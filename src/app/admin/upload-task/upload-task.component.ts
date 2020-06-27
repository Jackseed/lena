import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-upload-task",
  templateUrl: "./upload-task.component.html",
  styleUrls: ["./upload-task.component.scss"],
})
export class UploadTaskComponent implements OnInit, OnDestroy {
  @Input() file: File;
  @Input() i: number;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  id: string;
  private sub: Subscription;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.startUpload();
  }

  async startUpload() {
    const project = await this.db
      .collection("projects")
      .doc(this.id)
      .get()
      .toPromise();
    const id = this.db.createId();
    // The storage path
    const path = `test/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    console.log(this.task);

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize(async () => {
        const downloadUrl = await ref.getDownloadURL().toPromise();

        this.db
          .collection("projects")
          .doc(this.id)
          .collection("images")
          .doc(id)
          .set({
            id,
            downloadUrl,
            path,
            caption: "",
          });
      })
    );
    this.sub = this.snapshot.subscribe();
  }

  isActive(snapshot) {
    return (
      snapshot.state === "running" &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

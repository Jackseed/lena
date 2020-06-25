import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { firestore } from "firebase/app";

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
    let position: number;
    // image position
    if (project.data().images) {
      position = project.data().images.length + this.i;
    } else {
      position = 0;
    }
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
          .set(
            {
              images: firestore.FieldValue.arrayUnion({
                downloadUrl,
                path,
                caption: "",
                position,
              }),
            },
            { merge: true }
          );
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

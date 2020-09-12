import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import {
  AngularFireStorage,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-upload-task",
  templateUrl: "./upload-task.component.html",
  styleUrls: ["./upload-task.component.scss"]
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
    if (this.id) {
      const project = await this.db
        .collection("projects")
        .doc(this.id)
        .get()
        .toPromise();
      const id = this.db.createId();
      // The storage path
      const path = `projects/${Date.now()}_${this.file.name}`;

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
          const fileExtension = path.split(".").pop();
          console.log(fileExtension);
          if (fileExtension === "mp4") {
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
                video: {
                  isVideo: true
                }
              });
          } else {
            this.db
              .collection("projects")
              .doc(this.id)
              .collection("images")
              .doc(id)
              .set({
                id,
                downloadUrl,
                path,
                caption: ""
              });
          }
        })
      );
      // category image
    } else if (this.route.snapshot.routeConfig.path === "admin/vignettes") {
      const collection = await this.db
        .collection("vignettes")
        .get()
        .toPromise();
      const position = collection.size;
      const id = this.db.createId();
      // The storage path
      const path = `vignettes/${Date.now()}_${this.file.name}`;

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
            .collection("vignettes")
            .doc(id)
            .set({
              id,
              downloadUrl,
              path,
              position
            });
        })
      );
    } else {
      const collection = await this.db
        .collection("categories")
        .get()
        .toPromise();
      const position = collection.size;
      const id = this.db.createId();
      // The storage path
      const path = `categories/${Date.now()}_${this.file.name}`;

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
            .collection("categories")
            .doc(id)
            .set({
              id,
              downloadUrl,
              path,
              position,
              projectIds: []
            });
        })
      );
    }
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

import { Component, OnInit, Input } from "@angular/core";
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { firestore } from "firebase/app";

@Component({
  selector: "app-upload-task",
  templateUrl: "./upload-task.component.html",
  styleUrls: ["./upload-task.component.scss"],
})
export class UploadTaskComponent implements OnInit {
  @Input() file: File;
  @Input() i: number;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  path: string;
  ref: any;
  id: string;
  caption = new FormControl("");

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.startUpload();
    this.id = this.route.snapshot.paramMap.get("id");
  }

  startUpload() {
    // The storage path
    this.path = `test/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    this.ref = this.storage.ref(this.path);

    // The main task
    this.task = this.storage.upload(this.path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await this.ref.getDownloadURL().toPromise();

        this.db
          .collection("projects")
          .doc(this.id)
          .set(
            {
              images: firestore.FieldValue.arrayUnion({
                downloadURL: this.downloadURL,
                path: this.path,
              }),
            },
            { merge: true }
          );
      })
    );
  }
  // TODO: use a function onDelete to delete the file on Storage
  deleteImg() {
    const imgRef = this.storage.storage.refFromURL(this.downloadURL);
    // delete on firestore
    this.db
      .collection("files")
      .doc(this.id)
      .delete()
      .then((_) => {
        console.log("Image supprimée de la bdd !");
        // delete on firestorage
        imgRef
          .delete()
          .then((_) => {
            console.log("Fichier supprimée de storage !");
            this.downloadURL = "";
          })
          .catch((error) => {
            console.error(
              "Erreur dans la suppression fichier storage: ",
              error
            );
          });
      })
      .catch((error) => {
        console.error("Erreur dans la suppression bdd: ", error);
      });
  }

  isActive(snapshot) {
    return (
      snapshot.state === "running" &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  public save() {
    this.db
      .collection("projects")
      .doc(this.id)
      .set(
        {
          images: firestore.FieldValue.arrayRemove({
            downloadURL: this.downloadURL,
            path: this.path,
          }),
        },
        { merge: true }
      )
      .then(() => {
        this.db
          .collection("projects")
          .doc(this.id)
          .set(
            {
              images: firestore.FieldValue.arrayUnion({
                downloadURL: this.downloadURL,
                path: this.path,
                caption: this.caption.value,
              }),
            },
            { merge: true }
          );
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

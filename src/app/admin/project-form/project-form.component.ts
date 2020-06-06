import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { Project } from "src/app/models/project-list";
import { Subscription, Observable } from "rxjs";
import { take, tap } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import { firestore } from "firebase/app";

@Component({
  selector: "app-project-form",
  templateUrl: "./project-form.component.html",
  styleUrls: ["./project-form.component.scss"],
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  private id: string;
  public project: Project;
  public project$: Observable<Project>;
  public newProject = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    caption: new FormControl(""),
  });
  caption = new FormControl("");
  private sub: Subscription;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.project$ = this.db.collection("projects").doc(this.id).valueChanges();

    this.sub = this.db
      .collection("projects")
      .doc(this.id)
      .valueChanges()
      .pipe(
        take(1),
        tap((project) => {
          if (project) {
            this.project = project;
            this.newProject.patchValue(project);
            console.log(this.project);
          }
        })
      )
      .subscribe();
  }
  onSubmit() {}
  save() {
    this.db.collection("projects").doc(this.id).set(
      {
        title: this.newProject.value.title,
        description: this.newProject.value.description,
        caption: this.newProject.value.caption,
      },
      { merge: true }
    );
  }

  // TODO: use a function onDelete to delete the file on Storage
  deleteImg(downloadUrl) {
    const imgRef = this.storage.storage.refFromURL(downloadUrl);
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
          .then(() => {
            console.log("Fichier supprimée de storage !");
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

  public saveCaption(downloadUrl, path) {
    this.db
      .collection("projects")
      .doc(this.project.id)
      .set(
        {
          images: firestore.FieldValue.arrayRemove({
            downloadUrl,
            path,
          }),
        },
        { merge: true }
      )
      .then(() => {
        this.db
          .collection("projects")
          .doc(this.project.id)
          .set(
            {
              images: firestore.FieldValue.arrayUnion({
                downloadUrl,
                path,
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

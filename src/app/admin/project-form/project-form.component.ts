import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { Project } from "src/app/models/project-list";
import { Observable } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";
import { firestore } from "firebase/app";

@Component({
  selector: "app-project-form",
  templateUrl: "./project-form.component.html",
  styleUrls: ["./project-form.component.scss"],
})
export class ProjectFormComponent implements OnInit {
  private id: string;
  public project$: Observable<Project>;
  public newProject = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    caption: new FormControl(""),
  });
  caption = new FormControl("");

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.project$ = this.db.collection("projects").doc(this.id).valueChanges();
    const project = await this.db
      .collection("projects")
      .doc(this.id)
      .get()
      .toPromise();
    this.newProject.patchValue(project.data());
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
  async deleteImg(downloadUrl, path, caption, i) {
    const imgRef = this.storage.storage.refFromURL(downloadUrl);
    const project = await this.db
      .collection("projects")
      .doc(this.id)
      .get()
      .toPromise();

    // delete on firestore
    this.db
      .collection("projects")
      .doc(project.data().id)
      .set(
        {
          images: firestore.FieldValue.arrayRemove({
            downloadUrl,
            path,
            caption: project.data().images[i].caption,
          }),
        },
        { merge: true }
      )
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

  public async saveCaption(downloadUrl, path, caption, i) {
    const project = await this.db
      .collection("projects")
      .doc(this.id)
      .get()
      .toPromise();

    this.db
      .collection("projects")
      .doc(project.data().id)
      .set(
        {
          images: firestore.FieldValue.arrayRemove({
            downloadUrl,
            path,
            caption: project.data().images[i].caption,
          }),
        },
        { merge: true }
      )
      .then(() => {
        this.db
          .collection("projects")
          .doc(project.data().id)
          .set(
            {
              images: firestore.FieldValue.arrayUnion({
                downloadUrl,
                path,
                caption,
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

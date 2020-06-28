import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { Project } from "src/app/models/project-list";
import { Observable } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";
import { firestore } from "firebase/app";
import { Category } from "src/app/models/menu-titles";
import { Image } from "src/app/models/images";
import { map } from "rxjs/operators";

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
    category: new FormControl(""),
    description: new FormControl(""),
    caption: new FormControl(""),
    finalCaption: new FormControl(""),
  });
  caption = new FormControl("");
  public categories$: Observable<Category[]>;
  public images$: Observable<Image[]>;
  private projectRef;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.projectRef = this.db.collection("projects").doc(this.id);
    this.project$ = this.projectRef.valueChanges();
    const project = await this.projectRef.get().toPromise();
    this.categories$ = this.db
      .collection("categories")
      .valueChanges()
      .pipe(
        map((categories: Category[]) =>
          categories.sort((a, b) => a.position - b.position)
        )
      );
    this.images$ = this.projectRef.collection("images").valueChanges();
    if (project.data()) {
      this.newProject.patchValue(project.data());
    }
  }
  onSubmit() {}
  save() {
    this.projectRef.set(
      {
        title: this.newProject.value.title,
        description: this.newProject.value.description,
        caption: this.newProject.value.caption,
        finalCaption: this.newProject.value.finalCaption,
      },
      { merge: true }
    );
  }

  sortByPosition(images: Image[]): Image[] {
    return images.sort((a, b) => a.position - b.position);
  }

  // TODO: use a function onDelete to delete the file on Storage
  async deleteImg(img: Image) {
    const batch = this.db.firestore.batch();
    const imgRef = this.storage.storage.refFromURL(img.downloadUrl);
    const images = [];
    this.projectRef
      .collection("images")
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          images.push(doc.data());
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    // delete on firestore
    this.projectRef
      .collection("images")
      .doc(img.id)
      .delete()
      .then((_) => {
        console.log("Image supprimée de la bdd !");
        // delete on firestorage
        imgRef
          .delete()
          .then(() => {
            console.log("Fichier supprimée de storage !");
            // reposition remaining images
            images.sort((a, b) => a.position - b.position);
            images.splice(img.position, 1);

            batch.update(
              this.db.firestore.collection("projects").doc(this.id),
              { imageCount: firestore.FieldValue.increment(-1) }
            );
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < images.length; i++) {
              batch.update(
                this.db.firestore
                  .collection("projects")
                  .doc(this.id)
                  .collection("images")
                  .doc(images[i].id),
                {
                  position: i,
                }
              );
            }

            batch.commit();
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

  public async saveCaption(downloadUrl, path, caption, position) {
    const batch = this.db.firestore.batch();
    const project = await this.projectRef.get().toPromise();
    console.log(project.data().images);

    const images = project
      .data()
      .images.sort((a, b) => a.position - b.position);
    console.log(images);
    images[position].caption = caption;

    batch.update(
      this.db.firestore.collection("projects").doc(project.data().id),
      {
        images: firestore.FieldValue.delete(),
      }
    );

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < images.length; i++) {
      batch.update(
        this.db.firestore.collection("projects").doc(project.data().id),
        {
          images: firestore.FieldValue.arrayUnion(images[i]),
        }
      );
    }

    batch.commit();
  }
}

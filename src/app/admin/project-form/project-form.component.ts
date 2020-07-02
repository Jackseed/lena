import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { Project } from "src/app/models/project-list";
import { Observable } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";
import { firestore } from "firebase/app";
import { Category } from "src/app/models/menu-titles";
import { Image } from "src/app/models/images";
import { map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
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
    this.openSnackBar("Projet sauvegardé !");
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Fermer", {
      duration: 2000,
    });
  }

  sortByPosition(images: Image[]): Image[] {
    return images.sort((a, b) => a.position - b.position);
  }

  // TODO: use a function onDelete to delete the file on Storage
  public async deleteImg(img: Image) {
    const imgRef = this.storage.storage.refFromURL(img.downloadUrl);
    let images = [];
    await this.projectRef
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
            images = this.sortByPosition(images);
            images.splice(img.position, 1);

            const batch = this.updateImgPositions(images);

            batch.update(
              this.db.firestore.collection("projects").doc(this.id),
              { imageCount: firestore.FieldValue.increment(-1) }
            );

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

  public saveCaption(img: Image) {
    this.projectRef
      .collection("images")
      .doc(img.id)
      .update({ caption: img.caption })
      .catch((error) => {
        console.error("Erreur dans l'update caption': ", error);
      });
    this.openSnackBar("Sous-titre sauvegardé !");
  }

  private updateImgPositions(images: Image[]): firestore.WriteBatch {
    const batch = this.db.firestore.batch();
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
    return batch;
  }

  public async upImg(img: Image) {
    let images = [];
    await this.projectRef
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
    images = this.sortByPosition(images);
    images.splice(img.position, 1);
    images.splice(img.position - 1, 0, img);
    const batch = this.updateImgPositions(images);
    batch.commit();
  }

  public async downImg(img: Image) {
    let images = [];
    await this.projectRef
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
    images = this.sortByPosition(images);
    images.splice(img.position, 1);
    images.splice(img.position + 1, 0, img);
    const batch = this.updateImgPositions(images);
    batch.commit();
  }

  public async deleteProject(project: Project) {
    // delete images first
    const images = [];
    await this.projectRef
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
    const batch = this.db.firestore.batch();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < images.length; i++) {
      // delete on db
      batch.delete(
        this.db.firestore
          .collection("projects")
          .doc(this.id)
          .collection("images")
          .doc(images[i].id)
      );
      // delete on storage
      this.storage.storage.refFromURL(images[i].downloadUrl).delete();
    }
    // delete the project
    batch.delete(this.db.firestore.collection("projects").doc(this.id));

    // remove the projectId from category
    const categoryDoc = await this.db
      .collection("categories")
      .doc(project.categoryId)
      .get()
      .toPromise();
    const projectIds = categoryDoc.data().projectIds;
    const projectId = projectIds.find((proj) => proj.id === this.id);

    // sort old category and remove the project
    projectIds.sort((a, b) => a.position - b.position);
    projectIds.splice(projectId.position, 1);
    batch.update(
      this.db.firestore.collection("categories").doc(project.categoryId),
      {
        projectIds: firestore.FieldValue.delete(),
      }
    );

    // re-write all projectIds from old category without the changing project
    // if there is no more project, write an empty array
    // tslint:disable-next-line: prefer-for-of
    if (projectIds.length === 0) {
      batch.update(
        this.db.firestore.collection("categories").doc(project.categoryId),
        {
          projectIds: [],
        }
      );
    } else {
      for (let i = 0; i < projectIds.length; i++) {
        projectIds[i].position = i;

        batch.update(
          this.db.firestore.collection("categories").doc(project.categoryId),
          {
            projectIds: firestore.FieldValue.arrayUnion(projectIds[i]),
          }
        );
      }
    }

    batch.commit();

    this.openSnackBar("Projet supprimé !");
    this.router.navigate(["/admin"]);
  }
}

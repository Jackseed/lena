import { Component, OnInit, Input } from "@angular/core";
import { Tile } from "src/app/models/vignettes";
import { Project } from "src/app/models/project-list";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, startWith } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-vignette-form",
  templateUrl: "./vignette-form.component.html",
  styleUrls: ["./vignette-form.component.scss"],
})
export class VignetteFormComponent implements OnInit {
  @Input() vignette: Tile;
  public projects: Project[] = [];
  projectForm = new FormControl();
  filteredProjects: Observable<Project[]>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.getProjects();
    this.projects.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    this.filteredProjects = this.projectForm.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );

    if (!!this.vignette.projectId) {
      this.projectForm.patchValue(this.getProjectById(this.vignette.projectId));
    } else {
    }
  }

  onSubmit() {}
  save() {
    this.db.collection("vignettes").doc(this.vignette.id).update({
      projectId: this.projectForm.value.id,
    });
    this.openSnackBar("Lien sauvegardé !");
  }
  private openSnackBar(message: string) {
    this.snackBar.open(message, "Fermer", {
      duration: 2000,
    });
  }

  public displayFn(project: Project): string {
    return project && project.title ? project.title : "";
  }

  private async getProjects() {
    await this.db
      .collection("projects")
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            this.projects.push(doc.data());
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  private _filter(project: Project): Project[] {
    let filterValue: string;
    if (project.title) {
      filterValue = project.title.toLowerCase();
    } else {
      filterValue = "";
    }
    return this.projects.filter((proj) =>
      proj.title.toLowerCase().includes(filterValue)
    );
  }

  private getProjectById(id: string): Project {
    return this.projects.find((project) => project.id === id);
  }

  // TODO: use a function onDelete to delete the file on Storage
  public async deleteVignette(vignette: Tile) {
    const imgRef = this.storage.storage.refFromURL(vignette.downloadUrl);

    // delete on firestore
    this.db
      .collection("vignettes")
      .doc(vignette.id)
      .delete()
      .then((_) => {
        console.log("Image supprimée de la bdd !");
        // delete on firestorage
        imgRef
          .delete()
          .then(async () => {
            console.log("Fichier supprimée de storage !");
            // reposition remaining categories
            const vignettes: Tile[] = [];
            await this.db
              .collection("vignettes")
              .get()
              .toPromise()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  if (doc.exists) {
                    vignettes.push(doc.data());
                  }
                });
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
            vignettes.sort((a, b) => a.position - b.position);

            const batch = this.db.firestore.batch();

            for (let i = 0; i < vignettes.length; i++) {
              batch.update(
                this.db.firestore.collection("vignettes").doc(vignettes[i].id),
                {
                  position: i,
                }
              );
            }

            batch.commit();

            this.openSnackBar("Vignette supprimée !");
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
}

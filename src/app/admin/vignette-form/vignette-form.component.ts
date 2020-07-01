import { Component, OnInit, Input } from "@angular/core";
import { Tile } from "src/app/models/vignettes";
import { Project } from "src/app/models/project-list";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, startWith } from "rxjs/operators";

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

  constructor(private db: AngularFirestore) {}

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
      this.projectForm.patchValue(
        this.getProjectById(this.vignette.projectId)
      );
    } else {
    }
  }

  onSubmit() {}
  save() {
    this.db.collection("vignettes").doc(this.vignette.id).update({
      projectId: this.projectForm.value.id,
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
    return this.projects.filter((project_) =>
      project_.title.toLowerCase().includes(filterValue)
    );
  }

  private getProjectById(id: string): Project {
    return this.projects.find((project) => project.id === id);
  }
}

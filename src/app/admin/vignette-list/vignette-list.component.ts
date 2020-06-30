import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, startWith } from "rxjs/operators";
import { Tile } from "src/app/models/vignettes";
import { Observable } from "rxjs";
import { Project } from "src/app/models/project-list";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-vignette-list",
  templateUrl: "./vignette-list.component.html",
  styleUrls: ["./vignette-list.component.scss"],
})
export class VignetteListComponent implements OnInit {
  public vignettes$: Observable<Tile[]>;
  public projects: Project[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<Project[]>;

  constructor(private db: AngularFirestore) {}

  ngOnInit(): void {
    this.vignettes$ = this.db
      .collection("vignettes")
      .valueChanges()
      .pipe(
        map((vignettes: Tile[]) =>
          vignettes.sort((a, b) => a.position - b.position)
        )
      );

    this.getProjects();
    this.projects.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  async getProjects() {
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

  private _filter(value: string): Project[] {
    const filterValue = value.toLowerCase();

    return this.projects.filter((project) =>
      project.title.toLowerCase().includes(filterValue)
    );
  }
}

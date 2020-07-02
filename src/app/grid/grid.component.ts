import { Component, OnInit, OnDestroy } from "@angular/core";
import { Vignette, Grid } from "src/app/models/vignettes";
import { Subscription } from "rxjs";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { filter, map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Project } from "../models/projects";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"],
})
export class GridComponent implements OnInit, OnDestroy {
  public vignettes: Vignette[] = [];
  public projects: Project[] = [];
  public grid: Grid;
  watcher: Subscription;
  activeMediaQuery = "";

  constructor(
    private mediaObserver: MediaObserver,
    private db: AngularFirestore
  ) {
    this.watcher = mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        this.activeMediaQuery = change
          ? `'${change.mqAlias}' = (${change.mediaQuery})`
          : "";
        if (change.mqAlias === "xs") {
          this.grid = { cols: 2, gutterSize: 0 };
        } else if (change.mqAlias === "sm") {
          this.grid = { cols: 4, gutterSize: 0 };
        } else {
          this.grid = { cols: 4, gutterSize: 20 };
        }
      });
  }

  async ngOnInit() {
    await this.db
      .collection("vignettes")
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists && doc.data().projectId) {
            this.vignettes.push(doc.data());
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    this.vignettes.sort((a, b) => a.position - b.position);

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

  getProjectById(id: string): Project {
    return this.projects.find((project) => project.id === id);
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }
}

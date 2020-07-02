import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Project } from "../models/projects";
import { Image } from "../models/images";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, switchMap } from "rxjs/operators";

@Component({
  selector: "app-project-view",
  templateUrl: "./project-view.component.html",
  styleUrls: ["./project-view.component.scss"],
})
export class ProjectViewComponent implements OnInit {
  private id: string;
  public project$: Observable<Project>;
  public images$: Observable<any[]>;
  public projects: Project[] = [];

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  async ngOnInit() {
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

    this.project$ = this.route.params.pipe(
      map((p) => {
        if (p.title) {
          return this.projects.find((project) => {
            return project.title === p.title;
          });
        } else {
          return this.projects.find((project) => {
            return project.id === p.id;
          });
        }
      })
    );

    this.images$ = this.project$.pipe(
      switchMap((project) =>
        this.db
          .collection("projects")
          .doc(project.id)
          .collection("images")
          .valueChanges()
          .pipe(
            map((images: Image[]) =>
              images.sort((a, b) => a.position - b.position)
            )
          )
      )
    );
  }

  public isAdmin() {
    if (this.route.snapshot.routeConfig.path.includes("admin")) {
      return true;
    } else {
      return false;
    }
  }

  back() {
    this.location.back();
  }
}

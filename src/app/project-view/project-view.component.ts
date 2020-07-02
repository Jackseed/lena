import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Project } from "../models/project-list";
import { Image } from "../models/images";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Component({
  selector: "app-project-view",
  templateUrl: "./project-view.component.html",
  styleUrls: ["./project-view.component.scss"],
})
export class ProjectViewComponent implements OnInit {
  private id: string;
  public project$: Observable<Project>;
  public images$: Observable<any[]>;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.project$ = this.db.collection("projects").doc(this.id).valueChanges();
    this.images$ = this.db
      .collection("projects")
      .doc(this.id)
      .collection("images")
      .valueChanges()
      .pipe(
        map((images: Image[]) => images.sort((a, b) => a.position - b.position))
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

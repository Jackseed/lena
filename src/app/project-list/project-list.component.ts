import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Project, createProject } from "../models/project-list";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
})
export class ProjectListComponent implements OnInit {
  public projects$: Observable<Project[]>;
  constructor(private db: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
    this.projects$ = this.db
      .collection("projects")
      .valueChanges()
      .pipe(
        map((projects) => projects.map((project) => createProject(project)))
      );
  }

  public add() {
    const id = this.db.createId();
    this.db.collection("projects").doc(id).set({id});
    this.router.navigate([`admin/${id}/edit`]);
  }
}

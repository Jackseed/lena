import { Component, OnInit } from "@angular/core";
import { Project, Projects } from "../models/project-list";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: "app-project-view",
  templateUrl: "./project-view.component.html",
  styleUrls: ["./project-view.component.scss"],
})
export class ProjectViewComponent implements OnInit {
  private id: string;
  public project$: Observable<Project>;

  constructor(private db: AngularFirestore, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.project$ = this.db.collection("projects").doc(this.id).valueChanges();
  }
}

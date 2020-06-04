import { Component, OnInit } from "@angular/core";
import { Project, Projects } from "../models/project-list";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"],
})
export class ProjectComponent implements OnInit {
  public project$: Observable<Project>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.project$ = this.route.params.pipe(
      map((p) => p.title),
      map((title) =>
        Projects.find((projet) => {
          return projet.link === title;
        })
      )
    );
  }
}

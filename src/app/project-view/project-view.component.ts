import { Component, OnInit } from "@angular/core";
import { Project, Projects } from "../models/project-list";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {

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

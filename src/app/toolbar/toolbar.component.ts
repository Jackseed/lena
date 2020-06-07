import { Component, OnInit } from '@angular/core';
import { Project, Projects } from '../models/project-list';
import { MenuTitles, Category } from '../models/menu-titles';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public projects: Project[] = Projects;
  public imgTitles: Category[] = MenuTitles;

  constructor() { }

  ngOnInit(): void {
  }

}

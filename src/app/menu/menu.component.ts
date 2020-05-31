import { Component, OnInit } from '@angular/core';
import { ImgTitle, MenuTitles } from '../models/menu-titles';
import { Project, Projects } from '../models/project-list';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public imgTitles: ImgTitle[] = MenuTitles;
  public projects: Project[] = Projects;

  constructor() { }

  ngOnInit() {
  }

}

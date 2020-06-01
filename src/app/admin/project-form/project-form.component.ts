import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  public newProject = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {

  }

}

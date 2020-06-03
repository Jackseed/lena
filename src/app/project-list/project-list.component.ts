import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  constructor(
    private db: AngularFirestore,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  public add() {
    const id = this.db.createId();
    this.db.collection("projects").doc(id).set({id});
    this.router.navigate([`admin/${id}`]);
  }

}

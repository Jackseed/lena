import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Project } from "../models/project-list";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

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
        map((projects: Project[]) =>
          projects.sort((a, b) => a.position - b.position)
        )
      );
  }

  public async addProject() {
    const collection = await this.db.collection("projects").get().toPromise();
    const position = collection.size;
    const id = this.db.createId();
    this.db.collection("projects").doc(id).set({ id, position });
    this.router.navigate([`admin/${id}/edit`]);
  }
  drop(event: CdkDragDrop<string[]>) {
    this.changePosition(event.previousIndex, event.currentIndex);
  }
  async changePosition(previousIndex, currentIndex) {
    const projects: Project[] = [];
    await this.db
      .collection("projects")
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            projects.push(doc.data());
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    projects.sort((a, b) => a.position - b.position);
    projects.splice(currentIndex, 0, projects.splice(previousIndex, 1)[0]);

    const batch = this.db.firestore.batch();

    for (let i = 0; i < projects.length; i++) {
      batch.update(
        this.db.firestore.collection("projects").doc(projects[i].id),
        {
          position: i,
        }
      );
    }

    batch.commit();
  }
}

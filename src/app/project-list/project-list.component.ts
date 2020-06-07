import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Project } from "../models/project-list";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Category } from "../models/menu-titles";
import { firestore } from "firebase/app";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
})
export class ProjectListComponent implements OnInit {
  public projects$: Observable<Project[]>;
  public projects: Project[] = [];
  public categories$: Observable<Category[]>;

  constructor(private db: AngularFirestore, private router: Router) {}

  async ngOnInit() {
    this.categories$ = this.db
      .collection("categories")
      .valueChanges()
      .pipe(
        map((categories: Category[]) =>
          categories.sort((a, b) => a.position - b.position)
        )
      );

    this.projects$ = this.db
      .collection("projects")
      .valueChanges()
      .pipe(
        map((projects: Project[]) =>
          projects.sort((a, b) => a.position - b.position)
        )
      );

    await this.db
      .collection("projects")
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            this.projects.push(doc.data());
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  public async addProject(categoryId: string) {
    const batch = this.db.firestore.batch();
    const categoryDoc = await this.db
      .collection("categories")
      .doc(categoryId)
      .get()
      .toPromise();
    const position = categoryDoc.data().projectIds.length;
    const id = this.db.createId();

    batch.set(this.db.firestore.collection("projects").doc(id), {
      id,
      categoryId,
    });

    batch.update(this.db.firestore.collection("categories").doc(categoryId), {
      projectIds: firestore.FieldValue.arrayUnion({
        id,
        position,
      }),
    });
    batch.commit();
    this.router.navigate([`admin/${id}/edit`]);
  }

  sortByPosition(projectIds: { id: string; position: number }[]) {
    return projectIds.sort((a, b) => a.position - b.position);
  }

  getProjectById(id: string): Project {
    return this.projects.find((project) => project.id === id);
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

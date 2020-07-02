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
      title: "",
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
    if (event.previousContainer === event.container) {
      this.changePosition(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.switchCategory(
        event.previousContainer.data,
        event.previousContainer.id,
        event.container.data,
        event.container.id,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  async changePosition(projectIds, previousIndex, currentIndex) {
    const batch = this.db.firestore.batch();
    projectIds.sort((a, b) => a.position - b.position);
    projectIds.splice(currentIndex, 0, projectIds.splice(previousIndex, 1)[0]);

    batch.update(
      this.db.firestore
        .collection("categories")
        .doc(this.getProjectById(projectIds[0].id).categoryId),
      {
        projectIds: firestore.FieldValue.delete(),
      }
    );

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < projectIds.length; i++) {
      projectIds[i].position = i;

      batch.update(
        this.db.firestore
          .collection("categories")
          .doc(this.getProjectById(projectIds[0].id).categoryId),
        {
          projectIds: firestore.FieldValue.arrayUnion(projectIds[i]),
        }
      );
    }

    batch.commit();
  }

  private switchCategory(
    projectIds,
    oldCategoryId,
    newProjectIds,
    newCategoryId,
    previousIndex,
    newIndex
  ) {
    const batch = this.db.firestore.batch();
    const projectId = projectIds[previousIndex].id;

    // sort new category and add changing project
    newProjectIds.sort((a, b) => a.position - b.position);
    newProjectIds.splice(newIndex, 0, projectIds[previousIndex]);

    // sort old category and remove changing project
    projectIds.sort((a, b) => a.position - b.position);
    projectIds.splice(previousIndex, 1);

    // delete all projectIds from old category
    batch.update(
      this.db.firestore.collection("categories").doc(oldCategoryId),
      {
        projectIds: firestore.FieldValue.delete(),
      }
    );

    // re-write all projectIds from old category without the changing project
    // if there is no more project, write an empty array
    // tslint:disable-next-line: prefer-for-of
    if (projectIds.length === 0) {
      batch.update(
        this.db.firestore.collection("categories").doc(oldCategoryId),
        {
          projectIds: [],
        }
      );
    } else {
      for (let i = 0; i < projectIds.length; i++) {
        projectIds[i].position = i;

        batch.update(
          this.db.firestore.collection("categories").doc(oldCategoryId),
          {
            projectIds: firestore.FieldValue.arrayUnion(projectIds[i]),
          }
        );
      }
    }
    // change the category id of the changing project
    batch.update(this.db.firestore.collection("projects").doc(projectId), {
      categoryId: newCategoryId,
    });

    // delete all projectIds from new category
    batch.update(
      this.db.firestore.collection("categories").doc(newCategoryId),
      {
        projectIds: firestore.FieldValue.delete(),
      }
    );
    // add the changing project to new category
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < newProjectIds.length; i++) {
      newProjectIds[i].position = i;

      batch.update(
        this.db.firestore.collection("categories").doc(newCategoryId),
        {
          projectIds: firestore.FieldValue.arrayUnion(newProjectIds[i]),
        }
      );
    }
    batch.commit();
  }
}

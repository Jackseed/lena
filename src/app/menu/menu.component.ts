import { Component, OnInit } from "@angular/core";
import { Category } from "../models/categories";
import { Project } from "../models/projects";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  public categories$: Observable<Category[]>;
  public projects: Project[] = [];

  constructor(private db: AngularFirestore) {}

  async ngOnInit() {
    this.categories$ = this.db
      .collection("categories")
      .valueChanges()
      .pipe(
        map((categories: Category[]) =>
          categories.sort((a, b) => a.position - b.position)
        )
      );

    await this.db
      .collection("projects")
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists && doc.data().status === "published") {
            this.projects.push(doc.data());
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  getProjectById(id: string): Project {
    return this.projects.find((project) => project.id === id);
  }

  sortByPosition(projectIds: { id: string; position: number }[]) {
    return projectIds.sort((a, b) => a.position - b.position);
  }
}

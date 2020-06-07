import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Category } from "src/app/models/menu-titles";
import { Observable } from "rxjs";
import { map } from "rxjs/internal/operators/map";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
})
export class CategoryListComponent implements OnInit {
  public newCategory = new FormGroup({
    category: new FormControl(""),
  });
  public categories$: Observable<Category[]>;
  constructor(private db: AngularFirestore) {}

  ngOnInit(): void {
    this.categories$ = this.db
      .collection("categories")
      .valueChanges()
      .pipe(
        map((categories: Category[]) =>
          categories.sort((a, b) => a.position - b.position)
        )
      );
  }
  onSubmit() {}
  async save() {
    const collection = await this.db.collection("categories").get().toPromise();
    const position = collection.size;
    const id = this.db.createId();
    this.db.collection("categories").doc(id).set({
      id,
      name: this.newCategory.value.category,
      position,
      projectIds: [],
    });
    this.newCategory.reset();
  }

  drop(event: CdkDragDrop<string[]>) {
    this.changePosition(event.previousIndex, event.currentIndex);
  }
  async changePosition(previousIndex, currentIndex) {
    const categories: Category[] = [];
    await this.db
      .collection("categories")
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            categories.push(doc.data());
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    categories.sort((a, b) => a.position - b.position);
    categories.splice(currentIndex, 0, categories.splice(previousIndex, 1)[0]);
    console.log(categories);
    const batch = this.db.firestore.batch();

    for (let i = 0; i < categories.length; i++) {
      batch.update(
        this.db.firestore.collection("categories").doc(categories[i].id),
        {
          position: i,
        }
      );
    }

    batch.commit();
  }
}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { Project } from "src/app/models/project-list";
import { Subscription } from "rxjs";
import { take, tap } from "rxjs/operators";

@Component({
  selector: "app-project-form",
  templateUrl: "./project-form.component.html",
  styleUrls: ["./project-form.component.scss"],
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  private id: string;
  private project: Project;
  public newProject = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    caption: new FormControl(""),
  });
  private sub: Subscription;

  constructor(private db: AngularFirestore, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.sub = this.db
      .collection("projects")
      .doc(this.id)
      .valueChanges()
      .pipe(
        take(1),
        tap((project) => {
          if (project) {
            this.newProject.patchValue(project);
          }
        })
      )
      .subscribe();
  }
  onSubmit() {}
  save() {
    this.db.collection("projects").doc(this.id).set(
      {
        title: this.newProject.value.title,
        description: this.newProject.value.description,
        caption: this.newProject.value.caption,
      },
      { merge: true }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-project-form",
  templateUrl: "./project-form.component.html",
  styleUrls: ["./project-form.component.scss"],
})
export class ProjectFormComponent implements OnInit {
  private id: string;
  public newProject = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    caption: new FormControl(""),
  });

  constructor(private db: AngularFirestore, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
  }
  onSubmit() {}
  save() {
    this.db.collection("projects").doc(this.id).set({
      title: this.newProject.value.title,
      description: this.newProject.value.description,
      caption: this.newProject.value.caption,
    });
  }
}

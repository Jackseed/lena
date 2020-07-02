import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Tile } from "src/app/models/vignettes";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-vignette-list",
  templateUrl: "./vignette-list.component.html",
  styleUrls: ["./vignette-list.component.scss"],
})
export class VignetteListComponent implements OnInit {
  public vignettes$: Observable<Tile[]>;

  constructor(
    private db: AngularFirestore,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.vignettes$ = this.db
      .collection("vignettes")
      .valueChanges()
      .pipe(
        map((vignettes: Tile[]) =>
          vignettes.sort((a, b) => a.position - b.position)
        )
      );
  }
  public navigateProject(projectId: string) {
    if (projectId) {
      this.router.navigate([`/admin/${projectId}/view`]);
    } else {
      this.openSnackBar("Aucun projet associé (sauvegarde ?)");
    }
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, "Fermer", {
      duration: 2000,
    });
  }
  back() {
    this.location.back();
  }
}

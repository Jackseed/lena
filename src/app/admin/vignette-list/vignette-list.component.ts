import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Tile } from "src/app/models/vignettes";
import { Observable } from "rxjs";

@Component({
  selector: "app-vignette-list",
  templateUrl: "./vignette-list.component.html",
  styleUrls: ["./vignette-list.component.scss"],
})
export class VignetteListComponent implements OnInit {
  public vignettes$: Observable<Tile[]>;

  constructor(private db: AngularFirestore) {}

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
}

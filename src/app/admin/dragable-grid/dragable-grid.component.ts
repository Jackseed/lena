import { Component, OnInit, OnDestroy } from "@angular/core";
import { Grid, Tile } from "src/app/models/vignettes";
import { Subscription, Observable } from "rxjs";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { filter, map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
@Component({
  selector: "app-dragable-grid",
  templateUrl: "./dragable-grid.component.html",
  styleUrls: ["./dragable-grid.component.scss"],
})
export class DragableGridComponent implements OnInit, OnDestroy {
  public grid: Grid;
  private watcher: Subscription;
  private activeMediaQuery = "";
  public vignettes$: Observable<Tile[]>;

  constructor(
    private mediaObserver: MediaObserver,
    private db: AngularFirestore
  ) {
    this.watcher = mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        this.activeMediaQuery = change
          ? `'${change.mqAlias}' = (${change.mediaQuery})`
          : "";
        if (change.mqAlias === "xs") {
          this.grid = { cols: 2, gutterSize: 0 };
        } else if (change.mqAlias === "sm") {
          this.grid = { cols: 4, gutterSize: 0 };
        } else {
          this.grid = { cols: 4, gutterSize: 20 };
        }
      });
  }

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

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }
}

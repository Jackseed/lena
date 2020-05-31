import { Component, OnDestroy } from "@angular/core";
import { Tiles, Tile, Grid } from "src/app/models/vignettes";
import { Subscription } from "rxjs";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"],
})
export class GridComponent implements OnDestroy {
  public tiles: Tile[] = Tiles;
  public grid: Grid;
  watcher: Subscription;
  activeMediaQuery = "";

  constructor(mediaObserver: MediaObserver) {
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
          this.grid = { cols: 4, gutterSize: 20 };
        } else {
          this.grid = { cols: 4, gutterSize: 20 };
        }
      });
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }
}

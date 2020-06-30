import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Grid, Tile } from "src/app/models/vignettes";
import { Subscription, Observable } from "rxjs";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { filter, map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  CdkDrag,
} from "@angular/cdk/drag-drop";
@Component({
  selector: "app-dragable-grid",
  templateUrl: "./dragable-grid.component.html",
  styleUrls: ["./dragable-grid.component.scss"],
})
export class DragableGridComponent implements OnInit, OnDestroy {
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  public grid: Grid;
  private watcher: Subscription;
  private activeMediaQuery = "";
  public vignettes$: Observable<Tile[]>;
  public vignettes: Tile[] = [];

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public items: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(
    private mediaObserver: MediaObserver,
    private db: AngularFirestore
  ) {
    this.target = null;
    this.source = null;

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
    this.getVignettes();
    console.log(this.vignettes);
  }

  async getVignettes() {
    await this.db
      .collection("vignettes")
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            this.vignettes.push(doc.data());
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }


  ngAfterViewInit() {
    const phElement = this.placeholder.element.nativeElement;

    phElement.style.display = "none";
    phElement.parentNode.removeChild(phElement);
  }

  drop() {
    if (!this.target) {
      return;
    }

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentNode;

    phElement.style.display = "none";

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(
      this.source.element.nativeElement,
      parent.children[this.sourceIndex]
    );

    this.target = null;
    this.source = null;

    if (this.sourceIndex !== this.targetIndex) {
      moveItemInArray(this.vignettes, this.sourceIndex, this.targetIndex);
    }
  }

  enter = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop === this.placeholder) {
      return true;
    }

    const phElement = this.placeholder.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    const dragIndex = this.__indexOf(
      dropElement.parentNode.children,
      drag.dropContainer.element.nativeElement
    );
    const dropIndex = this.__indexOf(
      dropElement.parentNode.children,
      dropElement
    );

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      const sourceElement = this.source.element.nativeElement;
      phElement.style.width = sourceElement.clientWidth + "px";
      phElement.style.height = sourceElement.clientHeight + "px";

      sourceElement.parentNode.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = "";
    dropElement.parentNode.insertBefore(
      phElement,
      dragIndex < dropIndex ? dropElement.nextSibling : dropElement
    );

    this.source.start();
    this.placeholder.enter(
      drag,
      drag.element.nativeElement.offsetLeft,
      drag.element.nativeElement.offsetTop
    );
    console.log(this.vignettes);
    return false;
  };

  __indexOf(collection, node) {
    return Array.prototype.indexOf.call(collection, node);
  }

  private updatePosition(){}

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }
}

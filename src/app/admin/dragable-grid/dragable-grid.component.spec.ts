import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragableGridComponent } from './dragable-grid.component';

describe('DragableGridComponent', () => {
  let component: DragableGridComponent;
  let fixture: ComponentFixture<DragableGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragableGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragableGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

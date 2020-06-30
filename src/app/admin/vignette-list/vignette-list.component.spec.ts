import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VignetteListComponent } from './vignette-list.component';

describe('VignetteListComponent', () => {
  let component: VignetteListComponent;
  let fixture: ComponentFixture<VignetteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VignetteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VignetteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

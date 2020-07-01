import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VignetteFormComponent } from './vignette-form.component';

describe('VignetteFormComponent', () => {
  let component: VignetteFormComponent;
  let fixture: ComponentFixture<VignetteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VignetteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VignetteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

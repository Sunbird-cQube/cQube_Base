import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DikshaTpdEnrollmentComponent } from './diksha-tpd-enrollment.component';

describe('DikshaTpdEnrollmentComponent', () => {
  let component: DikshaTpdEnrollmentComponent;
  let fixture: ComponentFixture<DikshaTpdEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DikshaTpdEnrollmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DikshaTpdEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

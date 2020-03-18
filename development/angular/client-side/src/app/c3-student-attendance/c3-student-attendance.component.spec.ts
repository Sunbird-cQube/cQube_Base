import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C3StudentAttendanceComponent } from './c3-student-attendance.component';

describe('C3StudentAttendanceComponent', () => {
  let component: C3StudentAttendanceComponent;
  let fixture: ComponentFixture<C3StudentAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C3StudentAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C3StudentAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

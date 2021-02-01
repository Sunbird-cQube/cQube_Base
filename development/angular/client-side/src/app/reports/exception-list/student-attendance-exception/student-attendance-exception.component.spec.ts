import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAttendanceExceptionComponent } from './student-attendance-exception.component';

describe('StudentAttendanceExceptionComponent', () => {
  let component: StudentAttendanceExceptionComponent;
  let fixture: ComponentFixture<StudentAttendanceExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAttendanceExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAttendanceExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

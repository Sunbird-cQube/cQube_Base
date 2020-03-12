import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C3AttendanceSchoolWiseComponent } from './c3-attendance-school-wise.component';

describe('C3AttendanceSchoolWiseComponent', () => {
  let component: C3AttendanceSchoolWiseComponent;
  let fixture: ComponentFixture<C3AttendanceSchoolWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C3AttendanceSchoolWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C3AttendanceSchoolWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

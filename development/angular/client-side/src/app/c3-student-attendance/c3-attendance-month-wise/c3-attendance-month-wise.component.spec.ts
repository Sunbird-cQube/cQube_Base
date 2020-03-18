import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C3AttendanceMonthWiseComponent } from './c3-attendance-month-wise.component';

describe('C3AttendanceMonthWiseComponent', () => {
  let component: C3AttendanceMonthWiseComponent;
  let fixture: ComponentFixture<C3AttendanceMonthWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C3AttendanceMonthWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C3AttendanceMonthWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

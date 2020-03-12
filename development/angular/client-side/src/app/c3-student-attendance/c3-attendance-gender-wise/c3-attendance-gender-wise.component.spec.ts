import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C3AttendanceGenderWiseComponent } from './c3-attendance-gender-wise.component';

describe('C3AttendanceGenderWiseComponent', () => {
  let component: C3AttendanceGenderWiseComponent;
  let fixture: ComponentFixture<C3AttendanceGenderWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C3AttendanceGenderWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C3AttendanceGenderWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

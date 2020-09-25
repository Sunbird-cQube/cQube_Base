import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudengtAttendanceComponent } from './student-attendance.component';

describe('StudengtAttendanceComponent', () => {
  let component: StudengtAttendanceComponent;
  let fixture: ComponentFixture<StudengtAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudengtAttendanceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudengtAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

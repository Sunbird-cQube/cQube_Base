import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentWiseComponent } from './student-wise.component';

describe('StudentWiseComponent', () => {
  let component: StudentWiseComponent;
  let fixture: ComponentFixture<StudentWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

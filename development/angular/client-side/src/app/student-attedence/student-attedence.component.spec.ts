import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAttedenceComponent } from './student-attedence.component';

describe('StudentAttedenceComponent', () => {
  let component: StudentAttedenceComponent;
  let fixture: ComponentFixture<StudentAttedenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAttedenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAttedenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

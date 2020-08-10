import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterExceptionComponent } from './semester-exception.component';

describe('SemesterExceptionComponent', () => {
  let component: SemesterExceptionComponent;
  let fixture: ComponentFixture<SemesterExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemesterExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C3StudentPerformanceComponent } from './c3-student-performance.component';

describe('C3StudentPerformanceComponent', () => {
  let component: C3StudentPerformanceComponent;
  let fixture: ComponentFixture<C3StudentPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C3StudentPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C3StudentPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

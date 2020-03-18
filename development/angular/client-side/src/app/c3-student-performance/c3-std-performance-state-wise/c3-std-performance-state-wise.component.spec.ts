import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C3StdPerformanceStateWiseComponent } from './c3-std-performance-state-wise.component';

describe('C3StdPerformanceStateWiseComponent', () => {
  let component: C3StdPerformanceStateWiseComponent;
  let fixture: ComponentFixture<C3StdPerformanceStateWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C3StdPerformanceStateWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C3StdPerformanceStateWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

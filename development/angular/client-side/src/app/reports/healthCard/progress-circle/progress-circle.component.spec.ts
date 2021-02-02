import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCircleComponent } from './progress-circle.component';

describe('ProgressCircleComponent', () => {
  let component: ProgressCircleComponent;
  let fixture: ComponentFixture<ProgressCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatChartComponent } from './heat-chart.component';

describe('HeatChartComponent', () => {
  let component: HeatChartComponent;
  let fixture: ComponentFixture<HeatChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

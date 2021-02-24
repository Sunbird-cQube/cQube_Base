import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SatHeatChartComponent } from './sat-heat-chart.component';

describe('SatHeatChartComponent', () => {
  let component: SatHeatChartComponent;
  let fixture: ComponentFixture<SatHeatChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SatHeatChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SatHeatChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

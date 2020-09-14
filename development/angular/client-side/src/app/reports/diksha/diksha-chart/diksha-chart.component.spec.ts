import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DikshaChartComponent } from './diksha-chart.component';

describe('DikshaChartComponent', () => {
  let component: DikshaChartComponent;
  let fixture: ComponentFixture<DikshaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DikshaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DikshaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

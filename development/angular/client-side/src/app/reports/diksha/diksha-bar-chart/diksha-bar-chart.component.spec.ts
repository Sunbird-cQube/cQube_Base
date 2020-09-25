import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DikshaBarChartComponent } from './diksha-bar-chart.component';

describe('DikshaBarChartComponent', () => {
  let component: DikshaBarChartComponent;
  let fixture: ComponentFixture<DikshaBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DikshaBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DikshaBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

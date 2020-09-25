import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositReportComponent } from './composit-report.component';

describe('CompositReportComponent', () => {
  let component: CompositReportComponent;
  let fixture: ComponentFixture<CompositReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompositReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

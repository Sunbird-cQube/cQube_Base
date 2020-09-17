import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PATReportComponent } from './pat-report.component';

describe('PATReportComponent', () => {
  let component: PATReportComponent;
  let fixture: ComponentFixture<PATReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PATReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PATReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

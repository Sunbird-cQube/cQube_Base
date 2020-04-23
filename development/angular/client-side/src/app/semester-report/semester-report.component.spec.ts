import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterReportComponent } from './semester-report.component';

describe('SemesterReportComponent', () => {
  let component: SemesterReportComponent;
  let fixture: ComponentFixture<SemesterReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemesterReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

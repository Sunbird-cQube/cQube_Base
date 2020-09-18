import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrcReportComponent } from './crc-report.component';

describe('CrcReportComponent', () => {
  let component: CrcReportComponent;
  let fixture: ComponentFixture<CrcReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CrcReportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrcReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

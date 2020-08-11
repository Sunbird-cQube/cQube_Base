import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTelemetryComponent } from './show-telemetry.component';

describe('ShowTelemetryComponent', () => {
  let component: ShowTelemetryComponent;
  let fixture: ComponentFixture<ShowTelemetryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTelemetryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTelemetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

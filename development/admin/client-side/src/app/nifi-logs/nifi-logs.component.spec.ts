import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NifiLogsComponent } from './nifi-logs.component';

describe('NifiLogsComponent', () => {
  let component: NifiLogsComponent;
  let fixture: ComponentFixture<NifiLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NifiLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NifiLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

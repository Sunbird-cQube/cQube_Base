import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLogsComponent } from './allLogs.component';

describe('AllLogsComponent', () => {
  let component: AllLogsComponent;
  let fixture: ComponentFixture<AllLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllLogsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

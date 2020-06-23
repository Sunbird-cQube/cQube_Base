import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularLogsComponent } from './angular-logs.component';

describe('AngularLogsComponent', () => {
  let component: AngularLogsComponent;
  let fixture: ComponentFixture<AngularLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

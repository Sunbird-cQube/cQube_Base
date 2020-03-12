import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C3KpiComponent } from './c3-kpi.component';

describe('C3KpiComponent', () => {
  let component: C3KpiComponent;
  let fixture: ComponentFixture<C3KpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C3KpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C3KpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

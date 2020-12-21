import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCardComponent } from './health-card.component';

describe('HealthCardComponent', () => {
  let component: HealthCardComponent;
  let fixture: ComponentFixture<HealthCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

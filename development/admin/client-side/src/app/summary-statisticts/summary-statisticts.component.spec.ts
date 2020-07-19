import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryStatistictsComponent } from './summary-statisticts.component';

describe('SummaryStatistictsComponent', () => {
  let component: SummaryStatistictsComponent;
  let fixture: ComponentFixture<SummaryStatistictsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryStatistictsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryStatistictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

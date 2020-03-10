import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWiseComponent } from './month-wise.component';

describe('MonthWiseComponent', () => {
  let component: MonthWiseComponent;
  let fixture: ComponentFixture<MonthWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DikshaTPDTeachersPercentageComponent } from './diksha-tpd-teachers-percentage.component';

describe('DikshaTPDTeachersPercentageComponent', () => {
  let component: DikshaTPDTeachersPercentageComponent;
  let fixture: ComponentFixture<DikshaTPDTeachersPercentageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DikshaTPDTeachersPercentageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DikshaTPDTeachersPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

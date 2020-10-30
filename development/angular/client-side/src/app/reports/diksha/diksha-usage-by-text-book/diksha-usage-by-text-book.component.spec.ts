import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DikshaUsageByTextBookComponent } from './diksha-usage-by-text-book.component';

describe('DikshaUsageByTextBookComponent', () => {
  let component: DikshaUsageByTextBookComponent;
  let fixture: ComponentFixture<DikshaUsageByTextBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DikshaUsageByTextBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DikshaUsageByTextBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

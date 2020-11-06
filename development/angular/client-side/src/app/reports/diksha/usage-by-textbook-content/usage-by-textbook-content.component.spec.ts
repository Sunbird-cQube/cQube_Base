import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageByTextbookContentComponent } from './usage-by-textbook-content.component';

describe('UsageByTextbookContentComponent', () => {
  let component: UsageByTextbookContentComponent;
  let fixture: ComponentFixture<UsageByTextbookContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageByTextbookContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageByTextbookContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

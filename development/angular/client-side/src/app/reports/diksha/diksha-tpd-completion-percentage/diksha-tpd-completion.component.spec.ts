import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DikshaTpdCompletionComponent } from './diksha-tpd-completion.component';

describe('DikshaTpdCompletionComponent', () => {
  let component: DikshaTpdCompletionComponent;
  let fixture: ComponentFixture<DikshaTpdCompletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DikshaTpdCompletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DikshaTpdCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

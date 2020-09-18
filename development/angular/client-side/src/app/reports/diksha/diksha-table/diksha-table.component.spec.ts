import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DikshaTableComponent } from './diksha-table.component';

describe('DikshaTableComponent', () => {
  let component: DikshaTableComponent;
  let fixture: ComponentFixture<DikshaTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DikshaTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DikshaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

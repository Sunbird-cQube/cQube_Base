import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PATLOTableComponent } from './pat-lo-table.component';

describe('PATLOTableComponent', () => {
  let component: PATLOTableComponent;
  let fixture: ComponentFixture<PATLOTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PATLOTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PATLOTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

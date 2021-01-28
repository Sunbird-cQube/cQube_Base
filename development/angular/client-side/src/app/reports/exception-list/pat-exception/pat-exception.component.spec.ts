import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PATExceptionComponent } from './pat-exception.component';

describe('PATExceptionComponent', () => {
  let component: PATExceptionComponent;
  let fixture: ComponentFixture<PATExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PATExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PATExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

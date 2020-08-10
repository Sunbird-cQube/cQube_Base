import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NifiShedularComponent } from './nifi-shedular.component';

describe('NifiShedularComponent', () => {
  let component: NifiShedularComponent;
  let fixture: ComponentFixture<NifiShedularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NifiShedularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NifiShedularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

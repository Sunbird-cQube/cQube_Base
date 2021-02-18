import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataReplayComponent } from './data-replay.component';

describe('DataReplayComponent', () => {
  let component: DataReplayComponent;
  let fixture: ComponentFixture<DataReplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataReplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataReplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

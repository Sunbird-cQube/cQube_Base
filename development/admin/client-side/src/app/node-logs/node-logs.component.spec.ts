import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeLogsComponent } from './node-logs.component';

describe('NodeLogsComponent', () => {
  let component: NodeLogsComponent;
  let fixture: ComponentFixture<NodeLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

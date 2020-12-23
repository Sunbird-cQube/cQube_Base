import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DikshaTPDContentProgressComponent } from './diksha-tpd-content-progress.component';

describe('DikshaTPDContentProgressComponent', () => {
  let component: DikshaTPDContentProgressComponent;
  let fixture: ComponentFixture<DikshaTPDContentProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DikshaTPDContentProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DikshaTPDContentProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

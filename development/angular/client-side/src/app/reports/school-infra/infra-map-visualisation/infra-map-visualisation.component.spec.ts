import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfraMapVisualisationComponent } from './infra-map-visualisation.component';

describe('InfraMapVisualisationComponent', () => {
  let component: InfraMapVisualisationComponent;
  let fixture: ComponentFixture<InfraMapVisualisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfraMapVisualisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfraMapVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

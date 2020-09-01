import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolInfrastructureComponent } from './school-infrastructure.component';

describe('SchoolInfrastructureComponent', () => {
  let component: SchoolInfrastructureComponent;
  let fixture: ComponentFixture<SchoolInfrastructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolInfrastructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolInfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

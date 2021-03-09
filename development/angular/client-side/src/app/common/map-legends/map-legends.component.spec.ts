import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLegendsComponent } from './map-legends.component';

describe('MapLegendsComponent', () => {
  let component: MapLegendsComponent;
  let fixture: ComponentFixture<MapLegendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapLegendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLegendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

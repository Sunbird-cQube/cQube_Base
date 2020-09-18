import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { S3FilesDownloadComponent } from './s3-files-download.component';

describe('S3FilesDownloadComponent', () => {
  let component: S3FilesDownloadComponent;
  let fixture: ComponentFixture<S3FilesDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ S3FilesDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S3FilesDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

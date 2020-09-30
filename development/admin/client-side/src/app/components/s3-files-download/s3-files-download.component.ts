import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { S3DownloadsService } from '../../services/s3-downloads.service';
declare const $;

@Component({
  selector: 'app-s3-files-download',
  templateUrl: './s3-files-download.component.html',
  styleUrls: ['./s3-files-download.component.css']
})
export class S3FilesDownloadComponent implements OnInit {
  bucketName;
  folderName;
  fileName;
  listBucket: any = [];
  listFolder: any;
  folderHidden: boolean = true;
  fileHidden: boolean = true;
  fileNames: any = [];
  list: any = [];
  err;
  public selectedFile;

  constructor(private router: Router, private service: S3DownloadsService) { }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('spinner').style.display = 'block';
    this.bucketName = '';
    this.service.listBuckets().subscribe(res => {
      var bucket = res;
      this.listBucket[0] = { Name: bucket['input'] };
      this.listBucket[1] = { Name: bucket['output'] };
      this.listBucket[2] = { Name: bucket['emission'] };

      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.err = "No data founcd";
    });
    document.getElementById('homeBtn').style.display = "Block";
  }

  listFiles() {
    document.getElementById('spinner').style.display = 'block';
    this.folderHidden = true;
    this.fileHidden = false;
    this.folderName = '';
    var element = <HTMLBodyElement>document.getElementById('btn');
    element['disabled'] = true;
    this.service.listFiles(this.bucketName).subscribe((res: any) => {

      var files = []
      res.forEach(element => {
        files.push({ fileName: element['Key'] });
      });

      this.fileNames = files;
      this.fileNames.forEach(element => {
        element['checked'] = false;
      });
      document.getElementById('spinner').style.display = 'none';
    })
  }

  checkedList() {
    var element = <HTMLBodyElement>document.getElementById('btn');
    element['disabled'] = false;
    this.list = this.fileNames.filter(item => item.checked);
  }

  onSubmit() {
    this.service.downloadFile(this.selectedFile, this.bucketName).subscribe(res => {
      window.open(`${res['downloadUrl']}`, "_blank");
    });
  }

}

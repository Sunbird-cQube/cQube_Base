import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
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
  public selectedFile;

  constructor(private router: Router, private service: AppService) { }

  ngOnInit(): void {
    // document.getElementById('spinner').style.display = 'block';
    this.bucketName = '';
    this.service.listBuckets().subscribe(res => {
      var bucket = res['Buckets'];
      bucket.forEach(element => {
        if (element.Name == "cqube-gj-raw" || element.Name == "cqube-gj-input" || element.Name == "cqube-gj-output") {
          this.listBucket.push(element);
        }
      });
      // document.getElementById('spinner').style.display = 'none';
    });
  }

  listFolders() {
    // document.getElementById('spinner').style.display = 'block';
    this.folderHidden = true;
    this.fileHidden = false;
    this.folderName = '';
    this.service.listFolders(this.bucketName).subscribe((res: any) => {

      var files = []
      res.forEach(element => {
        files.push({ fileName: element['Key'] });
      });

      this.fileNames = files;
      this.fileNames.forEach(element => {
        element['checked'] = false;
      });
      // $(document).ready(function () {
      //   $('#table').DataTable({
      //     destroy: false, bLengthChange: false, bInfo: false,
      //     bPaginate: false, scrollY: 420, scrollX: true,
      //     scrollCollapse: true, paging: false, searching: false,
      //     fixedColumns: {
      //       leftColumns: 1
      //     }
      //   });
      // });
      // document.getElementById('spinner').style.display = 'none';
    })
  }

  listFiles() {
    // this.fileHidden = false;
    // this.fileNames = [];
    // this.service.listFolders(this.bucketName).subscribe(res => {

    //   this.fileNames = res['Key'];
    //   this.fileNames.forEach(element => {
    //     element['checked'] = false;
    //   });
    // })
  }

  checkedList() {
    this.list = this.fileNames.filter(item => item.checked);
  }

  onSubmit() {
    this.service.downloadFile(this.selectedFile, this.bucketName).subscribe(res => {
      window.location.href = res['downloadUrl'];
    });
  }

}

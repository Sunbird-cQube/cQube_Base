import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import { Router } from '@angular/router';
import { AppServiceComponent } from '../app.service';
declare const $;

@Component({
  selector: 'app-missing-data',
  templateUrl: './missing-data.component.html',
  styleUrls: ['./missing-data.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MissingDataComponent implements OnInit {
  fileName: any;
  reportData: any = [];
  constructor(private router: Router, private service: AppServiceComponent) {
    service.logoutOnTokenExpire();
  }

  ngOnInit(): void {
    document.getElementById('homeBtn').style.display = "Block";
    document.getElementById('backBtn').style.display = "none";
    $(document).ready(function () {
      $('#table').DataTable({
        destroy: true, bLengthChange: false, bInfo: false,
        bPaginate: false, scrollY: "58vh", scrollX: true,
        scrollCollapse: true, paging: false, searching: false
      });
    });
  }

  school_Invalid_Data() {
    document.getElementById('spinner').style.display = 'block';
    this.service.school_invalid().subscribe(res => {
      this.fileName = "school_invalid_data";
      this.reportData = res;
      this.downloadReport();
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      console.log(err);
      document.getElementById('spinner').style.display = 'none';
    })
  }

  // to download the excel report
  downloadReport() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: this.fileName
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.reportData);
  }

}

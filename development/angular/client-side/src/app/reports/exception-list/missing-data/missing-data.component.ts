import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import { Router } from '@angular/router';
import { ExceptionReportService } from '../../../services/exception-report.service';
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
  constructor(private router: Router, private service: ExceptionReportService) { }

  ngOnInit(): void {
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
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
      alert('No data found, Unable to download');
      document.getElementById('errMsg').style.color = 'red';
      document.getElementById('errMsg').style.display = 'block';
      document.getElementById('errMsg').innerHTML = 'No data found';
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

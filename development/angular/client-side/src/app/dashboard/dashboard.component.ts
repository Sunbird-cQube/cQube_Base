import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AppServiceComponent } from '../app.service';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hiddenPass = false;
  fileName: any;
  reportData: any = [];

  constructor(private router: Router, private service: AppServiceComponent) {
    service.logoutOnToeknExpire();
   }
  ngOnInit() {
    document.getElementById('spinner').style.display = 'none';
    if (localStorage.getItem('roleName') == "admin") {
      this.hiddenPass = false;
    } else {
      this.hiddenPass = true;
    }
    document.getElementById('backBtn').style.display = "block";
    document.getElementById('homeBtn').style.display = "None";

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

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
declare const $;

@Component({
  selector: 'app-diksha-table',
  templateUrl: './diksha-table.component.html',
  styleUrls: ['./diksha-table.component.css']
})
export class DikshaTableComponent implements OnInit {
  public result: any = [];
  public districtId: any = '';
  public timePeriod: any = 'last_30_days';
  public timeDetails: any = '';
  public districtsDetails: any = '';
  dataTable: any;
  dtOptions: any;
  tableData: any = [];
  public hierName: any;
  public dist: boolean = false;
  public all: boolean = false;
  fileName;
  reportData: any = [];

  constructor(
    public http: HttpClient,
    public service: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
  ) {
    service.logoutOnToeknExpire();
  }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
    this.metaData();
  }

  loaderAndErr() {
    if (this.result.length !== 0) {
      document.getElementById('spinner').style.display = 'none';
    } else {
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('errMsg').style.color = 'red';
      document.getElementById('errMsg').style.display = 'block';
      document.getElementById('errMsg').innerHTML = 'No data found';
    }
  }

  errMsg() {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
  }

  metaData() {
    document.getElementById('home').style.display = "none";
    this.errMsg();
    this.districtId = '';
    this.all = true
    this.dist = false;
    this.timePeriod = 'last_30_days';
    this.service.dikshaMetaData().subscribe(result => {
      this.districtsDetails = result['districtDetails']
      this.timeDetails = result['timeRange']
      this.timeDetails = [{ key: 'last_day' }, { key: 'last_7_days' }, { key: 'last_30_days' }]
    })
    if (this.result.length! > 0) {
      $('#table').DataTable().destroy();
    }
    this.result = [];
    this.reportData = [];
    this.service.dikshaAllTableData({ timePeriod: this.timePeriod }).subscribe(res => {
      this.fileName = `Diksha_All_Data_${this.timePeriod}`;
      this.result = res;
      this.result.sort((a, b) => (a.total_content_plays < b.total_content_plays) ? 1 : ((b.total_content_plays < a.total_content_plays) ? -1 : 0));
      $(document).ready(function () {
        $('#table').DataTable({
          destroy: true, bLengthChange: false, bInfo: false,
          bPaginate: false, scrollY: "68vh", scrollX: true,
          scrollCollapse: true, paging: false, searching: true,
          fixedColumns: {
            leftColumns: 1
          }
        });
      });
      this.result.forEach(element => {
        var obj = {
          usage_By: "All",
          content_name: element.content_name,
          textbook: element.textbook,
          subject: element.subject,
          grade: element.grade,
          medium: element.medium,
          total_content_plays: element.total_content_plays
        }
        this.reportData.push(obj);
      });
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.loaderAndErr();
    })
  }

  districtWise(districtId) {
    this.errMsg();
    document.getElementById('home').style.display = "Block";
    this.districtId = districtId
    if (this.timePeriod != '' && districtId != '') {
      this.all = false
      this.dist = true
      let d = this.districtsDetails.filter(item => {
        if (item.district_id == districtId)
          return item.district_name
      })
      this.hierName = d[0].district_name
      this.timeRange(this.timePeriod)
    } else {
      if (districtId == '') {
        this.all = true
        this.dist = false
      } else {
        this.all = false
        this.dist = true
        let d = this.districtsDetails.filter(item => {
          if (item.district_id == districtId)
            return item.district_name
        })
        this.hierName = d[0].district_name
      }

      if (this.result.length! > 0) {
        $('#table').DataTable().destroy();
      }
      this.result = [];
      this.reportData = [];
      this.service.dikshaDistrictTableData(districtId).subscribe(res => {
        this.fileName = `Diksha_Dist_Data_${this.timePeriod}`;
        this.result = res;
        this.result.sort((a, b) => (a.total_content_plays < b.total_content_plays) ? 1 : ((b.total_content_plays < a.total_content_plays) ? -1 : 0));
        $(document).ready(function () {
          $('#table').DataTable({
            destroy: true, bLengthChange: false, bInfo: false,
            bPaginate: false, scrollY: "68vh", scrollX: true,
            scrollCollapse: true, paging: false, searching: false,
            fixedColumns: {
              leftColumns: 1
            }
          });
        });
        this.result.forEach(element => {
          var obj = {
            usage_By: "District",
            district_name: element.district_name,
            district_id: element.district_id,
            content_name: element.content_name,
            textbook: element.textbook,
            subject: element.subject,
            grade: element.grade,
            medium: element.medium,
            total_content_plays: element.total_content_plays
          }
          this.reportData.push(obj);
        });
        document.getElementById('spinner').style.display = 'none';
      }, err => {
        this.loaderAndErr();
      })
    }

  }

  timeRange(timePeriod) {
    this.errMsg();
    document.getElementById('home').style.display = "Block";
    if (this.districtId == '') {
      this.districtId = 'All'
    }
    this.timePeriod = timePeriod
    if (this.result.length! > 0) {
      $('#table').DataTable().destroy();
    }
    this.result = [];
    this.reportData = [];
    this.service.dikshaTimeRangeTableData(this.districtId, timePeriod).subscribe(res => {
      this.fileName = `Diksha_${this.hierName}_Dist_Data_${this.timePeriod}`;
      this.result = res;
      this.result.sort((a, b) => (a.total_content_plays < b.total_content_plays) ? 1 : ((b.total_content_plays < a.total_content_plays) ? -1 : 0));
      $(document).ready(function () {
        $('#table').DataTable({
          destroy: true, bLengthChange: false, bInfo: false,
          bPaginate: false, scrollY: "68vh", scrollX: true,
          scrollCollapse: true, paging: false, searching: true,
          fixedColumns: {
            leftColumns: 1
          }
        });
      });
      this.result.forEach(element => {
        var obj = {
          usage_By: "District",
          district_name: element.district_name,
          district_id: element.district_id,
          content_name: element.content_name,
          textbook: element.textbook,
          subject: element.subject,
          grade: element.grade,
          medium: element.medium,
          total_content_plays: element.total_content_plays
        }
        this.reportData.push(obj);
      });
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.loaderAndErr();
    })
  }

  downloadRoport() {
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

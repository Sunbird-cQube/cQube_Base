import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HeatmapModule from 'highcharts/modules/heatmap';
HeatmapModule(Highcharts);
import { AppServiceComponent } from '../../../app.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PatReportService } from '../../../services/pat-report.service';
declare const $;

@Component({
  selector: 'app-pat-lo-table',
  templateUrl: './pat-lo-table.component.html',
  styleUrls: ['./pat-lo-table.component.css']
})
export class PATLOTableComponent implements OnInit {
  name: string;
  level = '';

  // For filter implementation
  districtNames = [];
  district;
  blockNames = [];
  block;
  clusterNames = [];
  cluster;

  years = [];
  grades = [];
  subjects = [];
  examDates = [];
  allViews = [];
  public year = 2020;
  public grade = '';
  public subject = '';
  public examDate = '';
  public viewBy = ''

  //to set hierarchy level
  skul = true;
  dist = false;
  blok = false;
  clust = false;

  // to set hierarchy values
  districtHierarchy: any;
  blockHierarchy: any;
  clusterHierarchy: any;

  data;

  // to download the excel report
  public fileName: any = `State_wise_report_${this.year}`
  public reportData: any = [];

  public metaData: any;
  myData;

  constructor(
    public http: HttpClient,
    public service: PatReportService,
    public commonService: AppServiceComponent,
    public router: Router
  ) {
  }

  ngOnInit(): void {
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.commonFunc()
  }

  resetToInitPage() {
    this.skul = true;
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.grade = undefined;
    this.examDate = undefined;
    this.subject = undefined;
    this.district = undefined;
    document.getElementById('home').style.display = 'none';
    this.commonFunc();
  }

  commonFunc = () => {
    this.commonService.errMsg();
    this.level = 'district';
    this.reportData = [];
    let a = {
      year: this.year,
      grade: this.grade,
      subject_name: this.subject,
      exam_date: this.examDate,
      viewBy: this.viewBy == '' ? 'indicator' : this.viewBy
    }

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.PATHeatMapAllData(a).subscribe(response => {
      console.log(response['tableData']);
      this.createTable(response['tableData']);
      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      console.log(err);
      this.reportData = [];
      this.commonService.loaderAndErr(this.districtNames);
    })
  }

  createTable(dataSet) {
    var my_columns = [];
    $.each(dataSet[0], function (key, value) {
      var my_item = {};
      my_item['data'] = key;
      my_item['value'] = value;
      my_columns.push(my_item);
    });
    
    $(document).ready(function () {
      var headers = '<thead><tr>'
      var body = '<tbody>';
      my_columns.forEach((column, i) => {
          var col = (column.data.replace(/_/g, ' ')).replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
          headers += `<th>${col}</th>`
      });

      let newArr = [];
      $.each(dataSet, function (a, b) {
        let temp = [];
        $.each(b, function (key, value) {
            var new_item = {};
            new_item['data'] = key;
            new_item['value'] = value;
            temp.push(new_item);
        });
        newArr.push(temp)
      });

      newArr.forEach((columns) => {
        body += '<tr>';
        columns.forEach((column) => {
            body += `<td>${column.value}</td>`
        });
        body += '</tr>';
      });

      headers += `</tr></thead>`
      body += '</tbody>';
      $(`#LOtable`).empty();
      $(`#LOtable`).append(headers);
      $(`#LOtable`).append(body);
      $(`#LOtable`).DataTable({
        destroy: true, bLengthChange: false, bInfo: false,
        bPaginate: false, scrollY: "58vh", scrollX: true,
        scrollCollapse: true, paging: false, searching: false,
        fixedColumns: {
          leftColumns: 1
        }
      });
    });
  }



  selectedYear() {
    this.fileName = "Year_wise_report";
    document.getElementById('home').style.display = 'none';
    this.commonFunc()
  }

  selectedGrade() {
    this.fileName = "Grade_wise_report";
    document.getElementById('home').style.display = 'block';
    this.commonFunc()
  }

  selectedSubject() {
    this.fileName = "Subject_wise_report";
    document.getElementById('home').style.display = 'block';
    this.commonFunc()
  }

  selectedExamDate() {
    this.fileName = "ExamDate_wise_report";
    document.getElementById('home').style.display = 'block';
    this.commonFunc()
  }

  selectedViewBy() {
    this.fileName = "ViewBy_report";
    document.getElementById('home').style.display = 'block';
    this.commonFunc()
  }

  selectedDistrict(districtId) {
    document.getElementById('home').style.display = 'block';
    this.commonService.errMsg();
    this.reportData = [];
    this.level = 'block';
    this.skul = false;
    this.dist = true;
    this.blok = false;
    this.clust = false;

    let a = {
      year: this.year,
      grade: this.grade,
      subject_name: this.subject,
      exam_date: this.examDate,
      viewBy: this.viewBy == '' ? 'indicator' : this.viewBy,
      districtId: districtId
    }

    var dist = this.districtNames.find(a => a.district_id == districtId);
    this.districtHierarchy = {
      districtName: dist.district_name,
      distId: dist.district_id
    }
    this.service.PATHeatMapDistData(a).subscribe(response => {
      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      console.log(err);
      this.reportData = [];
      this.commonService.loaderAndErr(this.reportData);
    })

  }

  selectedBlock(blockId) {
    document.getElementById('home').style.display = 'block';
    this.commonService.errMsg();
    this.reportData = [];
    this.level = 'block';
    this.skul = false;
    this.dist = true;
    this.blok = false;
    this.clust = false;

    let a = {
      year: this.year,
      grade: this.grade,
      subject_name: this.subject,
      exam_date: this.examDate,
      viewBy: this.viewBy == '' ? 'indicator' : this.viewBy,
      districtId: this.district,
      blockId: blockId
    }

    var block = this.blockNames.find(a => a.block_id == blockId);
    this.districtHierarchy = {
      districtName: block.district_name,
      distId: block.district_id,
      blockName: block.block_name,
      blockId: block.block_id
    }
    this.service.PATHeatMapBlockData(a).subscribe(response => {
      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      console.log(err);
      this.reportData = [];
      this.commonService.loaderAndErr(this.reportData);
    })
  }

  selectedCluster(clusterId) {

  }

  // to download the csv report
  downloadReport() {
    this.commonService.download(this.fileName, this.reportData);
  }
}

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
  level = '';

  // For filter implementation
  districtNames = [];
  district;
  blockNames = [];
  block;
  clusterNames = [];
  cluster;

  blockHidden = true;
  clusterHidden = true;

  years = [];
  grades = [];
  subjects = [];
  examDates = [];
  allViews = [];

  public year = '2020';
  public grade = 'all';
  public subject = 'all';
  public examDate = 'all';
  public viewBy = 'indicator';

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
  public fileName: any = `District_wise_report_${this.year}`
  public reportData: any = [];

  public metaData: any;
  myData;

  constructor(
    public http: HttpClient,
    public service: PatReportService,
    public commonService: AppServiceComponent,
    public router: Router
  ) {
    service.PATHeatMapMetaData().subscribe(res => {
      this.metaData = res['data'][0];
      this.years.push(this.metaData['year']);
      this.grades = this.metaData.data['grades'];
      this.grades = [{ grade: "all" }, ...this.grades.filter(item => item !== { grade: "all" })];
      this.subjects = this.metaData.data['subjects'];
      this.subjects = [{ subject: "all" }, ...this.subjects.filter(item => item !== { subject: "all" })];
      this.examDates = this.metaData.data['examDate'];
      this.examDates = [{ exam_date: "all" }, ...this.examDates.filter(item => item !== { exam_date: "all" })];
      this.allViews = this.metaData.data['viewBy'];
    })
  }

  ngOnInit(): void {
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.commonFunc()
  }

  resetToInitPage() {
    this.fileName = "District_wise_report";
    this.skul = true;
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.grade = 'all';
    this.examDate = 'all';
    this.subject = 'all';
    this.viewBy = 'indicator';
    this.district = undefined;
    this.block = undefined;
    this.cluster = undefined;
    this.blockHidden = true;
    this.clusterHidden = true;
    document.getElementById('home').style.display = 'none';
    this.commonFunc();
  }

  commonFunc = () => {
    this.commonService.errMsg();
    this.level = 'district';
    let a = {
      year: this.year,
      grade: this.grade == 'all' ? '' : this.grade,
      subject_name: this.subject == 'all' ? '' : this.subject,
      exam_date: this.examDate == 'all' ? '' : this.examDate,
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy
    }

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.patLOTableDistData(a).subscribe(response => {
     this.resetTable();
     this.reportData = [];
     this.reportData = response['tableData'];
     this.districtNames = response['districtDetails'];
     this.districtNames = this.districtNames.sort((a, b) => (a.district_name > b.district_name) ? 1 : ((b.district_name > a.district_name) ? -1 : 0));
      this.createTable(response['tableData']);
      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      this.handleError();
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
        bPaginate: false, scrollY: "63vh", scrollX: true,
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
    this.levelWiseFilter();
  }

  selectedGrade() {
    this.fileName = "Grade_wise_report";
    this.levelWiseFilter();
  }

  selectedSubject() {
    this.fileName = "Subject_wise_report";
    this.levelWiseFilter();
  }

  selectedExamDate() {
    this.fileName = "ExamDate_wise_report";
    this.levelWiseFilter();
  }

  selectedViewBy() {
    this.fileName = "ViewBy_report";
    this.levelWiseFilter();
  }

  selectedDistrict(districtId) {
    this.fileName = "Block_wise_report";
    this.level = 'block';
    this.block = undefined;
    this.cluster = undefined;
    this.blockHidden = false;
    this.clusterHidden = true;
    document.getElementById('home').style.display = 'block';
    this.commonService.errMsg();
    this.reportData = [];

    let a = {
      year: this.year,
      grade: this.grade == 'all' ? '' : this.grade,
      subject_name: this.subject == 'all' ? '' : this.subject,
      exam_date: this.examDate == 'all' ? '' : this.examDate,
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy,
      districtId: districtId
    }

    this.service.patLOTableBlockData(a).subscribe(response => {
    this.reportData = response['tableData'];
     this.blockNames = response['blockDetails'];
     this.blockNames = this.blockNames.sort((a, b) => (a.block_name > b.block_name) ? 1 : ((b.block_name > a.block_name) ? -1 : 0));
     this.resetTable();
      this.createTable(response['tableData']);
      var dist = this.districtNames.find(a => a.district_id == districtId);
      this.districtHierarchy = {
        districtName: dist.district_name,
        distId: dist.district_id
      }
      this.skul = false;
      this.dist = true;
      this.blok = false;
      this.clust = false;
      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      this.handleError();
    })

  }

  selectedBlock(blockId) {
    this.fileName = "Cluster_wise_report";
    this.level = 'cluster';
    this.cluster = undefined;
    this.blockHidden = false;
    this.clusterHidden = false;
    document.getElementById('home').style.display = 'block';
    this.commonService.errMsg();
    this.reportData = [];

    let a = {
      year: this.year,
      grade: this.grade == 'all' ? '' : this.grade,
      subject_name: this.subject == 'all' ? '' : this.subject,
      exam_date: this.examDate == 'all' ? '' : this.examDate,
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy,
      districtId: this.district,
      blockId: blockId
    }

    this.service.patLOTableClusterData(a).subscribe(response => {
      this.reportData = response['tableData'];
     this.clusterNames = response['clusterDetails'];
     this.clusterNames = this.clusterNames.sort((a, b) => (a.cluster_name > b.cluster_name) ? 1 : ((b.cluster_name > a.cluster_name) ? -1 : 0));
     this.resetTable();
      this.createTable(response['tableData']);
      var block = this.blockNames.find(a => a.block_id == blockId);
      this.blockHierarchy = {
        districtName: block.district_name,
        distId: block.district_id,
        blockName: block.block_name,
        blockId: block.block_id
      }

      this.skul = false;
      this.dist = false;
      this.blok = true;
      this.clust = false;
      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      this.handleError();
    })
  }

  selectedCluster(clusterId) {
    this.fileName = "School_wise_report";
    this.level = 'school';
    document.getElementById('home').style.display = 'block';
    this.commonService.errMsg();
    this.reportData = [];

    let a = {
      year: this.year,
      grade: this.grade == 'all' ? '' : this.grade,
      subject_name: this.subject == 'all' ? '' : this.subject,
      exam_date: this.examDate == 'all' ? '' : this.examDate,
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy,
      districtId: this.district,
      blockId: this.block,
      clusterId: clusterId
    }

    this.service.patLOTableSchoolData(a).subscribe(response => {
      this.reportData = response['tableData'];
     this.resetTable();
      this.createTable(response['tableData']);
      var cluster = this.clusterNames.find(a => a.cluster_id == clusterId);
      this.clusterHierarchy = {
        districtName: cluster.district_name,
        distId: cluster.district_id,
        blockName: cluster.block_name,
        blockId: cluster.block_id,
        clusterId: cluster.cluster_id,
        clusterName: cluster.cluster_name
      }
      this.skul = false;
      this.dist = false;
      this.blok = false;
      this.clust = true;

      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      this.handleError();
    })
  }

  //resetting table
  resetTable(){
    if(this.reportData.length > 0){
      $(`#LOtable`).empty();
      $('#LOtable').DataTable().destroy();
    }
  }
//level wise filter
levelWiseFilter() {
  document.getElementById('initTable').style.display = 'block';
  document.getElementById('home').style.display = 'block';
  if (this.level == 'district') {
    this.commonFunc()
  }
  if (this.level == 'block') {
    this.selectedDistrict(this.district);
  }
  if (this.level == 'cluster') {
    this.selectedBlock(this.block)
  }
  if (this.level == 'school') {
    this.selectedCluster(this.cluster);
  }
}

//error handling
handleError(){
  $(`#LOtable`).empty();
  this.reportData = [];
  this.commonService.loaderAndErr(this.reportData);
  document.getElementById('initTable').style.display = 'none';
}

// to download the csv report
downloadReport() {
  this.commonService.download(this.fileName, this.reportData);
}
}

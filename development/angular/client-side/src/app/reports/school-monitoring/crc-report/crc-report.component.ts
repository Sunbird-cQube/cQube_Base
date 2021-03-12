import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrcReportService } from '../../../services/crc-report.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ExportToCsv } from 'export-to-csv';
import { AppServiceComponent } from '../../../app.service';
declare const $;

@Component({
  selector: 'app-crc-report',
  templateUrl: './crc-report.component.html',
  styleUrls: ['./crc-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CrcReportComponent implements OnInit {
  dataTable: any;
  dtOptions: any;
  tableData: any = [];

  @ViewChild('dataTable', { static: true }) table;

  public title: string = '';
  public titleName: string = '';

  public districts: any;
  public blocks: any = [];
  public cluster: any = [];
  public schools: any = [];

  public districtsNames: any = [];
  public blocksNames: any = [];
  public clusterNames: any = [];
  public schoolsNames: any = [];

  public id: any = '';

  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;

  public myDistrict: any;
  public myBlock: any;
  public myCluster: any;

  public colors: any;

  public studentCount: any;
  public schoolCount: any;

  public dateRange: any = '';

  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;
  public skul: boolean = true;

  public hierName: any;
  public distName: any;
  public blockName: any;
  public clustName: any;

  public visitCount: any;
  public visitedSchools: any;
  public notVisitedSchools: any;

  public styles: any = [];
  public labelOptions: any = {};

  public mylatlngData: any = [];
  public result: any = [];

  public scatterChart: Chart;
  public xAxis: any = "visit_0";
  public yAxis: any = "visit_1_2";

  public crcDistrictsNames: any;
  public crcBlocksNames: any;
  public crcClusterNames: any;
  public crcSchoolNames: any;

  public fileName: any;
  public reportData: any = [];

  public xAxisFilter = [
    { key: 'visit_0', value: "Visit-0 times (%)" },
    { key: 'visit_1_2', value: "Visit-1 to 2 times (%)" },
    { key: 'visit_3_5', value: "Visit-3 to 5 times (%)" },
    { key: 'visit_6_10', value: "Visit-6 to 10 times (%)" },
    { key: 'visit_10_more', value: "Visits more than 10 times (%)" },
    { key: "no_of_schools_per_crc", value: "Number of schools per CRC" },
    { key: "visits_per_school", value: "Visits per schools" },
    { key: "visitedSchoolCount", value: "Visited schools count" },
    { key: "totalSchools", value: "Total schools" },
    { key: "totalVisits", value: "Total visits" }
  ]

  public yAxisFilter = [
    { key: 'visit_0', value: "Visit-0 times (%)" },
    { key: 'visit_1_2', value: "Visit-1 to 2 times (%)" },
    { key: 'visit_3_5', value: "Visit-3 to 5 times (%)" },
    { key: 'visit_6_10', value: "Visit-6 to 10 times (%)" },
    { key: 'visit_10_more', value: "Visits more than 10 times (%)" },
    { key: "no_of_schools_per_crc", value: "Number of schools per CRC" },
    { key: "visits_per_school", value: "Visits per schools" },
    { key: "visitedSchoolCount", value: "Visited schools count" },
    { key: "totalSchools", value: "Total schools" },
    { key: "totalVisits", value: "Total visits" }
  ]

  timeRange = [{ key: 'overall', value: "Overall" }, { key: 'last_30_days', value: "Last 30 Days" }, { key: 'last_7_days', value: "Last 7 Days" }, { key: "last_day", value: "Last Day" }];
  period = 'overall';

  myData;
  state: string;
  constructor(public http: HttpClient, public service: CrcReportService, public router: Router, private changeDetection: ChangeDetectorRef, public commonService: AppServiceComponent, private readonly _router: Router) {
    localStorage.removeItem('resData');
  }

  height = window.innerHeight;
  onResize() {
    this.height = window.innerHeight;
    this.levelWiseFilter();
  }

  ngOnInit() {
    this.state = this.commonService.state;
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.createChart(["clg"], [], '', {});
    let params = JSON.parse(sessionStorage.getItem('report-level-info'));

    if (params)
      this.period = params.timePeriod;
    if (params && params.level) {
      let data = params.data;
      if (params.level === 'district') {
        this.myDistrict = data.id;
        this.getDistricts(params.level);
      } else if (params.level === 'block') {
        this.myDistrict = data.districtId;
        this.myBlock = data.id;
        this.getDistricts(params.level);
        this.getBlocks(params.level, data.districtId, data.id);
      } else if (params.level === 'cluster') {
        this.myDistrict = data.districtId;
        this.myBlock = data.blockId;
        this.myCluster = data.id;
        this.getDistricts(params.level);
        this.getBlocks(params.level, data.districtId, data.blockId);
        this.getClusters(data.districtId, data.blockId, data.id);
      }
    } else {
      this.onResize();
      // this.districtWise();
    }
  }

  getDistricts(level): void {
    this.scatterChart.destroy();
    this.service.crcDistWiseData({ timePeriod: this.period }).subscribe(res => {
      localStorage.setItem('resData', JSON.stringify(res));
      this.result = res;
      let a = this.result.schoolsVisitedCount
      this.result = this.result.visits;
      this.crcDistrictsNames = this.result;

      for (var i = 0; i < this.result.length; i++) {
        if (this.myDistrict == this.result[i].districtId) {
          localStorage.setItem('dist', this.result[i].districtName);
          localStorage.setItem('distId', this.myDistrict);
        }

        this.districtsNames.push({ id: this.result[i].districtId, name: this.result[i].districtName });
      }
      this.crcDistrictsNames.sort((a, b) => (a.districtName > b.districtName) ? 1 : ((b.districtName > a.districtName) ? -1 : 0));

      if (level === 'district') {
        this.myDistData(this.myDistrict, true);
      }
    });
  }

  getBlocks(level, distId, blockId?: any): void {
    this.service.crcBlockWiseData(distId, { timePeriod: this.period }).subscribe((result: any) => {
      this.crcBlocksNames = result;
      this.reportData = this.crcBlocksNames = this.crcBlocksNames.visits;
      for (var i = 0; i < this.crcBlocksNames.length; i++) {
        if (blockId == this.crcBlocksNames[i].blockId) {
          localStorage.setItem('block', this.crcBlocksNames[i].blockName);
          localStorage.setItem('blockId', blockId);
        }

        this.blocksNames.push({ id: this.crcBlocksNames[i].blockId, name: this.crcBlocksNames[i].blockName });
      }
      this.crcBlocksNames.sort((a, b) => (a.blockName > b.blockName) ? 1 : ((b.blockName > a.blockName) ? -1 : 0));

      if (level === 'block')
        this.myBlockData(blockId, true);
    });
  }

  getClusters(distId, blockId, clusterId): void {
    this.service.crcClusterWiseData(distId, blockId, { timePeriod: this.period }).subscribe((result: any) => {
      this.crcClusterNames = result.visits;
      this.reportData = this.crcClusterNames;

      localStorage.setItem('clusterId', clusterId);

      for (var i = 0; i < this.crcClusterNames.length; i++) {
        if (clusterId == this.crcClusterNames[i].clusterId) {
          localStorage.setItem('cluster', this.crcClusterNames[i].clusterName);
        }
        this.clusterNames.push({ id: this.crcClusterNames[i].clusterId, name: this.crcClusterNames[i].clusterName });
      }
      this.crcClusterNames.sort((a, b) => (a.clusterName > b.clusterName) ? 1 : ((b.clusterName > a.clusterName) ? -1 : 0));

      this.myClusterData(clusterId, true);
    });
  }

  public tableHead: any;
  public chartData: any = [];
  public modes: any;
  reportName = 'crc_report';


  onPeriodSelect() {
    if (this.period != 'overall') {
      document.getElementById('home').style.display = 'block';
    } else {
      document.getElementById('home').style.display = 'none';
    }
    // if (this.skul) {
    //   this.districtWise();
    // } else if (this.dist) {
    //   this.myDistData(this.distName);
    // } else if (this.blok) {
    //   this.myBlockData(this.blockName);
    // } else if (this.clust) {
    //   this.myClusterData(this.clustName);
    // }
    this.onResize();
  }
  onClockHome() {
    this.period = 'overall';
    document.getElementById('home').style.display = 'none';
    this.districtWise();
  }

  districtWise() {
    if ($.fn.DataTable.isDataTable('#table')) {
      $('#table').DataTable().destroy();
      $('#table').empty();
    }
    this.scatterChart.destroy();
    this.changeDetection.detectChanges();
    this.reportData = [];
    this.tableHead = "District Name";
    this.fileName = `${this.reportName}_${this.period}_allDistricts_${this.commonService.dateAndTime}`;
    this.blockHidden = true;
    this.clusterHidden = true;
    this.crcDistrictsNames = [];
    this.visitedSchools = 0;
    this.notVisitedSchools = 0;
    this.myDistrict = '';
    this.commonService.errMsg();
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.skul = true;

    this.schoolCount = 0;
    this.visitCount = 0;

    this.tableData = [];

    this.dateRange = localStorage.getItem('dateRange');
    this.schoolCount = 0;
    this.visitCount = 0;
    this.chartData = []

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.crcDistWiseData({ timePeriod: this.period }).subscribe(res => {
      localStorage.setItem('resData', JSON.stringify(res));
      this.result = res;
      let a = this.result.schoolsVisitedCount
      this.result = this.result.visits;

      this.modes = ['District Wise', 'Block Wise', 'Cluster Wise', 'School Wise'];
      this.reportData = [];
      if (this.result.length > 0) {
        var labels = [];
        this.reportData = this.crcDistrictsNames = this.result;
        for (var i = 0; i < this.result.length; i++) {
          this.districtsNames.push({ id: this.result[i].districtId, name: this.result[i].districtName });
          labels.push(this.result[i].districtName);
          this.chartData.push({ x: Number(this.result[i][this.xAxis]), y: Number(this.result[i][this.yAxis]) });
        }
        this.crcDistrictsNames.sort((a, b) => (a.districtName > b.districtName) ? 1 : ((b.districtName > a.districtName) ? -1 : 0));

        this.countVisitedAndNotVisited(a);

        let x_axis = this.xAxisFilter.find(o => o.key == this.xAxis);
        let y_axis = this.yAxisFilter.find(o => o.key == this.yAxis);
        let obj = {
          xAxis: x_axis.value,
          yAxis: y_axis.value
        }
        this.createChart(labels, this.chartData, this.tableHead, obj);
        this.tableData = this.result;
        this.dtOptions = {
          data: this.tableData,
          iDisplayLength: this.result.length,
          "bLengthChange": false,
          "bInfo": false,
          "bPaginate": false,
          scrollY: this.height > 1760 ? '65vh' : this.height > 1180 && this.height < 1760 ? '54vh' : this.height > 667 && this.height < 1180 ? '44vh' : '35vh',
          scrollX: true,
          scrollCollapse: true,
          paging: false,
          "searching": false,
          fixedColumns: {
            leftColumns: 1
          },
          columns: [
            { title: 'District Name', data: 'districtName' },
            { title: 'Visit-0 times (%)', data: 'visit_0' },
            { title: 'Visit-1 to 2 times (%)', data: 'visit_1_2' },
            { title: 'Visit-3 to 5 times (%)', data: 'visit_3_5' },
            { title: 'Visit-6 to 10 times (%)', data: 'visit_6_10' },
            { title: 'Visits more than 10 times (%)', data: 'visit_10_more' },
            { title: 'Number of schools per CRC', data: 'no_of_schools_per_crc' },
            { title: "Visits per schools", data: "visits_per_school" },
            { title: "Visited schools count", data: "visitedSchoolCount" },
            { title: "Total schools", data: "totalSchools" },
            { title: "Total visits", data: "totalVisits" }
          ]
        };
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable(this.dtOptions);

        this.commonService.loaderAndErr(this.chartData);
        this.changeDetection.detectChanges();
      }
    }, err => {
      this.chartData = [];
      this.createChart(["clg"], [], '', {});
      $('#table').empty();
      this.changeDetection.detectChanges();
      this.commonService.loaderAndErr(this.chartData);
    });
  }

  distWise() {
    this.reportData = [];
    this.fileName = `${this.reportName}_${this.period}_allDistricts_${this.commonService.dateAndTime}`;
    if (JSON.parse(localStorage.getItem('resData')) !== null) {
      this.chartData = [];
      this.result = JSON.parse(localStorage.getItem('resData'));
      this.result = this.result.visits;
      this.reportData = this.result;
      this.downloadReport();
    } else {
      alert("No data found to download");
    }
  }

  blockWise() {
    this.reportData = [];
    this.commonService.errMsg();
    var element1: any = document.getElementsByClassName('dwnld');
    // element1[0].disabled = true;
    this.fileName = `${this.reportName}_${this.period}_allBlocks_${this.commonService.dateAndTime}`;
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.crcAllBlockWiseData({ timePeriod: this.period }).subscribe(res => {
      this.reportData = res['visits'];
      if (res !== null) {
        document.getElementById('spinner').style.display = 'none';
        element1[0].disabled = false;
      }
      this.downloadReport();
      this.changeDetection.markForCheck();
    }, err => {
      alert("No data found to download");
      this.chartData = [];
      this.commonService.loaderAndErr(this.chartData);
    });
  }

  clusterWise() {
    this.reportData = [];
    this.commonService.errMsg();
    var element1: any = document.getElementsByClassName('dwnld');
    // element1[0].disabled = true;
    this.fileName = `${this.reportName}_${this.period}_allClusters_${this.commonService.dateAndTime}`;
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.crcAllClusterWiseData({ timePeriod: this.period }).subscribe(res => {
      this.reportData = res['visits'];
      if (res !== null) {
        document.getElementById('spinner').style.display = 'none';
        element1[0].disabled = false;
      }
      this.downloadReport();
      this.changeDetection.markForCheck();
    }, err => {
      alert("No data found to download");
      this.chartData = [];
      this.commonService.loaderAndErr(this.chartData);
    });
  }

  schoolWise() {
    this.reportData = [];
    this.commonService.errMsg();
    var element1: any = document.getElementsByClassName('dwnld');
    // element1[0].disabled = true;
    this.fileName = `${this.reportName}_${this.period}_allSchools_${this.commonService.dateAndTime}`;
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.crcAllSchoolWiseData({ timePeriod: this.period }).subscribe(res => {
      this.reportData = res['visits'];
      if (res !== null) {
        document.getElementById('spinner').style.display = 'none';
        element1[0].disabled = false;
      }
      this.downloadReport();
      this.changeDetection.markForCheck();
    }, err => {
      alert("No data found to download");
      this.chartData = [];
      this.commonService.loaderAndErr(this.chartData);
    });
  }


  myDistData(data, fromParam = false) {

    this.scatterChart.destroy();
    this.modes = [];
    this.downloadType = '';
    this.blockHidden = false;
    this.clusterHidden = true;
    this.fileName = `${this.reportName}_${this.period}_blocks_of_district_${data}_${this.commonService.dateAndTime}`;
    this.myBlock = '';
    this.crcBlocksNames = [];
    this.visitedSchools = 0;
    this.notVisitedSchools = 0;
    this.commonService.errMsg();
    this.schoolCount = 0;
    this.visitCount = 0;
    this.tableData = [];
    this.chartData = [];
    this.reportData = [];
    this.tableHead = "Block Name";
    this.dist = true;
    this.blok = false;
    this.clust = false;
    this.skul = false;
    let obj = this.districtsNames.find(o => o.id == data);
    this.distName = data;
    this.hierName = obj.name;
    localStorage.setItem('dist', obj.name);
    localStorage.setItem('distId', data);

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.crcBlockWiseData(data, { timePeriod: this.period }).subscribe((result: any) => {
      if (!fromParam) {
        if ($.fn.DataTable.isDataTable('#table')) {
          $('#table').DataTable().destroy();
          $('#table').empty();
        }
      }
      this.crcBlocksNames = result;
      let a = this.crcBlocksNames.schoolsVisitedCount
      this.reportData = this.crcBlocksNames = this.crcBlocksNames.visits;

      if (this.result.length > 0) {
        var labels = [];
        for (var i = 0; i < this.crcBlocksNames.length; i++) {
          this.blocksNames.push({ id: this.crcBlocksNames[i].blockId, name: this.crcBlocksNames[i].blockName });
          labels.push(this.crcBlocksNames[i].blockName);
          this.chartData.push({ x: Number(this.crcBlocksNames[i][this.xAxis]), y: Number(this.crcBlocksNames[i][this.yAxis]) });
        }
        this.crcBlocksNames.sort((a, b) => (a.blockName > b.blockName) ? 1 : ((b.blockName > a.blockName) ? -1 : 0));
        this.countVisitedAndNotVisited(a);

        let x_axis = this.xAxisFilter.find(o => o.key == this.xAxis);
        let y_axis = this.yAxisFilter.find(o => o.key == this.yAxis);
        let obj = {
          xAxis: x_axis.value,
          yAxis: y_axis.value
        }

        this.createChart(labels, this.chartData, this.tableHead, obj);
        this.changeDetection.detectChanges();
        this.tableData = this.crcBlocksNames;
        this.dtOptions = {
          data: this.tableData,
          iDisplayLength: this.crcBlocksNames.length,
          "bLengthChange": false,
          "bInfo": false,
          "bPaginate": false,
          scrollY: this.height > 1760 ? '65vh' : this.height > 1180 && this.height < 1760 ? '54vh' : this.height > 667 && this.height < 1180 ? '44vh' : '35vh',
          scrollX: true,
          scrollCollapse: true,
          paging: false,
          "searching": false,
          fixedColumns: {
            leftColumns: 1
          },
          columns: [
            { title: 'District Name', data: 'districtName' },
            { title: 'Block Name', data: 'blockName' },
            { title: 'Visit-0 times (%)', data: 'visit_0' },
            { title: 'Visit-1 to 2 times (%)', data: 'visit_1_2' },
            { title: 'Visit-3 to 5 times (%)', data: 'visit_3_5' },
            { title: 'Visit-6 to 10 times (%)', data: 'visit_6_10' },
            { title: 'Visits more than 10 times (%)', data: 'visit_10_more' },
            { title: 'Number of schools per CRC', data: 'no_of_schools_per_crc' },
            { title: "Visits per schools", data: "visits_per_school" },
            { title: "Visited schools count", data: "visitedSchoolCount" },
            { title: "Total schools", data: "totalSchools" },
            { title: "Total visits", data: "totalVisits" }
          ]
        };
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable(this.dtOptions);


        this.changeDetection.markForCheck();
        this.commonService.loaderAndErr(this.chartData);
      }
    }, err => {
      this.chartData = [];
      this.createChart(["clg"], [], '', {});
      $('#table').empty();
      this.changeDetection.detectChanges();
      this.commonService.loaderAndErr(this.chartData);
    });
    this.blocksNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    document.getElementById('home').style.display = 'block';;
  }

  myBlockData(data: any, fromParam = false) {
    this.scatterChart.destroy();
    this.modes = [];
    this.downloadType = '';
    this.clusterHidden = false;
    this.blockHidden = false;
    this.fileName = `${this.reportName}_${this.period}_clusters_of_block_${data}_${this.commonService.dateAndTime}`;
    this.myCluster = '';
    this.crcClusterNames = [];
    this.visitedSchools = 0;
    this.notVisitedSchools = 0;
    this.commonService.errMsg();
    this.schoolCount = 0;
    this.visitCount = 0;
    this.tableData = [];
    this.chartData = [];
    this.reportData = [];
    this.tableHead = "Cluster Name";
    this.dist = false;
    this.blok = true;
    this.clust = false;
    this.skul = false;

    localStorage.setItem('blockId', data);
    this.titleName = localStorage.getItem('dist');
    this.distName = localStorage.getItem('distId');
    this.blockName = data;
    let obj = this.blocksNames.find(o => o.id == data);
    localStorage.setItem('block', JSON.stringify(obj.name));
    this.hierName = obj.name;

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.crcClusterWiseData(localStorage.getItem('distId'), data, { timePeriod: this.period }).subscribe((result: any) => {
      if (!fromParam) {
        if ($.fn.DataTable.isDataTable('#table')) {
          $('#table').DataTable().destroy();
          $('#table').empty();
        }
        this.changeDetection.detectChanges();
      }

      this.crcClusterNames = result;
      let a = this.crcClusterNames.schoolsVisitedCount
      this.crcClusterNames = this.crcClusterNames.visits;
      this.reportData = this.crcClusterNames;

      var labels = [];
      for (var i = 0; i < this.crcClusterNames.length; i++) {
        this.clusterNames.push({ id: this.crcClusterNames[i].clusterId, name: this.crcClusterNames[i].clusterName });
        labels.push(this.crcClusterNames[i].clusterName);
        this.chartData.push({ x: Number(this.crcClusterNames[i][this.xAxis]), y: Number(this.crcClusterNames[i][this.yAxis]) });
      }
      this.crcClusterNames.sort((a, b) => (a.clusterName > b.clusterName) ? 1 : ((b.clusterName > a.clusterName) ? -1 : 0));
      this.countVisitedAndNotVisited(a);

      let x_axis = this.xAxisFilter.find(o => o.key == this.xAxis);
      let y_axis = this.yAxisFilter.find(o => o.key == this.yAxis);
      let obj = {
        xAxis: x_axis.value,
        yAxis: y_axis.value
      }

      this.createChart(labels, this.chartData, this.tableHead, obj);
      this.changeDetection.detectChanges();
      this.tableData = this.crcClusterNames;
      this.dtOptions = {
        data: this.tableData,
        iDisplayLength: this.crcClusterNames.length,
        "bLengthChange": false,
        "bInfo": false,
        "bPaginate": false,
        scrollY: this.height > 1760 ? '65vh' : this.height > 1180 && this.height < 1760 ? '54vh' : this.height > 667 && this.height < 1180 ? '44vh' : '35vh',
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        "searching": false,
        fixedColumns: {
          leftColumns: 1
        },
        columns: [
          { title: 'District Name', data: 'districtName' },
          { title: 'Block Name', data: 'blockName' },
          { title: 'Cluster Name', data: 'clusterName' },
          { title: 'Visit-0 times (%)', data: 'visit_0' },
          { title: 'Visit-1 to 2 times (%)', data: 'visit_1_2' },
          { title: 'Visit-3 to 5 times (%)', data: 'visit_3_5' },
          { title: 'Visit-6 to 10 times (%)', data: 'visit_6_10' },
          { title: 'Visits more than 10 times (%)', data: 'visit_10_more' },
          { title: 'Number of schools per CRC', data: 'no_of_schools_per_crc' },
          { title: "Visits per schools", data: "visits_per_school" },
          { title: "Visited schools count", data: "visitedSchoolCount" },
          { title: "Total schools", data: "totalSchools" },
          { title: "Total visits", data: "totalVisits" }
        ]
      };
      this.dataTable = $(this.table.nativeElement);
      this.dataTable.DataTable(this.dtOptions);

      this.changeDetection.markForCheck();
      this.commonService.loaderAndErr(this.chartData);
    }, err => {
      this.chartData = [];
      this.createChart(["clg"], [], '', {});
      $('#table').empty();
      this.changeDetection.detectChanges();
      this.commonService.loaderAndErr(this.chartData);
    });
    this.blocksNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    document.getElementById('home').style.display = 'block';;
  }

  myClusterData(data: any, fromParam = false) {
    this.scatterChart.destroy();
    this.modes = [];
    this.downloadType = '';
    this.tableHead = "School Name";
    this.commonService.errMsg();
    this.schoolCount = 0;
    this.visitCount = 0;
    this.fileName = `${this.reportName}_${this.period}_schools_of_cluster_${data}_${this.commonService.dateAndTime}`;
    this.crcSchoolNames = [];
    this.visitedSchools = 0;
    this.notVisitedSchools = 0;
    this.dist = false;
    this.blok = false;
    this.clust = true;
    this.skul = false;
    this.tableData = [];
    this.chartData = [];
    this.reportData = [];
    this.title = localStorage.getItem('block').replace(/^"(.+(?="$))"$/, '$1');
    this.titleName = localStorage.getItem('dist');
    var distId = localStorage.getItem('distId');
    var blockId = localStorage.getItem('blockId');
    this.distName = localStorage.getItem('distId');
    this.blockName = blockId;
    this.clustName = data;
    let obj = this.clusterNames.find(o => o.id == data);
    this.hierName = obj.name;
    localStorage.setItem('clusterId', data);

    this.clusterHidden = false;
    this.blockHidden = false;

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.crcSchoolWiseData(distId, blockId, data, { timePeriod: this.period }).subscribe(async (result: any) => {
      if (!fromParam) {
        if ($.fn.DataTable.isDataTable('#table')) {
          $('#table').DataTable().destroy();
          $('#table').empty();
        }
        this.changeDetection.detectChanges();
      }

      this.crcSchoolNames = result;
      let a = this.crcSchoolNames.schoolsVisitedCount
      this.reportData = this.crcSchoolNames = this.crcSchoolNames.visits;

      var labels = [];
      for (var i = 0; i < this.crcSchoolNames.length; i++) {
        if (typeof parseInt(this.crcSchoolNames[i].totalSchools) === "number" && typeof (parseInt(this.crcSchoolNames[i].totalVisits)) === "number") {
          this.schoolCount = this.schoolCount + parseInt(this.crcSchoolNames[i].totalSchools);
          this.visitCount = this.visitCount + Number(this.crcSchoolNames[i].totalVisits);
        }
        labels.push(this.crcSchoolNames[i].schoolName);
        this.chartData.push({ x: Number(this.crcSchoolNames[i][this.xAxis]), y: Number(this.crcSchoolNames[i][this.yAxis]) });
      }

      this.countVisitedAndNotVisited(a);

      let x_axis = this.xAxisFilter.find(o => o.key == this.xAxis);
      let y_axis = this.yAxisFilter.find(o => o.key == this.yAxis);
      let obj = {
        xAxis: x_axis.value,
        yAxis: y_axis.value
      }

      this.createChart(labels, this.chartData, this.tableHead, obj);
      this.changeDetection.detectChanges();
      this.tableData = this.crcSchoolNames;
      this.dtOptions = {
        data: this.tableData,
        iDisplayLength: this.crcSchoolNames.length,
        "bLengthChange": false,
        "bInfo": false,
        "bPaginate": false,
        scrollY: this.height > 1760 ? '65vh' : this.height > 1180 && this.height < 1760 ? '54vh' : this.height > 667 && this.height < 1180 ? '44vh' : '35vh',
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        "searching": false,
        fixedColumns: {
          leftColumns: 1
        },
        columns: [
          { title: 'District Name', data: 'districtName' },
          { title: 'Block Name', data: 'blockName' },
          { title: 'Cluster Name', data: 'clusterName' },
          { title: 'School Name', data: 'schoolName' },
          { title: 'Visit-0 times (%)', data: 'visit_0' },
          { title: 'Visit-1 to 2 times (%)', data: 'visit_1_2' },
          { title: 'Visit-3 to 5 times (%)', data: 'visit_3_5' },
          { title: 'Visit-6 to 10 times (%)', data: 'visit_6_10' },
          { title: 'Visits more than 10 times (%)', data: 'visit_10_more' },
          { title: 'Number of schools per CRC', data: 'no_of_schools_per_crc' },
          { title: "Visits per schools", data: "visits_per_school" },
          { title: "Total schools", data: "totalSchools" },
          { title: "Total visits", data: "totalVisits" }
        ]
      };
      this.dataTable = $(this.table.nativeElement);
      this.dataTable.DataTable(this.dtOptions);

      this.commonService.loaderAndErr(this.chartData);
      this.changeDetection.markForCheck();
    }, err => {
      this.chartData = [];
      this.createChart(["clg"], [], '', {});
      $('#table').empty();
      this.changeDetection.detectChanges();
      this.commonService.loaderAndErr(this.chartData);
    });
    document.getElementById('home').style.display = 'block';
  }

  countVisitedAndNotVisited(a) {
    this.visitCount = a.totalNumberOfVisits.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    this.schoolCount = a.totalNumberOfSchools.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    this.visitedSchools = a.totalSchoolsVisited.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    this.notVisitedSchools = a.totalSchoolsNotVisited.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  }

  createChart(labels, chartData, name, obj) {
    var ctx = $('#myChart');
    ctx.attr('height', this.height > 1760 ? '70vh' : this.height > 1180 && this.height < 1760 ? '60vh' : this.height > 667 && this.height < 1180 ? '52vh' : '46vh');
    this.scatterChart = new Chart('myChart', {
      type: 'scatter',
      data: {
        labels: labels,
        datasets: [{
          data: chartData,
          pointBackgroundColor: "#4890b5",
          pointBorderColor: '#7cd6cc',
          pointBorderWidth: 0.5,
          pointRadius: this.height > 1760 ? 16 : this.height > 1180 && this.height < 1760 ? 10 : this.height > 667 && this.height < 1180 ? 8 : 5,
          pointHoverRadius: this.height > 1760 ? 18 : this.height > 1180 && this.height < 1760 ? 12 : this.height > 667 && this.height < 1180 ? 9 : 6,
        }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        tooltips: {
          titleFontSize: 16,
          cornerRadius: 10,
          xPadding: this.height > 1760 ? 30 : this.height > 1180 && this.height < 1760 ? 20 : this.height > 667 && this.height < 1180 ? 10 : 2,
          yPadding: this.height > 1760 ? 30 : this.height > 1180 && this.height < 1760 ? 20 : this.height > 667 && this.height < 1180 ? 10 : 2,
          bodyFontSize: this.height > 1760 ? 32 : this.height > 1180 && this.height < 1760 ? 22 : this.height > 667 && this.height < 1180 ? 12 : 10,
          displayColors: false,
          custom: function (tooltip) {
            if (!tooltip) return;
            // disable displaying the color box;
            tooltip.displayColors = false;
          },
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              var multistringText = [name + ": " + label];
              multistringText.push(obj.xAxis + ": " + tooltipItem.xLabel);
              multistringText.push(obj.yAxis + ": " + tooltipItem.yLabel);
              return multistringText;
            }
          }
        },

        scales: {
          xAxes: [{
            gridLines: {
              color: "rgba(252, 239, 252)",
            },
            ticks: {
              fontColor: 'black',
              min: 0,
              fontSize: this.height > 1760 ? 30 : this.height > 1180 && this.height < 1760 ? 23 : this.height > 667 && this.height < 1180 ? 13 : 10,
            },
            scaleLabel: {
              fontColor: "black",
              display: true,
              labelString: obj.xAxis,
              fontSize: this.height > 1760 ? 32 : this.height > 1180 && this.height < 1760 ? 22 : this.height > 667 && this.height < 1180 ? 12 : 10,
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(252, 239, 252)",
            },
            ticks: {
              fontColor: 'black',
              min: 0,
              fontSize: this.height > 1760 ? 30 : this.height > 1180 && this.height < 1760 ? 23 : this.height > 667 && this.height < 1180 ? 13 : 10,
            },
            scaleLabel: {
              fontColor: "black",
              display: true,
              labelString: obj.yAxis,
              fontSize: this.height > 1760 ? 32 : this.height > 1180 && this.height < 1760 ? 22 : this.height > 667 && this.height < 1180 ? 12 : 10,
            }
          }]
        }
      }
    });
  };

  public downloadType: string;
  downloadReportofState(downloadType) {
    if (downloadType == 'District Wise') {
      this.distWise();
    } else if (downloadType == 'Block Wise') {
      this.blockWise();
    } else if (downloadType == 'Cluster Wise') {
      this.clusterWise();
    } else if (downloadType == 'School Wise') {
      this.schoolWise();
    } else {
      alert("Please select download type");
    }
  }

  downloadReport() {
    this.commonService.download(this.fileName, this.reportData);
  }

  selectAxis() {
    this.levelWiseFilter();
  }

  levelWiseFilter() {
    if (this.skul) {
      this.districtWise();
    }
    if (this.dist) {
      this.myDistData(localStorage.getItem('distId'));
    }
    if (this.blok) {
      this.myBlockData(localStorage.getItem('blockId'));
    }
    if (this.clust) {
      this.myClusterData(localStorage.getItem('clusterId'));
    }
  }

  redirectTo() {
    this.router.navigate(['home/dashboard']);
  }

  goToHealthCard(): void {
    let data: any = {};

    if (this.dist) {
      data.level = 'district';
      data.value = this.myDistrict;
    } else if (this.blok) {
      data.level = 'block';
      data.value = this.myBlock;
    } else if (this.clust) {
      data.level = 'cluster';
      data.value = this.myCluster;
    } else {
      data.level = 'state';
      data.value = null
    }
    data['timePeriod'] = this.period;

    sessionStorage.setItem('health-card-info', JSON.stringify(data));
    this._router.navigate(['/healthCard']);
  }

}
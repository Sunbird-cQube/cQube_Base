import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HeatmapModule from 'highcharts/modules/heatmap';
HeatmapModule(Highcharts);
import { AppServiceComponent } from '../../../app.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PatReportService } from '../../../services/pat-report.service';

@Component({
  selector: 'app-heat-chart',
  templateUrl: './heat-chart.component.html',
  styleUrls: ['./heat-chart.component.css']
})
export class HeatChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  name: string;
  level = '';

  blockHidden = true;
  clusterHidden = true;

  // For filter implementation
  districtNames = [];
  district;
  blockNames = [];
  block;
  clusterNames = [];
  cluster;

  years = [];
  months = [];
  grades = [];
  subjects = [];
  examDates = [];
  allViews = [];

  public year = '';
  public month = '';
  public grade = 'all';
  public subject = 'all';
  public examDate = 'all';
  public viewBy = 'indicator';

  //to set hierarchy level
  skul = true;
  dist = false;
  blok = false;
  clust = false;

  gradeSelected = false

  // to set hierarchy values
  districtHierarchy: any;
  blockHierarchy: any;
  clusterHierarchy: any;

  chartObject: Highcharts.Chart = null;
  data;

  // to download the excel report
  public fileName: any = `District_wise_report_${this.year}`
  public reportData: any = [];

  public metaData: any;
  myData;
  state: string;

  //For pagination.....
  items = [];
  pageOfItems: Array<any>;
  pageSize = 40;
  currentPage = 1;


  constructor(
    public http: HttpClient,
    public service: PatReportService,
    public commonService: AppServiceComponent,
    public router: Router
  ) {
    service.PATHeatMapMetaData().subscribe(res => {
      this.metaData = res['data'];
      for (let i = 0; i < this.metaData.length; i++) {
        this.years.push(this.metaData[i]['year']);
      }
      this.year = this.years[this.years.length - 1];
      let i;
      for (i = 0; i < this.metaData.length; i++) {
        if (this.metaData[i]['year'] == this.year) {
          this.months = (Object.keys(res['data'][i].data.months));
          this.grades = this.metaData[i].data['grades'];
          this.subjects = this.metaData[i].data['subjects'];
          this.allViews = this.metaData[i].data['viewBy'];
          break;
        }
      }
      this.month = this.months[this.months.length - 1];
      this.examDates = this.metaData[i].data['months'][`${this.month}`]['examDate'];
      this.grades = [{ grade: "all" }, ...this.grades.filter(item => item !== { grade: "all" })];
      this.subjects = [{ subject: "all" }, ...this.subjects.filter(item => item !== { subject: "all" })];
      this.examDates = [{ exam_date: "all" }, ...this.examDates.filter(item => item !== { exam_date: "all" })];
      this.commonFunc();
    },err=>{
      this.metaData = [];
      this.commonService.loaderAndErr(this.metaData);
    })
  }

  fetchFilters(metaData) {
    let i;
    for (i = 0; i < metaData.length; i++) {
      if (metaData[i]['year'] == this.year) {
        this.months = (Object.keys(this.metaData[i].data.months));
        this.grades = metaData[i].data['grades'];
        this.subjects = metaData[i].data['subjects'];
        this.allViews = metaData[i].data['viewBy'];
        break;
      }
    }
    if (!this.months.includes(this.month)) {
      this.month = this.months[this.months.length - 1];
    }
    this.examDates = metaData[i].data['months'][`${this.month}`]['examDate'];
    this.examDates = [{ exam_date: "all" }, ...this.examDates.filter(item => item !== { exam_date: "all" })];
    this.grades = [{ grade: "all" }, ...this.grades.filter(item => item !== { grade: "all" })];
    this.subjects = [{ subject: "all" }, ...this.subjects.filter(item => item !== { subject: "all" })];
  }

  ngOnInit(): void {
    this.state = this.commonService.state;
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
  }

  onChangePage() {
    let yLabel = this.yLabel.slice((this.currentPage - 1) * this.pageSize, ((this.currentPage - 1) * this.pageSize + this.pageSize));
    let data = this.items.slice(this.pageSize * this.xLabel.length * (this.currentPage - 1), this.pageSize * this.xLabel.length * this.currentPage);
    let tooltipData = this.toolTipData.slice(this.pageSize * this.xLabel.length * (this.currentPage - 1), this.pageSize * this.xLabel.length * this.currentPage);

    data = data.map(record => {
      record.y %= this.pageSize;
      return record;
    });

    tooltipData = tooltipData.map(record => {
      record.y %= this.pageSize;
      return record;
    });

    this.chartFun(this.xlab.length > 0 ? this.xlab : this.xLabel, this.xLabelId, this.ylab.length > 0 ? this.ylab : yLabel, this.zLabel, data, this.a['viewBy'], this.level, this.xLabel1, this.yLabel1, tooltipData, this.grade);
  }

  resetToInitPage() {
    this.fileName = "District_wise_report";
    this.resetOnAllGrades();
    this.year = this.years[this.years.length - 1];
    this.commonFunc();
    this.currentPage = 1;

    document.getElementById('home').style.display = 'none';
  }

  commonFunc = () => {
    this.commonService.errMsg();
    this.level = 'district';
    this.reportData = [];
    this.fetchFilters(this.metaData);
    let a = {
      year: this.year,
      month: this.month,
      grade: this.grade == 'all' ? '' : this.grade,
      subject_name: this.subject == 'all' ? '' : this.subject,
      exam_date: this.examDate == 'all' ? '' : this.examDate,
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy
    }
    this.month = a.month;
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.PATHeatMapAllData(a).subscribe(response => {
      this.genericFunction(response);
      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      this.reportData = [];
      this.commonService.loaderAndErr(this.reportData);
      if (this.chart.axes) {
        this.chart.destroy();
      }
    })
  }

  chart;
  chartFun = (xLabel, xLabelId, yLabel, zLabel, data, viewBy, level, xLabel1, yLabel1, tooltipData, grade) => {
    let scrollBarX
    let scrollBarY

    if (xLabel1.length <= 30) {
      scrollBarX = false
    } else {
      scrollBarX = true
    }

    if (yLabel1.length <= 12) {
      scrollBarY = false
    } else {
      scrollBarY = true
    }
    for (let i = 0; i < xLabel.length; i++) {
      xLabel[i] = xLabel[i].substr(0, 15);
    }
    // var options: Highcharts.Options = 
    this.chart = Highcharts.chart('container', {
      chart: {
        type: 'heatmap'
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      xAxis: [{
        categories: [],
        labels: {
          rotation: 270,
          style: {
            color: 'black',
            fontSize: '14px',
          },
          enabled: false
        },
        lineColor: '#FFFFFF',
        gridLineColor: 'transparent',
        min: 0,
        max: 30,
        scrollbar: {
          enabled: scrollBarX
        }
      }, {
        lineColor: '#FFFFFF',
        linkedTo: 0,
        opposite: true,
        categories: xLabel,
        gridLineColor: 'transparent',
        labels: {
          rotation: 270,
          style: {
            color: 'black',
            fontSize: '12px',
            fontFamily: 'Arial',
          }
        },
      }],
      yAxis: {
        categories: yLabel,
        labels: {
          style: {
            color: 'black',
            fontSize: '12px',
            textDecoration: "underline",
            textOverflow: "ellipsis",
            fontFamily: 'Arial'
          },
          align: "right",
          formatter: function (this) {
            if (typeof this.value === 'string') {
              return `<p>${this.value}</p>`;
            }

            return '';
          }
        },
        gridLineColor: 'transparent',
        title: null,
        reversed: true,
        min: 0,
        max: 11,
        scrollbar: {
          enabled: scrollBarY
        }
      },
      colorAxis: {
        min: 0,
        minColor: '#ff3300',
        maxColor: '#99ff99',
      },
      series: [{
        turboThreshold: data.length + 100,
        data: data,
        dataLabels: {
          enabled: true,
          color: '#000000',
          style: {
            textOutline: 'none',
          },
          overflow: false,
          crop: true,
        },
        type: 'heatmap'
      }],
      title: {
        text: null
      },
      tooltip: {
        formatter: function () {
          return '<b>' + getPointCategoryName(this.point, 'y', viewBy, level, grade) + '</b>';
        }
      },
    });

    function getPointCategoryName(point, dimension, viewBy, level, grades) {
      var series = point.series,
        isY = dimension === 'y',
        axis = series[isY ? 'yAxis' : 'xAxis'];
      let splitVal = zLabel[point[isY ? 'y' : 'x']].split('/')

      let totalSchools;
      let totalStudents;
      let studentAttended;
      let indicator;
      let grade;
      let subject;
      let exam_date;
      let name;
      tooltipData.map(a => {
        if (point.x == a.x && point.y == a.y) {
          totalSchools = a.total_schools
          totalStudents = a.total_students
          studentAttended = a.students_attended
          grade = a.grade
          subject = a.subject
          exam_date = a.exam_date
          if (viewBy == 'indicator') {
            indicator = a.indicator
          } else {
            indicator = a.qusetion_id
          }
          name = a.name;
        }
      })

      var obj = '';
      if (level == 'district') {
        obj = `<b>District Name: ${name}</b>`
      }

      if (level == 'block') {
        obj = `<b>Block Name: ${name}</b>`

      }

      if (level == 'cluster') {
        obj = `<b>ClusterName: ${name}</b>`

      }

      if (level == 'school') {
        obj = `<b>SchoolName: ${name}</b>`

      }
      obj += `<br> <b>Grade: ${grade}</b>
        <br> <b>Subject: ${subject}</b>
        <br> <b>ExamDate: ${exam_date}</b>
        <br> ${grades != "all" ? viewBy == 'indicator' ? `<b>Indicator: ${indicator}` : `<b>QuestionId: ${indicator}</b>` : ''}
        <br> <b>Total Schools: ${totalSchools}</b>
        <br> <b>Total Students: ${totalStudents}</b>
        <br> <b>Students Attended: ${studentAttended}</b>
        <br> ${point.value !== null ? `<b>Marks:${point.value}` : ''}</b>`
      return obj
    }
  }


  selectedYear() {
    document.getElementById('home').style.display = 'none';
    this.month = '';
    this.examDate = 'all';
    this.subject = 'all';
    this.fetchFilters(this.metaData);
    this.levelWiseFilter();
  }

  selectedMonth() {
    this.fileName = "Month_wise_report";
    this.fetchFilters(this.metaData);
    this.grade = 'all';
    this.examDate = 'all';
    this.subject = 'all';
    document.getElementById('home').style.display = 'none';
    this.levelWiseFilter();
  }
  selectedGrade() {
    if (!this.month) {
      alert("Please select month!");
    } else {
      this.fileName = "Grade_wise_report";
      if (this.grade !== 'all') {
        this.gradeSelected = true;
      } else {
        this.resetOnAllGrades();
      }
      this.levelWiseFilter();
    }
  }

  resetOnAllGrades() {
    this.level = 'district';
    this.skul = true;
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.grade = 'all';
    this.examDate = 'all';
    this.subject = 'all';
    this.viewBy = 'indicator';
    this.gradeSelected = false;
    this.district = undefined;
    this.block = undefined;
    this.cluster = undefined;
    this.blockHidden = true;
    this.clusterHidden = true;
  }

  selectedSubject() {
    if (!this.month) {
      alert("Please select month!");
    } else {
      this.fileName = "Subject_wise_report";
      this.levelWiseFilter();
    }
  }

  selectedExamDate() {
    if (!this.month) {
      alert("Please select month!");
    } else {
      this.fileName = "ExamDate_wise_report";
      this.levelWiseFilter();
    }
  }

  selectedViewBy() {
    if (!this.month) {
      alert("Please select month!");
    } else {
      this.fileName = "ViewBy_report";
      this.levelWiseFilter();
    }
  }

  selectedDistrict(districtId) {
    this.currentPage = 1;
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
      month: this.month,
      grade: this.grade == 'all' ? '' : this.grade,
      subject_name: this.subject == 'all' ? '' : this.subject,
      exam_date: this.examDate == 'all' ? '' : this.examDate,
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy,
      districtId: districtId
    }

    this.service.PATHeatMapDistData(a).subscribe(response => {
      this.genericFunction(response);
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
      this.reportData = [];
      this.commonService.loaderAndErr(this.reportData);
      if (this.chart.axes) {
        this.chart.destroy();
      }
    })

  }

  selectedBlock(blockId) {
    this.currentPage = 1;
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
      month: this.month,
      grade: this.grade == 'all' ? '' : this.grade,
      subject_name: this.subject == 'all' ? '' : this.subject,
      exam_date: this.examDate == 'all' ? '' : this.examDate,
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy,
      districtId: this.district,
      blockId: blockId
    }

    this.service.PATHeatMapBlockData(a).subscribe(response => {
      this.genericFunction(response);
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
      this.reportData = [];
      this.commonService.loaderAndErr(this.reportData);
      if (this.chart.axes) {
        this.chart.destroy();
      }
    })
  }

  selectedCluster(clusterId) {
    this.currentPage = 1;
    this.fileName = "School_wise_report";
    this.level = 'school';
    document.getElementById('home').style.display = 'block';
    this.commonService.errMsg();
    this.reportData = [];

    let a = {
      year: this.year,
      month: this.month,
      grade: this.grade == 'all' ? '' : this.grade,
      subject_name: this.subject == 'all' ? '' : this.subject,
      exam_date: this.examDate == 'all' ? '' : this.examDate,
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy,
      districtId: this.district,
      blockId: this.block,
      clusterId: clusterId
    }

    this.service.PATHeatMapClusterData(a).subscribe(response => {
      this.genericFunction(response);
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
      this.reportData = [];
      this.commonService.loaderAndErr(this.reportData);
      if (this.chart.axes) {
        this.chart.destroy();
      }
    })
  }

  xlab = []; ylab = []; a = {}; yLabel = []; xLabel = []; xLabelId = []; zLabel = []; xLabel1 = []; yLabel1 = []; toolTipData: any;
  genericFunction(response) {
    this.reportData = [];
    this.xlab = [];
    this.ylab = [];
    this.a = {
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy
    }
    this.yLabel = response['result']['yLabel']
    this.xLabel = response['result']['xLabel']
    this.xLabelId = response['result']['xLabelId']
    this.data = response['result']['data']
    this.zLabel = response['result']['zLabel']
    this.reportData = response['downloadData']
    if (response['districtDetails']) {
      let districts = response['districtDetails'];
      this.districtNames = districts.sort((a, b) => (a.district_name > b.district_name) ? 1 : ((b.district_name > a.district_name) ? -1 : 0));
    }
    if (response['blockDetails']) {
      let blocks = response['blockDetails'];
      this.blockNames = blocks.sort((a, b) => (a.block_name > b.block_name) ? 1 : ((b.block_name > a.block_name) ? -1 : 0));
    }
    if (response['clusterDetails']) {
      let clusters = response['clusterDetails'];
      this.clusterNames = clusters.sort((a, b) => (a.cluster_name > b.cluster_name) ? 1 : ((b.cluster_name > a.cluster_name) ? -1 : 0));
    }
    if (this.xLabel.length <= 30) {
      for (let i = 0; i <= 30; i++) {
        this.xlab.push(this.xLabel[i] ? this.xLabel[i] : ' ')
      }
    }

    if (this.yLabel.length <= 12) {
      for (let i = 0; i <= 12; i++) {
        this.ylab.push(this.yLabel[i] ? this.yLabel[i] : ' ')
      }
    }
    this.xLabel1 = this.xLabel
    this.yLabel1 = this.yLabel

    this.items = this.data.map((x, i) => x);
    this.toolTipData = response['result']['tooltipData'];
    this.onChangePage();
  }

  //level wise filter
  levelWiseFilter() {
    this.currentPage = 1;
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

  // to download the csv report
  downloadReport() {
    this.commonService.download(this.fileName, this.reportData);
  }
}

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

  chartObject: Highcharts.Chart = null;
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
    this.skul = true;
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.grade = undefined;
    this.examDate = undefined;
    this.subject = undefined;
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
    this.reportData = [];
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
    this.myData = this.service.PATHeatMapAllData(a).subscribe(response => {
      this.genericFunction(response);
      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      console.log(err);
      this.reportData = [];
      this.commonService.loaderAndErr(this.districtNames);
    })
  }

  chartFun = (xLabel, xLabelId, yLabel, zLabel, data, viewBy, level) => {
    // var options: Highcharts.Options = 
    Highcharts.chart('container', {
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
        categories: xLabelId,
        labels: {
          rotation: 270,
        },
        min: 0,
        max: (xLabelId.length / 2),
        scrollbar: {
          enabled: true
        }
      }, {
        linkedTo: 0,
        opposite: true,
        categories: xLabel,
        labels: {
          rotation: 270
        },
      }],
      yAxis: {
        categories: yLabel,
        labels: {
          style: {
            color: 'black',
            fontSize: '14px',
            textDecoration: "underline",
            textOverflow: "ellipsis"
          },
          align: "right"
        },
        title: null,
        reversed: true,
        min: 0,
        max: yLabel.length > 1 ? (yLabel.length / 2) : yLabel.length - 1,
        scrollbar: {
          enabled: true
        }
      },
      colorAxis: {
        min: 0,
        minColor: '#ff3300',
        maxColor: '#99ff99'
      },
      // reflow: false,
      series: [{
        borderWidth: 2,
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
        type: 'heatmap',
      }],
      title: {
        text: null
      },
      tooltip: {
        formatter: function () {
          return '<b>' + getPointCategoryName(this.point, 'y', viewBy, level) + '</b>';
        }
      },
    });

    function getPointCategoryName(point, dimension, viewBy, level) {
      var series = point.series,
        isY = dimension === 'y',
        axis = series[isY ? 'yAxis' : 'xAxis'];
      let splitVal = zLabel[point[isY ? 'y' : 'x']].split('/')

      var obj = '';
      if (level == 'district') {
        obj = `<b>DistrictId: ${series['xAxis'].categories[point['x']]}</b> 
        <br> <b>DistrictName: ${point.series.chart.xAxis[1].categories[point['x']]}</b>           
        <br> <b>Grade: ${splitVal[1]}</b>
        <br> <b>Subject: ${splitVal[2]}</b>
        <br> <b>ExamDate: ${splitVal[0]}</b>
        <br> ${viewBy == 'indicator' ? `<b>Indicator: ${splitVal[6]}` : `<b>QuestionId: ${splitVal[6]}</b>`}
        <br> <b>Total Schools: ${splitVal[4]}</b>
        <br> <b>Total Students: ${splitVal[5]}</b>
        <br> <b>Students Attended: ${splitVal[3]}</b>
        <br> ${point.value !== null ? `<b>Marks:${point.value}` : ''}</b>`
      }

      if (level == 'block') {
        obj = `<b>BlockId: ${series['xAxis'].categories[point['x']]}</b> 
        <br> <b>BlockName: ${point.series.chart.xAxis[1].categories[point['x']]}</b>   
               
        <br> <b>Grade: ${splitVal[1]}</b>
        <br> <b>Subject: ${splitVal[2]}</b>
        <br> <b>ExamDate: ${splitVal[0]}</b>
        <br> ${viewBy == 'indicator' ? `<b>Indicator: ${splitVal[6]}` : `<b>QuestionId: ${splitVal[6]}</b>`}
        <br> <b>Total Schools: ${splitVal[4]}</b>
        <br> <b>Total Students: ${splitVal[5]}</b>
        <br> <b>Students Attended: ${splitVal[3]}</b>
        <br> ${point.value !== null ? `<b>Marks:${point.value}` : ''}</b>`
      }

      if (level == 'cluster') {
        obj = `<b>ClusterId: ${series['xAxis'].categories[point['x']]}</b> 
        <br> <b>ClusterName: ${point.series.chart.xAxis[1].categories[point['x']]}</b>   
               
        <br> <b>Grade: ${splitVal[1]}</b>
        <br> <b>Subject: ${splitVal[2]}</b>
        <br> <b>ExamDate: ${splitVal[0]}</b>
        <br> ${viewBy == 'indicator' ? `<b>Indicator: ${splitVal[6]}` : `<b>QuestionId: ${splitVal[6]}</b>`}
        <br> <b>Total Schools: ${splitVal[4]}</b>
        <br> <b>Total Students: ${splitVal[5]}</b>
        <br> <b>Students Attended: ${splitVal[3]}</b>
        <br> ${point.value !== null ? `<b>Marks:${point.value}` : ''}</b>`
      }

      if (level == 'school') {
        obj = `<b>SchoolId: ${series['xAxis'].categories[point['x']]}</b> 
        <br> <b>SchoolName: ${point.series.chart.xAxis[1].categories[point['x']]}</b>   
               
        <br> <b>Grade: ${splitVal[1]}</b>
        <br> <b>Subject: ${splitVal[2]}</b>
        <br> <b>ExamDate: ${splitVal[0]}</b>
        <br> ${viewBy == 'indicator' ? `<b>Indicator: ${splitVal[6]}` : `<b>QuestionId: ${splitVal[6]}</b>`}
        <br> <b>Total Schools: ${splitVal[4]}</b>
        <br> <b>Total Students: ${splitVal[5]}</b>
        <br> <b>Students Attended: ${splitVal[3]}</b>
        <br> ${point.value !== null ? `<b>Marks:${point.value}` : ''}</b>`
      }



      return obj
    }
  }

  selectedYear() {
    this.fileName = "Year_wise_report";
    document.getElementById('home').style.display = 'none';
    if (this.level == 'district') {
      this.commonFunc()
    }
    if (this.level == 'block') {
      this.selectedDistrict(this.district);
    }

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
      console.log(err);
      this.reportData = [];
      this.commonService.loaderAndErr(this.reportData);
    })

  }

  selectedBlock(blockId) {
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
      console.log(err);
      this.reportData = [];
      this.commonService.loaderAndErr(this.reportData);
    })
  }

  selectedCluster(clusterId) {
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

    this.service.PATHeatMapBlockData(a).subscribe(response => {
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
      console.log(err);
      this.reportData = [];
      this.commonService.loaderAndErr(this.reportData);
    })
  }

  genericFunction(response) {
    let a = {
      viewBy: this.viewBy == 'indicator' ? 'indicator' : this.viewBy
    }
    let yLabel = response['result']['yLabel']
    let xLabel = response['result']['xLabel']
    let xLabelId = response['result']['xLabelId']
    let data = response['result']['data']
    let zLabel = response['result']['zLabel']
    this.reportData = response['downloadData']
    if (response['districtDetails']) {
      this.districtNames = response['districtDetails'];
      this.districtNames = this.districtNames.sort((a, b) => (a.district_name > b.district_name) ? 1 : ((b.district_name > a.district_name) ? -1 : 0));
    }
    if (response['blockDetails']) {
      this.blockNames = response['blockDetails'];
      this.blockNames = this.blockNames.sort((a, b) => (a.block_name > b.block_name) ? 1 : ((b.block_name > a.block_name) ? -1 : 0));
    }
    if (response['clusterDetails']) {
      this.clusterNames = response['clusterDetails'];
      this.clusterNames = this.clusterNames.sort((a, b) => (a.cluster_name > b.cluster_name) ? 1 : ((b.cluster_name > a.cluster_name) ? -1 : 0));
    }
    this.chartFun(xLabel, xLabelId, yLabel, zLabel, data, a.viewBy, this.level);
  }

  //level wise filter
  levelWiseFilter() {
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

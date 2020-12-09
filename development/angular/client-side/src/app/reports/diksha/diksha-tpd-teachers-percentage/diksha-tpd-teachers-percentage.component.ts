import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HeatmapModule from 'highcharts/modules/heatmap';
HeatmapModule(Highcharts);
import { AppServiceComponent } from '../../../app.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DikshaReportService } from 'src/app/services/diksha-report.service';

@Component({
  selector: 'app-diksha-tpd-teachers-percentage',
  templateUrl: './diksha-tpd-teachers-percentage.component.html',
  styleUrls: ['./diksha-tpd-teachers-percentage.component.css']
})
export class DikshaTPDTeachersPercentageComponent implements OnInit {
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

  reportType = "percentage_teachers";
  timePeriod = 'All';
  timePeriods = [{ key: "Last_Day", value: "Last Day" }, { key: "Last_7_Day", value: "Last 7 Days" }, { key: "Last_30_Day", value: "Last 30 Days" }, { key: "All", value: "Overall" }]

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
  public fileName: any = `District_wise_report`
  public reportData: any = [];

  public metaData: any;
  myData;
  state: string;

  constructor(
    public http: HttpClient,
    public service: DikshaReportService,
    public commonService: AppServiceComponent,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.state = this.commonService.state;
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
    this.district = undefined;
    this.block = undefined;
    this.cluster = undefined;
    this.blockHidden = true;
    this.clusterHidden = true;
    this.timePeriod = 'All';
    document.getElementById('home').style.display = 'none';
    this.commonFunc();
  }

  commonFunc = () => {
    this.commonService.errMsg();
    this.level = 'district';
    this.reportData = [];
    let a = {
      timePeriod: this.timePeriod,
      reportType: this.reportType
    }

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.tpdDistWise(a).subscribe(response => {
      this.genericFunction(response);
      this.commonService.loaderAndErr(this.reportData);
    }, err => {
      console.log(err);
      this.reportData = [];
      this.commonService.loaderAndErr(this.districtNames);
    })
  }

  chartFun = (xLabel, xLabelId, yLabel, zLabel, data, level, xLabel1, yLabel1, tooltipData) => {
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
        },
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
            fontSize: '11px',
            fontFamily: 'Arial',
          }
        },
      }],
      yAxis: {
        categories: yLabel,
        labels: {
          style: {
            color: 'black',
            fontSize: '10px',
            textDecoration: "underline",
            textOverflow: "ellipsis",
            fontFamily: 'Arial'
          },
          align: "right"
        },
        gridLineColor: 'transparent',
        title: null,
        reversed: true,
        min: 0,
        max: 12,
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
          return '<b>' + getPointCategoryName(this.point, 'y', level) + '</b>';
        }
      },
    });

    function getPointCategoryName(point, dimension, level) {
      let indicator;
      let name;
      tooltipData.map(a => {
        if (point.x == a.x && point.y == a.y) {
          indicator = a.indicator;
          name = a.name;
        }
      })
      var obj = '';
      if (level == 'district') {
        obj = `<b>District Name: ${name}</b> 
        <br> <b>Indicator: ${indicator}  <b>      
        <br> ${point.value !== null ? `<b>Percentage Teachers:${point.value} %` : ''}</b>`
      }

      if (level == 'block') {
        obj = `<b>Block Name: ${point.series.chart.xAxis[1].categories[point['x']]}</b> 
        <br> <b>Indicator: ${indicator}  <b>     
        <br> ${point.value !== null ? `<b>Percentage Teachers:${point.value} %` : ''}</b>`
      }

      if (level == 'cluster') {
        obj = `<b>Cluster Name: ${point.series.chart.xAxis[1].categories[point['x']]}</b> 
        <br> <b>Indicator: ${indicator}  <b>     
        <br> ${point.value !== null ? `<b>Percentage Teachers:${point.value} %` : ''}</b>`
      }

      if (level == 'school') {
        obj = `<b>School Name: ${point.series.chart.xAxis[1].categories[point['x']]}</b>  
        <br> <b>Indicator: ${indicator}  <b>    
        <br> ${point.value !== null ? `<b>Percentage Teachers:${point.value} %` : ''}</b>`
      }
      return obj
    }
  }

  selectedTimePeriod() {
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
      timePeriod: this.timePeriod,
      reportType: this.reportType,
      districtId: districtId
    }

    this.service.tpdBlockWise(a).subscribe(response => {
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
    this.fileName = "Cluster_wise_report";
    this.level = 'cluster';
    this.cluster = undefined;
    this.blockHidden = false;
    this.clusterHidden = false;
    document.getElementById('home').style.display = 'block';
    this.commonService.errMsg();
    this.reportData = [];

    let a = {
      timePeriod: this.timePeriod,
      reportType: this.reportType,
      districtId: this.district,
      blockId: blockId
    }

    this.service.tpdClusterWise(a).subscribe(response => {
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
    this.fileName = "School_wise_report";
    this.level = 'school';
    document.getElementById('home').style.display = 'block';
    this.commonService.errMsg();
    this.reportData = [];

    let a = {
      timePeriod: this.timePeriod,
      reportType: this.reportType,
      districtId: this.district,
      blockId: this.block,
      clusterId: clusterId
    }

    this.service.tpdSchoolWise(a).subscribe(response => {
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
    var xlab = [];
    var ylab = [];
    let yLabel = response['result']['yLabel']
    let xLabel = response['result']['xLabel']
    let xLabelId = response['result']['xLabelId']
    let data = response['result']['data']
    let zLabel = response['result']['zLabel']
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
    if (xLabel.length <= 30) {
      for (let i = 0; i <= 30; i++) {
        xlab.push(xLabel[i] ? xLabel[i] : ' ')
      }
    }

    if (yLabel.length <= 12) {
      for (let i = 0; i <= 12; i++) {
        ylab.push(yLabel[i] ? yLabel[i] : ' ')
      }
    }
    let xLabel1 = xLabel
    let yLabel1 = yLabel
    this.chartFun(xlab.length > 0 ? xlab : xLabel, xLabelId, ylab.length > 0 ? ylab : yLabel, zLabel, data, this.level, xLabel1, yLabel1, response['result']['tooltipData']);
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

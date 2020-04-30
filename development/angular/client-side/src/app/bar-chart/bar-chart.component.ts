import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { Chart, ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  District_Name: string;
  visit_0_times: number;
  visit_1to2_times: number;
  visit_3to5_times: number;

}
const ELEMENT_DATA: PeriodicElement[] =
  [
    { District_Name: 'AHMEDABAD', visit_0_times: 11.0, visit_1to2_times: 51.8, visit_3to5_times: 16.4 },
    { District_Name: 'AMRELI', visit_0_times: 27.0, visit_1to2_times: 67.8, visit_3to5_times: 15.8 },
    { District_Name: 'ANAND', visit_0_times: 12.0, visit_1to2_times: 57.9, visit_3to5_times: 26.4 },
    { District_Name: 'ARAVALLI', visit_0_times: 33.0, visit_1to2_times: 39.0, visit_3to5_times: 21.5 },
    { District_Name: 'BANASKANTHA', visit_0_times: 45.0, visit_1to2_times: 46.8, visit_3to5_times: 9.3 },
    { District_Name: 'BHARUCH', visit_0_times: 23.0, visit_1to2_times: 43.6, visit_3to5_times: 15.7 },
    { District_Name: 'BHAVNAGAR', visit_0_times: 12.0, visit_1to2_times: 52.2, visit_3to5_times: 30.2 },
    { District_Name: 'BOTAD', visit_0_times: 15.0, visit_1to2_times: 42.6, visit_3to5_times: 25.2 },
    { District_Name: 'DOHAD', visit_0_times: 34.0, visit_1to2_times: 46.5, visit_3to5_times: 28.9 },
    { District_Name: 'KACHCHH', visit_0_times: 50.0, visit_1to2_times: 49.7, visit_3to5_times: 13.4 },
  ];

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements OnInit {
  displayedColumns: string[] = ['District_Name', 'visit_0_times', 'visit_1to2_times', 'visit_3to5_times'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public title: string = '';
  public titleName: string = '';
  public districts: any;
  public blocks: any = [];
  public cluster: any = [];
  public schools: any = [];
  public districtsIds: any = [];
  public blocksIds: any = [];
  public clusterIds: any = [];
  public schoolsIds: any = [];
  public districtsNames: any = [];
  public blocksNames: any = [];
  public clusterNames: any = [];
  public schoolsNames: any = [];
  public stylesFile = "../assets/mapStyles.json";
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
  public skul: boolean = false;
  public hierName: any;
  public distName: any;
  public blockName: any;
  public clustName: any;
  public visitCount: any;

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

  public xAxisFilter = [
    { key: 'visit_0', value: "Visit-0 times (%)" },
    { key: 'visit_1_2', value: "Visit-1 to 2 times (%)" },
    { key: 'visit_3_5', value: "Visit-3 to 5 times (%)" },
    { key: 'visit_6_10', value: "Visit-6 to 10 times (%)" },
    { key: 'visit_10_more', value: "Visits more than 10 times (%)" },
    { key: "no_of_schools_per_crc", value: "Number of schools per CRC" },
    { key: "visits_per_school", value: "Visits per schools" },
    { key: "totalSchools", value: "Total schools" }
  ]

  public yAxisFilter = [
    { key: 'visit_0', value: "Visit-0 times (%)" },
    { key: 'visit_1_2', value: "Visit-1 to 2 times (%)" },
    { key: 'visit_3_5', value: "Visit-3 to 5 times (%)" },
    { key: 'visit_6_10', value: "Visit-6 to 10 times (%)" },
    { key: 'visit_10_more', value: "Visits more than 10 times (%)" },
    { key: "no_of_schools_per_crc", value: "Number of schools per CRC" },
    { key: "visits_per_school", value: "Visits per schools" },
    { key: "totalSchools", value: "Total schools" }
  ]


  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router, private changeDetection: ChangeDetectorRef) { }

  async ngOnInit() {
    this.createChart(["clg"], [], '');
    this.districtWise();
  }


  loaderAndErr() {
    if (this.scatterChart !== null) {
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
  public tableHead: any;
  public tableData: any = [];
  public chartData: any = [];
  districtWise() {
    this.scatterChart.destroy();
    this.tableHead = "District Name";
    this.blockHidden = true;
    this.clusterHidden = true;
    this.errMsg();
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.skul = true;
    document.getElementById('home').style.display = 'none';
    this.schoolCount = 0;
    this.visitCount = 0;
    this.tableData = [];

    this.dateRange = localStorage.getItem('dateRange');
    if (this.result.length > 0) {
      console.log('-----if------');
      this.chartData = [];
      var labels = [];
      this.crcDistrictsNames = this.result;
      for (var i = 0; i < this.result.length; i++) {
        labels.push(this.result[i].districtName);
        this.chartData.push({ x: Number(this.result[i][this.xAxis]), y: Number(this.result[i][this.yAxis]) });
      }
      this.createChart(labels, this.chartData, this.tableHead);
      this.loaderAndErr();
      this.changeDetection.markForCheck();
    } else {
      console.log('-----else------');
      this.chartData = []
      this.service.crcDistWiseData().subscribe(res => {
        this.result = res;
        if (this.result.length > 0) {
          var labels = [];
          this.crcDistrictsNames = this.result;
          for (var i = 0; i < this.result.length; i++) {
            labels.push(this.result[i].districtName);
            this.chartData.push({ x: Number(this.result[i][this.xAxis]), y: Number(this.result[i][this.yAxis]) });
          }

          this.createChart(labels, this.chartData, this.tableHead);
          this.loaderAndErr();
          this.changeDetection.markForCheck();
        }
      });
    }
  }


  myDistData(data) {
    console.log(data);
    this.scatterChart.destroy();
    this.blockHidden = false;
    this.clusterHidden = true;
    this.errMsg();
    this.schoolCount = 0;
    this.visitCount = 0;
    this.tableData = [];
    this.chartData = [];
    this.tableHead = "Block Name";
    this.dist = true;
    this.blok = false;
    this.clust = false;
    this.skul = false;
    this.distName = data;
    this.hierName = data.name;
    localStorage.setItem('dist', data.name);
    localStorage.setItem('distId', data);

    this.service.crcBlockWiseData(data).subscribe((result: any) => {
      console.log(result);
      this.crcBlocksNames = result;

      var labels = [];
      for (var i = 0; i < this.crcBlocksNames.length; i++) {
        labels.push(this.crcBlocksNames[i].blockName);
        this.chartData.push({ x: Number(this.crcBlocksNames[i][this.xAxis]), y: Number(this.crcBlocksNames[i][this.yAxis]) });
      }
      this.createChart(labels, this.chartData, this.tableHead);
      this.changeDetection.markForCheck();
      this.loaderAndErr();
    });
    this.blocksNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    document.getElementById('home').style.display = 'block';;
  }

  myBlockData(data) {
    this.scatterChart.destroy();
    this.clusterHidden = false;
    this.blockHidden = false;
    this.errMsg();
    this.schoolCount = 0;
    this.visitCount = 0;
    this.tableData = [];
    this.chartData = [];
    this.tableHead = "CRC Name";
    this.dist = false;
    this.blok = true;
    this.clust = false;
    this.skul = false;
    localStorage.setItem('block', data.name);
    localStorage.setItem('blockId', data.id);
    this.titleName = localStorage.getItem('dist');
    this.distName = { id: JSON.parse(localStorage.getItem('distId')), name: this.titleName };
    this.blockName = data;
    this.hierName = data.name;
    // this.service.crcClusterWiseData(data.distId, data.id).subscribe(res => {


    //   this.mylatlngData = res;
    //   this.clusterNames = [];
    //   var sorted = this.mylatlngData['barChartData'].sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
    //   let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
    //   this.colors = colors;
    //   for (var i = 0; i < this.mylatlngData['barChartData'].length; i++) {
    //     this.clusterIds.push(this.mylatlngData['barChartData'][i]['clusterId']);
    //     this.blocksIds.push(this.mylatlngData['barChartData'][i]['blockId']);
    //     if (this.mylatlngData['barChartData'][i]['clusterName'] !== null) {
    //       this.clusterNames.push({ id: this.mylatlngData['barChartData'][i]['clusterId'], name: this.mylatlngData['barChartData'][i]['clusterName'], blockid: data.id, distId: data.distId });
    //     } else {
    //       this.clusterNames.push({ id: this.mylatlngData['barChartData'][i]['clusterId'], name: "NO NAME FOUND", blockid: data.id, distId: data.distId });
    //     }
    //   }

    // for (var i = 0; i < this.mylatlngData['tableData'].length; i++) {
    //   var obj: any = {
    //     distName: this.mylatlngData['tableData'][i]['district'],
    //     schCount: this.mylatlngData['tableData'][i]['totalSchools'],
    //     visitedSchools: this.mylatlngData['tableData'][i]['visitedSchoolCount'],
    //     notVisitedSchools: this.mylatlngData['tableData'][i]['notVisitedSchoolCount'],
    //     visitesCount: this.mylatlngData['tableData'][i]['visitsperDist']
    //   }
    //   this.tableData.push(obj);
    // }

    this.service.crcClusterWiseData(JSON.parse(localStorage.getItem('distId')), data).subscribe((result: any) => {
      console.log(result);
      this.crcClusterNames = result;

      var labels = [];
      for (var i = 0; i < this.crcClusterNames.length; i++) {
        labels.push(this.crcClusterNames[i].clusterName);
        this.chartData.push({ x: Number(this.crcClusterNames[i][this.xAxis]), y: Number(this.crcClusterNames[i][this.yAxis]) });
      }
      this.createChart(labels, this.chartData, this.tableHead);
      this.changeDetection.markForCheck();
      this.loaderAndErr();
    });
    this.blocksNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    // })

    document.getElementById('home').style.display = 'block';;
  }

  // myClusterData(data) {
  //   this.scatterChart.destroy();
  //   this.tableHead = "School Name";
  //   this.errMsg();
  //   this.schoolCount = 0;
  //   this.visitCount = 0;
  //   this.dist = false;
  //   this.blok = false;
  //   this.clust = true;
  //   this.skul = false;
  //   this.tableData = [];
  //   this.title = localStorage.getItem('block');
  //   this.titleName = localStorage.getItem('dist');
  //   var distId = JSON.parse(localStorage.getItem('distId'));
  //   var blockId = JSON.parse(localStorage.getItem('blockId'))
  //   this.distName = { id: JSON.parse(localStorage.getItem('distId')), name: this.titleName };
  //   this.blockName = { id: blockId, name: this.title, distId: this.distName.id, dist: this.distName.name }
  //   this.clustName = data;
  //   this.hierName = data.name;
  //   this.service.crc_all_Schools(distId, blockId, data.id).subscribe(res => {

  //     this.mylatlngData = res;
  //     this.clusterIds = [];

  //     for (var i = 0; i < this.mylatlngData['tableData'].length; i++) {
  //       var obj: any = {
  //         distName: this.mylatlngData['tableData'][i]['district'],
  //         schCount: this.mylatlngData['tableData'][i]['totalSchools'],
  //         visitedSchools: this.mylatlngData['tableData'][i]['visitedSchoolCount'],
  //         notVisitedSchools: this.mylatlngData['tableData'][i]['notVisitedSchoolCount'],
  //         visitesCount: this.mylatlngData['tableData'][i]['visitsperDist']
  //       }
  //       this.tableData.push(obj);
  //     }

  //     this.service.crc_all_Schools(data.distId, data.blockid, data.id).subscribe((result: any) => {

  //       for (var i = 0; i < result.length; i++) {
  //         this.schoolCount = this.schoolCount + result[i]["schoolsCount"];
  //         this.visitCount = this.visitCount + result[i]["visits"];
  //       }

  //       var chartData = [];
  //       var labels = [];
  //       for (var i = 0; i < result['tableData'].length; i++) {
  //         labels.push(result['tableData'][i].district);
  //         chartData.push({ x: result['tableData'][i].visitedSchoolCount, y: result['tableData'][i].visitsperDist });
  //       };
  //       var obj: any = {};
  //       this.createChart(labels, chartData, this.tableHead);
  //     })
  //     this.loaderAndErr();
  //     this.changeDetection.markForCheck();
  //   })

  //   document.getElementById('home').style.display = 'block';
  // }

  createChart(labels, chartData, name) {

    this.scatterChart = new Chart('myChart', {
      type: 'scatter',
      data: {
        labels: labels,
        datasets: [{
          data: chartData,
          backgroundColor: "#24a0ed",
          pointRadius: 6
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {

          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              var multistringText = [name + ": " + label];
              multistringText.push("x-Axis: " + tooltipItem.xLabel);
              multistringText.push("y-Axis: " + tooltipItem.yLabel);
              return multistringText;
            }
          }
        },

        scales: {
          xAxes: [{
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              min: 0
            },
            scaleLabel: {
              display: true,
              labelString: "x_Axis",
              fontSize: 12,
              // fontColor: "dark gray"
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              min: 0
            },
            scaleLabel: {
              display: true,
              labelString: "y_Axis",
              fontSize: 12,
              // fontColor: "dark gray",
            }
          }]
        }
      }
    });
  }

  color() {
    // Converts a #ffffff hex string into an [r,g,b] array
    function hex2rgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null;
    }

    // Inverse of the above
    function rgb2hex(rgb) {
      return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }

    // Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
    // Taken from the awesome ROT.js roguelike dev library at
    // https://github.com/ondras/rot.js
    function _interpolateRgb(color1, color2, factor) {
      if (arguments.length < 3) { factor = 0.5; }

      let result = color1.slice();

      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      }
      return result;
    }

    function generateGradient(color1, color2, total, interpolation) {
      const colorStart = typeof color1 === 'string' ? hex2rgb(color1) : color1;
      const colorEnd = typeof color2 === 'string' ? hex2rgb(color2) : color2;

      // will the gradient be via RGB or HSL
      switch (interpolation) {
        case 'rgb':
          return colorsToGradientRgb(colorStart, colorEnd, total);
        // case 'hsl':
        //   return colorsToGradientHsl(colorStart, colorEnd, total);
        default:
          return false;
      }
    }

    function colorsToGradientRgb(startColor, endColor, steps) {
      // returns array of hex values for color, since rgb would be an array of arrays and not strings, easier to handle hex strings
      let arrReturnColors = [];
      let interimColorRGB;
      let interimColorHex;
      const totalColors = steps;
      const factorStep = 1 / (totalColors - 1);

      for (let idx = 0; idx < totalColors; idx++) {
        interimColorRGB = _interpolateRgb(startColor, endColor, factorStep * idx);
        interimColorHex = rgb2hex(interimColorRGB);
        arrReturnColors.push(interimColorHex);
      }
      return arrReturnColors;
    }
    return {
      generateGradient
    };
  }

}

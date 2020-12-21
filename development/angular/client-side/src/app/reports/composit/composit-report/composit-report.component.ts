import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompositReportService } from '../../../services/composit-report.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { AppServiceComponent } from 'src/app/app.service';
declare const $;

@Component({
  selector: 'app-composit-report',
  templateUrl: './composit-report.component.html',
  styleUrls: ['./composit-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CompositReportComponent implements OnInit {
  public scatterChart: Chart;
  public result: any = [];
  public xAxis: any;
  public yAxis: any;
  public xAxisFilter: any = [];
  public yAxisFilter: any = [];
  public downloadLevel = '';

  public districtsNames: any = [];
  public blockNames: any = [];
  public clusterNames: any = [];

  public SchoolInfrastructureDistrictsNames;
  public SchoolInfrastructureBlocksNames;
  public SchoolInfrastructureClusterNames;
  public SchoolInfrastructureSchoolNames;

  public myDistrict: any;
  public myBlock: any;
  public myCluster: any;

  public blockHidden;
  public clusterHidden;

  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;
  public skul: boolean = true;

  public title: string = '';
  public titleName: string = '';

  public hierName: any;
  public distName: any;
  public blockName: any;
  public clustName: any;

  public fileName: any;
  public reportData: any;
  public myData;
  public downloadType: string;
  state: string;


  constructor(public http: HttpClient, public service: CompositReportService, public router: Router, private changeDetection: ChangeDetectorRef, public commonService: AppServiceComponent,) {
    localStorage.removeItem('resData');
  }

  ngOnInit() {
    this.state = this.commonService.state;
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.dist_wise_data().subscribe(res => {
      this.result = res;
      if (Object.keys(this.result[0]).includes("Student Attendance(%)")) {
        this.xAxis = "Student Attendance(%)";
      } else {
        this.xAxis = Object.keys(this.result[0])[1];
      }
      if (Object.keys(this.result[0]).includes("Semester Performance(%)")) {
        this.yAxis = "Semester Performance(%)";
      } else {
        this.yAxis = Object.keys(this.result[0])[2];
      }
      this.districtWise();
    }, err => {
      this.result = [];
      this.createChart(["clg"], [], '', {});
      $('#table').empty();
      this.commonService.loaderAndErr(this.result);
    });

    document.getElementById('spinner').style.display = 'block';


  }

  public tableHead: any;
  public chartData: any = [];
  public modes: any

  districtWise() {
    if (this.chartData.length !== 0) {
      this.scatterChart.destroy();
    }

    this.xAxisFilter = [];
    this.yAxisFilter = [];
    this.downloadLevel = 'dist';
    this.tableHead = "District Name";
    this.fileName = "Dist_level_report";

    this.myDistrict = '';
    this.downloadType = '';
    this.modes = ['Dist Wise', 'Block Wise', 'Cluster Wise', 'School Wise'];

    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.skul = true;
    this.commonService.errMsg();
    this.blockHidden = true;
    this.clusterHidden = true;
    this.reportData = [];

    document.getElementById('home').style.display = 'none';

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.dist_wise_data().subscribe(res => {
      this.reportData = this.SchoolInfrastructureDistrictsNames = this.result = res;
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================
      this.funToDownload(this.reportData);

      this.SchoolInfrastructureDistrictsNames.sort((a, b) => (a.district.value > b.district.value) ? 1 : ((b.district.value > a.district.value) ? -1 : 0));
      this.commonService.loaderAndErr(this.result);
      this.changeDetection.markForCheck();
    }, err => {
      this.result = [];
      this.createChart(["clg"], [], '', {});
      $('#table').empty();
      this.commonService.loaderAndErr(this.result);
    });
  }

  myDistData(data) {
    if (this.chartData.length !== 0) {
      this.scatterChart.destroy();
    }
    this.xAxisFilter = [];
    this.yAxisFilter = [];
    this.downloadLevel = 'block';
    this.tableHead = "Block Name";
    this.fileName = "blockPerDistrict_report";

    this.dist = true;
    this.blok = false;
    this.clust = false;
    this.skul = false;
    this.commonService.errMsg();
    this.myBlock = '';
    this.downloadType = '';
    this.modes = [];
    this.reportData = [];

    this.distName = data;
    let obj = this.districtsNames.find(o => o.id == data);
    this.hierName = obj.name;
    localStorage.setItem('dist', obj.name);
    localStorage.setItem('distId', data);

    this.blockHidden = false;
    this.clusterHidden = true;

    document.getElementById('home').style.display = 'block';
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.block_per_dist_data(data).subscribe(res => {
      this.reportData = this.SchoolInfrastructureBlocksNames = this.result = res;
      // for download========
      this.funToDownload(this.reportData);
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================
      this.SchoolInfrastructureBlocksNames.sort((a, b) => (a.block.value > b.block.value) ? 1 : ((b.block.value > a.block.value) ? -1 : 0));

      //========================

      this.commonService.loaderAndErr(this.result);
      this.changeDetection.markForCheck();
    }, err => {
      this.result = [];
      this.createChart(["clg"], [], '', {});
      $('#table').empty();
      this.commonService.loaderAndErr(this.result);
    });
  }

  myBlockData(data) {
    if (this.chartData.length !== 0) {
      this.scatterChart.destroy();
    }
    this.xAxisFilter = [];
    this.yAxisFilter = [];
    this.downloadLevel = 'cluster';
    this.tableHead = "Cluster Name";
    this.fileName = "clusterPerBlock_report";
    this.commonService.errMsg();
    this.dist = false;
    this.blok = true;
    this.clust = false;
    this.skul = false;

    this.myCluster = '';
    this.downloadType = '';
    this.modes = [];
    this.reportData = [];

    localStorage.setItem('blockId', data);
    this.titleName = localStorage.getItem('dist');
    this.distName = JSON.parse(localStorage.getItem('distId'));
    this.blockName = data;
    let obj = this.blockNames.find(o => o.id == data);
    localStorage.setItem('block', JSON.stringify(obj.name));
    this.hierName = obj.name;

    this.blockHidden = false;
    this.clusterHidden = false;

    document.getElementById('home').style.display = 'block';
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.cluster_per_block_data(this.distName, data).subscribe(res => {
      this.reportData = this.SchoolInfrastructureClusterNames = this.result = res;
      // for download========
      this.funToDownload(this.reportData);
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================
      this.SchoolInfrastructureClusterNames.sort((a, b) => (a.cluster.value > b.cluster.value) ? 1 : ((b.cluster.value > a.cluster.value) ? -1 : 0));


      //========================

      this.commonService.loaderAndErr(this.result);
      this.changeDetection.markForCheck();
    }, err => {
      this.result = [];
      this.createChart(["clg"], [], '', {});
      $('#table').empty();
      this.commonService.loaderAndErr(this.result);
    });
  }

  myClusterData(data) {
    if (this.chartData.length !== 0) {
      this.scatterChart.destroy();
    }
    this.xAxisFilter = [];
    this.yAxisFilter = [];
    this.downloadLevel = 'school';
    this.tableHead = "School Name";
    this.fileName = "schoolPerCluster_report";

    this.dist = false;
    this.blok = false;
    this.clust = true;
    this.skul = false;
    this.commonService.errMsg();
    this.modes = [];
    this.reportData = [];

    this.title = JSON.parse(localStorage.getItem('block'));
    this.titleName = localStorage.getItem('dist');
    var distId = JSON.parse(localStorage.getItem('distId'));
    var blockId = JSON.parse(localStorage.getItem('blockId'));
    this.distName = JSON.parse(localStorage.getItem('distId'));
    this.blockName = blockId;
    this.clustName = data;
    let obj = this.clusterNames.find(o => o.id == data);
    this.hierName = obj.name;
    localStorage.setItem('clusterId', data);

    document.getElementById('home').style.display = 'block';
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.school_per_cluster_data(distId, blockId, data).subscribe(res => {
      this.reportData = this.SchoolInfrastructureSchoolNames = this.result = res;
      // for download========
      this.funToDownload(this.reportData);
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================

      this.commonService.loaderAndErr(this.result);
      this.changeDetection.markForCheck();
    }, err => {
      this.result = [];
      this.createChart(["clg"], [], '', {});
      $('#table').empty();
      this.commonService.loaderAndErr(this.result);
    });
  }

  distWise() {
    this.reportData = [];
    this.commonService.errMsg();
    var element1: any = document.getElementsByClassName('dwnld');
    // element1[0].disabled = true;
    this.fileName = "Dist_level_Report";
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.dist_wise_data().subscribe(res => {
      this.reportData = res;
      if (res !== null) {
        document.getElementById('spinner').style.display = 'none';
        element1[0].disabled = false;
      }
      this.funToDownload(this.reportData);
      this.changeDetection.markForCheck();
    }, err => {
      this.chartData = [];
      this.commonService.loaderAndErr(this.result);
    });
  }

  blockWise() {
    if (this.chartData.length !== 0) {
      this.scatterChart.destroy();
    }
    this.xAxisFilter = [];
    this.yAxisFilter = [];
    this.downloadLevel = 'block';
    this.tableHead = "Block Name";
    this.fileName = "Block_level_report";

    this.myDistrict = '';

    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.skul = true;
    this.commonService.errMsg();
    this.blockHidden = true;
    this.clusterHidden = true;
    this.reportData = [];
    document.getElementById('home').style.display = 'block';
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.block_wise_data().subscribe(res => {
      this.reportData = this.result = res;
      this.funToDownload(this.reportData);
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================
      this.commonService.loaderAndErr(this.result);
      this.changeDetection.markForCheck();
    }, err => {
      this.chartData = [];
      this.commonService.loaderAndErr(this.result);
    });
  }

  clusterWise() {
    if (this.chartData.length !== 0) {
      this.scatterChart.destroy();
    }
    this.xAxisFilter = [];
    this.yAxisFilter = [];
    this.downloadLevel = 'cluster';
    this.tableHead = "Cluster Name";
    this.fileName = "Cluster_level_report";

    this.myDistrict = '';

    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.skul = true;
    this.commonService.errMsg();
    this.blockHidden = true;
    this.clusterHidden = true;
    this.reportData = [];
    document.getElementById('home').style.display = 'block';
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.cluster_wise_data().subscribe(res => {
      this.reportData = this.result = res;
      this.funToDownload(this.reportData);
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================
      this.commonService.loaderAndErr(this.result);
      this.changeDetection.markForCheck();
    }, err => {
      this.chartData = [];
      this.commonService.loaderAndErr(this.result);
    });
  }

  // schoolWise() {
  //   if (this.chartData.length !== 0) {
  //     this.scatterChart.destroy();
  //   }
  //   this.xAxisFilter = [];
  //   this.yAxisFilter = [];
  //   this.downloadLevel = 'school';
  //   this.tableHead = "School Name";
  //   this.fileName = "School_level_report";

  //   this.myDistrict = '';

  //   this.dist = false;
  //   this.blok = false;
  //   this.clust = false;
  //   this.skul = true;
  //   this.commonService.errMsg();
  //   this.blockHidden = true;
  //   this.clusterHidden = true;
  //   this.reportData = [];
  //   document.getElementById('home').style.display = 'block';
  //   if (this.myData) {
  //     this.myData.unsubscribe();
  //   }
  //   this.myData = this.service.school_wise_data().subscribe(res => {
  //     this.reportData = this.result = res;
  //     //for chart =============================================
  //     this.showChart(this.result, this.downloadLevel);
  //     //====================================
  //     this.commonService.loaderAndErr(this.result);
  //     this.changeDetection.markForCheck();
  //   }, err => {
  //     this.chartData = [];
  //     this.commonService.loaderAndErr(this.result);
  //   });
  // }


  showChart(result, downloadType) {
    var l = undefined;
    if (downloadType == "dist") {
      l = 1;
    } else if (downloadType == "block") {
      l = 2;
    } else if (downloadType == "cluster") {
      l = 3;
    } else if (downloadType == "school") {
      l = 4;
    }

    for (i = l; i < Object.keys(result[0]).length; i++) {
      this.xAxisFilter.push({ key: Object.keys(result[0])[i], value: Object.keys(result[0])[i].replace(/_/g, ' ') });
      this.yAxisFilter.push({ key: Object.keys(result[0])[i], value: Object.keys(result[0])[i].replace(/_/g, ' ') });
    }

    var labels = [];
    this.chartData = []
    var j;

    for (var i = 0; i < result.length; i++) {
      j = i;
      if (result[i][this.xAxis] && result[i][this.yAxis]) {
        var x = undefined, y = undefined;
        if (result[i][this.xAxis].percent >= 0 && result[i][this.yAxis].percent >= 0) {
          x = parseFloat(result[i][this.xAxis].percent);
          y = parseFloat(result[i][this.yAxis].percent);
        }
        if (result[i][this.xAxis].percent >= 0 && result[i][this.yAxis].value >= 0) {
          x = parseFloat(result[i][this.xAxis].percent);
          y = parseFloat(result[i][this.yAxis].value);
        }
        if (result[i][this.xAxis].value >= 0 && result[i][this.yAxis].value >= 0) {
          x = parseFloat(result[i][this.xAxis].value);
          y = parseFloat(result[i][this.yAxis].value);
        }
        if (result[i][this.xAxis].value >= 0 && result[i][this.yAxis].percent >= 0) {
          x = parseFloat(result[i][this.xAxis].value);
          y = parseFloat(result[i][this.yAxis].percent);
        }

        this.chartData.push({ x: x, y: y });
        if (downloadType == "dist") {
          labels.push(result[i].district.value);
          this.districtsNames.push({ id: this.result[i].district.id, name: this.result[i].district.value });
        } else if (downloadType == "block") {
          labels.push(result[i].block.value);
          this.blockNames.push({ id: this.result[i].block.id, name: this.result[i].block.value });
        } else if (downloadType == "cluster") {
          labels.push(result[i].cluster.value);
          this.clusterNames.push({ id: this.result[i].cluster.id, name: this.result[i].cluster.value });
        } else if (downloadType == "school") {
          labels.push(result[i].school.value);
        }
      } else {
        this.chartData = [];
        this.result = [];
        this.commonService.loaderAndErr(this.result);
      }

    }
    if (result[j][this.xAxis] && result[j][this.yAxis]) {
      let x_axis = this.xAxisFilter.find(o => o.key == this.xAxis);
      let y_axis = this.yAxisFilter.find(o => o.key == this.yAxis);

      let obj = {
        xAxis: x_axis.value,
        yAxis: y_axis.value
      }
      this.createChart(labels, this.chartData, this.tableHead, obj);
    } else {
      if (downloadType == "dist") {
        this.SchoolInfrastructureDistrictsNames = [];
      } else if (downloadType == "block") {
        this.SchoolInfrastructureBlocksNames = [];
      } else if (downloadType == "cluster") {
        this.SchoolInfrastructureClusterNames = [];
      }
      this.chartData = [];
      this.result = [];
      this.commonService.loaderAndErr(this.result);
    }
  }

  selectAxis() {
    if (this.skul) {
      if (this.fileName == "Dist_level_report") {
        this.districtWise();
      } else if (this.fileName == "Block_level_report") {
        this.blockWise();
      } else if (this.fileName == "Cluster_level_report") {
        this.clusterWise();
      }
      // else if (this.fileName == "School_level_report") {
      //   this.schoolWise();
      // }

    }
    if (this.dist) {
      this.myDistData(JSON.parse(localStorage.getItem('distId')));
    }
    if (this.blok) {
      this.myBlockData(JSON.parse(localStorage.getItem('blockId')));
    }
    if (this.clust) {
      this.myClusterData(JSON.parse(localStorage.getItem('clusterId')));
    }
  }

  createChart(labels, chartData, name, obj) {
    this.scatterChart = new Chart('myChart', {
      type: 'scatter',
      data: {
        labels: labels,
        datasets: [{
          data: chartData,
          pointBackgroundColor: "#4890b5",
          pointRadius: 4
        }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        tooltips: {
          custom: function (tooltip) {
            if (!tooltip) return;
            // disable displaying the color box;
            tooltip.displayColors = false;
          },
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              var multistringText = [name + " : " + label];
              multistringText.push(obj.xAxis + " : " + tooltipItem.xLabel.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
              multistringText.push(obj.yAxis + " : " + tooltipItem.yLabel.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
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
              // max: 100
            },
            scaleLabel: {
              fontColor: "black",
              display: true,
              labelString: obj.xAxis,
              fontSize: 12,
              // fontColor: "dark gray"
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(252, 239, 252)",
            },
            ticks: {
              fontColor: 'black',
              min: 0,
              // max: 100
            },
            scaleLabel: {
              fontColor: "black",
              display: true,
              labelString: obj.yAxis,
              fontSize: 12,
              // fontColor: "dark gray",
            }
          }]
        }
      }
    });
  }

  funToDownload(data) {
    let newData = [];
    $.each(data, function (key, value) {
      let headers = Object.keys(value);
      let newObj = {}
      for (var i = 0; i < Object.keys(value).length; i++) {
        if (headers[i] != 'district' && headers[i] != 'block' && headers[i] != 'cluster' && headers[i] != 'school' && headers[i] != 'total_schools' && headers[i] != 'total_schools_data_received') {
          if (value[headers[i]].value >= 0) {
            newObj[`${headers[i]}`] = value[`${headers[i]}`].value;
          } else if (value[headers[i]].percent >= 0) {
            newObj[`${headers[i]}`] = value[`${headers[i]}`].percent;
          }
        } else {
          newObj[`${headers[i]}`] = value[`${headers[i]}`].value;
          var myStr = headers[i].charAt(0).toUpperCase() + headers[i].substr(1).toLowerCase();
          newObj[`${myStr}`] = newObj[headers[i]];
          delete newObj[headers[i]]
        }
      }
      newData.push(newObj);
    })
    this.reportData = newData
  }
  downloadRoport() {
    this.commonService.download(this.fileName, this.reportData);
  }
}
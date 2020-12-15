import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SchoolInfraService } from '../../../services/school-infra.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ExportToCsv } from 'export-to-csv';
import { AppServiceComponent } from 'src/app/app.service';
declare const $;

@Component({
  selector: 'app-school-infrastructure',
  templateUrl: './school-infrastructure.component.html',
  styleUrls: ['./school-infrastructure.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SchoolInfrastructureComponent implements OnInit {
  public scatterChart: Chart;
  public result: any = [];
  public xAxis: any = "infra_score";
  public yAxis: any = "library";
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
  public skul: boolean = false;

  public title: string = '';
  public titleName: string = '';

  public hierName: any;
  public distName: any;
  public blockName: any;
  public clustName: any;

  public fileName: any;
  public reportData: any;
  public myData;
  state: string;

  constructor(public http: HttpClient, public service: SchoolInfraService, public router: Router, private changeDetection: ChangeDetectorRef, public commonService: AppServiceComponent,) {
    localStorage.removeItem('resData');
  }

  ngOnInit() {
    this.state = this.commonService.state;
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.districtWise();
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
    this.fileName = "Dist_level_Report";

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
    this.myData = this.service.infraDistWise().subscribe(res => {
      this.SchoolInfrastructureDistrictsNames = this.result = res;
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================

      // for table 
      var dataSet = this.result;
      this.createTable(dataSet);
      //========================
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
    this.myData = this.service.infraBlockWise(data).subscribe(res => {
      this.reportData = this.SchoolInfrastructureBlocksNames = this.result = res;
      // for download========
      this.funToDownload(this.reportData);
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================
      this.SchoolInfrastructureBlocksNames.sort((a, b) => (a.block.value > b.block.value) ? 1 : ((b.block.value > a.block.value) ? -1 : 0));
      // for table data
      var dataSet = this.result;
      this.createTable(dataSet);
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
    this.myData = this.service.infraClusterWise(this.distName, data).subscribe(res => {
      this.reportData = this.SchoolInfrastructureClusterNames = this.result = res;
      // for download========
      this.funToDownload(this.reportData);
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================
      this.SchoolInfrastructureClusterNames.sort((a, b) => (a.cluster.value > b.cluster.value) ? 1 : ((b.cluster.value > a.cluster.value) ? -1 : 0));

      // for table data
      var dataSet = this.result;
      this.createTable(dataSet);
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
    this.myData = this.service.infraSchoolWise(distId, blockId, data).subscribe(res => {
      this.reportData = this.SchoolInfrastructureSchoolNames = this.result = res;
      // for download========
      this.funToDownload(this.reportData);
      //for chart =============================================
      this.showChart(this.result, this.downloadLevel);
      //====================================

      // for table data
      var dataSet = this.result;
      this.createTable(dataSet);
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

  distWise() {
    this.reportData = [];
    this.commonService.errMsg();
    var element1: any = document.getElementsByClassName('dwnld');
    // element1[0].disabled = true;
    this.fileName = "Dist_level_Infra_Report";
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.infraDistWise().subscribe(res => {
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
    this.reportData = [];
    this.commonService.errMsg();
    var element1: any = document.getElementsByClassName('dwnld');
    // element1[0].disabled = true;
    this.fileName = "Block_level_Infra_Report";
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.infraAllBlockWise().subscribe(res => {
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

  clusterWise() {
    this.reportData = [];
    this.commonService.errMsg();
    var element1: any = document.getElementsByClassName('dwnld');
    // element1[0].disabled = true;
    this.fileName = "Cluster_level_Infra_Report";
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.infraAllClusterWise().subscribe(res => {
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

  schoolWise() {
    this.reportData = [];
    this.commonService.errMsg();
    var element1: any = document.getElementsByClassName('dwnld');
    // element1[0].disabled = true;
    this.fileName = "School_level_Infra_Report";
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.infraAllSchoolWise().subscribe(res => {
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

  showChart(result, downloadType) {
    var l = undefined;
    if (downloadType == "dist") {
      l = 3;
    } else if (downloadType == "block") {
      l = 4;
    } else if (downloadType == "cluster") {
      l = 5;
    } else if (downloadType == "school") {
      l = 6;
    }
    for (i = l; i < Object.keys(result[0]).length; i++) {
      this.xAxisFilter.push({ key: Object.keys(result[0])[i], value: Object.keys(result[0])[i].replace(/_/g, ' ').charAt(0).toUpperCase() + Object.keys(result[0])[i].replace(/_/g, ' ').substr(1).toLowerCase() });
      this.yAxisFilter.push({ key: Object.keys(result[0])[i], value: Object.keys(result[0])[i].replace(/_/g, ' ').charAt(0).toUpperCase() + Object.keys(result[0])[i].replace(/_/g, ' ').substr(1).toLowerCase() });
    }

    var labels = [];
    this.chartData = []
    for (var i = 0; i < result.length; i++) {
      var x = undefined, y = undefined;

      if (Object.keys(result[i][this.xAxis]).length === 1 && Object.keys(result[i][this.yAxis]).length === 1) {
        x = Number(result[i][this.xAxis].value);
        y = Number(result[i][this.yAxis].value);
      }
      if (Object.keys(result[i][this.xAxis]).length === 1 && Object.keys(result[i][this.yAxis]).length === 2) {
        x = Number(result[i][this.xAxis].value);
        y = Number(result[i][this.yAxis].percent);
      }
      if (Object.keys(result[i][this.xAxis]).length === 2 && Object.keys(result[i][this.yAxis]).length === 1) {
        x = Number(result[i][this.xAxis].percent);
        y = Number(result[i][this.yAxis].value);
      }
      if (Object.keys(result[i][this.xAxis]).length === 2 && Object.keys(result[i][this.yAxis]).length === 2) {
        x = Number(result[i][this.xAxis].percent);
        y = Number(result[i][this.yAxis].percent);
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
    }

    let x_axis = this.xAxisFilter.find(o => o.key == this.xAxis);
    let y_axis = this.yAxisFilter.find(o => o.key == this.yAxis);

    let obj = {
      xAxis: x_axis.value,
      yAxis: y_axis.value
    }

    this.createChart(labels, this.chartData, this.tableHead, obj);
  }

  selectAxis() {
    if (this.skul) {
      this.districtWise();
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

  createTable(dataSet) {
    if ($.fn.DataTable.isDataTable('#table')) {
      $('#table').DataTable().destroy();
      $('#table').empty();
    }
    var my_columns = [];
    $.each(dataSet[0], function (key, value) {
      var my_item = {};
      my_item['data'] = key;
      my_item['value'] = value;
      my_columns.push(my_item);
    });

    $(document).ready(function () {
      var headers = '<thead><tr>'
      var subheader = '<tr>';
      var body = '<tbody>';

      my_columns.forEach((column, i) => {
        headers += `<th ${(column.data == 'district'
          || column.data == 'block'
          || column.data == 'cluster'
          || column.data == 'school'
          || column.data == 'total_schools'
          || column.data == 'infra_score'
          || column.data == 'total_schools_data_received') ? 'rowspan="2" style = "text-transform:capitalize;"' : 'colspan="2" style = "text-transform:capitalize;"'}>${column.data.replace(/_/g, ' ')}</th>`
        if (column.data != 'district'
          && column.data != 'block'
          && column.data != 'cluster'
          && column.data != 'school'
          && column.data != 'total_schools'
          && column.data != 'infra_score'
          && column.data != 'total_schools_data_received') {
          subheader += '<th>Yes</th><th>%.</th>'
        }
      });

      let newArr = [];
      $.each(dataSet, function (a, b) {
        let temp = [];
        $.each(b, function (key, value) {
          var new_item = {};
          new_item['data'] = key;
          new_item['value'] = value;
          temp.push(new_item);
        })
        newArr.push(temp)
      });

      newArr.forEach((columns) => {
        body += '<tr>';
        columns.forEach((column) => {
          if (column.data != 'district'
            && column.data != 'block'
            && column.data != 'cluster'
            && column.data != 'school'
            && column.data != 'total_schools'
            && column.data != 'infra_score'
            && column.data != 'total_schools_data_received'
          ) {
            body += `<td>${column.value.value}</td><td>${column.value.percent}</td>`
          } else {
            body += `<td>${column.value.value}</td>`
          }
        })
        body += '</tr>';
      });

      subheader += '</tr>'
      headers += `</tr>${subheader}</thead>`
      body += '</tr></tbody>';
      $("#table").append(headers);
      $("#table").append(body);
      $('#table').DataTable({
        destroy: true, bLengthChange: false, bInfo: false,
        bPaginate: false, scrollY: "40vh", scrollX: true,
        scrollCollapse: true, paging: false, searching: false,
        fixedColumns: {
          leftColumns: 1
        }
      });
    });
  }

  createChart(labels, chartData, name, obj) {
    this.scatterChart = new Chart('myChart', {
      type: 'scatter',
      data: {
        labels: labels,
        datasets: [{
          data: chartData,
          pointBackgroundColor: "#4890b5",
          pointRadius: 6
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
              var multistringText = [name + ": " + label];
              if (obj.xAxis == "INFRA_SCORE") {
                multistringText.push(obj.xAxis + ": " + tooltipItem.xLabel);
              } else {
                multistringText.push(obj.xAxis + ": " + tooltipItem.xLabel + " %");
              }
              if (obj.yAxis == "INFRA_SCORE") {
                multistringText.push(obj.yAxis + ": " + tooltipItem.yLabel);
              } else {
                multistringText.push(obj.yAxis + ": " + tooltipItem.yLabel + " %");
              }
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
              max: 100
            },
            scaleLabel: {
              fontColor: "black",
              display: true,
              labelString: obj.xAxis,
              fontSize: 12,
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(252, 239, 252)",
            },
            ticks: {
              fontColor: 'black',
              min: 0,
              max: 100
            },
            scaleLabel: {
              fontColor: "black",
              display: true,
              labelString: obj.yAxis,
              fontSize: 12,
            }
          }]
        }
      }
    });
  }

  funToDownload(reportData) {
    let newData = [];
    $.each(reportData, function (key, value) {
      let headers = Object.keys(value);
      let newObj = {}
      for (var i = 0; i < Object.keys(value).length; i++) {
        if (headers[i] != 'district' && headers[i] != 'block' && headers[i] != 'cluster' && headers[i] != 'school' && headers[i] != 'total_schools' && headers[i] != 'total_schools_data_received') {
          if (value[headers[i]].value >= 0) {
            newObj[`${headers[i]}_value`] = value[headers[i]].value;
          }
          if (value[headers[i]].percent >= 0) {
            newObj[`${headers[i]}_percent`] = value[headers[i]].percent;
          }
        } else {
          newObj[headers[i]] = value[headers[i]].value;
        }
      }
      newData.push(newObj);
    })
    this.reportData = newData
    if (this.downloadType === 'Dist Wise' || this.downloadType === 'Block Wise' || this.downloadType === 'Cluster Wise' || this.downloadType === 'School Wise') {
      this.downloadRoport();
    }
  }

  public downloadType: string;
  downloadReportofState(downloadType) {
    if (downloadType == 'Dist Wise') {
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

  downloadRoport() {
    if (this.reportData.length == 0) {
      alert("No data found to download");
    } else {
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
}
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, IterableDiffers } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ExportToCsv } from 'export-to-csv';
import { async } from '@angular/core/testing';
declare const $;

@Component({
  selector: 'app-school-infrastructure',
  templateUrl: './school-infrastructure.component.html',
  styleUrls: ['./school-infrastructure.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolInfrastructureComponent implements OnInit {
  public scatterChart: Chart;
  public result: any = [];
  public xAxis: any = "total_schools";
  public yAxis: any = "total_schools_data received";
  public xAxisFilter = [
    { key: 'total_schools', value: "Total Schools" },
    { key: 'total_schools_data received', value: "Total Schools Data Received" },
    { key: 'average_percent', value: "Average on 19 parameters (%)" },
    { key: 'handwash_percent', value: "Handwash (%)" },
    { key: 'solar_panel_percent', value: "Solar Panel (%)" },
    { key: "library_percent", value: "Library %" },
    { key: "drining_water_percent", value: "Drinking Water %" },
    { key: "tap_water_percent", value: "Tap Water %" },
    { key: 'hand_pumps_percent', value: "Hand Pump (%)" },
    { key: "playground_percent", value: "PlayGround (%)" },
    { key: "news_paper_percent", value: "News Paper (%)" },
    { key: "digital_board_percent", value: "Digital Board (%)" },
    { key: 'electricity_percent', value: "Electricity (%)" },
    { key: "toilet_percent", value: "Total Toilets (%)" },
    { key: "boys_toilet_percent", value: "Boy's Toilet (%)" },
    { key: "girls_toilet_percent", value: "Girl's Toilet (%)" },
    { key: 'cwsn_boys_toilet_percent', value: "CWSN Boy's Toilet (%)" },
    { key: "cwsn_girls_toilet_percent", value: "CWSN Girl's Toilet (%)" },
    { key: "boys_urinals_percent", value: "Boy's Urinals (%)" },
    { key: "girls_urinals_percent", value: "Girl's Urinals (%)" }
  ]

  public yAxisFilter = [
    { key: 'total_schools', value: "Total Schools" },
    { key: 'total_schools_data received', value: "Total Schools Data Received" },
    { key: 'average_percent', value: "Average on 19 parameters (%)" },
    { key: 'handwash_percent', value: "Handwash (%)" },
    { key: 'solar_panel_percent', value: "Solar Panel (%)" },
    { key: "library_percent", value: "Library %" },
    { key: "drining_water_percent", value: "Drinking Water %" },
    { key: "tap_water_percent", value: "Tap Water %" },
    { key: 'hand_pumps_percent', value: "Hand Pump (%)" },
    { key: "playground_percent", value: "PlayGround (%)" },
    { key: "news_paper_percent", value: "News Paper (%)" },
    { key: "digital_board_percent", value: "Digital Board (%)" },
    { key: 'electricity_percent', value: "Electricity (%)" },
    { key: "toilet_percent", value: "Total Toilets (%)" },
    { key: "boys_toilet_percent", value: "Boy's Toilet (%)" },
    { key: "girls_toilet_percent", value: "Girl's Toilet (%)" },
    { key: 'cwsn_boys_toilet_percent', value: "CWSN Boy's Toilet (%)" },
    { key: "cwsn_girls_toilet_percent", value: "CWSN Girl's Toilet (%)" },
    { key: "boys_urinals_percent", value: "Boy's Urinals (%)" },
    { key: "girls_urinals_percent", value: "Girl's Urinals (%)" }
  ]

  public myData;

  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router, private changeDetection: ChangeDetectorRef) {
    localStorage.removeItem('resData');
  }

  selectAxis() {
    this.districtWise();
  }
  ngOnInit() {
    this.districtWise();
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

  public tableHead: any;
  public chartData: any = [];
  public modes: any

  async districtWise() {
    if (this.chartData.length !== 0) {
      this.scatterChart.destroy();
    }
    this.chartData = []
    this.tableHead = "District Name";
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = await this.service.infraDistWise().subscribe(async res => {
      this.result = res;
      var labels = [];
      for (var i = 0; i < this.result.length; i++) {
        labels.push(this.result[i].district_name);
        this.chartData.push({ x: Number(this.result[i][this.xAxis]), y: Number(this.result[i][this.yAxis]) });
      }

      let x_axis = this.xAxisFilter.find(o => o.key == this.xAxis);
      let y_axis = this.yAxisFilter.find(o => o.key == this.yAxis);
      let obj = {
        xAxis: x_axis.value,
        yAxis: y_axis.value
      }

      await this.createChart(labels, this.chartData, this.tableHead, obj);

      $(document).ready(function () {
        $('#table').DataTable(
          {
            destroy: true, bLengthChange: false, bInfo: false,
            bPaginate: false, scrollY: "62vh", scrollX: true,
            scrollCollapse: true, paging: false, searching: false,
            fixedColumns: {
              leftColumns: 1
            }
          }
        );
      });
      this.loaderAndErr();
      this.changeDetection.markForCheck();
    }, err => {
      this.result = [];
      this.loaderAndErr();
    });
  }

  createChart(labels, chartData, name, obj) {
    var sortedX = this.chartData.sort((a, b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0));
    var sortedY = this.chartData.sort((a, b) => (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0));
    console.log(sortedX);
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
              min: 0
            },
            scaleLabel: {
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
              min: 0
            },
            scaleLabel: {
              display: true,
              labelString: obj.yAxis,
              fontSize: 12,
              // fontColor: "dark gray",
            }
          }]
        }
      }
    });
  };

}

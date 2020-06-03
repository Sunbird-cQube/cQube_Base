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

  //For char creation
  //========================================
  public barChartOptions = {
    responsive: true,
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
          labelString: "Average Values",
          fontSize: 12,
          fontColor: "dark gray"
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
          labelString: "District Names",
          fontSize: 12,
          fontColor: "dark gray",
        }
      }]
    }
  };;
  public barChartLabels: any = [];
  public barChartType: any = 'horizontalBar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartColors: any = [
    { backgroundColor: 'red' },
    { backgroundColor: 'green' },
  ]

  public barChartData = [
    { data: [], label: 'Total Schools', stack: 'a' },
    { data: [], label: 'total_schools_data received', stack: 'a' }
  ];;
  //============================================================

  public result: any = [];
  public labels = [
    "Total Schools", "Total Schools Data Received", "Average on 19 parameters", "Handwash",
    "Solar Panel", "Library", "Drinking Water", "Tap Water", "Hand Pump", "PlayGround", "News Paper",
    "Digital Board", "Electricity", "Total Toilets", "Boy's Toilet", "Girl's Toilet", "CWSN Boy's Toilet",
    "CWSN Girl's Toilet", "Boy's Urinals", "Girl's Urinals"
  ]

  public keys = [
    "total_schools", "total_schools_data received", "average_value", "handwash_value",
    "solar_panel_value", "library_value", "drinking_water_value", "tap_water_value", "hand_pumps_value", "playground_value",
    "news_paper_value", "digital_board_value", "electricity_value", "toilet_value", "boys_toilet_value", "girls_toilet_value",
    "cwsn_boys_toilet_value", "cwsn_girls_toilet_value", "boys_urinals_value", "girls_urinals_value"
  ]
  public myData;

  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router, private changeDetection: ChangeDetectorRef) {
    localStorage.removeItem('resData');
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

  generateChart(distNames, data) {
    this.barChartLabels = distNames;
    this.barChartType = 'horizontalBar';
    this.barChartData = data;
  }

  async districtWise() {
    this.chartData = []

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = await this.service.infraDistWise().subscribe(async res => {
      this.result = res;

      var distNames = [];
      this.result.forEach(element => {
        distNames.push(element.district_name);
      });

      var data = [];
      for (var i = 0; i < this.labels.length; i++) {
        this.result.forEach(item => {
          data.push(item[this.keys[i]]);
        });
        var obj = {
          data: data, label: this.labels[i], stack: 'a'
        }
        data = [];
        this.chartData.push(obj);
      }
      await this.generateChart(distNames, this.chartData);

      $(document).ready(function () {
        $('#table').DataTable(
          {
            destroy: true,
            bLengthChange: false,
            bInfo: false,
            bPaginate: false,
            scrollY: "62vh",
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            searching: false,
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

}

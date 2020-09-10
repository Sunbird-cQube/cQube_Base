import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-diksha-bar-chart',
  templateUrl: './diksha-bar-chart.component.html',
  styleUrls: ['./diksha-bar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DikshaBarChartComponent implements OnInit {
  chart: boolean = false;

  public colors = [];
  header = '';
  public barChartOptions: ChartOptions = {};
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartColors: Color[] = [
    { backgroundColor: '#0e92b0' }
  ]
  public barChartData: ChartDataSets[] = [];

  collection_type = 'all';

  public result: any = [];
  public timePeriod = '';
  public hierName: any;
  public dist: boolean = false;
  public all: boolean = false;
  public timeDetails: any = [{ id: "last_day", name: "Last Day" }, { id: "last_7_days", name: "Last 7 Days" }, { id: "last_30_days", name: "Last 30 Days" }];
  public districtsDetails: any = '';
  public myChart: Chart;
  public showAllChart: boolean = false;
  public allDataNotFound: any;
  public collectioTypes: any = [{ id: "all", type: "Overall" }, { id: "course", type: "Course" }, { id: "textbook", type: "TextBook" }, { id: "others", type: "Others" }];
  public collectionNames: any = [];
  collectionName = '';
  footer;

  downloadType;
  fileName: any;
  reportData: any = [];
  y_axisValue;


  constructor(
    public http: HttpClient,
    public service: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
  ) {
    service.logoutOnTokenExpire();
  }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
    this.getAllData();
  }
  loaderAndErr() {
    if (this.result.length !== 0) {
      document.getElementById('spinner').style.display = 'none';
    } else {
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('errMsg').style.color = 'red';
      document.getElementById('errMsg').style.display = 'block';
    }
  }

  errMsg() {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
  }
  emptyChart() {
    this.barChartData = [
      { data: [], label: '' }
    ];
    this.result = [];
  }

  homeClick() {
    document.getElementById('home').style.display = "none";
    this.getAllData()
  }
  linkClick() {
    this.collection_type = "all";
    document.getElementById('home').style.display = "none";
    this.getAllData()
  }
  async getAllData() {
    this.emptyChart();
    if (this.collection_type != "all") {
      document.getElementById('home').style.display = "block";
    }
    this.errMsg();
    this.reportData = [];
    this.timePeriod = '';
    this.collectionName = '';
    this.footer = '';
    this.fileName = `collectionType_${this.collection_type}_data`;
    this.result = [];
    this.all = true
    this.dist = false;
    this.header = this.changeingStringCases(this.collection_type) + " linked";
    if (this.collection_type == 'all') {
      this.header = "Overall";
    }
    this.header = this.header;
    this.listCollectionNames();
    this.service.dikshaBarChart({ collection_type: this.collection_type }).subscribe(async result => {
      this.result = result['chartData'];
      this.reportData = result['downloadData'];
      this.footer = result['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.createChart(this.result);
      if (result['data']) {
        this.chart = (result['data'][0].length > 0);
      }
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.result = [];
      this.emptyChart();
      this.loaderAndErr();
    });

  }

  listCollectionNames() {
    this.errMsg();
    this.reportData = [];
    this.collectionName = '';
    this.footer = '';
    this.service.listCollectionNames({ collection_type: this.collection_type, timePeriod: this.timePeriod }).subscribe(res => {
      this.collectionNames = [];
      this.collectionNames = res['uniqueCollections'];
      this.collectionNames.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
      if (res['chartData']) {
        document.getElementById('home').style.display = "block";
        this.result = [];
        this.emptyChart();
        this.result = res['chartData'];
        this.footer = res['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.createChart(this.result);
        this.reportData = res['downloadData'];
      }
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.collectionNames = [];
      this.result = [];
      this.emptyChart();
      this.loaderAndErr();
    })
  }

  chooseTimeRange() {
    this.listCollectionNames();
  }

  getDataBasedOnCollections() {
    this.emptyChart();
    this.reportData = [];
    document.getElementById('home').style.display = "block";
    this.errMsg();
    this.fileName = `collectionType_${this.collection_type}_data_of_${this.collectionName}`;
    this.footer = '';
    this.result = [];
    this.all = true
    this.dist = false
    this.service.getDataByCollectionNames({ collection_type: this.collection_type, timePeriod: this.timePeriod, collection_name: this.collectionName }).subscribe(res => {
      this.result = res['chartData'];
      this.reportData = res['downloadData'];
      this.footer = res['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.createChart(this.result);
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.loaderAndErr();
    });
  }

  createChart(data) {
    var chartData = [];
    var obj = { data: data.data, label: "Total Content Play" }
    chartData.push(obj);
    this.barChartOptions = {
      legend: {
        display: true
      },
      responsive: true,
      tooltips: {
        custom: function (tooltip) {
          if (!tooltip) return;
          tooltip.displayColors = false;
        },
        // callbacks: {
        //   label: function (tooltipItem, data) {
        //     var label = data.labels[tooltipItem.index];
        //     var content = data.datasets[0].data;
        //     var scores = content[tooltipItem.index];
        //     // var subject = data.datasets[tooltipItem.index].label
        //     var multistringText = ["District Name" + ": " + label];
        //     multistringText.push("Total Content Plays" + ": " + scores);
        //     // multistringText.push(obj.yAxis + ": " + tooltipItem.yLabel);
        //     return multistringText;
        //   }
        // }
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
            labelString: "Total Content Play",
            fontSize: 12,
            // fontColor: "dark gray"
          }
        }],
        yAxes: [{
          gridLines: {
            color: "rgba(252, 239, 252)",
          },
          ticks: {
            min: 0,
            max: this.y_axisValue
          },
          scaleLabel: {
            display: true,
            labelString: "District Names",
            fontSize: 12,
            // fontColor: "dark gray",
          }
        }]
      }
    }

    this.barChartLabels = data.labels;
    this.barChartData = chartData;
  }


  onChange() {
    document.getElementById('errMsg').style.display = 'none';
  }

  downloadRoport() {
    if (this.reportData.length <= 0) {
      alert("No data fount to download");
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

  changeingStringCases(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}

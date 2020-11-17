import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DikshaReportService } from '../../../services/diksha-report.service';
import { Router } from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { AppServiceComponent } from '../../../app.service';

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

  collection_type = 'course';

  public result: any = [];
  public timePeriod = 'all';
  public hierName: any;
  public dist: boolean = false;
  public all: boolean = false;
  public timeDetails: any = [{ id: "last_day", name: "Last Day" }, { id: "last_7_days", name: "Last 7 Days" }, { id: "last_30_days", name: "Last 30 Days" }, { id: "all", name: "Overall" }];
  public districtsDetails: any = '';
  public myChart: Chart;
  public showAllChart: boolean = false;
  public allDataNotFound: any;
  public collectioTypes: any = [{ id: "course", type: "Course" }];
  public collectionNames: any = [];
  collectionName = '';
  footer;

  downloadType;
  fileName: any;
  reportData: any = [];
  y_axisValue;

  constructor(
    public http: HttpClient,
    public service: DikshaReportService,
    public commonService: AppServiceComponent,
    public router: Router,
  ) {
  }

  ngOnInit(): void {
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.getAllData();
  }

  emptyChart() {
    this.barChartData = [
      { data: [], label: '' }
    ];
    this.result = [];
  }

  homeClick() {
    document.getElementById('home').style.display = "none";
    this.timePeriod = 'all';
    this.getAllData()
  }
  // linkClick() {
  //   document.getElementById('home').style.display = "none";
  //   this.getAllData()
  // }
  async getAllData() {
    this.emptyChart();
    if (this.timePeriod != 'all') {
      document.getElementById('home').style.display = "block";
    } else {
      document.getElementById('home').style.display = "none";
    }
    this.reportData = [];
    this.commonService.errMsg();

    this.collectionName = '';
    this.footer = '';
    this.fileName = `collectionType_${this.collection_type}_data`;
    this.result = [];
    this.all = true
    this.dist = false;
    this.header = this.changeingStringCases(this.collection_type) + " linked";
    // if (this.collection_type == 'all') {
    //   this.header = "Overall";
    // }
    // this.header = this.header;

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
      this.commonService.loaderAndErr(this.result);
    });

  }

  listCollectionNames() {
    this.commonService.errMsg();
    this.collectionName = '';
    this.footer = '';
    this.reportData = [];
    this.service.listCollectionNames({ collection_type: this.collection_type, timePeriod: this.timePeriod == 'all' ? '' : this.timePeriod }).subscribe(res => {
      this.collectionNames = [];
      this.collectionNames = res['uniqueCollections'];
      this.collectionNames.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
      if (res['chartData']) {
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
      this.commonService.loaderAndErr(this.result);
    })
  }

  chooseTimeRange() {
    document.getElementById('home').style.display = "block";
    if(this.timePeriod== 'all'){
      this.getAllData();
    }else{
      this.listCollectionNames();
    }
  }

  getDataBasedOnCollections() {
    this.emptyChart();
    this.reportData = [];
    document.getElementById('home').style.display = "block";
    this.commonService.errMsg();
    this.fileName = `collectionType_${this.collection_type}_data_of_${this.collectionName}`;
    this.footer = '';
    this.result = [];
    this.all = true
    this.dist = false
    this.service.getDataByCollectionNames({ collection_type: this.collection_type, timePeriod: this.timePeriod == 'all' ? '' : this.timePeriod, collection_name: this.collectionName }).subscribe(res => {
      this.result = res['chartData'];
      this.reportData = res['downloadData'];
      this.footer = res['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.createChart(this.result);
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.commonService.loaderAndErr(this.result);
    });
  }

  createChart(data) {
    var chartData = [];
    var percentage = [];
    var contentPlays = [];
    data.data.forEach(element => {
      contentPlays.push(element.total_content_plays);
      percentage.push(element.percentage);
    });
    var obj = { data: contentPlays, label: "Total Content Play" }
    chartData.push(obj);
    this.barChartOptions = {
      legend: {
        display: false
      },
      responsive: true,
      tooltips: {
        custom: function (tooltip) {
          if (!tooltip) return;
          tooltip.displayColors = false;
        },
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.labels[tooltipItem.index];
            var content = data.datasets[0].data;
            var scores = content[tooltipItem.index];
            var percent = percentage[tooltipItem.index]
            // var subject = data.datasets[tooltipItem.index].label
            var multistringText = [];
            multistringText.push("Total Content Plays" + ": " + scores.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
            multistringText.push("Percentage" + ": " + percent + " %");
            // multistringText.push(obj.yAxis + ": " + tooltipItem.yLabel);
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
            callback: function (value, index, values) {
              value = value.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
              return value;
            }
          },
          scaleLabel: {
            fontColor: "black",
            display: true,
            labelString: "Total Content Play",
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
            max: this.y_axisValue,
          },
          scaleLabel: {
            fontColor: "black",
            display: true,
            labelString: "District Names",
            fontSize: 12,
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
    this.commonService.download(this.fileName, this.reportData);
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

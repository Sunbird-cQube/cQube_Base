import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-diksha-chart',
  templateUrl: './diksha-chart.component.html',
  styleUrls: ['./diksha-chart.component.css']
})
export class DikshaChartComponent implements OnInit {
  chart1: boolean = false;
  chart2: boolean = false;
  chart3: boolean = false;
  chart4: boolean = false;

  public colors = [];
  public barChartOptions: ChartOptions = {};
  public barChartLabels: Label[] = [];
  public barChartLabels1: Label[] = [];
  public barChartLabels2: Label[] = [];
  public barChartLabels3: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    { backgroundColor: 'red' },
    { backgroundColor: 'green' },
  ]

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Series A', stack: 'a' }
  ];

  public barChartData1: ChartDataSets[] = [
    { data: [], label: 'Series A', stack: 'a' }
  ];

  public barChartData2: ChartDataSets[] = [
    { data: [], label: 'Series A', stack: 'a' }
  ];

  public barChartData3: ChartDataSets[] = [
    { data: [], label: 'Series A', stack: 'a' }
  ];

  public result: any = [];
  public districtId: any = '';
  public timePeriod = 'last_30_days';
  public hierName: any;
  public dist: boolean = false;
  public all: boolean = false;
  public timeDetails: any = [];
  public districtsDetails: any = '';
  public myChart: Chart;
  public showAllChart: boolean = false;
  public allDataNotFound: any;
  public usageByType: any = [{ type: "All" }, { type: "Teacher" }, { type: "Student" }, { type: "Others" }];
  downloadType;
  fileName: any;
  reportData: any = [];
  y_axisValue;


  constructor(
    public http: HttpClient,
    public service: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
  ) { console.log(this.timePeriod) }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
    this.metaData();
    this.getAllData();
  }
  loaderAndErr() {
    if (this.result.length !== 0) {
      document.getElementById('spinner').style.display = 'none';
    } else {
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('errMsg').style.color = 'red';
      document.getElementById('errMsg').style.display = 'block';
      // document.getElementById('errMsg').innerHTML = 'No data found';
    }
  }
  metaData() {
    document.getElementById('spinner').style.display = 'block';
    this.service.dikshaMetaData().subscribe(result => {
      this.districtsDetails = result['districtDetails']
      result['timeRange'].forEach(element => {
        var obj = { timeRange: element }
        this.timeDetails.push(obj);
      });
    }, err => {
      console.log(err);
    })
  }

  errMsg() {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
  }
  emptyChart() {
    this.barChartData = [
      { data: [], label: '', stack: 'a' }
    ];

    this.barChartData1 = [
      { data: [], label: '', stack: 'a' }
    ];

    this.barChartData2 = [
      { data: [], label: '', stack: 'a' }
    ];

    this.barChartData3 = [
      { data: [], label: '', stack: 'a' }
    ];
  }
  async getAllData() {
    this.emptyChart();
    document.getElementById('home').style.display = "none";
    this.errMsg();
    this.districtId = '';
    this.timePeriod = 'last_30_days';

    this.result = [];
    this.all = true
    this.dist = false
    this.service.dikshaAllData('All', this.timePeriod).subscribe(async result => {
      var arr = [];
      var maxValue = 0;
      await result['data'].forEach(element => {
        arr.push(element.score.map(Number));
      });
      var array = arr;
      var result1 = array.reduce((r, a) => a.map((b, i) => (r[i] || 0) + b), []);
      maxValue = Math.max(...result1);
      this.y_axisValue = maxValue;

      this.createChart(result, "barChartData");
      if (result['data']) {
        this.chart1 = (result['data'][0].length > 0);
        console.log(this.chart1);
      }

      this.service.dikshaAllData('Teacher', this.timePeriod).subscribe(result => {
        this.createChart(result, "barChartData1");
        if (result['data']) {
          this.chart2 = (result['data'][0].length > 0);
        }
      }, err => {
        this.loaderAndErr();
      })
      this.service.dikshaAllData('Student', this.timePeriod).subscribe(result => {
        this.createChart(result, "barChartData2");
        if (result['data']) {
          this.chart3 = (result['data'][0].length > 0);
        }
      }, err => {
        this.loaderAndErr();
      })
      this.service.dikshaAllData('Other', this.timePeriod).subscribe(result => {

        this.createChart(result, "barChartData3");
        if (result['data']) {
          this.chart4 = (result['data'][0].length > 0);
        }
        document.getElementById('spinner').style.display = 'none';
      }, err => {
        this.loaderAndErr();
      })
    }, err => {
      this.loaderAndErr();
    });

  }


  districtWise(districtId) {
    this.emptyChart();
    this.errMsg();
    document.getElementById('home').style.display = "Block";
    this.districtId = districtId
    if (this.timePeriod !== '') {
      this.all = false
      this.dist = true
      let d = this.districtsDetails.filter(item => {
        if (item.district_id == districtId)
          return item.district_name
      })
      this.hierName = d[0].district_name
      this.timeRange(this.timePeriod);
    } else {

      if (districtId == '') {
        this.all = true
        this.dist = false
      } else {
        console.log(districtId)
        this.all = false
        this.dist = true
        let d = this.districtsDetails.filter(item => {
          if (item.district_id == districtId)
            return item.district_name
        })
        this.hierName = d[0].district_name
      }


      this.result = [];
      this.service.dikshaDistData(districtId, 'All', this.timePeriod).subscribe(async result => {
        var arr = [];
        var maxValue = 0;
        await result['data'].forEach(element => {
          arr.push(element.score.map(Number));
        });
        var array = arr;
        var result1 = array.reduce((r, a) => a.map((b, i) => (r[i] || 0) + b), []);
        maxValue = Math.max(...result1);
        this.y_axisValue = maxValue;
        this.createChart(result, "barChartData");
        if (result['data']) {
          this.chart1 = (result['data'][0].length > 0);
        }

        this.service.dikshaDistData(districtId, 'Teacher', this.timePeriod).subscribe(result => {
          if (result['data']) {
            this.chart2 = (result['data'][0].length > 0);
          }

          this.createChart(result, "barChartData1");
        }, err => {
          this.loaderAndErr();
          console.log(err);
        })
        this.service.dikshaDistData(districtId, 'Student', this.timePeriod).subscribe(result => {
          this.createChart(result, "barChartData2");
          if (result['data']) {
            this.chart3 = (result['data'][0].length > 0);
          }

        }, err => {
          this.loaderAndErr();
          console.log(err);
        })
        this.service.dikshaDistData(districtId, 'Other', this.timePeriod).subscribe(result => {

          this.createChart(result, "barChartData3");
          if (result['data']) {
            this.chart4 = (result['data'][0].length > 0);
          }

          document.getElementById('spinner').style.display = 'none';
        }, err => {
          this.loaderAndErr();
          console.log(err);
        })
      }, err => {
        this.loaderAndErr();
        this.result = [];
        this.showAllChart = (this.result.length! > 0);
        this.allDataNotFound = err.error.errMsg;
      })

    }

  }

  timeRange(timePeriod) {
    this.emptyChart();

    document.getElementById('home').style.display = "block";
    this.allDataNotFound = undefined;
    console.log(this.timePeriod);
    this.errMsg();

    this.result = [];
    if (this.districtId == '') {
      this.districtId = 'All'
    }
    this.timePeriod = timePeriod

    this.service.dikshaDistData(this.districtId, 'All', this.timePeriod).subscribe(async result => {
      var arr = [];
      var maxValue = 0;
      await result['data'].forEach(element => {
        arr.push(element.score.map(Number));
      });
      var array = arr;
      var result1 = array.reduce((r, a) => a.map((b, i) => (r[i] || 0) + b), []);
      maxValue = Math.max(...result1);
      this.y_axisValue = maxValue;

      this.createChart(result, "barChartData");
      if (result['data']) {
        this.chart1 = (result['data'][0].length > 0);
      }


      this.service.dikshaDistData(this.districtId, 'Teacher', this.timePeriod).subscribe(result => {
        this.createChart(result, "barChartData1");
        if (result['data']) {
          this.chart2 = (result['data'][0].length > 0);
        }

      }, err => {
        this.loaderAndErr();
        console.log(err);
      })
      this.service.dikshaDistData(this.districtId, 'Student', this.timePeriod).subscribe(result => {
        this.createChart(result, "barChartData2");
        if (result['data']) {
          this.chart3 = (result['data'][0].length > 0);
        }

      }, err => {
        this.loaderAndErr();
        console.log(err);
      })
      this.service.dikshaDistData(this.districtId, 'Other', this.timePeriod).subscribe(result => {

        this.createChart(result, "barChartData3");
        if (result['data']) {
          this.chart4 = (result['data'][0].length > 0);
        }

        document.getElementById('spinner').style.display = 'none';
      }, err => {
        this.loaderAndErr();
        console.log(err);
      });
    }, err => {
      this.loaderAndErr();
      this.result = [];
      this.showAllChart = (this.result.length! > 0);
      this.allDataNotFound = err.error.errMsg;
    })

  }

  createChart(data, barChartData) {
    var chartData = [];
    if (data.data != undefined) {
      data.data.forEach(element => {
        var obj = { data: element.score, label: element.subject, stack: 'a' }
        chartData.push(obj);
        let a = { backgroundColor: '' };
        if (element.subject == 'Sanskrit') {
          a.backgroundColor = '#cc0000'
        }
        if (element.subject == 'Gujarati') {
          a.backgroundColor = '#006600'
        }
        if (element.subject == 'Science') {
          a.backgroundColor = '#333300'
        }
        if (element.subject == 'Gyan Setu') {
          a.backgroundColor = '#006666'
        }
        if (element.subject == 'Environmental Studies') {
          a.backgroundColor = '#003366'
        }
        if (element.subject == 'Hindi') {
          a.backgroundColor = '#333399'
        }
        if (element.subject == 'Multi_Subject') {
          a.backgroundColor = '#660066'
        }
        if (element.subject == 'Mathematics') {
          a.backgroundColor = '#cc3300'
        }
        if (element.subject == 'English') {
          a.backgroundColor = '#996600'
        }
        if (element.subject == 'Social Science') {
          a.backgroundColor = '#6600cc'
        }
        if (element.subject == 'Maths') {
          a.backgroundColor = '#3366cc'
        }
        this.barChartColors.push(a);
      });
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
          //     var subject = data.datasets[tooltipItem.index].label
          //     var multistringText = ["Grade Name" + ": " + label];
          //     multistringText.push("Subject Name" + ": " + subject);
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
              labelString: "Content-Gradelevel(Group)",
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
              labelString: "Total Content Play",
              fontSize: 12,
              // fontColor: "dark gray",
            }
          }]
        }
      }
      if (barChartData == "barChartData") {
        this.barChartLabels = data.grades;
        this.barChartData = chartData;
      }
      if (barChartData == "barChartData1") {
        this.barChartLabels1 = data.grades;
        this.barChartData1 = chartData;
      }
      if (barChartData == "barChartData2") {
        this.barChartLabels2 = data.grades;
        this.barChartData2 = chartData;
      }
      if (barChartData == "barChartData3") {
        this.barChartLabels3 = data.grades;
        this.barChartData3 = chartData;
      }

    }

  }

  onChange() {
    document.getElementById('errMsg').style.display = 'none';
  }

  downloadReportByType(type) {

    if (type) {
      this.errMsg();
      this.service.dikshaDataDownload({ districtId: this.districtId, timePeriod: this.timePeriod }).subscribe(res => {

        if (this.districtId == '') {
          if (res['All'][`${type}`]) {
            this.fileName = `Diksha_All_data_${type}`;
            this.reportData = res['All'][`${type}`];
            this.downloadRoport();
          } else {
            document.getElementById('errMsg').innerHTML = 'No data found for this type';
            document.getElementById('errMsg').style.display = 'block';
            document.getElementById('errMsg').style.color = 'red';
          }

        } else {
          if (res[`${this.districtId}`][`${type}`]) {
            this.fileName = `Diksha_${this.hierName}_data_${type}`;
            this.reportData = res[`${this.districtId}`][`${type}`];
            this.downloadRoport();
          } else {
            document.getElementById('errMsg').innerHTML = 'No data found for this type';
            document.getElementById('errMsg').style.display = 'block';
            document.getElementById('errMsg').style.color = 'red';
          }
        }
        document.getElementById('spinner').style.display = 'none';
      }, err => {
        console.log(err);
        document.getElementById('spinner').style.display = 'none';
        alert("No data found for this type");
      })
    } else {
      document.getElementById('errMsg').innerHTML = 'Please select download type';
      document.getElementById('errMsg').style.display = 'block';
      document.getElementById('errMsg').style.color = 'red';
    }

  }

  downloadRoport() {
    console.log(this.reportData.length);
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

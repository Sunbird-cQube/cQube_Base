import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-diksha-chart',
  templateUrl: './diksha-chart.component.html',
  styleUrls: ['./diksha-chart.component.css']
})
export class DikshaChartComponent implements OnInit {
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
      document.getElementById('errMsg').innerHTML = 'No data found';
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

  async getAllData() {
    if (this.result.length > 0) {
      this.myChart.destroy();
    }
    document.getElementById('home').style.display = "none";
    this.errMsg();
    this.districtId = '';
    this.timePeriod = 'last_30_days';
    if (this.result.length == 0 || this.result.data.length > 0) {
      document.querySelector("#r1").innerHTML = '<h3>Overall Usage</h3><canvas *ngIf="!showAllChart" id="report1" height="120vh"></canvas>';
      document.querySelector("#r2").innerHTML = '<h3>Usage by Teachers</h3><canvas id="report2" height="120vh"></canvas>';
      document.querySelector("#r3").innerHTML = '<h3>Usage by Students</h3><canvas id="report3" height="120vh"></canvas>';
      document.querySelector("#r4").innerHTML = '<h3>Usage by Others</h3><canvas id="report4" height="120vh"></canvas>';
    }
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

      this.stackChart('report1', result);

      this.service.dikshaAllData('Teacher', this.timePeriod).subscribe(result => {
        this.stackChart('report2', result);
      }, err => {
        this.loaderAndErr();
      })
      this.service.dikshaAllData('Student', this.timePeriod).subscribe(result => {
        this.stackChart('report3', result)
      }, err => {
        this.loaderAndErr();
      })
      this.service.dikshaAllData('Other', this.timePeriod).subscribe(result => {
        this.stackChart('report4', result);
        document.getElementById('spinner').style.display = 'none';
      }, err => {
        this.loaderAndErr();
      })
    }, err => {
      this.loaderAndErr();
    });

  }


  districtWise(districtId) {
    if (this.result.length > 0) {
      this.myChart.destroy();
    }
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

      if (this.result.data != undefined) {
        if (this.result.data.length > 0) {
          document.querySelector("#r1").innerHTML = '<h3>Overall Usage</h3><canvas id="report1" height="120vh"></canvas>';
          document.querySelector("#r2").innerHTML = '<h3>Usage by Teachers</h3><canvas id="report2" height="120vh"></canvas>';
          document.querySelector("#r3").innerHTML = '<h3>Usage by Students</h3><canvas id="report3" height="120vh"></canvas>';
          document.querySelector("#r4").innerHTML = '<h3>Usage by Others</h3><canvas id="report4" height="120vh"></canvas>';
        }
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
        this.stackChart('report1', result);

        this.service.dikshaDistData(districtId, 'Teacher', this.timePeriod).subscribe(result => {
          this.stackChart('report2', result)
        }, err => {
          this.loaderAndErr();
          console.log(err);
        })
        this.service.dikshaDistData(districtId, 'Student', this.timePeriod).subscribe(result => {
          this.stackChart('report3', result)
        }, err => {
          this.loaderAndErr();
          console.log(err);
        })
        this.service.dikshaDistData(districtId, 'Other', this.timePeriod).subscribe(result => {
          this.stackChart('report4', result);
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
    if (this.result.length > 0) {
      this.myChart.destroy();
    }
    document.getElementById('home').style.display = "block";
    this.allDataNotFound = undefined;
    console.log(this.timePeriod);
    this.errMsg();
    if (this.result.data != undefined) {
      if (this.result.data.length > 0) {
        document.querySelector("#r1").innerHTML = '<h3>Overall Usage</h3><canvas id="report1" height="120vh"></canvas>';
        document.querySelector("#r2").innerHTML = '<h3>Usage by Teachers</h3><canvas id="report2" height="120vh"></canvas>';
        document.querySelector("#r3").innerHTML = '<h3>Usage by Students</h3><canvas id="report3" height="120vh"></canvas>';
        document.querySelector("#r4").innerHTML = '<h3>Usage by Others</h3><canvas id="report4" height="120vh"></canvas>';
      }
    }
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

      this.stackChart('report1', result);


      this.service.dikshaDistData(this.districtId, 'Teacher', this.timePeriod).subscribe(result => {
        this.stackChart('report2', result)
      }, err => {
        this.loaderAndErr();
        console.log(err);
      })
      this.service.dikshaDistData(this.districtId, 'Student', this.timePeriod).subscribe(result => {
        this.stackChart('report3', result)
      }, err => {
        this.loaderAndErr();
        console.log(err);
      })
      this.service.dikshaDistData(this.districtId, 'Other', this.timePeriod).subscribe(result => {
        this.stackChart('report4', result);
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

  stackChart(id, result) {
    this.result = result;
    let b = []
    if (result.data != undefined) {
      result.data.forEach(element => {
        let a = {}
        a['label'] = element.subject;
        a['data'] = element.score;
        if (element.subject == 'Sanskrit') {
          a['backgroundColor'] = '#cc0000'
        }
        if (element.subject == 'Gujarati') {
          a['backgroundColor'] = '#006600'
        }
        if (element.subject == 'Science') {
          a['backgroundColor'] = '#333300'
        }
        if (element.subject == 'Gyan Setu') {
          a['backgroundColor'] = '#006666'
        }
        if (element.subject == 'Environmental Studies') {
          a['backgroundColor'] = '#003366'
        }
        if (element.subject == 'Hindi') {
          a['backgroundColor'] = '#333399'
        }
        if (element.subject == 'Multi_Subject') {
          a['backgroundColor'] = '#660066'
        }
        if (element.subject == 'Mathematics') {
          a['backgroundColor'] = '#cc3300'
        }
        if (element.subject == 'English') {
          a['backgroundColor'] = '#996600'
        }
        if (element.subject == 'Social Science') {
          a['backgroundColor'] = '#6600cc'
        }
        if (element.subject == 'Maths') {
          a['backgroundColor'] = '#3366cc'
        }
        b.push(a)
      });
    }

    // var ctx = document.getElementById(id);
    this.myChart = new Chart(id, {
      type: 'bar',
      data: {
        labels: result.grades,
        datasets: b,

      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Grades'
            },
            stacked: true,
            gridLines: {
              color: 'transparent'
            }

          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Total Score'
            },
            stacked: true,
            gridLines: {
              color: 'transparent'
            },
            ticks: {
              min: 0,
              max: this.y_axisValue
            },
          }]
        }
      }
    });

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
          }

        } else {
          if (res[`${this.districtId}`][`${type}`]) {
            this.fileName = `Diksha_${this.hierName}_data_${type}`;
            this.reportData = res[`${this.districtId}`][`${type}`];
            this.downloadRoport();
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

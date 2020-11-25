import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DikshaReportService } from '../../../services/diksha-report.service';
import { Router } from '@angular/router';
import { AppServiceComponent } from '../../../app.service';

@Component({
  selector: 'app-diksha-usage-by-text-book',
  templateUrl: './diksha-usage-by-text-book.component.html',
  styleUrls: ['./diksha-usage-by-text-book.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DikshaUsageByTextBookComponent implements OnInit {
  chart: boolean = false;
  public colors = [];
  header = '';
  public category: String[] = [];
  public chartData: Number[] = [];
  public xAxisLabel: String = "Total Content Plays";
  public yAxisLabel: String = "District Names"

  public collection_type: String = 'textbook';

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
  public collectioTypes: any = [{ id: "textbook", type: "TextBook" }];
  public collectionNames: any = [];
  collectionName = '';
  footer;

  downloadType;
  fileName: any;
  reportData: any = [];
  y_axisValue;
  state: string;

  constructor(
    public http: HttpClient,
    public service: DikshaReportService,
    public commonService: AppServiceComponent,
    public router: Router,
  ) {
  }

  ngOnInit(): void {
    this.state = this.commonService.state;
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
    this.getAllData();
  }

  emptyChart() {
    this.result = [];
    this.chartData = [];
    this.category = [];
  }

  homeClick() {
    document.getElementById('home').style.display = "none";
    this.timePeriod = 'all';
    this.getAllData()
  }

  getBarChartData() {
    if (this.result.labels.length <= 25) {
      for (let i = 0; i <= 25; i++) {
        this.category.push(this.result.labels[i] ? this.result.labels[i] : ' ')
      }
    } else {
      this.category = this.result.labels;
    }
    this.result.data.forEach(element => {
      this.chartData.push(Number(element[`total_content_plays`]));
    });
  }

  async getAllData() {
    this.emptyChart();
    if (this.timePeriod != "all") {
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
    this.listCollectionNames();
    this.service.dikshaBarChart({ collection_type: this.collection_type }).subscribe(async result => {
      this.result = result['chartData'];
      this.reportData = result['downloadData'];
      this.footer = result['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.getBarChartData();
      this.commonService.loaderAndErr(this.result);
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
    this.service.listCollectionNames({ collection_type: this.collection_type, timePeriod: this.timePeriod == 'all' ? '' : this.timePeriod }).subscribe(async res => {
      this.collectionNames = [];
      this.collectionNames = res['uniqueCollections'];
      this.collectionNames.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
      if (res['chartData']) {
        document.getElementById('home').style.display = "block";
        this.emptyChart();
        this.result = res['chartData'];
        this.footer = res['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.getBarChartData();
        this.reportData = res['downloadData'];
      }
      this.commonService.loaderAndErr(this.result);
    }, err => {
      this.collectionNames = [];
      this.result = [];
      this.emptyChart();
      this.commonService.loaderAndErr(this.result);
    })
  }

  async chooseTimeRange() {
    this.emptyChart();
    document.getElementById('home').style.display = "block";
    if (this.timePeriod == 'all') {
      await this.getAllData();
    } else {
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
    this.service.getDataByCollectionNames({ collection_type: this.collection_type, timePeriod: this.timePeriod == 'all' ? '' : this.timePeriod, collection_name: this.collectionName }).subscribe(async res => {
      this.result = res['chartData'];
      this.reportData = res['downloadData'];
      this.footer = res['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.getBarChartData();
      this.commonService.loaderAndErr(this.result);
    }, err => {
      this.commonService.loaderAndErr(this.result);
    });
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

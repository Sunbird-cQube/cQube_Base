import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DikshaReportService } from '../../../services/diksha-report.service';
import { Router } from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { AppServiceComponent } from '../../../app.service';

@Component({
  selector: 'app-diksha-tpd-completion',
  templateUrl: './diksha-tpd-completion.component.html',
  styleUrls: ['./diksha-tpd-completion.component.css']
})
export class DikshaTpdCompletionComponent implements OnInit {
  chart: boolean = false;
  public colors = [];
  header = '';
  chartHeight;

  districts = [];
  districtId;
  blocks = [];
  blockId;
  clusters = [];
  clusterId;

  blockHidden = true;
  clusterHidden = true;

  // to hide and show the hierarchy details
  public skul: boolean = false;
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;

  // to set the hierarchy names
  public districtHierarchy: any = '';
  public blockHierarchy: any = '';
  public clusterHierarchy: any = '';

  public barChartOptions = {};
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartColors: Color[] = [
    { backgroundColor: '#0e92b0' }
  ]
  public barChartData: ChartDataSets[] = [];


  public result: any = [];
  public timePeriod = 'overall';
  public hierName: any;
  public all: boolean = false;
  // public timeDetails: any = [{ id: "last_day", name: "Last Day" }, { id: "last_7_days", name: "Last 7 Days" }, { id: "last_30_days", name: "Last 30 Days" }, { id: "overall", name: "Overall" }];
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
  state: string;
  level: string = "district";;
  globalId: any;

  constructor(
    public http: HttpClient,
    public service: DikshaReportService,
    public commonService: AppServiceComponent,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.state = this.commonService.state;
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
    this.timePeriod = 'overall';
    this.districtId = undefined;
    this.blockHidden = true;
    this.clusterHidden = true;
    this.getAllData()
  }
  // linkClick() {
  //   document.getElementById('home').style.display = "none";
  //   this.getAllData()
  // }
  async getAllData() {
    this.emptyChart();
    if (this.timePeriod != 'overall') {
      document.getElementById('home').style.display = "block";
    } else {
      document.getElementById('home').style.display = "none";
    }
    this.reportData = [];
    this.commonService.errMsg();

    this.collectionName = '';
    this.footer = '';
    this.fileName = `overall_data`;
    this.result = [];
    this.all = true;
    this.skul = true;
    this.dist = false;
    this.blok = false;
    this.clust = false;

    this.listCollectionNames();
    this.service.tpdDistEnrollCompAll({ timePeriod: this.timePeriod }).subscribe(async result => {
      this.result = result['chartData'];
      this.districts = this.reportData = result['downloadData'];
      this.createChart(this.result);
      if (result['data']) {
        this.chart = (result['data'][0].length > 0);
      }
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
    this.service.tpdgetCollection({ timePeriod: this.timePeriod, level: this.level, id: this.globalId }).subscribe(res => {
      this.collectionNames = [];
      this.collectionNames = res['allCollections'];
      this.collectionNames.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.result = [];
      this.emptyChart();
      this.commonService.loaderAndErr(this.result);
    })
  }

  chooseTimeRange() {
    document.getElementById('home').style.display = "block";
    this.getAllData();
  }

  onDistSelect(districtId) {
    document.getElementById('home').style.display = "block";
    this.globalId = districtId;
    this.blockHidden = false;
    this.clusterHidden = true;
    this.level = "block"
    this.skul = false;
    this.dist = true;
    this.blok = false;
    this.clust = false;
    this.blockId = undefined;
    this.clusterId = undefined;
    this.listCollectionNames();
    this.service.tpdBlockEnrollCompAll({ timePeriod: this.timePeriod, districtId: districtId }).subscribe(res => {
      this.result = res['chartData'];
      this.districtHierarchy = {
        distId: res['downloadData'][0].district_id,
        districtName: res['downloadData'][0].district_name
      }
      this.fileName = `TPD_data_of_district_${this.districtHierarchy.districtName}`;
      this.blocks = this.reportData = res['downloadData'];
      // this.footer = result['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.createChart(this.result);
      if (res['data']) {
        this.chart = (res['data'][0].length > 0);
      }
      this.commonService.loaderAndErr(this.result);
    }, err => {
      this.result = [];
      this.emptyChart();
      this.commonService.loaderAndErr(this.result);
    });
  }

  onBlockSelect(blockId) {
    document.getElementById('home').style.display = "block";
    this.globalId = blockId;
    this.blockHidden = false;
    this.clusterHidden = false;
    this.level = "cluster"
    this.skul = false;
    this.dist = false;
    this.blok = true;
    this.clust = false;
    this.clusterId = undefined;
    this.listCollectionNames();
    this.service.tpdClusterEnrollCompAll({ timePeriod: this.timePeriod, blockId: blockId }).subscribe(res => {
      this.result = res['chartData'];
      this.blockHierarchy = {
        distId: res['downloadData'][0].district_id,
        districtName: res['downloadData'][0].district_name,
        blockId: res['downloadData'][0].block_id,
        blockName: res['downloadData'][0].block_name
      }
      this.fileName = `TPD_data_of_block_${this.blockHierarchy.blockName}`;
      this.clusters = this.reportData = res['downloadData'];
      // this.footer = result['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.createChart(this.result);
      if (res['data']) {
        this.chart = (res['data'][0].length > 0);
      }
      this.commonService.loaderAndErr(this.result);
    }, err => {
      this.result = [];
      this.emptyChart();
      this.commonService.loaderAndErr(this.result);
    });
  }

  onClusterSelect(clusterId) {
    document.getElementById('home').style.display = "block";
    this.globalId = this.blockId;
    this.level = "school"
    this.skul = false;
    this.dist = false;
    this.blok = false;
    this.clust = true;
    this.listCollectionNames();
    this.service.tpdSchoolEnrollCompAll({ timePeriod: this.timePeriod, blockId: this.blockId, clusterId: clusterId }).subscribe(res => {
      this.result = res['chartData'];
      this.clusterHierarchy = {
        distId: res['downloadData'][0].district_id,
        districtName: res['downloadData'][0].district_name,
        blockId: res['downloadData'][0].block_id,
        blockName: res['downloadData'][0].block_name,
        clusterId: res['downloadData'][0].cluster_id,
        clusterName: res['downloadData'][0].cluster_name
      }
      this.fileName = `TPD_data_of_cluster_${this.clusterHierarchy.clusterName}`;
      this.clusters = this.reportData = res['downloadData'];
      // this.footer = result['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.createChart(this.result);
      if (res['data']) {
        this.chart = (res['data'][0].length > 0);
      }
      this.commonService.loaderAndErr(this.result);
    }, err => {
      this.result = [];
      this.emptyChart();
      this.commonService.loaderAndErr(this.result);
    });
  }

  getDataBasedOnCollections() {
    this.emptyChart();
    this.reportData = [];
    document.getElementById('home').style.display = "block";
    this.commonService.errMsg();
    this.fileName = `TPD_data_of_${this.collectionName}`;
    this.footer = '';
    this.result = [];
    this.service.getCollectionData({ timePeriod: this.timePeriod, collection_name: this.collectionName, level: this.level, id: this.globalId, clusterId: this.clusterId }).subscribe(res => {
      this.result = res['chartData'];
      this.reportData = res['downloadData'];
      // this.footer = res['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.createChart(this.result);
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.commonService.loaderAndErr(this.result);
    });
  }


  createChart(data) {
    // this.chartHeight = `${(data.data.length * 35) / 6}`;
    var percentTeachers = [],
      percentCompletion = [];
    var yLable = this.level.charAt(0).toUpperCase() + this.level.slice(1);
    var chartData = [];
    data.data.forEach(element => {
      percentTeachers.push(element[`percent_teachers`]);
      percentCompletion.push(element[`percent_completion`]);
    });
    var obj = { data: percentTeachers, label: `percent_teachers` }
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
            var percentTeachers = data.datasets[0].data;
            var scores = percentTeachers[tooltipItem.index];
            var completion = percentCompletion[tooltipItem.index];
            var multistringText = [];
            // multistringText.push(`Percent Teachers` + ": " + scores + " %");
            multistringText.push(`Percent Completion` + ": " + completion + " %");
            return multistringText;
          }
        }
      },
      plotOptions: {
        bar: {
          groupPadding: 0,
          pointPadding: 0,
          dataLabels: {
            enabled: true,
          }
        }
      },
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'top',
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
            labelString: "Percentage",
            fontSize: 12,
          }
        }],
        yAxes: [{

          // type: 'linear',
          // categoryPercentage: .5,
          // barThickness: 12,
          // minBarLength: 100,
          gridLines: {
            color: "rgba(252, 239, 252)",
          },
          ticks: {
            fontColor: 'black',

            beginAtZero: true,
            min: 0,
            max: 5
          },
          scaleLabel: {
            fontColor: "black",
            display: true,
            labelString: `${yLable} Names`,
            fontSize: 12,
          },

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


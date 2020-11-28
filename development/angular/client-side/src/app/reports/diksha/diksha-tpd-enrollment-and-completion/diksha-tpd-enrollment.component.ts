import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DikshaReportService } from '../../../services/diksha-report.service';
import { Router } from '@angular/router';
import { AppServiceComponent } from '../../../app.service';

@Component({
  selector: 'app-diksha-tpd-enrollment',
  templateUrl: './diksha-tpd-enrollment.component.html',
  styleUrls: ['./diksha-tpd-enrollment.component.css']
})
export class DikshaTpdEnrollmentComponent implements OnInit {
  chart: boolean = false;
  public colors = [];
  header = '';
  level = "district";
  globalId;

  public category: String[] = [];
  public chartData: Number[] = [];
  public xAxisLabel: String = "Enrollment";
  public yAxisLabel: String;
  public reportName: String = "enroll/comp";

  enrollTypes = [{ key: 'enrollment', name: 'Enrollment' }, { key: 'completion', name: 'Completion' }];
  type = 'enrollment';
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
  public districtHierarchy: any = {};
  public blockHierarchy: any = {};
  public clusterHierarchy: any = {};

  public result: any = [];
  public timePeriod = 'overall';
  public hierName: any;
  public all: boolean = false;
  public timeDetails: any = [{ id: "last_day", name: "Last Day" }, { id: "last_7_days", name: "Last 7 Days" }, { id: "last_30_days", name: "Last 30 Days" }, { id: "overall", name: "Overall" }];
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
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.getAllData();
  }

  emptyChart() {
    this.result = [];
    this.chartData = [];
    this.category = [];
    this.reportData = [];
    this.districtHierarchy = {};
    this.blockHierarchy = {};
    this.clusterHierarchy = {};
    this.footer = undefined;
  }


  homeClick() {
    document.getElementById('home').style.display = "none";
    this.timePeriod = 'overall';
    this.type = 'enrollment';
    this.districtId = undefined;
    this.blockHidden = true;
    this.clusterHidden = true;
    this.yAxisLabel = "District Names"
    this.emptyChart();
    this.getAllData()
  }

  async getAllData() {
    this.emptyChart();
    if (this.timePeriod != 'overall') {
      document.getElementById('home').style.display = "block";
    } else {
      document.getElementById('home').style.display = "none";
    }
    this.districts = [];
    this.blocks = [];
    this.clusters = [];
    this.blockId = undefined;
    this.clusterId = undefined;
    this.collectionNames = [];
    this.commonService.errMsg();
    this.level = "district"
    this.collectionName = '';
    this.footer = '';
    this.fileName = `all_${this.type}_data`;
    this.result = [];
    this.all = true;
    this.skul = true;
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.yAxisLabel = "District Names"

    this.listCollectionNames();
    this.service.tpdDistEnrollCompAll({ timePeriod: this.timePeriod }).subscribe(async result => {
      this.result = result['chartData'];
      this.districts = this.reportData = result['downloadData'];
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
    this.service.tpdgetCollection({ timePeriod: this.timePeriod, level: this.level, id: this.globalId }).subscribe(async (res) => {
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
    if (this.level == 'district') {
      this.getAllData();
    }
    if (this.level == 'block') {
      this.onDistSelect(this.districtId);
    }
    if (this.level == 'cluster') {
      this.onBlockSelect(this.blockId);
    }
    if (this.level == 'school') {
      this.onClusterSelect(this.clusterId);
    }
  }

  onTypeSelect(type) {
    if (this.level == 'district') {
      this.getAllData();
    }
    if (this.level == 'block') {
      this.onDistSelect(this.districtId);
    }
    if (this.level == 'cluster') {
      this.onBlockSelect(this.blockId);
    }
    if (this.level == 'school') {
      this.onClusterSelect(this.clusterId);
    }
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
      this.chartData.push(Number(element[`${this.type}`]));
    });
    this.footer = (this.chartData.reduce((a, b) => Number(a) + Number(b), 0)).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

    this.xAxisLabel = this.type.charAt(0).toUpperCase() + this.type.slice(1);
  }

  onDistSelect(districtId) {
    this.emptyChart();
    document.getElementById('home').style.display = "block";
    this.globalId = districtId;
    this.blockHidden = false;
    this.clusterHidden = true;
    this.level = "block"
    this.skul = false;
    this.dist = true;
    this.blok = false;
    this.clust = false;
    this.blocks = [];
    this.clusters = [];
    this.collectionNames = [];
    this.blockId = undefined;
    this.clusterId = undefined;
    this.yAxisLabel = "Block Names"
    this.listCollectionNames();
    this.service.tpdBlockEnrollCompAll({ timePeriod: this.timePeriod, districtId: districtId }).subscribe(async (res) => {
      this.result = res['chartData'];
      this.districtHierarchy = {
        distId: res['downloadData'][0].district_id,
        districtName: res['downloadData'][0].district_name
      }
      this.fileName = `TPD_data_of_district_${this.districtHierarchy.districtName}`;
      this.blocks = this.reportData = res['downloadData'];
      // this.footer = result['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.getBarChartData();
      this.commonService.loaderAndErr(this.result);
    }, err => {
      this.result = [];
      this.emptyChart();
      this.commonService.loaderAndErr(this.result);
    });
  }

  onBlockSelect(blockId) {
    this.emptyChart();
    document.getElementById('home').style.display = "block";
    this.globalId = blockId;
    this.blockHidden = false;
    this.clusterHidden = false;
    this.level = "cluster"
    this.skul = false;
    this.dist = false;
    this.blok = true;
    this.clust = false;
    this.clusters = [];
    this.collectionNames = [];
    this.clusterId = undefined;
    this.yAxisLabel = "Cluster Names"
    this.listCollectionNames();
    this.service.tpdClusterEnrollCompAll({ timePeriod: this.timePeriod, blockId: blockId }).subscribe(async (res) => {
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
      this.getBarChartData();
      this.commonService.loaderAndErr(this.result);
    }, err => {
      this.result = [];
      this.emptyChart();
      this.commonService.loaderAndErr(this.result);
    });
  }

  onClusterSelect(clusterId) {
    this.emptyChart();
    document.getElementById('home').style.display = "block";
    this.globalId = this.blockId;
    this.level = "school"
    this.skul = false;
    this.dist = false;
    this.blok = false;
    this.clust = true;
    this.collectionNames = [];
    this.yAxisLabel = "School Names"
    this.listCollectionNames();
    this.service.tpdSchoolEnrollCompAll({ timePeriod: this.timePeriod, blockId: this.blockId, clusterId: clusterId }).subscribe(async (res) => {
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
      this.reportData = res['downloadData'];
      // this.footer = result['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.getBarChartData();
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
    this.service.getCollectionData({ timePeriod: this.timePeriod, collection_name: this.collectionName, level: this.level, id: this.globalId, clusterId: this.clusterId }).subscribe(async (res) => {
      this.result = res['chartData'];
      this.reportData = res['downloadData'];
      if (this.level == 'block') {
        this.districtHierarchy = {
          distId: res['downloadData'][0].district_id,
          districtName: res['downloadData'][0].district_name
        }
      }
      if (this.level == 'cluster') {
        this.blockHierarchy = {
          distId: res['downloadData'][0].district_id,
          districtName: res['downloadData'][0].district_name,
          blockId: res['downloadData'][0].block_id,
          blockName: res['downloadData'][0].block_name
        }
      }
      if (this.level == 'school') {
        this.clusterHierarchy = {
          distId: res['downloadData'][0].district_id,
          districtName: res['downloadData'][0].district_name,
          blockId: res['downloadData'][0].block_id,
          blockName: res['downloadData'][0].block_name,
          clusterId: res['downloadData'][0].cluster_id,
          clusterName: res['downloadData'][0].cluster_name
        }
      }
      // this.footer = res['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      this.getBarChartData();
      this.commonService.loaderAndErr(this.result);
    }, err => {
      this.commonService.loaderAndErr(this.result);
    });
  }

  //to filter downloadable data
  dataToDownload = [];
  newDownload(element) {
    element['total_enrolled'] = element.total_enrolled.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    element['total_completed'] = element.total_completed.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    var data1 = {}, data2 = {}, data3 = {};
    Object.keys(element).forEach(key => {
      if (key !== "percentage_completion") {
        data1[key] = element[key];
      }
    });
    Object.keys(data1).forEach(key => {
      if (key !== "percentage_teachers") {
        data2[key] = data1[key];
      }
    });
    var myKey = this.type == 'enrollment' ? "total_completed" : "total_enrolled";
    Object.keys(data2).forEach(key => {
      if (key !== myKey) {
        data3[key] = data2[key];
      }
    });
    this.dataToDownload.push(data3);
  }

  downloadRoport() {
    this.dataToDownload = [];
    this.reportData.forEach(element => {
      this.newDownload(element);
    });
    this.commonService.download(this.fileName, this.dataToDownload);
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

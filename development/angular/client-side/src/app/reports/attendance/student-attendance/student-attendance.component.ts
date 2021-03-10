import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceReportService } from '../../../services/student.attendance-report.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { KeycloakSecurityService } from '../../../keycloak-security.service';
import { AppServiceComponent, globalMap } from '../../../app.service';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StudengtAttendanceComponent implements OnInit {
  state;
  edate;
  public telemData = {}
  public disabled = false;
  public title: string = '';
  public titleName: string = '';
  public districts: any = [];
  public blocks: any = [];
  public cluster: any = [];
  public schools: any = [];
  public districtsIds: any = [];
  public blocksIds: any = [];
  public clusterIds: any = [];
  public schoolsIds: any = [];
  public districtsNames: any = [];
  public blocksNames: any = [];
  public clusterNames: any = [];
  public schoolsNames: any = [];
  public id: any = '';
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;
  public myDistrict: any;
  public myBlock: any;
  public myCluster: any;
  public colors: any = [];
  public studentCount: any;
  public schoolCount: any;
  public dateRange: any = '';
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;
  public skul: boolean = false;
  public hierName: any;
  public distName: any;
  public blockName: any;
  public clustName: any;
  public markerData;
  public layerMarkers: any = new L.layerGroup();
  public markersList = new L.FeatureGroup();
  public levelWise: any = 'District';

  // google maps zoom level
  public zoom: number = 7;

  public labelOptions: any = {};

  // initial center position for the map
  public lat: any;
  public lng: any;

  public markers: any = [];
  public mylatlngData: any = [];
  public getMonthYear: any;
  public years: any = [];
  public year;
  public months: any = [];
  public month;
  public element;
  params: any;
  yearMonth = true;
  selected = "absolute";
  reportName = 'student_attendance';

  getColor(data) {
    this.selected = data;
    this.onResize(event);
    }

  timeRange = [{ key: 'overall', value: "Overall" }, { key: 'last_30_days', value: "Last 30 Days" }, { key: 'last_7_days', value: "Last 7 Days" }, { key: "last_day", value: "Last Day" }, { key: 'select_month', value: "Year and Month" }];
  period = 'overall';
  timePeriod = {};
  academicYears: any = [];
  academicYear;
  rawFileName;

  constructor(public http: HttpClient, public service: AttendanceReportService, public router: Router, public keyCloakSevice: KeycloakSecurityService, private changeDetection: ChangeDetectorRef, public commonService: AppServiceComponent, private readonly _router: Router) { }

  width = window.innerWidth;
  heigth = window.innerHeight;
  onResize(event) {
    this.width = window.innerWidth;
    this.heigth = window.innerHeight;
    this.commonService.zoomLevel = this.width > 3820 ? this.commonService.mapCenterLatlng.zoomLevel + 2 : this.width < 3820 && this.width >= 2500 ? this.commonService.mapCenterLatlng.zoomLevel + 1 : this.width < 2500 && this.width > 1920 ? this.commonService.mapCenterLatlng.zoomLevel + 1 : this.commonService.mapCenterLatlng.zoomLevel;
    this.changeDetection.detectChanges();
    this.levelWiseFilter();
  }
  setZoomLevel(lat, lng, globalMap, zoomLevel) {
    globalMap.setView(new L.LatLng(lat, lng), zoomLevel);
    globalMap.options.minZoom = this.commonService.zoomLevel;
    this.changeDetection.detectChanges();
  }
  getMarkerRadius(rad1, rad2, rad3, rad4) {
    let radius = this.width > 3820 ? rad1 : this.width > 2500 && this.width < 3820 ? rad2 : this.width < 2500 && this.width > 1920 ? rad3 : rad4;
    return radius;
  }

  ngOnInit() {
    this.state = this.commonService.state;
    this.lat = this.commonService.mapCenterLatlng.lat;
    this.lng = this.commonService.mapCenterLatlng.lng;
    this.changeDetection.detectChanges();
    this.commonService.initMap('mapContainer', [[this.lat, this.lng]]);
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.skul = true;
    this.timePeriod = {
      period: 'overall'
    }
    this.service.getDateRange().subscribe(res => {
      this.getMonthYear = res;
      this.years = Object.keys(this.getMonthYear);
      this.year = this.years[this.years.length - 1];
      var allMonths = [];
      allMonths = this.getMonthYear[`${this.year}`];
      this.months = [];
      allMonths.forEach(month => {
        var obj = {
          name: month.month_name,
          id: month.month
        }
        this.months.push(obj);
      });
      this.month = this.months[this.months.length - 1].id;
      // this.dateRange = `${this.getMonthYear[`${this.year}`][this.months.length - 1].data_from_date} to ${this.getMonthYear[`${this.year}`][this.months.length - 1].data_upto_date}`;
      if (this.month) {
        this.month_year = {
          month: null,
          year: null
        };

        this.params = JSON.parse(sessionStorage.getItem('report-level-info'));
        let params = this.params;

        if (this.params)
          this.period = this.params.timePeriod;


        if (params && params.level) {
          let data = params.data;
          if (params.level === 'district') {
            this.myDistrict = data.id;
          } else if (params.level === 'block') {
            this.myDistrict = data.districtId
            this.myBlock = data.id;
          } else if (params.level === 'cluster') {
            this.myDistrict = data.districtId
            this.myBlock = Number(data.blockId);
            this.myCluster = data.id;
          }
          this.getDistricts();
        } else {
          this.onResize(event);
        }

      }
    }, err => {
      this.dateRange = '';
      this.changeDetection.detectChanges();
      document.getElementById('home').style.display = 'none';
      this.getMonthYear = {};
      this.commonService.loaderAndErr(this.markers);
    });

    this.service.getRawMeta({ report: 'sar' }).subscribe(res => {
      this.academicYears = res;
    })
  }

  showYearMonth() {
    document.getElementById('home').style.display = 'block';
    this.yearMonth = false;
    this.month_year = {
      month: this.month,
      year: this.year
    };
    this.timePeriod = {
      period: null
    }
    this.onResize(event);
  }

  onPeriodSelect() {
    if (this.period != 'overall') {
      document.getElementById('home').style.display = 'block';
    } else {
      document.getElementById('home').style.display = 'none';
    }
    this.yearMonth = true;
    this.timePeriod = {
      period: this.period
    }
    this.month_year = {
      month: null,
      year: null
    };
    this.onResize(event);
  }

  getDistricts(): void {
    this.service.dist_wise_data(this.timePeriod).subscribe(res => {
      var sorted = res['distData'].sort((a, b) => (a.attendance > b.attendance) ? 1 : -1);
      var distNames = [];
      this.markers = sorted;

      if (this.markers.length > 0) {
        for (var i = 0; i < this.markers.length; i++) {
          if (this.myDistrict === this.markers[i]['district_id']) {
            localStorage.setItem('dist', this.markers[i].district_name);
            localStorage.setItem('distId', this.markers[i].district_id);
          }

          this.districtsIds.push(this.markers[i]['district_id']);
          distNames.push({ id: this.markers[i]['district_id'], name: this.markers[i]['district_name'] });
        }
      }

      distNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.districtsNames = distNames;

      if (this.params.level === 'district') {
        this.distSelect({ type: 'click' }, this.myDistrict);
      } else {
        this.getBlocks();
      }
    }, err => {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    });
  }

  getBlocks(): void {
    this.month_year['id'] = this.myDistrict;
    this.service.blockPerDist({ ...this.month_year, ...this.timePeriod }).subscribe(res => {
      let blockData = res['blockData'];
      var uniqueData = blockData.reduce(function (previous, current) {
        var object = previous.filter(object => object['block_id'] === current['block_id']);
        if (object.length == 0) previous.push(current);
        return previous;
      }, []);
      blockData = uniqueData;
      var blokName = [];
      var sorted = blockData.sort((a, b) => (parseInt(a.attendance) > parseInt(b.attendance)) ? 1 : -1)

      this.markers = sorted;

      for (var i = 0; i < this.markers.length; i++) {
        if (this.myBlock === this.markers[i]['block_id']) {
          localStorage.setItem('block', this.markers[i].block_name);
          localStorage.setItem('blockId', this.markers[i].block_id);
        }

        this.blocksIds.push(this.markers[i]['block_id']);
        blokName.push({ id: this.markers[i]['block_id'], name: this.markers[i]['block_name'] });
      }
      blokName.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.blocksNames = blokName;

      if (this.params.level === 'block') {
        this.blockSelect({ type: 'click' }, this.myBlock);
      } else {
        this.getClusters();
      }
    }, err => {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    });
  }

  getClusters(): void {
    this.month_year['id'] = this.myBlock;
    this.service.clusterPerBlock({ ...this.month_year, ...this.timePeriod }).subscribe(res => {
      let clusterData = res['clusterDetails'];
      var uniqueData = clusterData.reduce(function (previous, current) {
        var object = previous.filter(object => object['cluster_id'] === current['cluster_id']);
        if (object.length == 0) previous.push(current);
        return previous;
      }, []);
      clusterData = uniqueData;
      var clustNames = [];

      var sorted = clusterData.sort((a, b) => (parseInt(a.attendance) > parseInt(b.attendance)) ? 1 : -1);
      for (var i = 0; i < sorted.length; i++) {
        if (this.myCluster === sorted[i]['cluster_id']) {
          localStorage.setItem('cluster', sorted[i].cluster_name);
          localStorage.setItem('clusterId', sorted[i].cluster_id);
        }

        this.clusterIds.push(sorted[i]['cluster_id']);
        if (sorted[i]['name'] !== null) {
          clustNames.push({ id: sorted[i]['cluster_id'], name: sorted[i]['cluster_name'], blockId: sorted[i]['block_id'] });
        } else {
          clustNames.push({ id: sorted[i]['cluster_id'], name: 'NO NAME FOUND', blockId: sorted[i]['block_id'] });
        }
      }

      clustNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.clusterNames = clustNames;

      this.clusterSelect({ type: 'click' }, this.myCluster);
    }, err => {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    });
  }

  public fileName: any;
  public reportData: any = [];

  globalId;

  downloadReport(event) {
    if (this.globalId == this.myDistrict) {
      var distData: any = {};
      this.districtData.find(a => {
        if (a.district_id == this.myDistrict) {
          distData = {
            id: a.district_id,
            name: a.district_name,
            lat: a.lat,
            lng: a.lng
          }
        }
      });
      this.getTelemetryData(distData, event.target.id, "district");
    }

    if (this.globalId == this.myBlock) {
      var blokData: any = {};
      this.blockData.find(a => {
        if (a.block_id == this.myBlock) {
          blokData = {
            id: a.block_id,
            name: a.block_name,
            lat: a.lat,
            lng: a.lng
          }
        }
      });
      this.getTelemetryData(blokData, event.target.id, "block");
    }
    if (this.globalId == this.myCluster) {
      var clustData: any = {};
      this.clusterData.find(a => {
        if (a.cluster_id == this.myCluster) {
          clustData = {
            id: a.cluster_id,
            name: a.cluster_name,
            lat: a.lat,
            lng: a.lng
          }
        }
      });
      this.getTelemetryData(clustData, event.target.id, "cluster");
    }

    var myReport = [];
    this.reportData.forEach(element => {
      if (this.levelWise != 'school') {
        if (element.number_of_schools) {
          element.number_of_schools = (element.number_of_schools.replace(/\,/g, ''));
        }
      }
      if (element.number_of_students) {
        element.number_of_students = (element.number_of_students.replace(/\,/g, ''));
      }
      var data = {};
      var downloadable_data = {};
      Object.keys(element).forEach(key => {
        if (key !== "lat") {
          data[key] = element[key];
        }
      });
      Object.keys(data).forEach(key => {
        if (key !== "lng") {
          downloadable_data[key] = data[key];
        }
      });
      myReport.push(downloadable_data);
    });
    this.commonService.download(this.fileName, myReport);
  }

  public month_year;
  getMonth(event) {
    var month = this.getMonthYear[`${this.year}`].find(a => a.month === this.month);
    // this.dateRange = `${month.data_from_date} to ${month.data_upto_date}`;
    this.month_year = {
      month: this.month,
      year: this.year
    };
    this.onResize(event);
    }

  levelWiseFilter() {
    if (this.skul) {
      if (this.levelWise === "District") {
        this.districtWise();
      }
      if (this.levelWise === "Block") {
        this.blockWise(event);
      }
      if (this.levelWise === "Cluster") {
        this.clusterWise(event);
      }
      if (this.levelWise === "school") {
        this.schoolWise(event);
      }
    } else {
      if (this.dist && this.myDistrict !== null) {
        this.myDistData(this.myDistrict);
      }
      if (this.blok && this.myBlock !== undefined) {
        this.myBlockData(this.myBlock);
      }
      if (this.clust && this.myCluster !== null) {
        this.myClusterData(this.myCluster);
      }
    }
    this.setZoomLevel(this.lat, this.lng, globalMap, this.commonService.zoomLevel);
  }

  getYear() {
    this.months = [];
    this.month = undefined;
    var allMonths = [];
    allMonths = this.getMonthYear[`${this.year}`];
    allMonths.forEach(month => {
      var obj = {
        name: month.month_name,
        id: month.month
      }
      this.months.push(obj);
    });
    // this.element.disabled = false;
  }

  public myData;
  districtData = [];

  onClickHome() {
    this.yearMonth = true;
    this.academicYear = undefined;
    this.period = 'overall';
    this.levelWise = "District";
    this.month_year = {
      month: null,
      year: null
    };
    this.timePeriod = {
      period: this.period
    }
    this.districtWise();
    document.getElementById('home').style.display = 'none';
  }

  async districtWise() {
    this.commonAtStateLevel();
    this.levelWise = "District";
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      if (this.month_year.month) {
        this.fileName = `${this.reportName}_allDistricts_${month.name.trim()}_${this.year}_${this.commonService.dateAndTime}`;
      } else {
        this.fileName = `${this.reportName}_allDistricts_${this.period}_${this.commonService.dateAndTime}`;
      }
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.dist_wise_data({ ...this.month_year, ...this.timePeriod }).subscribe(res => {
        this.reportData = this.districtData = this.mylatlngData = res['distData'];
        this.dateRange = res['dateRange'];
        var sorted = this.mylatlngData.sort((a, b) => (a.attendance > b.attendance) ? 1 : -1);

        var distNames = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        this.markers = sorted;
        let colors = this.commonService.getRelativeColors(sorted, { value: 'attendance', report: 'reports' });
        if (this.markers.length > 0) {
          for (var i = 0; i < this.markers.length; i++) {
            var color = this.commonService.color(this.markers[i], 'attendance');
            this.districtsIds.push(this.markers[i]['district_id']);
            distNames.push({ id: this.markers[i]['district_id'], name: this.markers[i]['district_name'] });
            var markerIcon = this.commonService.initMarkers(this.markers[i].lat, this.markers[i].lng, this.selected == 'absolute' ? color : this.commonService.relativeColorGredient(sorted[i], { value: 'attendance', report: 'reports' }, colors), this.getMarkerRadius(14, 10, 8, 5), 0.01, 1, this.levelWise);
            this.generateToolTip(markerIcon, this.markers[i], this.onClick_Marker, this.layerMarkers, this.levelWise);
          }
        }

        distNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.districtsNames = distNames;

        this.commonService.restrictZoom(globalMap);
        globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
        this.setZoomLevel(this.lat, this.lng, globalMap, this.commonService.zoomLevel);
        this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.commonService.loaderAndErr(this.markers);
        this.changeDetection.markForCheck();
      }, err => {
        this.dateRange = ''; this.changeDetection.detectChanges();
        this.districtsNames = [];
        this.markers = [];
        this.commonService.loaderAndErr(this.markers);
      });
    } else {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    }
    globalMap.addLayer(this.layerMarkers);
  }

  blockWise(event) {
    this.commonAtStateLevel();
    this.levelWise = "Block";
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      if (this.month_year.month) {
        this.fileName = `${this.reportName}_allBlocks_${month.name.trim()}_${this.year}_${this.commonService.dateAndTime}`;
      } else {
        this.fileName = `${this.reportName}_allBlocks_${this.period}_${this.commonService.dateAndTime}`;
      }

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.block_wise_data({ ...this.month_year, ...this.timePeriod }).subscribe(res => {
        this.reportData = this.mylatlngData = res['blockData'];
        this.dateRange = res['dateRange'];
        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.attendance) > parseInt(b.attendance)) ? 1 : -1);

        var blockNames = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        this.markers = sorted;
        let colors = this.commonService.getRelativeColors(sorted, { value: 'attendance', report: 'reports' });
        if (this.markers.length !== 0) {
          for (let i = 0; i < this.markers.length; i++) {
            var color = this.commonService.color(this.markers[i], 'attendance');
            this.blocksIds.push(this.markers[i]['block_id']);
            blockNames.push({ id: this.markers[i]['block_id'], name: this.markers[i]['block_name'], distId: this.markers[i]['dist'] });
            var markerIcon = this.commonService.initMarkers(this.markers[i].lat, this.markers[i].lng, this.selected == 'absolute' ? color : this.commonService.relativeColorGredient(sorted[i], { value: 'attendance', report: 'reports' }, colors), this.getMarkerRadius(12, 8, 6, 3.5), 0.01, 1, this.levelWise);
            this.generateToolTip(markerIcon, this.markers[i], this.onClick_Marker, this.layerMarkers, this.levelWise);
          }
          blockNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.blocksNames = blockNames;

          this.commonService.restrictZoom(globalMap);
          globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
          this.setZoomLevel(this.lat, this.lng, globalMap, this.commonService.zoomLevel);
          this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.commonService.loaderAndErr(this.markers);
          this.changeDetection.markForCheck();
        }
      }, err => {
        this.dateRange = ''; this.changeDetection.detectChanges();
        this.markers = [];
        this.commonService.loaderAndErr(this.markers);
      });
    } else {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    }
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
    ;
  }

  clusterWise(event) {
    this.commonAtStateLevel();
    this.levelWise = "Cluster";
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      if (this.month_year.month) {
        this.fileName = `${this.reportName}_allClusters_${month.name.trim()}_${this.year}_${this.commonService.dateAndTime}`;
      } else {
        this.fileName = `${this.reportName}_allClusters_${this.period}_${this.commonService.dateAndTime}`;
      }

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.cluster_wise_data({ ...this.month_year, ...this.timePeriod }).subscribe(res => {
        this.reportData = this.mylatlngData = res['clusterData'];
        this.dateRange = res['dateRange'];
        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.attendance) > parseInt(b.attendance)) ? 1 : -1)

        var clustNames = [];
        var blockNames = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];


        this.markers = sorted;
        let colors = this.commonService.getRelativeColors(sorted, { value: 'attendance', report: 'reports' });
        if (this.markers.length !== 0) {
          for (let i = 0; i < this.markers.length; i++) {
            var color = this.commonService.color(this.markers[i], 'attendance');
            this.clusterIds.push(this.markers[i]['cluster_id']);
            this.blocksIds.push(this.markers[i]['block_id']);
            if (this.markers[i]['cluster_name'] !== null) {
              clustNames.push({ id: this.markers[i]['cluster_id'], name: this.markers[i]['cluster_name'], blockId: this.markers[i]['block_id'] });
            } else {
              clustNames.push({ id: this.markers[i]['cluster_id'], name: 'NO NAME FOUND', blockId: this.markers[i]['block_id'] });
            }
            blockNames.push({ id: this.markers[i]['block_id'], name: this.markers[i]['block_name'], distId: this.markers[i]['district_id'] });
            var markerIcon = this.commonService.initMarkers(this.markers[i].lat, this.markers[i].lng, this.selected == 'absolute' ? color : this.commonService.relativeColorGredient(sorted[i], { value: 'attendance', report: 'reports' }, colors), this.getMarkerRadius(2.5, 2, 1.5, 1), 0.01, 0.5, this.levelWise);
            this.generateToolTip(markerIcon, this.markers[i], this.onClick_Marker, this.layerMarkers, this.levelWise);
          }

          clustNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.clusterNames = clustNames;
          blockNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.blocksNames = blockNames;

          this.commonService.restrictZoom(globalMap);
          globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
          this.setZoomLevel(this.lat, this.lng, globalMap, this.commonService.zoomLevel);
          this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.commonService.loaderAndErr(this.markers);
          this.changeDetection.markForCheck();
        }
      }, err => {
        this.dateRange = ''; this.changeDetection.detectChanges();
        this.markers = [];
        this.commonService.loaderAndErr(this.markers);
      });
    } else {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    }
    globalMap.addLayer(this.markersList);
    document.getElementById('home').style.display = 'block';
    ;
    this.cluster = [];
  }

  schoolWise(event) {
    this.commonAtStateLevel();
    this.levelWise = "school";
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      if (this.month_year.month) {
        this.fileName = `${this.reportName}_allSchools_${month.name.trim()}_${this.year}_${this.commonService.dateAndTime}`;
      } else {
        this.fileName = `${this.reportName}_allSchools_${this.period}_${this.commonService.dateAndTime}`;
      }

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.school_wise_data({ ...this.month_year, ...this.timePeriod }).subscribe(res => {
        this.reportData = this.mylatlngData = res['schoolData'];
        this.dateRange = res['dateRange'];
        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.attendance) > parseInt(b.attendance)) ? 1 : -1)

        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        this.markers = sorted;
        let colors = this.commonService.getRelativeColors(sorted, { value: 'attendance', report: 'reports' });
        if (this.markers.length !== 0) {
          for (let i = 0; i < this.markers.length; i++) {
            var color = this.commonService.color(this.markers[i], 'attendance');
            this.districtsIds.push(sorted[i]['district_id']);
            var markerIcon = this.commonService.initMarkers(this.markers[i].lat, this.markers[i].lng, this.selected == 'absolute' ? color : this.commonService.relativeColorGredient(sorted[i], { value: 'attendance', report: 'reports' }, colors), this.getMarkerRadius(1.5, 1.2, 1, 0), 0, 0.3, this.levelWise);
            this.generateToolTip(markerIcon, this.markers[i], this.onClick_Marker, this.layerMarkers, this.levelWise);
          }

          globalMap.doubleClickZoom.enable();
          globalMap.scrollWheelZoom.enable();
          globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
          this.setZoomLevel(this.lat, this.lng, globalMap, this.commonService.zoomLevel);
          this.schoolCount = (this.markers.length).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.commonService.loaderAndErr(this.markers);
          this.changeDetection.markForCheck();
        }
      }, err => {
        this.dateRange = ''; this.changeDetection.detectChanges();
        this.markers = [];
        this.commonService.loaderAndErr(this.markers);
      });
    } else {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    }
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  commonAtStateLevel() {
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.reportData = [];
    this.markers = [];
    this.studentCount = 0;
    this.schoolCount = 0;
    this.blockHidden = true;
    this.clusterHidden = true;
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.skul = true;
    this.hierName = '';
    this.distName = '';
    this.blockName = '';
    this.title = '';
    this.titleName = '';
    this.clustName = '';
    this.lat = this.commonService.mapCenterLatlng.lat;
    this.lng = this.commonService.mapCenterLatlng.lng;
    globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
    this.markerData = {};
    this.myDistrict = null;
  }


  clickedMarker(event, label) {
    var level;
    var obj = {};
    if (this.districtsIds.includes(label.district_id)) {
      level = "district";
      localStorage.setItem('dist', label.district_name);
      localStorage.setItem('distId', label.district_id);
      this.myDistData(label.district_id);
      if (event.latlng) {
        obj = {
          id: label.district_id,
          name: label.district_name,
          lat: event.latlng.lat,
          lng: event.latlng.lng
        }
      }
    }

    if (this.blocksIds.includes(label.block_id)) {
      level = "block";
      if (this.skul) {
        localStorage.setItem('dist', label.district_name);
        localStorage.setItem('distId', label.district_id);
      } else {
        localStorage.setItem('dist', localStorage.getItem('dist'));
        localStorage.setItem('distId', localStorage.getItem('distId'));
      }
      localStorage.setItem('block', label.block_name);
      localStorage.setItem('blockId', label.block_id);
      this.myBlockData(label.block_id);

      if (event.latlng) {
        obj = {
          id: label.block_id,
          name: label.block_name,
          lat: event.latlng.lat,
          lng: event.latlng.lng
        }
      }
    }

    if (this.clusterIds.includes(label.cluster_id)) {
      level = "cluster";
      localStorage.setItem('dist', label.district_name);
      localStorage.setItem('distId', label.district_id);
      localStorage.setItem('block', label.block_name);
      localStorage.setItem('blockId', label.block_id);
      localStorage.setItem('cluster', label.cluster_name);
      localStorage.setItem('clusterId', label.cluster_id);

      this.myClusterData(label.cluster_id);
      if (event.latlng) {
        obj = {
          id: label.cluster_id,
          name: label.cluster_name,
          lat: event.latlng.lat,
          lng: event.latlng.lng
        }
      }
    }
    this.getTelemetryData(obj, event.type, level);
  }

  //Showing tooltips on markers on mouse hover...
  onMouseOver(m, infowindow) {
    m.lastOpen = infowindow;
    m.lastOpen.open();
  }

  //Hide tooltips on markers on mouse hover...
  hideInfo(m) {
    if (m.lastOpen != null) {
      m.lastOpen.close();
    }
  }

  onClickSchool(event) {
    this.levelWise = 'school';
    if (event.latlng) {
      var obj = {
        id: event.target.myJsonData.school_id,
        name: event.target.myJsonData.school_name,
        lat: event.target.myJsonData.lat,
        lng: event.target.myJsonData.lng
      }
      this.getTelemetryData(obj, event.type, this.levelWise);
    }
  }

  onClick_Marker(event) {
    var marker = event.target;
    this.markerData = marker.myJsonData;
    this.clickedMarker(event, marker.myJsonData);
  }

  distSelect(event, data) {
    var distData: any = {};
    this.districtData.find(a => {
      if (a.district_id == data) {
        distData = {
          id: a.district_id,
          name: a.district_name,
          lat: a.lat,
          lng: a.lng
        }
      }
    });
    this.getTelemetryData(distData, event.type, "district");
    this.myDistData(data);
  }

  blockData = [];
  myDistData(data) {
    this.levelWise = "Block";
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.markers = [];
    this.reportData = [];
    this.commonService.errMsg();
    this.studentCount = 0;
    this.schoolCount = 0;
    this.markerData = null;

    this.dist = true;
    this.blok = false;
    this.clust = false;
    this.skul = false;
    this.blockHidden = false;
    this.clusterHidden = true;
    let obj = this.districtsNames.find(o => o.id == data);
    this.hierName = '';
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      if (this.month_year.month) {
        this.fileName = `${this.reportName}_${this.levelWise}s_of_district_${data}_${month.name.trim()}_${this.year}_${this.commonService.dateAndTime}`;
      } else {
        this.fileName = `${this.reportName}_${this.levelWise}s_of_district_${data}_${this.period}_${this.commonService.dateAndTime}`;
      }
      this.distName = { district_id: data, district_name: obj.name };
      this.hierName = obj.name;
      localStorage.setItem('dist', obj.name);
      localStorage.setItem('distId', data);

      this.globalId = this.myDistrict = data;
      this.myBlock = null;

      this.month_year['id'] = data;

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.blockPerDist({ ...this.month_year, ...this.timePeriod }).subscribe(res => {
        this.reportData = this.blockData = this.mylatlngData = res['blockData'];
        this.dateRange = res['dateRange'];
        var uniqueData = this.mylatlngData.reduce(function (previous, current) {
          var object = previous.filter(object => object['block_id'] === current['block_id']);
          if (object.length == 0) previous.push(current);
          return previous;
        }, []);
        this.mylatlngData = uniqueData;
        this.lat = Number(this.mylatlngData[0]['lat']);
        this.lng = Number(this.mylatlngData[0]['lng']);

        var blokName = [];

        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.attendance) > parseInt(b.attendance)) ? 1 : -1)

        this.markers = sorted;
        let colors = this.commonService.getRelativeColors(sorted, { value: 'attendance', report: 'reports' });
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        for (var i = 0; i < this.markers.length; i++) {
          var color = this.commonService.color(this.markers[i], 'attendance');
          this.blocksIds.push(this.markers[i]['block_id']);
          blokName.push({ id: this.markers[i]['block_id'], name: this.markers[i]['block_name'] })
          var markerIcon = this.commonService.initMarkers(this.markers[i].lat, this.markers[i].lng, this.selected == 'absolute' ? color : this.commonService.relativeColorGredient(sorted[i], { value: 'attendance', report: 'reports' }, colors), this.getMarkerRadius(14, 10, 8, 4), 0.01, 1, this.levelWise);
          this.generateToolTip(markerIcon, this.markers[i], this.onClick_Marker, this.layerMarkers, this.levelWise);
        }
        blokName.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.blocksNames = blokName;

        this.commonService.restrictZoom(globalMap);
        globalMap.setMaxBounds([[this.lat - 1.5, this.lng - 3], [this.lat + 1.5, this.lng + 2]]);
        this.setZoomLevel(this.lat, this.lng, globalMap, this.commonService.zoomLevel + 1);
        this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.commonService.loaderAndErr(this.markers);
        this.changeDetection.markForCheck();
      }, err => {
        this.dateRange = ''; this.changeDetection.detectChanges();
        this.markers = [];
        this.commonService.loaderAndErr(this.markers);
      });
    } else {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    }
    document.getElementById('home').style.display = 'block';
    globalMap.addLayer(this.layerMarkers);
  }

  blockSelect(event, data) {
    var blokData: any = {};
    this.blockData.find(a => {
      if (a.block_id == data) {
        blokData = {
          id: a.block_id,
          name: a.block_name,
          lat: a.lat,
          lng: a.lng
        }
      }
    });
    this.getTelemetryData(blokData, event.type, "block");
    this.myBlockData(data);
  }

  clusterData = [];
  myBlockData(data) {
    this.levelWise = "Cluster";
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.markers = [];
    this.reportData = [];
    this.commonService.errMsg();
    this.markerData = null;

    this.dist = false;
    this.blok = true;
    this.clust = false;
    this.skul = false;
    this.clusterHidden = false;
    this.blockHidden = false;
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      if (this.month_year.month) {
        this.fileName = `${this.reportName}_${this.levelWise}s_of_block_${data}_${month.name.trim()}_${this.year}_${this.commonService.dateAndTime}`;
      } else {
        this.fileName = `${this.reportName}_${this.levelWise}s_of_block_${data}_${this.period}_${this.commonService.dateAndTime}`;
      }
      var blockNames = [];
      this.blocksNames.forEach(item => {
        if (item.distId && item.distId === Number(localStorage.getItem('distId'))) {
          blockNames.push(item);
        }
      });

      if (blockNames.length > 1) {
        this.blocksNames = blockNames;
      }
      let obj = this.blocksNames.find(o => o.id == data);
      localStorage.setItem('block', obj.name);
      localStorage.setItem('blockId', data);
      this.titleName = localStorage.getItem('dist');
      this.distName = { district_id: Number(localStorage.getItem('distId')), district_name: this.titleName };
      this.blockName = { block_id: data, block_name: obj.name };
      this.hierName = obj.name;

      this.globalId = this.myBlock = data;
      this.myDistrict = Number(localStorage.getItem('distId'));
      this.myCluster = null;

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.month_year['id'] = data;
      this.myData = this.service.clusterPerBlock({ ...this.month_year, ...this.timePeriod }).subscribe(res => {
        this.reportData = this.clusterData = this.mylatlngData = res['clusterDetails'];
        this.dateRange = res['dateRange'];
        var uniqueData = this.mylatlngData.reduce(function (previous, current) {
          var object = previous.filter(object => object['cluster_id'] === current['cluster_id']);
          if (object.length == 0) previous.push(current);
          return previous;
        }, []);
        this.mylatlngData = uniqueData;
        this.lat = Number(this.mylatlngData[0]['lat']);
        this.lng = Number(this.mylatlngData[0]['lng']);
        var clustNames = [];

        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.attendance) > parseInt(b.attendance)) ? 1 : -1)

        this.markers = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];
        // sorted.pop();
        this.markers = sorted;
        let colors = this.commonService.getRelativeColors(sorted, { value: 'attendance', report: 'reports' });
        for (var i = 0; i < sorted.length; i++) {
          var color = this.commonService.color(this.markers[i], 'attendance');
          this.clusterIds.push(sorted[i]['cluster_id']);
          if (sorted[i]['name'] !== null) {
            clustNames.push({ id: sorted[i]['cluster_id'], name: sorted[i]['cluster_name'], blockId: sorted[i]['block_id'] });
          } else {
            clustNames.push({ id: sorted[i]['cluster_id'], name: 'NO NAME FOUND', blockId: sorted[i]['block_id'] });
          }
          var markerIcon = this.commonService.initMarkers(this.markers[i].lat, this.markers[i].lng, this.selected == 'absolute' ? color : this.commonService.relativeColorGredient(sorted[i], { value: 'attendance', report: 'reports' }, colors), this.getMarkerRadius(14, 10, 8, 4), 0.01, 1, this.levelWise);
          this.generateToolTip(markerIcon, this.markers[i], this.onClick_Marker, this.layerMarkers, this.levelWise);
        }

        clustNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.clusterNames = clustNames;

        this.commonService.restrictZoom(globalMap);
        globalMap.setMaxBounds([[this.lat - 1.5, this.lng - 3], [this.lat + 1.5, this.lng + 2]]);
        this.setZoomLevel(this.lat, this.lng, globalMap, this.commonService.zoomLevel + 3)
        this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.commonService.loaderAndErr(this.markers);
        this.changeDetection.markForCheck();
      }, err => {
        this.dateRange = ''; this.changeDetection.detectChanges();
        this.markers = [];
        this.commonService.loaderAndErr(this.markers);
      });
    } else {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    }
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }


  clusterSelect(event, data) {
    var clustData: any = {};
    this.clusterData.find(a => {
      if (a.cluster_id == data) {
        clustData = {
          id: a.cluster_id,
          name: a.cluster_name,
          lat: a.lat,
          lng: a.lng
        }
      }
    });
    this.getTelemetryData(clustData, event.type, "cluster");
    this.myClusterData(data);
  }
  myClusterData(data) {
    this.levelWise = "school";
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.markers = [];
    this.reportData = [];
    this.commonService.errMsg();
    this.studentCount = 0;
    this.schoolCount = 0;
    this.markerData = null;

    this.dist = false;
    this.blok = false;
    this.clust = true;
    this.skul = false;

    this.clusterHidden = false;
    this.blockHidden = false;
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      if (this.month_year.month) {
        this.fileName = `${this.reportName}_${this.levelWise}s_of_cluster_${data}_${month.name.trim()}_${this.year}_${this.commonService.dateAndTime}`;
      } else {
        this.fileName = `${this.reportName}_${this.levelWise}s_of_cluster_${data}_${this.period}_${this.commonService.dateAndTime}`;
      }

      let obj = this.clusterNames.find(o => o.id == data);
      var blockNames = [];
      this.blocksNames.forEach(item => {
        if (item.distId && item.distId === Number(localStorage.getItem('distId'))) {
          blockNames.push(item);
        }
      });
      var uniqueData
      if (blockNames.length > 1) {
        uniqueData = blockNames.reduce(function (previous, current) {
          var object = previous.filter(object => object['id'] === current['id']);
          if (object.length == 0) previous.push(current);
          return previous;
        }, []);
        this.blocksNames = uniqueData;
      }

      var clustName = [];
      this.clusterNames.forEach(item => {
        if (item.blockId && item.blockId === Number(localStorage.getItem('blockId'))) {
          clustName.push(item);
        }
      });

      if (clustName.length > 1) {
        uniqueData = clustName.reduce(function (previous, current) {
          var object = previous.filter(object => object['id'] === current['id']);
          if (object.length == 0) previous.push(current);
          return previous;
        }, []);
        this.clusterNames = uniqueData;
      }

      this.title = localStorage.getItem('block');
      this.titleName = localStorage.getItem('dist');
      var blockId = Number(localStorage.getItem('blockId'));
      this.distName = { district_id: Number(localStorage.getItem('distId')), district_name: this.titleName };
      this.blockName = { block_id: blockId, block_name: this.title, district_id: this.distName.id, district_name: this.distName.name }
      this.clustName = { cluster_id: data };
      this.hierName = obj.name;

      this.globalId = this.myCluster = data;
      // this.myBlock = this.myBlock;
      this.myDistrict = Number(localStorage.getItem('distId'));

      if (this.myData) {
        this.myData.unsubscribe();
      }

      this.month_year['id'] = data;
      this.myData = this.service.schoolsPerCluster({ ...this.month_year, ...this.timePeriod }).subscribe(res => {
        this.reportData = this.mylatlngData = res['schoolsDetails'];
        this.dateRange = res['dateRange'];
        var uniqueData = this.mylatlngData.reduce(function (previous, current) {
          var object = previous.filter(object => object['school_id'] === current['school_id']);
          if (object.length == 0) previous.push(current);
          return previous;
        }, []);
        this.mylatlngData = uniqueData;
        this.lat = Number(this.mylatlngData[0]['lat']);
        this.lng = Number(this.mylatlngData[0]['lng']);

        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.attendance) > parseInt(b.attendance)) ? 1 : -1)

        this.markers = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        this.markers = sorted;
        let colors = this.commonService.getRelativeColors(sorted, { value: 'attendance', report: 'reports' });
        for (var i = 0; i < sorted.length; i++) {
          var color = this.commonService.color(this.markers[i], 'attendance');
          var markerIcon = this.commonService.initMarkers(this.markers[i].lat, this.markers[i].lng, this.selected == 'absolute' ? color : this.commonService.relativeColorGredient(sorted[i], { value: 'attendance', report: 'reports' }, colors), this.getMarkerRadius(14, 10, 8, 4), 0.1, 1, this.levelWise);
          this.generateToolTip(markerIcon, this.markers[i], this.onClick_Marker, this.layerMarkers, this.levelWise);
        }
        globalMap.doubleClickZoom.enable();
        globalMap.scrollWheelZoom.enable();
        globalMap.setMaxBounds([[this.lat - 1.5, this.lng - 3], [this.lat + 1.5, this.lng + 2]]);
        this.setZoomLevel(this.lat, this.lng, globalMap, this.commonService.zoomLevel + 5);
        this.schoolCount = (this.markers.length).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.commonService.loaderAndErr(this.markers);
        this.changeDetection.markForCheck();
      }, err => {
        this.dateRange = ''; this.changeDetection.detectChanges();
        this.markers = [];
        this.commonService.loaderAndErr(this.markers);
      });
    } else {
      this.markers = [];
      this.commonService.loaderAndErr(this.markers);
    }
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  popups(markerIcon, markers, onClick_Marker, layerMarkers, levelWise) {
    markerIcon.on('mouseover', function (e) {
      this.openPopup();
    });
    markerIcon.on('mouseout', function (e) {
      this.closePopup();
    });

    layerMarkers.addLayer(markerIcon);
    if (levelWise != "school") {
      markerIcon.on('click', onClick_Marker, this);
    } else {
      markerIcon.on('click', this.onClickSchool, this);
    }
    markerIcon.myJsonData = markers;
  }

  //Generate dynamic tool-tip
  generateToolTip(markerIcon, markers, onClick_Marker, layerMarkers, levelWise) {
    this.popups(markerIcon, markers, onClick_Marker, layerMarkers, levelWise);
    var details = {};
    var orgObject = {};
    Object.keys(markers).forEach(key => {
      if (key !== "lat") {
        details[key] = markers[key];
      }
    });
    Object.keys(details).forEach(key => {
      if (key !== "lng") {
        orgObject[key] = details[key];
      }
    });

    var yourData = this.commonService.getInfoFrom(orgObject, "attendance", levelWise, "std-attd", undefined, undefined).join(" <br>");
    const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
      yourData);
    markerIcon.addTo(globalMap).bindPopup(popup);
  }


  getTelemetryData(data, event, level) {
    this.service.telemetryData = [];
    var obj = {};
    if (data.id != undefined) {
      if (event == 'download') {
        obj = {
          pageId: "student_attendance",
          uid: this.keyCloakSevice.kc.tokenParsed.sub,
          event: event,
          level: level,
          locationid: data.id,
          locationname: data.name,
          lat: data.lat,
          lng: data.lng,
          download: 1
        }
        this.service.telemetryData.push(obj);
      } else {
        obj = {
          pageId: "student_attendance",
          uid: this.keyCloakSevice.kc.tokenParsed.sub,
          event: event,
          level: level,
          locationid: data.id,
          locationname: data.name,
          lat: data.lat,
          lng: data.lng,
          download: 0
        }
        this.service.telemetryData.push(obj);
      }

      this.edate = new Date();
      var dateObj = {
        year: this.edate.getFullYear(),
        month: ("0" + (this.edate.getMonth() + 1)).slice(-2),
        date: ("0" + (this.edate.getDate())).slice(-2),
        hour: ("0" + (this.edate.getHours())).slice(-2),
      }
      this.service.telemetrySar(dateObj).subscribe(res => {
      }, err => {
        this.dateRange = ''; this.changeDetection.detectChanges();
        console.log(err);
      });
    }
  }

  goToHealthCard(): void {
    let data: any = {};

    if (this.levelWise === 'Block') {
      data.level = 'district';
      data.value = this.myDistrict;
    } else if (this.levelWise === 'Cluster') {
      data.level = 'block';
      data.value = this.myBlock;
    } else if (this.levelWise === 'school') {
      data.level = 'cluster';
      data.value = this.myCluster;
    } else {
      data.level = 'state';
      data.value = null
    }
    data['timePeriod'] = this.period;

    sessionStorage.setItem('health-card-info', JSON.stringify(data));
    this._router.navigate(['/healthCard']);
  }

  downloadRaw() {
    document.getElementById('spinner').style.display = 'block';
    var selectedAcademicYear = this.academicYear;
    this.rawFileName = `attendance/raw/student_attendance_all_${this.levelWise.toLowerCase()}s_${selectedAcademicYear}.csv`;
    this.academicYear = undefined;
    this.service.downloadFile({ fileName: this.rawFileName }).subscribe(res => {
      this.academicYear = undefined;
      document.getElementById('spinner').style.display = 'none';
      window.open(`${res['downloadUrl']}`, "_blank");
    }, err => {
      alert("No Raw Data File Available in Bucket");
    })
  }

  public legendColors: any = ["#ff0000", "#f50a00", "#e81700", "#db2400", "#ce3100", "#c13e00", "#b44b00", "#a75800", "#9b6400", "#8e7100", "#817e00", "#748b00", "#679800", "#5aa500", "#4db200", "#40bf00", "#34cb00", "#27d800", "#1ae500", "#00ff00"];
  public values = ['0-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '61-65', '66-70', '71-75', '76-80', '81-85', '86-90', '91-95', '96-100']

}
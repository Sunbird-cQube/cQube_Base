import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExceptionReportService } from '../../../services/exception-report.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { AppServiceComponent, globalMap } from '../../../app.service';

@Component({
  selector: 'app-semester-exception',
  templateUrl: './semester-exception.component.html',
  styleUrls: ['./semester-exception.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SemesterExceptionComponent implements OnInit {
  public title: string = '';
  public titleName: string = '';
  public colors: any;

  // to assign the count of below values to show in the UI footer
  public studentCount: any;
  public schoolCount: any;
  public dateRange: any = '';

  // to hide and show the hierarchy details
  public skul: boolean = true;
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;

  // to hide the blocks and cluster dropdowns
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;

  // to set the hierarchy names
  public districtHierarchy: any = '';
  public blockHierarchy: any = '';
  public clusterHierarchy: any = '';

  // leaflet layer dependencies
  public layerMarkers = new L.layerGroup();
  public markersList = new L.FeatureGroup();

  // assigning the data to each of these to show in dropdowns and maps
  // for dropdowns
  public data: any;
  public markers: any = [];
  // for maps
  public districtMarkers: any = [];
  public blockMarkers: any = [];
  public clusterMarkers: any = [];
  public schoolMarkers: any = [];

  // to show and hide the dropdowns based on the selection of buttons
  public stateLevel: any = 0; // 0 for buttons and 1 for dropdowns

  // to download the excel report
  public fileName: any;
  public reportData: any = [];

  // variables
  public districtId: any = '';
  public blockId: any = '';
  public clusterId: any = '';

  public levelWise = 'district';

  public myData;
  state: string;
  // initial center position for the map
  public lat: any;
  public lng: any;

  timeRange = [{ key: 'overall', value: "Overall" }, { key: 'last_30_days', value: "Last 30 Days" }, { key: 'last_7_days', value: "Last 7 Days" }];
  period = 'overall';
  allGrades: any;
  grade = 'all';
  allSubjects: string[];
  subject = '';
  semesters: any = [];
  semester;

  reportName = 'semester_assessment_test_exception';
  managementName;
  management;
  category;

  constructor(
    public http: HttpClient,
    public service: ExceptionReportService,
    public commonService: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
  ) {
  }

  width = window.innerWidth;
  heigth = window.innerHeight;
  onResize() {
    this.width = window.innerWidth;
    this.heigth = window.innerHeight;
    this.commonService.zoomLevel = this.width > 3820 ? this.commonService.mapCenterLatlng.zoomLevel + 2 : this.width < 3820 && this.width >= 2500 ? this.commonService.mapCenterLatlng.zoomLevel + 1 : this.width < 2500 && this.width > 1920 ? this.commonService.mapCenterLatlng.zoomLevel + 1 : this.commonService.mapCenterLatlng.zoomLevel;
    this.changeDetection.detectChanges();
    this.levelWiseFilter();
  }
  setZoomLevel(lat, lng, globalMap, zoomLevel) {
    if (lat !== undefined && lng !== undefined)
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
    this.commonService.initMap('patExceMap', [[this.lat, this.lng]]);
    this.managementName = this.management = JSON.parse(localStorage.getItem('management')).id;
    this.category = JSON.parse(localStorage.getItem('category')).id;
    this.managementName = this.commonService.changeingStringCases(
      this.managementName.replace(/_/g, " ")
    );
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('spinner').style.display = 'none';
    this.fileName = `${this.reportName}_${this.period}_${this.grade != 'all' ? this.grade : 'allGrades'}_${this.subject ? this.subject : ''}_allDistricts_${this.commonService.dateAndTime}`;
    this.getSemesters();
  }

  onPeriodSelect() {
    this.onResize();
    this.getSemesters();
  }

  getSemesters() {
    this.service.semExceptionMetaData({ period: this.period }).subscribe((res) => {
      this.semesters = res["data"];
      if (this.semesters.length > 0 && !this.semester)
        this.semester = this.semesters[this.semesters.length - 1].id;
      this.onResize();
    }, err => {
      this.semesters = [];
      this.commonService.loaderAndErr(this.semesters);
    });
  }


  semSelect() {
    this.onResize();
  }

  onGradeSelect(data) {
    this.fileName = `${this.reportName}_${this.period}_${this.grade}_${this.subject ? this.subject : ''}_all_${this.commonService.dateAndTime}`;
    this.grade = data;
    this.subject = '';
    this.onResize();
  }

  levelWiseFilter() {
    if (this.skul) {
      if (this.levelWise === "district") {
        this.districtWise();
      }
      if (this.levelWise === "block") {
        this.blockWise();
      }
      if (this.levelWise === "cluster") {
        this.clusterWise();
      }
      if (this.levelWise === "school") {
        this.schoolWise();
      }
    } else {
      if (this.dist && this.districtId !== undefined) {
        this.onDistrictSelect(this.districtId);
      }
      if (this.blok && this.blockId !== undefined) {
        this.onBlockSelect(this.blockId);
      }
      if (this.clust && this.clusterId !== undefined) {
        this.onClusterSelect(this.clusterId);
      }
    }
    this.changeDetection.detectChanges();
  }

  homeClick() {
    this.fileName = `${this.reportName}_${this.period}_${this.grade != 'all' ? this.grade : 'allGrades'}_${this.subject ? this.subject : ''}_allDistricts_${this.commonService.dateAndTime}`;
    this.grade = 'all';
    this.period = 'overall';
    this.levelWise = "district";
    this.blok = true;
    this.subject = '';
    this.districtWise();
  }

  // to load all the districts for state data on the map
  districtWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.districtId = undefined;
      this.commonService.errMsg();
      this.reportData = [];
      this.schoolCount = '';

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      this.service.gradeMetaData({ period: this.period, report: 'sat_exception' }).subscribe(res => {
        if (res['data']['district']) {
          this.allGrades = res['data']['district'];
          this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));
          this.allGrades = [{ grade: "all" }, ...this.allGrades.filter(item => item !== { grade: "all" })];
        }
        // api call to get all the districts data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.patExceptionDistWise({ ...{ grade: this.grade, subject: this.subject, timePeriod: this.period, report: 'sat_exception', semester: this.semester }, ...{ management: this.management, category: this.category } }).subscribe(res => {
          this.data = res;
          // to show only in dropdowns
          this.markers = this.districtMarkers = this.data['data'];
          this.allSubjects = [];
          if (this.grade != 'all') {
            this.allSubjects = this.data['subjects'].filter(a => {
              return a != 'grade';
            });
          }
          // options to set for markers in the map
          let options = {
            radius: this.getMarkerRadius(14, 10, 8, 5),
            fillOpacity: 1,
            strokeWeight: 0.01,
            weight: 1,
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: 'district'
          }

          this.commonService.restrictZoom(globalMap);
          globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
          this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
          this.fileName = `${this.reportName}_${this.period}_${this.grade != 'all' ? this.grade : 'allGrades'}_${this.subject ? this.subject : ''}_allBlocks_${this.commonService.dateAndTime}`;
          this.genericFun(this.data, options, this.fileName);

          // sort the districtname alphabetically
          this.districtMarkers.sort((a, b) => (a.district_name > b.district_name) ? 1 : ((b.district_name > a.district_name) ? -1 : 0));
        }, err => {
          this.data = this.districtMarkers = [];
          this.commonService.loaderAndErr(this.data);
        });
      }, error => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
      // adding the markers to the map layers
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'none';

    } catch (e) {
      console.log(e);
    }
  }

  // to load all the blocks for state data on the map
  blockWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "block";
      this.schoolCount = '';

      this.fileName = `${this.reportName}_${this.period}_${this.grade != 'all' ? this.grade : 'allGrades'}_${this.subject ? this.subject : ''}_allBlocks_${this.commonService.dateAndTime}`;

      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      this.service.gradeMetaData({ period: this.period, report: 'sat_exception' }).subscribe(res => {
        if (res['data']['block']) {
          this.allGrades = res['data']['block'];
          this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));
          this.allGrades = [{ grade: "all" }, ...this.allGrades.filter(item => item !== { grade: "all" })];
        }

        // api call to get the all clusters data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.patExceptionBlock({ ...{ grade: this.grade, subject: this.subject, timePeriod: this.period, report: 'sat_exception', semester: this.semester }, ...{ management: this.management, category: this.category } }).subscribe(res => {
          this.data = res
          let options = {
            radius: this.getMarkerRadius(12, 8, 6, 4),
            fillOpacity: 1,
            strokeWeight: 0.01,
            weight: 1,
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: 'block'
          }
          if (this.data['data'].length > 0) {
            let result = this.data['data']
            this.blockMarkers = [];
            // generate color gradient
            let colors = this.commonService.getRelativeColors(result, { value: 'percentage_schools_with_missing_data', report: 'exception' });
            this.colors = colors;
            this.markers = this.blockMarkers = result;
            this.allSubjects = [];
            if (this.grade != 'all') {
              this.allSubjects = this.data['subjects'].filter(a => {
                return a != 'grade';
              });
            }
            this.commonService.restrictZoom(globalMap);
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
            this.genericFun(this.data, options, this.fileName);

            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }, err => {
          this.data = this.districtMarkers = [];
          this.commonService.loaderAndErr(this.data);
        });
      }, error => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  // to load all the clusters for state data on the map
  clusterWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "cluster";
      this.schoolCount = '';

      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.clusterId = undefined;

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;
      this.fileName = `${this.reportName}_${this.period}_${this.grade != 'all' ? this.grade : 'allGrades'}_${this.subject ? this.subject : ''}_allClusters_${this.commonService.dateAndTime}`;

      this.service.gradeMetaData({ period: this.period, report: 'sat_exception' }).subscribe(res => {
        if (res['data']['cluster']) {
          this.allGrades = res['data']['cluster'];
          this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));
          this.allGrades = [{ grade: "all" }, ...this.allGrades.filter(item => item !== { grade: "all" })];
        }

        // api call to get the all clusters data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.patExceptionCluster({ ...{ grade: this.grade, subject: this.subject, timePeriod: this.period, report: 'sat_exception', semester: this.semester }, ...{ management: this.management, category: this.category } }).subscribe(res => {
          this.data = res
          let options = {
            radius: this.getMarkerRadius(2.5, 1.8, 1.5, 1),
            fillOpacity: 1,
            strokeWeight: 0.01,
            weight: 1,
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: 'cluster'
          }
          if (this.data['data'].length > 0) {
            let result = this.data['data'];
            result = result.sort((a, b) => (parseInt(a.percentage_schools_with_missing_data) < parseInt(b.percentage_schools_with_missing_data)) ? 1 : -1)
            this.clusterMarkers = [];
            // generate color gradient
            let colors = this.commonService.getRelativeColors(result, { value: 'percentage_schools_with_missing_data', report: 'exception' });
            this.colors = colors;
            this.markers = this.clusterMarkers = result;
            this.allSubjects = [];
            if (this.grade != 'all') {
              this.allSubjects = this.data['subjects'].filter(a => {
                return a != 'grade';
              });
            }
            this.commonService.restrictZoom(globalMap);
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
            this.genericFun(this.data, options, this.fileName);
            // this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }, err => {
          this.data = this.districtMarkers = [];
          this.commonService.loaderAndErr(this.data);
        });
      }, error => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  // to load all the schools for state data on the map
  schoolWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "school";
      this.schoolCount = '';
      this.fileName = `${this.reportName}_${this.period}_${this.grade != 'all' ? this.grade : 'allGrades'}_${this.subject ? this.subject : ''}_allSchools_${this.commonService.dateAndTime}`;

      this.reportData = [];
      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      this.service.gradeMetaData({ period: this.period, report: 'sat_exception' }).subscribe(res => {
        if (res['data']['school']) {
          this.allGrades = res['data']['school'];
          this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));
          this.allGrades = [{ grade: "all" }, ...this.allGrades.filter(item => item !== { grade: "all" })];
        }

        // api call to get the all schools data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.patExceptionSchool({ ...{ grade: this.grade, subject: this.subject, timePeriod: this.period, report: 'sat_exception', semester: this.semester }, ...{ management: this.management, category: this.category } }).subscribe(res => {
          this.data = res
          let options = {
            radius: this.getMarkerRadius(1.5, 1.2, 1, 0),
            fillOpacity: 1,
            strokeWeight: 0.01,
            weight: 1,
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: 'school'
          }
          this.schoolMarkers = [];
          if (this.data['data'].length > 0) {
            let result = this.data['data']
            result = result.sort((a, b) => (parseInt(a.percentage_schools_with_missing_data) < parseInt(b.percentage_schools_with_missing_data)) ? 1 : -1)
            // generate color gradient
            this.markers = this.schoolMarkers = result;
            this.allSubjects = [];
            if (this.grade != 'all') {
              this.allSubjects = this.data['subjects'].filter(a => {
                return a != 'grade';
              });
            }
            globalMap.doubleClickZoom.enable();
            globalMap.scrollWheelZoom.enable();
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
            this.genericFun(this.data, options, this.fileName);
            // this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
            // }
          }
        }, err => {
          this.data = this.districtMarkers = [];
          this.commonService.loaderAndErr(this.data);
        });
      }, error => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  // to load all the blocks for selected district for state data on the map
  onDistrictSelect(districtId) {
    // to clear the existing data on the map layer  
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.blockId = undefined;
    this.schoolCount = '';
    // to show and hide the dropdowns
    this.blockHidden = false;
    this.clusterHidden = true;
    this.reportData = [];

    // api call to get the blockwise data for selected district
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.patExceptionBlockPerDist(districtId, { ...{ grade: this.grade, subject: this.subject, timePeriod: this.period, report: 'sat_exception', semester: this.semester }, ...{ management: this.management, category: this.category } }).subscribe(res => {
      this.data = res;

      this.markers = this.blockMarkers = this.data['data'];
      this.allSubjects = [];
      if (this.grade != 'all') {
        this.allSubjects = this.data['subjects'].filter(a => {
          return a != 'grade';
        });
      }
      // set hierarchy values
      this.districtHierarchy = {
        distId: this.data['data'][0].district_id,
        districtName: this.data['data'][0].district_name
      }

      this.districtId = districtId;

      // these are for showing the hierarchy names based on selection
      this.skul = false;
      this.dist = true;
      this.blok = false;
      this.clust = false;

      // options to set for markers in the map
      let options = {
        radius: this.getMarkerRadius(14, 10, 8, 4),
        fillOpacity: 1,
        strokeWeight: 0.01,
        weight: 1,
        mapZoom: this.commonService.zoomLevel + 1,
        centerLat: this.data['data'][0].block_latitude,
        centerLng: this.data['data'][0].block_longitude,
        level: 'block'
      }

      this.commonService.restrictZoom(globalMap);
      globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
      this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
      this.fileName = `${this.reportName}_${this.period}_${this.grade != 'all' ? this.grade : 'allGrades'}_${this.subject ? this.subject : ''}_${options.level}s_of_district_${districtId}_${this.commonService.dateAndTime}`;
      this.genericFun(this.data, options, this.fileName);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.block_name > b.block_name) ? 1 : ((b.block_name > a.block_name) ? -1 : 0));
    }, err => {
      this.data = this.blockMarkers = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the clusters for selected block for state data on the map
  onBlockSelect(blockId) {
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.clusterId = undefined;
    this.schoolCount = '';
    // to show and hide the dropdowns
    this.blockHidden = false;
    this.clusterHidden = false;
    this.reportData = [];

    // api call to get the clusterwise data for selected district, block
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.patExceptionClusterPerBlock(this.districtHierarchy.distId, blockId, { ...{ grade: this.grade, subject: this.subject, timePeriod: this.period, report: 'sat_exception', semester: this.semester }, ...{ management: this.management, category: this.category } }).subscribe(res => {
      this.data = res;
      this.markers = this.clusterMarkers = this.data['data'];
      this.allSubjects = [];
      if (this.grade != 'all') {
        this.allSubjects = this.data['subjects'].filter(a => {
          return a != 'grade';
        });
      }
      var myBlocks = [];
      this.blockMarkers.forEach(element => {
        if (element.district_id === this.districtHierarchy.distId) {
          myBlocks.push(element);
        }
      });
      this.blockMarkers = myBlocks;

      // set hierarchy values
      this.blockHierarchy = {
        distId: this.data['data'][0].district_id,
        districtName: this.data['data'][0].district_name,
        blockId: this.data['data'][0].block_id,
        blockName: this.data['data'][0].block_name
      }
      this.districtId = this.data['data'][0].district_id;
      this.blockId = blockId;

      // these are for showing the hierarchy names based on selection
      this.skul = false;
      this.dist = false;
      this.blok = true;
      this.clust = false;

      // options to set for markers in the map
      let options = {
        radius: this.getMarkerRadius(14, 10, 8, 4),
        fillOpacity: 1,
        strokeWeight: 0.01,
        weight: 1,
        mapZoom: this.commonService.zoomLevel + 3,
        centerLat: this.data['data'][0].cluster_latitude,
        centerLng: this.data['data'][0].cluster_longitude,
        level: 'cluster'
      }

      this.commonService.restrictZoom(globalMap);
      globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
      this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
      this.fileName = `${this.reportName}_${this.period}_${this.grade != 'all' ? this.grade : 'allGrades'}_${this.subject ? this.subject : ''}_${options.level}s_of_block_${blockId}_${this.commonService.dateAndTime}`;
      this.genericFun(this.data, options, this.fileName);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.cluster_name > b.cluster_name) ? 1 : ((b.cluster_name > a.cluster_name) ? -1 : 0));
    }, err => {
      this.data = this.clusterMarkers = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the schools for selected cluster for state data on the map
  onClusterSelect(clusterId) {
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.schoolCount = '';
    this.blockHidden = false;
    this.clusterHidden = false;
    this.reportData = [];

    // api call to get the schoolwise data for selected district, block, cluster
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.patExceptionBlock({ ...{ grade: this.grade, subject: this.subject, timePeriod: this.period, report: 'sat_exception', semester: this.semester }, ...{ management: this.management, category: this.category } }).subscribe(result => {
      this.myData = this.service.patExceptionSchoolPerClustter(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId, { ...{ grade: this.grade, subject: this.subject, timePeriod: this.period, report: 'sat_exception', semester: this.semester }, ...{ management: this.management, category: this.category } }).subscribe(res => {
        this.data = res;
        this.markers = this.schoolMarkers = this.data['data'];
        this.allSubjects = [];
        if (this.grade != 'all') {
          this.allSubjects = this.data['subjects'].filter(a => {
            return a != 'grade';
          });
        }
        var markers = result['data'];
        var myBlocks = [];
        markers.forEach(element => {
          if (element.district_id === this.blockHierarchy.distId) {
            myBlocks.push(element);
          }
        });
        this.blockMarkers = myBlocks;

        var myCluster = [];
        this.clusterMarkers.forEach(element => {
          if (element.block_id === this.blockHierarchy.blockId) {
            myCluster.push(element);
          }
        });
        this.clusterMarkers = myCluster;

        // set hierarchy values
        this.clusterHierarchy = {
          distId: this.data['data'][0].district_id,
          districtName: this.data['data'][0].district_name,
          blockId: this.data['data'][0].block_id,
          blockName: this.data['data'][0].block_name,
          clusterId: this.data['data'][0].cluster_id,
          clusterName: this.data['data'][0].cluster_name,
        }

        this.districtHierarchy = {
          distId: this.data['data'][0].district_id
        }

        this.districtId = this.data['data'][0].district_id;
        this.blockId = this.data['data'][0].block_id;
        this.clusterId = clusterId;

        // these are for showing the hierarchy names based on selection
        this.skul = false;
        this.dist = false;
        this.blok = false;
        this.clust = true;

        // options to set for markers in the map
        let options = {
          radius: this.getMarkerRadius(14, 10, 8, 4),
          fillOpacity: 1,
          strokeWeight: 0.01,
          weight: 1,
          mapZoom: this.commonService.zoomLevel + 5,
          centerLat: this.data['data'][0].school_latitude,
          centerLng: this.data['data'][0].school_longitude,
          level: 'school'
        }
        globalMap.doubleClickZoom.enable();
        globalMap.scrollWheelZoom.enable();
        globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
        this.setZoomLevel(options.centerLat, options.centerLng, globalMap, options.mapZoom);
        this.fileName = `${this.reportName}_${this.period}_${this.grade != 'all' ? this.grade : 'allGrades'}_${this.subject ? this.subject : ''}_${options.level}s_of_cluster_${clusterId}_${this.commonService.dateAndTime}`;
        this.genericFun(this.data, options, this.fileName);
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // common function for all the data to show in the map
  genericFun(data, options, fileName) {
    this.reportData = [];
    if (data['data'].length > 0) {
      this.markers = [];
      this.markers = data['data']
      var updatedMarkers = this.markers.filter(a => {
        return a.total_schools_with_missing_data && a.total_schools_with_missing_data != 0;
      });
      this.markers = updatedMarkers;
      this.schoolCount = 0;
      // generate color gradient
      this.colors = this.commonService.getRelativeColors(this.markers, { value: 'percentage_schools_with_missing_data', report: 'exception' });
      // attach values to markers
      for (let i = 0; i < this.markers.length; i++) {
        this.schoolCount = this.schoolCount + parseInt(this.markers[i].total_schools_with_missing_data);
        this.getLatLng(options.level, this.markers[i]);
        var markerIcon = this.commonService.initMarkers(this.latitude, this.longitude, this.commonService.relativeColorGredient(this.markers[i], { value: 'percentage_schools_with_missing_data', report: 'exception' }, this.colors), options.radius, options.strokeWeight, options.weight, options.level);
        if (markerIcon)
          this.generateToolTip(this.markers[i], options.level, markerIcon, this.strLat, this.strLng);
      }

      this.fileName = fileName;
      this.commonService.loaderAndErr(this.data);
      this.changeDetection.markForCheck();
    }
    this.schoolCount = this.schoolCount.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  }


  latitude; strLat; longitude; strLng;
  getLatLng(level, marker) {
    if (level == "district") {
      this.latitude = marker.district_latitude;
      this.strLat = "district_latitude";
      this.longitude = marker.district_longitude;
      this.strLng = "district_longitude";
    }
    if (level == "block") {
      this.latitude = marker.block_latitude;
      this.strLat = "block_latitude";
      this.longitude = marker.block_longitude;
      this.strLng = "block_longitude";
    }
    if (level == "cluster") {
      this.latitude = marker.cluster_latitude;
      this.strLat = "cluster_latitude";
      this.longitude = marker.cluster_longitude;
      this.strLng = "cluster_longitude";
    }
    if (level == "school") {
      this.latitude = marker.school_latitude;
      this.strLat = "school_latitude";
      this.longitude = marker.school_longitude;
      this.strLng = "school_longitude";
    }
  }

  popups(markerIcon, markers, level) {
    markerIcon.on('mouseover', function (e) {
      this.openPopup();
    });
    markerIcon.on('mouseout', function (e) {
      this.closePopup();
    });

    this.layerMarkers.addLayer(markerIcon);
    if (level != 'school') {
      markerIcon.on('click', this.onClick_Marker, this)
    }
    markerIcon.myJsonData = markers;
  }

  onSubjectSelect(data) {
    this.levelWiseFilter();
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

  // drilldown/ click functionality on markers
  onClick_Marker(event) {
    var data = event.target.myJsonData;
    if (data.district_id && !data.block_id && !data.cluster_id) {
      this.stateLevel = 1;
      this.onDistrictSelect(data.district_id)
    }
    if (data.district_id && data.block_id && !data.cluster_id) {
      this.stateLevel = 1;
      this.districtHierarchy = {
        distId: data.district_id
      }
      this.onBlockSelect(data.block_id)
    }
    if (data.district_id && data.block_id && data.cluster_id) {
      this.stateLevel = 1;
      this.blockHierarchy = {
        distId: data.district_id,
        blockId: data.block_id
      }
      this.onClusterSelect(data.cluster_id)
    }
  }

  // to download the excel report
  downloadReport() {
    this.reportData.forEach(element => {
      if (element.number_of_schools != undefined) {
        element['number_of_schools'] = element.number_of_schools.replace(/\,/g, '');
      }
    });
    var position = this.reportName.length;
    this.fileName = [this.fileName.slice(0, position), `_${this.management}`, this.fileName.slice(position)].join('');
    this.commonService.download(this.fileName, this.reportData);
  }

  generateToolTip(markers, level, markerIcon, lat, lng) {
    this.popups(markerIcon, markers, level);
    var details = {};
    var orgObject = {};
    Object.keys(markers).forEach(key => {
      if (key !== lat) {
        details[key] = markers[key];
      }
    });
    Object.keys(details).forEach(key => {
      if (key !== lng) {
        orgObject[key] = details[key];
      }
    });
    var detailSchool = {};
    var yourData;
    if (level == "school") {
      Object.keys(orgObject).forEach(key => {
        if (key !== "total_schools_with_missing_data") {
          detailSchool[key] = orgObject[key];
        }
      });
      this.reportData.push(detailSchool);
      yourData = this.commonService.getInfoFrom(detailSchool, "percentage_schools_with_missing_data", level, "sem-exception", undefined, undefined).join(" <br>");
    } else {
      this.reportData.push(orgObject);
      yourData = this.commonService.getInfoFrom(orgObject, "percentage_schools_with_missing_data", level, "sem-exception", undefined, undefined).join(" <br>");

    }
    //Generate dynamic tool-tip
    const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
      yourData);
    markerIcon.addTo(globalMap).bindPopup(popup);
  }
}

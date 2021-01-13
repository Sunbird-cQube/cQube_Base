import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PatReportService } from '../../../services/pat-report.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { AppServiceComponent, globalMap } from '../../../app.service';

@Component({
  selector: 'app-pat-report',
  templateUrl: './pat-report.component.html',
  styleUrls: ['./pat-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PATReportComponent implements OnInit {
  public title: string = '';
  public titleName: string = '';
  public colors: any;
  public setColor: any;

  // to assign the count of below values to show in the UI footer
  public studentCount: any;
  public schoolCount: any;
  public dateRange: any = '';

  // to hide and show the hierarchy details
  public skul: boolean = false;
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;

  // to hide the blocks and cluster dropdowns
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;
  subjectHidden: boolean = true;

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

  public myData;

  public myDistData: any;
  public myBlockData: any = [];
  public myClusterData: any = [];
  public mySchoolData: any = [];
  public level;

  allGrades = [];
  allSubjects = [];
  grade;
  subject;

  distFilter = [];
  blockFilter = [];
  clusterFilter = [];

  timeRange = [{ key: 'all', value: "Overall" }, { key: 'last_7_days', value: "Last 7 Days" }, { key: 'last_30_days', value: "Last 30 Days" }];
  period = 'all';
  state: string;
  // initial center position for the map
  public lat: any;
  public lng: any;

  constructor(
    public http: HttpClient,
    public service: PatReportService,
    public commonService: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
    private readonly _router: Router
  ) {
  }

  ngOnInit() {
    this.state = this.commonService.state;
    this.lat = this.commonService.mapCenterLatlng.lat;
    this.lng = this.commonService.mapCenterLatlng.lng;
    this.commonService.zoomLevel = this.commonService.mapCenterLatlng.zoomLevel;
    this.commonService.initMap('patMap', [[this.lat, this.lng]]);
    globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    let params = JSON.parse(sessionStorage.getItem('report-level-info'));

    if (params && params.level) {
      let data = params.data;
      if (params.level === 'district') {
        this.districtHierarchy = {
          distId: data.id
        };

        this.districtId = data.id;
        this.getDistricts(params.level);
      } else if (params.level === 'block') {
        this.districtHierarchy = {
          distId: data.districtId
        };

        this.blockHierarchy = {
          distId: data.districtId,
          blockId: data.id
        };

        this.districtId = data.districtId;
        this.blockId = data.id;
        this.getDistricts(params.level);
        this.getBlocks(data.districtId, data.id);
      } else if (params.level === 'cluster') {
        this.districtHierarchy = {
          distId: data.districtId
        };

        this.blockHierarchy = {
          distId: data.districtId,
          blockId: data.blockId
        };

        this.clusterHierarchy = {
          distId: data.districtId,
          blockId: data.blockId,
          clusterId: data.id
        };

        this.districtId = data.blockHierarchy;
        this.blockId = data.blockId;
        this.clusterId = data.id;
        this.getDistricts(params.level);
        this.getBlocks(data.districtId);
        this.getClusters(data.districtId, data.blockId, data.id);
      }
    } else {
      this.districtWise();
    }
  }

  getDistricts(level): void {
    this.service.PATDistWiseData({ grade: this.grade, period: this.period }).subscribe(res => {
      this.data = res['data'];
      this.districtMarkers = this.data;
      if (!this.districtMarkers[0]['Subjects']) {
        this.distFilter = this.districtMarkers;
      }

      if (level === 'district') {
        this.ondistLinkClick(this.districtId);
      }
    });
  }

  getBlocks(distId, blockId?: any): void {
    this.service.PATBlocksPerDistData(distId, { period: this.period }).subscribe(res => {
      this.data = res['data'];
      this.blockMarkers = this.data;

      if (!this.blockMarkers[0]['Subjects']) {
        this.blockFilter = this.blockMarkers;
      }

      if (blockId)
        this.onblockLinkClick(blockId);
    });
  }

  getClusters(distId, blockId, clusterId): void {
    this.service.PATClustersPerBlockData(distId, blockId, { period: this.period }).subscribe(res => {
      this.data = res['data'];
      this.clusterMarkers = this.data;

      if (!this.clusterMarkers[0]['Subjects']) {
        this.clusterFilter = this.clusterMarkers;
      }
      
      this.onclusterLinkClick(clusterId);
    });
  }

  onPeriodSelect() {
    this.levelWiseFilter();
  }

  onGradeSelect(data) {
    this.grade = data;
    this.subjectHidden = false;
    this.subject = '';
    this.levelWiseFilter();
  }
  onSubjectSelect(data) {
    this.subject = data;
    this.levelWiseFilter();
  }

  levelWiseFilter() {
    if (this.level == 'district') {
      this.districtWise();
    }
    if (this.level == 'block_wise') {
      this.blockWise();
    }
    if (this.level == 'cluster_wise') {
      this.clusterWise();
    }
    if (this.level == 'school_wise') {
      this.schoolWise();
    }

    if (this.level == 'block') {
      this.onDistrictSelect(this.districtId);
    }
    if (this.level == 'cluster') {
      this.onBlockSelect(this.blockId);
    }
    if (this.level == 'school') {
      this.onClusterSelect(this.clusterId);
    }
  }

  linkClick() {
    document.getElementById('home').style.display = 'none';
    this.grade = undefined;
    this.subjectHidden = true;
    this.districtWise();
  }

  // to load all the districts for state data on the map
  districtWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.districtId = undefined;
      if (this.level != 'district') {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.reportData = [];
      this.commonService.errMsg();
      this.level = 'district';
      this.fileName = "Dist_wise_report";
      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;
      this.service.gradeMetaData(this.period).subscribe(res => {
        if (res['data']['district']) {
          this.allGrades = res['data']['district'];
        }
        this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));

        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.PATDistWiseData({ grade: this.grade, period: this.period }).subscribe(res => {
          this.myDistData = res;
          this.data = res['data'];
          if (this.grade) {
            this.allSubjects = Object.keys(this.data[0].Subjects);
            var index = this.allSubjects.indexOf('Grade Performance');
            this.allSubjects.splice(index, 1);
            document.getElementById('home').style.display = 'block';
          }
          // to show only in dropdowns
          this.districtMarkers = this.data;
          if (!this.districtMarkers[0]['Subjects']) {
            this.distFilter = this.districtMarkers;
          }

          // options to set for markers in the map
          let options = {
            radius: 5,
            fillOpacity: 1,
            strokeWeight: 0.01,
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: 'district'
          }

          this.commonService.restrictZoom(globalMap);
          globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
          globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
          this.genericFun(this.myDistData, options, this.fileName);

          // sort the districtname alphabetically
          this.districtMarkers.sort((a, b) => (a.Details.district_name > b.Details.district_name) ? 1 : ((b.Details.district_name > a.Details.district_name) ? -1 : 0));

        }, err => {
          this.data = [];
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

  blockClick() {
    if (this.grade) {
      this.grade = undefined;
      this.subjectHidden = true;
      this.blockWise();
    } else {
      this.blockWise();
    }
  }
  // to load all the blocks for state data on the map
  blockWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      if (this.level != 'block_wise') {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.allGrades = [];
      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.level = 'block_wise';
      this.fileName = "Block_wise_report";

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      this.service.gradeMetaData(this.period).subscribe(res => {
        if (res['data']['block']) {
          this.allGrades = res['data']['block'];
        }
        this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));

        // api call to get the all clusters data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.PATBlockWiseData({ grade: this.grade, period: this.period }).subscribe(res => {
          this.myBlockData = res['data'];
          this.data = res['data'];
          if (this.grade) {
            this.allSubjects = Object.keys(this.data[0].Subjects);
            var index = this.allSubjects.indexOf('Grade Performance');
            this.allSubjects.splice(index, 1);
          }
          let options = {
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: "block_wise"
          }

          if (this.data.length > 0) {
            let result = this.data
            this.blockMarkers = [];
            this.blockMarkers = result;
            if (!this.blockMarkers[0]['Subjects']) {
              this.blockFilter = this.blockMarkers;
            }

            this.schoolCount = 0;
            if (this.grade && !this.subject) {
              this.blockMarkers.sort((a, b) => (a.Subjects['Grade Performance'] > b.Subjects['Grade Performance']) ? 1 : ((b.Subjects['Grade Performance'] > a.Subjects['Grade Performance']) ? -1 : 0));
            } else if (this.grade && this.subject) {

              let filterData = this.blockMarkers.filter(obj => {
                return ((Object.keys(obj.Subjects)).includes(this.subject));
              })
              this.blockMarkers = filterData;
              this.blockMarkers.sort((a, b) => (Number(a.Subjects[`${this.subject}`]) > Number(b.Subjects[`${this.subject}`])) ? 1 : ((Number(b.Subjects[`${this.subject}`]) > Number(a.Subjects[`${this.subject}`])) ? -1 : 0));
            } else {
              this.blockMarkers.sort((a, b) => (a.Details['Performance'] > b.Details['Performance']) ? 1 : ((b.Details['Performance'] > a.Details['Performance']) ? -1 : 0));
            }

            for (let i = 0; i < this.blockMarkers.length; i++) {
              var color;
              if (!this.grade && !this.subject) {
                color = this.commonService.color(this.blockMarkers[i].Details, 'Performance');
              } else if (this.grade && !this.subject) {
                color = this.commonService.color(this.blockMarkers[i].Subjects, 'Grade Performance');
              } else if (this.grade && this.subject) {
                color = this.commonService.color(this.blockMarkers[i].Subjects, this.subject);
              }
              var markerIcon = this.commonService.initMarkers(this.blockMarkers[i].Details.latitude, this.blockMarkers[i].Details.longitude, color, 3.5, 0.01, 1, options.level);
              this.generateToolTip(this.blockMarkers[i], options.level, markerIcon, "latitude", "longitude");
              this.getDownloadableData(this.blockMarkers[i], options.level);
            }

            this.commonService.restrictZoom(globalMap);
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);


            //schoolCount
            this.schoolCount = res['footer'].total_schools;
            if (this.schoolCount != null) {
              this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            }
            this.studentCount = res['footer'].students_count;
            if (this.studentCount != null) {
              this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            }

            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }, err => {
          this.data = [];
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

  clusterClick() {
    if (this.grade) {
      this.grade = undefined;
      this.subjectHidden = true;
      this.clusterWise();
    } else {
      this.clusterWise();
    }
  }
  // to load all the clusters for state data on the map
  clusterWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      if (this.level != 'cluster_wise') {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.allGrades = [];
      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.clusterId = undefined;
      this.level = "cluster_wise";
      this.fileName = "Cluster_wise_report";

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      this.service.gradeMetaData(this.period).subscribe(res => {
        if (res['data']['cluster']) {
          this.allGrades = res['data']['cluster'];
        }
        this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));

        // api call to get the all clusters data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.PATClusterWiseData({ grade: this.grade, period: this.period }).subscribe(res => {
          this.data = res['data']
          if (this.grade) {
            this.allSubjects = Object.keys(this.data[0].Subjects);
            var index = this.allSubjects.indexOf('Grade Performance');
            this.allSubjects.splice(index, 1);
          }
          let options = {
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: "cluster_wise"
          }

          if (this.data.length > 0) {
            let result = this.data
            this.clusterMarkers = [];
            this.clusterMarkers = result;
            if (!this.clusterMarkers[0]['Subjects']) {
              this.clusterFilter = this.clusterMarkers;
            }
            this.schoolCount = 0;
            if (this.grade && !this.subject) {
              this.clusterMarkers.sort((a, b) => (a.Subjects['Grade Performance'] > b.Subjects['Grade Performance']) ? 1 : ((b.Subjects['Grade Performance'] > a.Subjects['Grade Performance']) ? -1 : 0));
            } else if (this.grade && this.subject) {
              let filterData = this.clusterMarkers.filter(obj => {
                return ((Object.keys(obj.Subjects)).includes(this.subject));
              })
              this.clusterMarkers = filterData;
              this.clusterMarkers.sort((a, b) => (Number(a.Subjects[`${this.subject}`]) > Number(b.Subjects[`${this.subject}`])) ? 1 : ((Number(b.Subjects[`${this.subject}`]) > Number(a.Subjects[`${this.subject}`])) ? -1 : 0));
            } else {
              this.clusterMarkers.sort((a, b) => (a.Details['Performance'] > b.Details['Performance']) ? 1 : ((b.Details['Performance'] > a.Details['Performance']) ? -1 : 0));
            }
            for (let i = 0; i < this.clusterMarkers.length; i++) {
              var color = this.commonService.color(this.clusterMarkers[i].Details, 'Performance');
              if (this.grade) {
                color = this.commonService.color(this.clusterMarkers[i].Subjects, 'Grade Performance');
              } else if (this.grade && this.subject) {
                color = this.commonService.color(this.clusterMarkers[i].Subjects, this.subject);
              }
              var markerIcon = this.commonService.initMarkers(this.clusterMarkers[i].Details.latitude, this.clusterMarkers[i].Details.longitude, color, 1, 0.01, 0.5, options.level);
              this.generateToolTip(this.clusterMarkers[i], options.level, markerIcon, "latitude", "longitude");
              this.getDownloadableData(this.clusterMarkers[i], options.level);
            }

            //schoolCount
            this.schoolCount = res['footer'].total_schools;
            if (this.schoolCount != null) {
              this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            }
            this.studentCount = res['footer'].students_count;
            if (this.studentCount != null) {
              this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            }

            this.commonService.restrictZoom(globalMap);
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);

            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }, err => {
          this.data = [];
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

  schoolClick() {
    if (this.grade) {
      this.grade = undefined;
      this.subjectHidden = true;
      this.schoolWise();
    } else {
      this.schoolWise();
    }
  }
  // to load all the schools for state data on the map
  schoolWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      if (this.level != 'school_wise') {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.allGrades = [];
      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.clusterId = undefined;
      this.level = 'school_wise';
      this.fileName = "School_wise_report";

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      this.service.gradeMetaData(this.period).subscribe(res => {
        if (res['data']['school']) {
          this.allGrades = res['data']['school'];
        }
        this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));

        // api call to get the all schools data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.PATSchoolWiseData({ grade: this.grade, period: this.period }).subscribe(res => {
          this.data = res['data']
          if (this.grade) {
            this.allSubjects = Object.keys(this.data[0].Subjects);
            var index = this.allSubjects.indexOf('Grade Performance');
            this.allSubjects.splice(index, 1);
          }
          let options = {
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: "school_wise"
          }

          this.schoolMarkers = [];
          if (this.data.length > 0) {
            let result = this.data
            this.schoolCount = 0;
            this.schoolMarkers = result;
            if (this.grade && !this.subject) {
              this.schoolMarkers.sort((a, b) => (a.Subjects['Grade Performance'] > b.Subjects['Grade Performance']) ? 1 : ((b.Subjects['Grade Performance'] > a.Subjects['Grade Performance']) ? -1 : 0));
            } else if (this.grade && this.subject) {
              let filterData = this.schoolMarkers.filter(obj => {
                return ((Object.keys(obj.Subjects)).includes(this.subject));
              })
              this.schoolMarkers = filterData;
              this.schoolMarkers.sort((a, b) => (Number(a.Subjects[`${this.subject}`]) > Number(b.Subjects[`${this.subject}`])) ? 1 : ((Number(b.Subjects[`${this.subject}`]) > Number(a.Subjects[`${this.subject}`])) ? -1 : 0));
            } else {
              this.schoolMarkers.sort((a, b) => (a.Details['Performance'] > b.Details['Performance']) ? 1 : ((b.Details['Performance'] > a.Details['Performance']) ? -1 : 0));
            }

            for (let i = 0; i < this.schoolMarkers.length; i++) {
              var color = this.commonService.color(this.schoolMarkers[i].Details, 'Performance');
              if (this.grade) {
                color = this.commonService.color(this.schoolMarkers[i].Subjects, 'Grade Performance');
              } else if (this.grade && this.subject) {
                color = this.commonService.color(this.schoolMarkers[i].Subjects, this.subject);
              }
              var markerIcon = this.commonService.initMarkers(this.schoolMarkers[i].Details.latitude, this.schoolMarkers[i].Details.longitude, color, 0, 0, 0.3, 'school');
              this.generateToolTip(this.schoolMarkers[i], options.level, markerIcon, "latitude", "longitude");
              this.getDownloadableData(this.schoolMarkers[i], options.level);
            }

            globalMap.doubleClickZoom.enable();
            globalMap.scrollWheelZoom.enable();
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);

            //schoolCount
            this.schoolCount = res['footer'].total_schools;
            if (this.schoolCount != null) {
              this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            }
            this.studentCount = res['footer'].students_count;
            if (this.studentCount != null) {
              this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            }
            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }, err => {
          this.data = [];
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

  ondistLinkClick(districtId) {
    if (this.grade) {
      this.grade = undefined;
      this.subjectHidden = true;
      this.onDistrictSelect(districtId);
    } else {
      this.onDistrictSelect(districtId);
    }
  }
  // to load all the blocks for selected district for state data on the map
  onDistrictSelect(districtId) {
    // to clear the existing data on the map layer  
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    if (this.level != 'block') {
      this.subjectHidden = true;
      this.grade = undefined;
      this.subject = undefined;
    }
    this.blockId = undefined;
    this.reportData = [];
    this.level = 'block';
    var fileName = "Block_per_dist_report";
    var myData = this.distFilter.find(a => a.Details.district_id == districtId);
    var grades = [];
    if (myData['Grades']) {
      Object.keys(myData['Grades']).forEach(grade => {
        grades.push({ grade: grade })
      })
    }
    this.allGrades = grades;
    // api call to get the blockwise data for selected district
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.PATBlocksPerDistData(districtId, { period: this.period }).subscribe(res => {
      this.data = res['data']
      // if (this.grade) {
      //   this.allSubjects = Object.keys(this.data[0].Subjects);
      //   var index = this.allSubjects.indexOf('Grade Performance') + 1;
      //   this.allSubjects.splice(index, 1);
      // }
      this.blockMarkers = this.data;
      if (!this.blockMarkers[0]['Subjects']) {
        this.blockFilter = this.blockMarkers;
      }
      // set hierarchy values
      this.districtHierarchy = {
        distId: this.data[0].Details.district_id,
        districtName: this.data[0].Details.district_name
      }

      // to show and hide the dropdowns
      this.blockHidden = false;
      this.clusterHidden = true;

      this.districtId = districtId;

      // these are for showing the hierarchy names based on selection
      this.skul = false;
      this.dist = true;
      this.blok = false;
      this.clust = false;

      // options to set for markers in the map
      let options = {
        radius: 3.5,
        fillOpacity: 1,
        strokeWeight: 0.01,
        mapZoom: this.commonService.zoomLevel + 1,
        centerLat: this.data[0].Details.latitude,
        centerLng: this.data[0].Details.longitude,
        level: 'block'
      }
      this.data.forEach(element => {

      });

      this.commonService.restrictZoom(globalMap);
      globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
      globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
      this.genericFun(res, options, fileName);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.Details.block_name > b.Details.block_name) ? 1 : ((b.Details.block_name > a.Details.block_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  onblockLinkClick(blockId) {
    if (this.grade) {
      this.grade = undefined;
      this.subjectHidden = true;
      this.onBlockSelect(blockId);
    } else {
      this.onBlockSelect(blockId);
    }
  }
  // to load all the clusters for selected block for state data on the map
  onBlockSelect(blockId) {
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    if (this.level != 'cluster') {
      this.subjectHidden = true;
      this.grade = undefined;
      this.subject = undefined;
    }
    this.clusterId = undefined;
    this.reportData = [];
    this.level = 'cluster';
    var fileName = "Cluster_per_block_report";
    var myData = this.blockFilter.find(a => a.Details.block_id == blockId);
    var grades = [];
    Object.keys(myData['Grades']).forEach(grade => {
      grades.push({ grade: grade })
    })
    this.allGrades = grades;
    // api call to get the clusterwise data for selected district, block
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.PATClustersPerBlockData(this.districtHierarchy.distId, blockId, { period: this.period }).subscribe(res => {
      this.data = res['data']
      // if (this.grade) {
      //   this.allSubjects = Object.keys(this.data[0].Subjects)
      //   this.allSubjects.pop()
      // }
      this.clusterMarkers = this.data;
      if (!this.clusterMarkers[0]['Subjects']) {
        this.clusterFilter = this.clusterMarkers;
      }
      var myBlocks = [];
      this.blockMarkers.forEach(element => {
        if (element.Details.district_id === this.districtHierarchy.distId) {
          myBlocks.push(element);
        }
      });
      this.blockMarkers = myBlocks;

      // set hierarchy values
      this.blockHierarchy = {
        distId: this.data[0].Details.district_id,
        districtName: this.data[0].Details.district_name,
        blockId: this.data[0].Details.block_id,
        blockName: this.data[0].Details.block_name
      }

      // to show and hide the dropdowns
      this.blockHidden = false;
      this.clusterHidden = false;

      this.districtId = this.data[0].Details.district_id;
      this.blockId = blockId;

      // these are for showing the hierarchy names based on selection
      this.skul = false;
      this.dist = false;
      this.blok = true;
      this.clust = false;

      // options to set for markers in the map
      let options = {
        radius: 3,
        fillOpacity: 1,
        strokeWeight: 0.01,
        mapZoom: this.commonService.zoomLevel + 3,
        centerLat: this.data[0].Details.latitude,
        centerLng: this.data[0].Details.longitude,
        level: 'cluster'
      }
      this.commonService.restrictZoom(globalMap);
      globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
      globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
      this.genericFun(res, options, fileName);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.Details.cluster_name > b.Details.cluster_name) ? 1 : ((b.Details.cluster_name > a.Details.cluster_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  onclusterLinkClick(clusterId) {
    if (this.grade) {
      this.grade = undefined;
      this.subjectHidden = true;
      this.onClusterSelect(clusterId);
    } else {
      this.onClusterSelect(clusterId);
    }
  }
  // to load all the schools for selected cluster for state data on the map
  onClusterSelect(clusterId) {
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    if (this.level != 'school') {
      this.subjectHidden = true;
      this.grade = undefined;
      this.subject = undefined;
    }
    var myData = this.clusterFilter.find(a => a.Details.cluster_id == clusterId);
    var grades = [];
    Object.keys(myData['Grades']).forEach(grade => {
      grades.push({ grade: grade })
    })
    this.allGrades = grades;
    // api call to get the schoolwise data for selected district, block, cluster
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.PATBlockWiseData({ grade: this.grade, period: this.period }).subscribe((result: any) => {
      this.myData = this.service.PATSchoolssPerClusterData(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId, { period: this.period }).subscribe(res => {
        this.data = res['data'];
        // if (this.grade) {
        //   this.allSubjects = Object.keys(this.data[0].Subjects)
        //   this.allSubjects.pop()
        // }
        this.schoolMarkers = this.data;
        var markers = result['data'];
        var myBlocks = [];
        markers.forEach(element => {
          if (element.Details.district_id === this.blockHierarchy.distId) {
            myBlocks.push(element);
          }
        });
        this.blockMarkers = myBlocks;
        this.blockMarkers.sort((a, b) => (a.Details.block_name > b.Details.block_name) ? 1 : ((b.Details.block_name > a.Details.block_name) ? -1 : 0));

        var myCluster = [];
        this.clusterMarkers.forEach(element => {
          if (element.Details.block_id === this.blockHierarchy.blockId) {
            myCluster.push(element);
          }
        });
        this.clusterMarkers = myCluster;

        // set hierarchy values
        this.clusterHierarchy = {
          distId: this.data[0].Details.district_id,
          districtName: this.data[0].Details.district_name,
          blockId: this.data[0].Details.block_id,
          blockName: this.data[0].Details.block_name,
          clusterId: Number(this.data[0].Details.cluster_id),
          clusterName: this.data[0].Details.cluster_name,
        }

        this.blockHidden = false;
        this.clusterHidden = false;

        this.districtHierarchy = {
          distId: this.data[0].Details.district_id
        }

        this.districtId = this.data[0].Details.district_id;
        this.blockId = this.data[0].Details.block_id;
        this.clusterId = clusterId;

        // these are for showing the hierarchy names based on selection
        this.skul = false;
        this.dist = false;
        this.blok = false;
        this.clust = true;

        // options to set for markers in the map
        let options = {
          radius: 3.5,
          fillOpacity: 1,
          strokeWeight: 0.01,
          mapZoom: this.commonService.zoomLevel + 5,
          centerLat: this.data[0].Details.latitude,
          centerLng: this.data[0].Details.longitude,
          level: "school"
        }
        this.level = options.level;
        var fileName = "School_per_cluster_report";

        globalMap.doubleClickZoom.enable();
        globalMap.scrollWheelZoom.enable();
        globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
        globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
        this.genericFun(res, options, fileName);
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
    this.schoolCount = 0;
    var myData = data['data'];
    var color;
    if (myData.length > 0) {
      this.markers = myData;
      if (this.level == 'block' || this.level == 'cluster' || this.level == 'school') {
        if (this.grade && !this.subject) {
          let filterData = this.markers.filter(obj => {
            return ((Object.keys(obj.Grades)).includes(this.grade));
          })
          this.markers = filterData;
          this.markers.sort((a, b) => (a.Grades[`${this.grade}`]['Grade Performance'] > b.Grades[`${this.grade}`]['Grade Performance']) ? 1 : ((b.Grades[`${this.grade}`]['Grade Performance'] > a.Grades[`${this.grade}`]['Grade Performance']) ? -1 : 0));
          this.allSubjects = Object.keys(this.markers[0].Grades[`${this.grade}`]);
          this.allSubjects.pop();
        } else if (this.grade && this.subject) {
          let filterGrade = this.markers.filter(obj => {
            return ((Object.keys(obj.Grades)).includes(this.grade));
          })
          let filterData = filterGrade.filter(obj => {
            return ((Object.keys(obj.Grades[`${this.grade}`])).includes(this.subject));
          })
          this.markers = filterData;
          this.markers.sort((a, b) => (a.Grades[`${this.grade}`][`${this.subject}`] > b.Grades[`${this.grade}`][`${this.subject}`]) ? 1 : ((b.Grades[`${this.grade}`][`${this.subject}`] > a.Grades[`${this.grade}`][`${this.subject}`]) ? -1 : 0));
        } else {
          this.markers.sort((a, b) => (a.Details['Performance'] > b.Details['Performance']) ? 1 : ((b.Details['Performance'] > a.Details['Performance']) ? -1 : 0));
        }
        for (let i = 0; i < this.markers.length; i++) {
          if (!this.grade && !this.subject) {
            color = this.commonService.color(this.markers[i].Details, 'Performance');
          } else if (this.grade && !this.subject) {
            color = this.commonService.color(this.markers[i].Grades[`${this.grade}`], 'Grade Performance');
          } else if (this.grade && this.subject) {
            color = this.commonService.color(this.markers[i].Grades[`${this.grade}`], this.subject);
          }
        }
      } else {
        if (this.grade && !this.subject) {
          this.markers.sort((a, b) => (a.Subjects['Grade Performance'] > b.Subjects['Grade Performance']) ? 1 : ((b.Subjects['Grade Performance'] > a.Subjects['Grade Performance']) ? -1 : 0));
        } else if (this.grade && this.subject) {
          this.markers.sort((a, b) => (Number(a.Subjects[`${this.subject}`]) > Number(b.Subjects[`${this.subject}`])) ? 1 : ((Number(b.Subjects[`${this.subject}`]) > Number(a.Subjects[`${this.subject}`])) ? -1 : 0));
        } else {
          this.markers.sort((a, b) => (a.Details['Performance'] > b.Details['Performance']) ? 1 : ((b.Details['Performance'] > a.Details['Performance']) ? -1 : 0));
        }
        for (let i = 0; i < this.markers.length; i++) {
          if (!this.grade && !this.subject) {
            color = this.commonService.color(this.markers[i].Details, 'Performance');
          } else if (this.grade && !this.subject) {
            color = this.commonService.color(this.markers[i].Subjects, 'Grade Performance');
          } else if (this.grade && this.subject) {
            color = this.commonService.color(this.markers[i].Subjects, this.subject);
          }
        }
      }

      // attach values to markers
      for (let i = 0; i < this.markers.length; i++) {
        var markerIcon = this.commonService.initMarkers(this.markers[i].Details.latitude, this.markers[i].Details.longitude, color, options.radius, options.strokeWeight, 1, options.level);
        // data to show on the tooltip for the desired levels
        this.generateToolTip(this.markers[i], options.level, markerIcon, "latitude", "longitude");

        // to download the report
        this.fileName = fileName;
        this.getDownloadableData(this.markers[i], options.level);
      }
      this.commonService.loaderAndErr(this.data);
      this.changeDetection.markForCheck();
    }
    //schoolCount
    this.schoolCount = data['footer'].total_schools;
    if (this.schoolCount != null) {
      this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    }
    this.studentCount = data['footer'].students_count;
    if (this.studentCount != null) {
      this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    }
  }

  generateToolTip(markers, level, markerIcon, lat, lng) {
    this.popups(markerIcon, markers, level);
    let colorText = `style='color:blue !important;'`;
    var details = {};
    var orgObject = {};
    Object.keys(markers.Details).forEach(key => {
      if (key !== lat) {
        details[key] = markers.Details[key];
      }
    });
    Object.keys(details).forEach(key => {
      if (key !== lng) {
        orgObject[key] = details[key];
      }
    });
    if (level != 'school') {
      if (orgObject['total_schools'] != null) {
        orgObject['total_schools'] = orgObject['total_schools'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      }
    }
    if (orgObject['total_schools'] != null) {
      orgObject['students_count'] = orgObject['students_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    } 5
    var yourData1;
    if (this.grade) {
      yourData1 = this.commonService.getInfoFrom(orgObject, "Performance", level, "patReport", '', colorText).join(" <br>");

    } else {
      yourData1 = this.commonService.getInfoFrom(orgObject, "Performance", level, "patReport", 'Performance', colorText).join(" <br>");

    }
    var yourData;
    var ordered;
    var mylevel;
    if (level == 'district') {
      mylevel = level;
    } else if (level == 'block_wise') {
      mylevel = level;
    } else if (level == 'cluster_wise') {
      mylevel = level;
    } else if (level == 'school_wise') {
      mylevel = level;
    }

    if (level == mylevel) {
      if (this.grade && !this.subject) {
        yourData = this.commonService.getInfoFrom(markers.Subjects, "Performance", level, "patReport", 'Grade Performance', colorText).join(" <br>");
      } else if (this.grade && this.subject) {
        yourData = this.commonService.getInfoFrom(markers.Subjects, "Performance", level, "patReport", this.subject, colorText).join(" <br>");
      } else {
        ordered = {};
        Object.keys(markers['Grade Wise Performance']).sort().forEach(function (key) {
          ordered[key] = markers['Grade Wise Performance'][key];
        });
        yourData = this.commonService.getInfoFrom(ordered, "Performance", level, "patReport", '', colorText).join(" <br>");
      }

    } else {
      if (this.grade && !this.subject) {
        yourData = this.commonService.getInfoFrom(markers.Grades[`${this.grade}`], "Performance", level, "patReport", 'Grade Performance', colorText).join(" <br>");
      } else if (this.grade && this.subject) {
        yourData = this.commonService.getInfoFrom(markers.Grades[`${this.grade}`], "Performance", level, "patReport", this.subject, colorText).join(" <br>");
      } else {
        ordered = {};
        Object.keys(markers['Grade Wise Performance']).sort().forEach(function (key) {
          ordered[key] = markers['Grade Wise Performance'][key];
        });
        yourData = this.commonService.getInfoFrom(ordered, "Performance", level, "patReport", '', colorText).join(" <br>");
      }
    }

    const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
      "<b><u>Details</u></b>" +
      "<br>" + yourData1 +
      "<br><br><b><u>Periodic Exam Score (%)</u></b>" +
      "<br>" + yourData);
    markerIcon.addTo(globalMap).bindPopup(popup);
  }

  popups(markerIcon, markers, level) {
    for (var i = 0; i < this.markers.length; i++) {
      markerIcon.on('mouseover', function (e) {
        this.openPopup();
      });
      markerIcon.on('mouseout', function (e) {
        this.closePopup();
      });

      this.layerMarkers.addLayer(markerIcon);
      if (level != 'school') {
        markerIcon.on('click', this.onClick_Marker, this);
      }
      markerIcon.myJsonData = markers;
    }
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
    var data = event.target.myJsonData.Details;
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

  // to download the csv report
  downloadReport() {
    this.commonService.download(this.fileName, this.reportData);
  }

  // getting data to download........
  getDownloadableData(markers, level) {
    if (markers['Grade Wise Performance']) {
      if (markers['Grade Wise Performance']['Grade 3'] == undefined) {
        markers['Grade Wise Performance']['Grade 3'] = '';
      }
      if (markers['Grade Wise Performance']['Grade 4'] == undefined) {
        markers['Grade Wise Performance']['Grade 4'] = '';
      }
      if (markers['Grade Wise Performance']['Grade 5'] == undefined) {
        markers['Grade Wise Performance']['Grade 5'] = '';
      }
      if (markers['Grade Wise Performance']['Grade 6'] == undefined) {
        markers['Grade Wise Performance']['Grade 6'] = '';
      }
      if (markers['Grade Wise Performance']['Grade 7'] == undefined) {
        markers['Grade Wise Performance']['Grade 7'] = '';
      }
      if (markers['Grade Wise Performance']['Grade 8'] == undefined) {
        markers['Grade Wise Performance']['Grade 8'] = '';
      }
    }
    var details = {};
    var orgObject = {};
    Object.keys(markers.Details).forEach(key => {
      if (key !== "latitude") {
        details[key] = markers.Details[key];
      }
    });
    Object.keys(details).forEach(key => {
      var str = key.charAt(0).toUpperCase() + key.substr(1).toLowerCase();
      if (key !== "longitude") {
        orgObject[`${str}`] = details[key];
      }
    });
    var ordered = {};
    var mylevel;
    if (level == 'district') {
      mylevel = level;
    } else if (level == 'block_wise') {
      mylevel = level;
    } else if (level == 'cluster_wise') {
      mylevel = level;
    } else if (level == 'school_wise') {
      mylevel = level;
    }
    if (level != mylevel) {
      if (this.grade && !this.subject) {
        ordered = markers.Grades[`${this.grade}`];
      } else if (this.grade && this.subject) {
        ordered = { [`${this.subject}` + '_score']: markers.Grades[`${this.grade}`][`${this.subject}`] }
      } else {
        Object.keys(markers['Grade Wise Performance']).sort().forEach(function (key) {
          ordered[key] = markers['Grade Wise Performance'][key];
        });
      }
    } else {
      if (this.grade && !this.subject) {
        ordered = markers.Subjects;
      } else if (this.grade && this.subject) {
        ordered = { [`${this.subject}` + '_score']: markers.Subjects[`${this.subject}`] }
      } else {
        Object.keys(markers['Grade Wise Performance']).sort().forEach(function (key) {
          ordered[key] = markers['Grade Wise Performance'][key];
        });
      }
    }

    var myobj = Object.assign(orgObject, ordered);
    this.reportData.push(myobj);
  }

  goToHealthCard(): void {
    let data: any = {};

    if (this.dist) {
      data.level = 'district';
      data.value = this.districtHierarchy.distId;
    } else if (this.blok) {
      data.level = 'block';
      data.value = this.blockHierarchy.blockId;
    } else if (this.clust) {
      data.level = 'cluster';
      data.value = this.clusterHierarchy.clusterId;
    } else {
      data.level = 'state';
      data.value = null
    }

    sessionStorage.setItem('health-card-info', JSON.stringify(data));
    this._router.navigate(['/healthCard']);
  }
}
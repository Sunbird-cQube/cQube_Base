import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExceptionReportService } from '../../../services/exception-report.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { AppServiceComponent, globalMap } from '../../../app.service';
@Component({
  selector: 'app-pat-exception',
  templateUrl: './pat-exception.component.html',
  styleUrls: ['./pat-exception.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PATExceptionComponent implements OnInit {
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

  public levelWise = '';

  public myData;
  state: string;
  // initial center position for the map
  public lat: any;
  public lng: any;

  timeRange = [{ key: 'overall', value: "Overall" }, { key: 'last_7_days', value: "Last 7 Days" }, { key: 'last_30_days', value: "Last 30 Days" }];
  period = 'overall';
  allGrades: any;
  grade = 'all';
  allSubjects: string[];

  constructor(
    public http: HttpClient,
    public service: ExceptionReportService,
    public commonService: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.state = this.commonService.state;
    this.lat = this.commonService.mapCenterLatlng.lat;
    this.lng = this.commonService.mapCenterLatlng.lng;
    this.commonService.zoomLevel = this.commonService.mapCenterLatlng.zoomLevel;
    this.commonService.initMap('patExceMap', [[this.lat, this.lng]]);
    globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('spinner').style.display = 'none';
    this.districtWise();
  }

  onPeriodSelect() {
    this.levelWiseFilter();
  }

  onGradeSelect(data) {
    this.grade = data;
    this.levelWiseFilter();
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
  }

  homeClick() {
    this.grade = 'all';
    this.period = 'overall';
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
      this.levelWise = "district";
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

      this.service.gradeMetaData(this.period).subscribe(res => {
        if (res['data']['district']) {
          this.allGrades = res['data']['district'];
          this.allGrades = [{ grade: "all" }, ...this.allGrades.filter(item => item !== { grade: "all" })];
        }
        this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));
        // api call to get all the districts data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.patExceptionDistWise({ grade: this.grade, timePeriod: this.period }).subscribe(res => {
          this.data = res;
          // to show only in dropdowns
          this.markers = this.districtMarkers = this.data['data'];
          if (this.grade != 'all') {
            this.allSubjects = this.data['subjects'];
          }
          // options to set for markers in the map
          let options = {
            radius: 5,
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
          globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
          var fileName = "District_wise_report";
          this.genericFun(this.data, options, fileName);

          // sort the districtname alphabetically
          this.districtMarkers.sort((a, b) => (a.district_name > b.district_name) ? 1 : ((b.district_name > a.district_name) ? -1 : 0));
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

  // to load all the blocks for state data on the map
  blockWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "block";
      this.schoolCount = '';

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

      this.service.gradeMetaData(this.period).subscribe(res => {
        if (res['data']['block']) {
          this.allGrades = res['data']['block'];
          this.allGrades = [{ grade: "all" }, ...this.allGrades.filter(item => item !== { grade: "all" })];
        }
        this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));
        // api call to get the all clusters data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.patExceptionBlock({ grade: this.grade, timePeriod: this.period }).subscribe(res => {
          this.data = res
          let options = {
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: "Block"
          }
          if (this.data['data'].length > 0) {
            let result = this.data['data']
            this.blockMarkers = [];
            result = result.sort((a, b) => (parseInt(a.percentage_schools_with_missing_data) < parseInt(b.percentage_schools_with_missing_data)) ? 1 : -1)
            // generate color gradient
            let colors = result.length == 1 ? ['red'] : this.commonService.exceptionColor().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
            this.colors = colors;
            this.markers = this.blockMarkers = result;

            if (this.blockMarkers.length !== 0) {
              for (let i = 0; i < this.blockMarkers.length; i++) {
                var markerIcon = this.commonService.initMarkers(this.blockMarkers[i].block_latitude, this.blockMarkers[i].block_longitude, this.colors[i], 3.5, 0.1, 1, options.level);
                this.generateToolTip(this.blockMarkers[i], options.level, markerIcon, "block_latitude", "block_longitude");

                // to download the report
                this.fileName = "Block_wise_report";
              }

              this.commonService.restrictZoom(globalMap);
              globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
              globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);

              this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

              this.commonService.loaderAndErr(this.data);
              this.changeDetection.markForCheck();
            }
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

      this.service.gradeMetaData(this.period).subscribe(res => {
        if (res['data']['cluster']) {
          this.allGrades = res['data']['cluster'];
          this.allGrades = [{ grade: "all" }, ...this.allGrades.filter(item => item !== { grade: "all" })];
        }
        this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));
        // api call to get the all clusters data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.patExceptionCluster({ grade: this.grade, timePeriod: this.period }).subscribe(res => {
          this.data = res
          let options = {
            mapZoom: this.commonService.zoomLevel,
            centerLat: this.lat,
            centerLng: this.lng,
            level: "Cluster"
          }
          if (this.data['data'].length > 0) {
            let result = this.data['data'];
            result = result.sort((a, b) => (parseInt(a.percentage_schools_with_missing_data) < parseInt(b.percentage_schools_with_missing_data)) ? 1 : -1)
            this.clusterMarkers = [];
            // generate color gradient
            let colors = result.length == 1 ? ['red'] : this.commonService.exceptionColor().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
            this.colors = colors;
            this.markers = this.clusterMarkers = result;

            if (this.clusterMarkers.length !== 0) {
              for (let i = 0; i < this.clusterMarkers.length; i++) {
                var markerIcon = this.commonService.initMarkers(this.clusterMarkers[i].cluster_latitude, this.clusterMarkers[i].cluster_longitude, this.colors[i], 1, 0.01, 0.5, options.level);

                this.generateToolTip(this.clusterMarkers[i], options.level, markerIcon, "cluster_latitude", "cluster_longitude");

                // to download the report
                this.fileName = "Cluster_wise_report";
              }

              this.commonService.restrictZoom(globalMap);
              globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
              globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);

              this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

              this.commonService.loaderAndErr(this.data);
              this.changeDetection.markForCheck();
            }
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

  // to load all the schools for state data on the map
  schoolWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "school";
      this.schoolCount = '';

      this.reportData = [];
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
          this.allGrades = [{ grade: "all" }, ...this.allGrades.filter(item => item !== { grade: "all" })];
        }
        this.allGrades.sort((a, b) => (a.grade > b.grade) ? 1 : ((b.grade > a.grade) ? -1 : 0));
        // api call to get the all schools data
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.patExceptionSchool({ grade: this.grade, timePeriod: this.period }).subscribe(res => {
          this.data = res
          let options = {
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
            let colors = result.length == 1 ? ['red'] : this.commonService.exceptionColor().generateGradient('#FF0000', '#FF0000', result.length, 'rgb');
            this.colors = colors;
            this.markers = this.schoolMarkers = result;

            if (this.schoolMarkers.length !== 0) {
              for (let i = 0; i < this.schoolMarkers.length; i++) {
                var markerIcon = this.commonService.initMarkers(this.schoolMarkers[i].school_latitude, this.schoolMarkers[i].school_longitude, this.colors[i], 0, 0, 0.3, options.level);
                this.generateToolTip(this.schoolMarkers[i], options.level, markerIcon, "school_latitude", "school_longitude");
                // to download the report
                this.fileName = "School_wise_report";
              }

              globalMap.doubleClickZoom.enable();
              globalMap.scrollWheelZoom.enable();
              globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
              globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);

              this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

              this.commonService.loaderAndErr(this.data);
              this.changeDetection.markForCheck();
            }
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

  // to load all the blocks for selected district for state data on the map
  onDistrictSelect(districtId) {
    // to clear the existing data on the map layer  
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.blockId = undefined;

    // to show and hide the dropdowns
    this.blockHidden = false;
    this.clusterHidden = true;

    // api call to get the blockwise data for selected district
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.patExceptionBlockPerDist(districtId, { grade: this.grade, timePeriod: this.period }).subscribe(res => {
      this.data = res;

      this.markers = this.blockMarkers = this.data['data'];
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
        radius: 3.5,
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
      globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
      var fileName = "Block_per_dist_report";
      this.genericFun(this.data, options, fileName);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.block_name > b.block_name) ? 1 : ((b.block_name > a.block_name) ? -1 : 0));
    }, err => {
      this.data = [];
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

    // to show and hide the dropdowns
    this.blockHidden = false;
    this.clusterHidden = false;

    // api call to get the clusterwise data for selected district, block
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.patExceptionClusterPerBlock(this.districtHierarchy.distId, blockId, { grade: this.grade, timePeriod: this.period }).subscribe(res => {
      this.data = res;
      this.markers = this.clusterMarkers = this.data['data'];
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
        radius: 3.5,
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
      globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
      var fileName = "Cluster_per_block_report";
      this.genericFun(this.data, options, fileName);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.cluster_name > b.cluster_name) ? 1 : ((b.cluster_name > a.cluster_name) ? -1 : 0));
    }, err => {
      this.data = [];
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

    this.blockHidden = false;
    this.clusterHidden = false;
    // api call to get the schoolwise data for selected district, block, cluster
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.patExceptionBlock({ grade: this.grade, timePeriod: this.period }).subscribe(result => {
      this.myData = this.service.patExceptionSchoolPerClustter(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId, { grade: this.grade, timePeriod: this.period }).subscribe(res => {
        this.data = res;
        this.markers = this.schoolMarkers = this.data['data'];

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
          radius: 3.5,
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
        globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
        var fileName = "School_per_cluster_report";
        this.genericFun(this.data, options, fileName);
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
    this.schoolCount = '';

    if (data['data'].length > 0) {
      this.markers = data['data']
      this.markers = this.markers.sort((a, b) => (parseInt(a.percentage_schools_with_missing_data) < parseInt(b.percentage_schools_with_missing_data)) ? 1 : -1)
      // generate color gradient
      let colors;
      if (options.level == 'school') {
        colors = this.markers.length == 1 ? ['red'] : this.commonService.exceptionColor().generateGradient('#FF0000', '#FF0000', this.markers.length, 'rgb');
      } else {
        colors = this.markers.length == 1 ? ['red'] : this.commonService.exceptionColor().generateGradient('#FF0000', '#7FFF00', this.markers.length, 'rgb');
      }
      this.colors = colors;
      // attach values to markers
      for (var i = 0; i < this.markers.length; i++) {
        this.getLatLng(options.level, this.markers[i]);
        var markerIcon;
        markerIcon = this.commonService.initMarkers(this.latitude, this.longitude, this.colors[i], options.radius, options.strokeWeight, options.weight, options.level);

        // data to show on the tooltip for the desired levels
        if (options.level) {
          this.generateToolTip(this.markers[i], options.level, markerIcon, this.strLat, this.strLng);
          // to download the report
          this.fileName = fileName;
        }
      }

      this.commonService.loaderAndErr(this.data);
      this.changeDetection.markForCheck();
    }
    this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
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
    for (var i = 0; i < this.markers.length; i++) {
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
  }

  subject;
  onSubjectSelect(data) {
    // this.subject = data;
    // let options = {
    //   radius: 3.5,
    //   fillOpacity: 1,
    //   strokeWeight: 0.01,
    //   weight: 1,
    //   mapZoom: this.commonService.zoomLevel,
    //   centerLat: this.lat,
    //   centerLng: this.lng,
    //   level: this.levelWise
    // }
    // // console.log(this.markers);
    // var filtered = this.markers.filter(a => {
    //   console.log(a.subject == this.subject)
    //   return (a.subject == this.subject)
    // });
    // console.log(filtered);
    // if (this.markers.length > 0) {
    //   this.markers = this.markers.sort((a, b) => (parseInt(a.percentage_schools_with_missing_data) < parseInt(b.percentage_schools_with_missing_data)) ? 1 : -1)
    //   // generate color gradient
    //   let colors = this.markers.length == 1 ? ['red'] : this.commonService.exceptionColor().generateGradient('#FF0000', '#FF0000', this.markers.length, 'rgb');
    //   this.colors = colors;

    //   if (this.markers.length !== 0) {
    //     for (let i = 0; i < this.markers.length; i++) {
    //       var markerIcon;
    //       markerIcon = this.commonService.initMarkers(this.latitude, this.longitude, this.colors[i], options.radius, options.strokeWeight, options.weight, options.level);
    //       this.generateToolTip(this.markers[i], options.level, markerIcon, this.strLat, this.strLng);
    //       // to download the report
    //       this.fileName = `Subject_wise_data_${this.levelWise}`;
    //     }

    //     globalMap.doubleClickZoom.enable();
    //     globalMap.scrollWheelZoom.enable();
    //     globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
    //     globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);

    //     this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

    //     this.commonService.loaderAndErr(this.data);
    //     this.changeDetection.markForCheck();
    //   }
    // }
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

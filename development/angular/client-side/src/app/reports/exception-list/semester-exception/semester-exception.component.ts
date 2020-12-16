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
  public skul: boolean = false;
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

  public semesters = [{ id: 1, name: "Semester 1" }, { id: 2, name: "Semester 2" }];
  public semester = 2;
  public levelWise = '';

  public myData;
  state: string;
  // initial center position for the map
  public lat: any;
  public lng: any;

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
    this.commonService.initMap('semExMap', [[this.lat, this.lng]]);
    globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.districtWise();

  }

  semSelect() {
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

      // api call to get all the districts data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.semCompletionDist({ sem: this.semester }).subscribe(res => {
        this.data = res;
        // to show only in dropdowns
        this.districtMarkers = this.data['data'];

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

      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.semCompletionBlock({ sem: this.semester }).subscribe(res => {
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
          let colors = this.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;
          this.blockMarkers = result;

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

      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.semCompletionCluster({ sem: this.semester }).subscribe(res => {
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
          let colors = this.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;
          this.clusterMarkers = result;

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

      // api call to get the all schools data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.semCompletionSchool({ sem: this.semester }).subscribe(res => {
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
          let colors = this.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;

          this.schoolMarkers = result;
          if (this.schoolMarkers.length !== 0) {
            for (let i = 0; i < this.schoolMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.schoolMarkers[i].school_latitude, this.schoolMarkers[i].school_longitude, this.colors[i], 0.9, 1, 0.4, options.level);

              this.generateToolTip(this.schoolMarkers[i], options.level, markerIcon, "school_latitude", "school_longitude");

              // to download the report
              this.fileName = "School_wise_report";
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
    this.myData = this.service.semCompletionBlockPerDist(districtId, { sem: this.semester }).subscribe(res => {
      this.data = res;

      this.blockMarkers = this.data['data'];
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
    this.myData = this.service.semCompletionClusterPerBlock(this.districtHierarchy.distId, blockId, { sem: this.semester }).subscribe(res => {
      this.data = res;
      this.clusterMarkers = this.data['data'];
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
    this.myData = this.service.semCompletionBlock({ sem: this.semester }).subscribe(result => {
      this.myData = this.service.semCompletionSchoolPerClustter(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId, { sem: this.semester }).subscribe(res => {
        this.data = res;
        this.schoolMarkers = this.data['data'];

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
      let colors = this.color().generateGradient('#FF0000', '#7FFF00', this.markers.length, 'rgb');
      this.colors = colors;

      // attach values to markers
      for (var i = 0; i < this.markers.length; i++) {
        var lat, strLat; var lng, strLng;
        if (options.level == "district") {
          lat = this.markers[i].district_latitude;
          strLat = "district_latitude";
          lng = this.markers[i].district_longitude;
          strLng = "district_longitude";
        }
        if (options.level == "block") {
          lat = this.markers[i].block_latitude;
          strLat = "block_latitude";
          lng = this.markers[i].block_longitude;
          strLng = "block_longitude";
        }
        if (options.level == "cluster") {
          lat = this.markers[i].cluster_latitude;
          strLat = "cluster_latitude";
          lng = this.markers[i].cluster_longitude;
          strLng = "cluster_longitude";
        }
        if (options.level == "school") {
          lat = this.markers[i].school_latitude;
          strLat = "school_latitude";
          lng = this.markers[i].school_longitude;
          strLng = "school_longitude";
        }

        var markerIcon;
        markerIcon = this.commonService.initMarkers(lat, lng, this.colors[i], options.radius, options.strokeWeight, options.weight, options.level);

        // data to show on the tooltip for the desired levels
        if (options.level) {
          this.generateToolTip(this.markers[i], options.level, markerIcon, strLat, strLng);
          // to download the report
          this.fileName = fileName;
        }
      }

      this.commonService.loaderAndErr(this.data);
      this.changeDetection.markForCheck();
    }
    this.schoolCount = this.data['footer'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
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


  //color gredient generation....
  public color() {
    // Converts a #ffffff hex string into an [r,g,b] array
    function hex2rgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    // Inverse of the above
    function rgb2hex(rgb) {
        return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }

    // Interpolates two [r,g,b] colors and returns an [r,g,b] of the result

    function _interpolateRgb(color1, color2, factor) {
        if (arguments.length < 3) { factor = 0.5; }

        let result = color1.slice();

        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    }

    function generateGradient(color1, color2, total, interpolation) {
        const colorStart = typeof color1 === 'string' ? hex2rgb(color1) : color1;
        const colorEnd = typeof color2 === 'string' ? hex2rgb(color2) : color2;

        // will the gradient be via RGB or HSL
        switch (interpolation) {
            case 'rgb':
                return colorsToGradientRgb(colorStart, colorEnd, total);
            case 'hsl':
            //   return colorsToGradientHsl(colorStart, colorEnd, total);
            default:
                return false;
        }
    }

    function colorsToGradientRgb(startColor, endColor, steps) {
        // returns array of hex values for color, since rgb would be an array of arrays and not strings, easier to handle hex strings
        let arrReturnColors = [];
        let interimColorRGB;
        let interimColorHex;
        const totalColors = steps;
        const factorStep = 1 / (totalColors - 1);

        for (let idx = 0; idx < totalColors; idx++) {
            interimColorRGB = _interpolateRgb(startColor, endColor, factorStep * idx);
            interimColorHex = rgb2hex(interimColorRGB);
            arrReturnColors.push(interimColorHex);
        }
        return arrReturnColors;
    }
    return {
        generateGradient
    };
}
}

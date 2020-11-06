import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SemesterReportService } from '../../../services/semester-report.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { KeycloakSecurityService } from '../../../keycloak-security.service';
import { AppServiceComponent, globalMap } from '../../../app.service';

@Component({
  selector: 'app-sem-view',
  templateUrl: './sem-view.component.html',
  styleUrls: ['./sem-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SemViewComponent implements OnInit, OnDestroy {

  impressionId = Math.floor(100000 + Math.random() * 900000);
  pageId = "Semester";
  userId;
  type = "";
  public btnId;
  date = new Date();
  edate;
  end_time;
  start_time = Math.floor(this.date.getTime() / 1000.0);
  // public telemData = {
  //   impression: {
  //     pageId: this.pageId,
  //     impressionId: this.impressionId, // unique id of the page
  //     uid: this.userId, // userid
  //     type: this.type, // click,select,search
  //     startTime: this.start_time, // starttime when user comes to that page
  //     endTime: this.end_time
  //   },
  //   interact: []
  // }

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

  constructor(
    public http: HttpClient,
    public service: SemesterReportService,
    public commonService: AppServiceComponent,
    public router: Router,
    public keyCloakSevice: KeycloakSecurityService,
    private changeDetection: ChangeDetectorRef,
  ) {
  }

  ngOnDestroy() { }

  ngOnInit() {
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    var eventType = "pageLoad";
    this.btnId = "";
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);
    this.commonService.initMap('semMap');
    this.districtWise();
  }

  homeClick(event) {
    var eventType = event.type;
    this.btnId = event.target.id;
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);
    this.semester = 2;
    this.districtWise();
  }

  semSelect() {
    if (this.skul) {
      if (this.levelWise === "district") {
        this.districtWise();
      }
      if (this.levelWise === "block") {
        this.blockWise(event);
      }
      if (this.levelWise === "cluster") {
        this.clusterWise(event);
      }
      if (this.levelWise === "school") {
        this.schoolWise(event);
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
      this.districtMarkers = [];
      this.reportData = [];
      this.schoolCount = '';
      this.studentCount = '';

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
      this.myData = this.service.all_dist_sem_data({ sem: this.semester }).subscribe(res => {
        this.data = res;
        // to show only in dropdowns
        this.districtMarkers = this.data['sortedData'];

        // options to set for markers in the map
        let options = {
          radius: 5,
          fillOpacity: 1,
          strokeWeight: 0.01,
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
          level: 'district'
        }
        this.fileName = "district_wise_sem_report";
        this.genericFun(this.data, options, this.fileName);

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
  blockWise(event) {
    var eventType = event.type;
    this.btnId = event.target.id;
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);

    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "block";
      this.fileName = "block_wise_sem_report"
      this.reportData = [];
      this.schoolCount = '';
      this.studentCount = '';

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
      this.myData = this.service.all_block_sem_data({ sem: this.semester }).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
        }
        if (this.data['sortedData'].length > 0) {
          let result = this.data['sortedData']
          this.blockMarkers = [];
          // generate color gradient
          let colors = this.commonService.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;
          this.blockMarkers = result;

          if (this.blockMarkers.length !== 0) {
            for (let i = 0; i < this.blockMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.blockMarkers[i].lat, this.blockMarkers[i].lng, this.colors[i], 3.5, 1, 0.01, this.levelWise);
              this.generateToolTip(markerIcon, this.blockMarkers[i], this.levelWise);
            }

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);

            this.schoolCount = this.data['totalValues'].totalSchools;
            this.studentCount = this.data['totalValues'].totalStudents;

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
  clusterWise(event) {
    var eventType = event.type;
    this.btnId = event.target.id;
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "cluster";
      this.fileName = "cluster_wise_sem_report"
      this.reportData = [];
      this.schoolCount = '';
      this.studentCount = '';

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
      this.myData = this.service.all_cluster_sem_data({ sem: this.semester }).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
        }
        if (this.data['sortedData'].length > 0) {
          let result = this.data['sortedData']
          this.clusterMarkers = [];
          // generate color gradient
          let colors = this.commonService.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;
          this.clusterMarkers = result;

          if (this.clusterMarkers.length !== 0) {
            for (let i = 0; i < this.clusterMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.clusterMarkers[i].lat, this.clusterMarkers[i].lng, this.colors[i], 0, 1, 0.01, this.levelWise);
              this.generateToolTip(markerIcon, this.clusterMarkers[i], this.levelWise);
            }

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);

            this.schoolCount = this.data['totalValues'].totalSchools;
            this.studentCount = this.data['totalValues'].totalStudents;

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
  schoolWise(event) {
    var eventType = event.type;
    this.btnId = event.target.id;
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);

    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      this.levelWise = "school";
      this.fileName = "school_wise_sem_report"
      this.reportData = [];
      this.schoolCount = '';
      this.studentCount = '';
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
      this.myData = this.service.all_school_sem_data({ sem: this.semester }).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
        }
        this.schoolMarkers = [];
        if (this.data['sortedData'].length > 0) {
          let result = this.data['sortedData']

          // generate color gradient
          let colors = this.commonService.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;

          this.schoolMarkers = result;
          if (this.schoolMarkers.length !== 0) {
            for (let i = 0; i < this.schoolMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.schoolMarkers[i].lat, this.schoolMarkers[i].lng, this.colors[i], 0, 0, 0, this.levelWise);
              this.generateToolTip(markerIcon, this.schoolMarkers[i], this.levelWise);
            }

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);


            this.schoolCount = this.data['totalValues'].totalSchools;
            this.studentCount = this.data['totalValues'].totalStudents;

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

  distSelect(event, districtId) {
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType);
    this.onDistrictSelect(districtId);
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
    this.myData = this.service.block_wise_sem_data(districtId, { sem: this.semester }).subscribe(res => {
      this.data = res;

      this.blockMarkers = this.data['sortedData'];
      // set hierarchy values
      this.districtHierarchy = {
        distId: this.data['sortedData'][0].district_id,
        districtName: this.data['sortedData'][0].district_name
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
        mapZoom: 8.3,
        centerLat: this.data['sortedData'][0].lat,
        centerLng: this.data['sortedData'][0].lng,
        level: 'block'
      }
      this.fileName = "Blocks_per_district_sem_report";
      this.genericFun(this.data, options, this.fileName);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.blockName > b.blockName) ? 1 : ((b.blockName > a.blockName) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  blockSelect(event, blockId) {
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType);
    this.onBlockSelect(blockId);
  }

  // to load all the clusters for selected block for state data on the map
  onBlockSelect(blockId) {
    // var date = new Date();
    // var timeStamp = Math.floor(date.getTime() / 1000.0);
    // this.telemData.interact.push(
    //   {
    //     selectId: 'block select', // id of the interaction like button_id, dropdown_id etc
    //     uid: this.userId, // userid
    //     type: 'select', // click,select,search
    //     pageid: this.telemData.impression.pageId, // unique id of the page where user is interacting
    //     impressionId: this.telemData.impression.impressionId,
    //     timestamp: timeStamp
    //   }
    // );
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
    this.myData = this.service.cluster_wise_sem_data(this.districtHierarchy.distId, blockId, { sem: this.semester }).subscribe(res => {
      this.data = res;
      this.clusterMarkers = this.data['sortedData'];
      var myBlocks = [];
      this.blockMarkers.forEach(element => {
        if (element.district_id === this.districtHierarchy.distId) {
          myBlocks.push(element);
        }
      });
      this.blockMarkers = myBlocks;

      // set hierarchy values
      this.blockHierarchy = {
        distId: this.data['sortedData'][0].district_id,
        districtName: this.data['sortedData'][0].district_name,
        blockId: this.data['sortedData'][0].block_id,
        blockName: this.data['sortedData'][0].block_name
      }
      this.districtId = this.data['sortedData'][0].district_id;
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
        mapZoom: 10,
        centerLat: this.data['sortedData'][0].lat,
        centerLng: this.data['sortedData'][0].lng,
        level: 'cluster'
      }
      this.fileName = "clusters_per_block_sem_report";
      this.genericFun(this.data, options, this.fileName);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.clusterName > b.clusterName) ? 1 : ((b.clusterName > a.clusterName) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  clusterSelect(event, clusterId) {
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType);
    this.onClusterSelect(clusterId);
  }
  // to load all the schools for selected cluster for state data on the map
  onClusterSelect(clusterId) {
    // var date = new Date();
    // var timeStamp = Math.floor(date.getTime() / 1000.0);
    // this.telemData.interact.push(
    //   {
    //     selectId: 'cluster select', // id of the interaction like button_id, dropdown_id etc
    //     uid: this.userId, // userid
    //     type: 'select', // click,select,search
    //     pageid: this.telemData.impression.pageId, // unique id of the page where user is interacting
    //     impressionId: this.telemData.impression.impressionId,
    //     timestamp: timeStamp
    //   }
    // );
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
    this.myData = this.service.all_block_sem_data({ sem: this.semester }).subscribe(result => {
      this.myData = this.service.school_wise_sem_data(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId, { sem: this.semester }).subscribe(res => {
        this.data = res;
        this.schoolMarkers = this.data['sortedData'];

        var markers = result['sortedData'];
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
          distId: this.data['sortedData'][0].district_id,
          districtName: this.data['sortedData'][0].district_name,
          blockId: this.data['sortedData'][0].block_id,
          blockName: this.data['sortedData'][0].block_name,
          clusterId: this.data['sortedData'][0].cluster_id,
          clusterName: this.data['sortedData'][0].cluster_name,
        }

        this.districtHierarchy = {
          distId: this.data['sortedData'][0].district_id
        }

        this.districtId = this.data['sortedData'][0].district_id;
        this.blockId = this.data['sortedData'][0].block_id;
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
          mapZoom: 12,
          centerLat: this.data['sortedData'][0].lat,
          centerLng: this.data['sortedData'][0].lng,
          level: "school"
        }
        this.fileName = "Schools_per_cluster_sem_report";
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
    this.markers = [];
    this.schoolCount = '';
    this.studentCount = '';

    if (data['sortedData'].length > 0) {
      this.markers = data['sortedData']

      // generate color gradient
      let colors = this.commonService.color().generateGradient('#FF0000', '#7FFF00', this.markers.length, 'rgb');
      this.colors = colors;

      // attach values to markers
      for (var i = 0; i < this.markers.length; i++) {
        var markerIcon = this.commonService.initMarkers(this.markers[i].lat, this.markers[i].lng, this.colors[i], options.radius, options.strokeWeight, 1, options.level);
        globalMap.setZoom(options.mapZoom);

        // data to show on the tooltip for the desired levels
        if (options.level) {
          this.generateToolTip(markerIcon, this.markers[i], options.level);
          this.fileName = fileName;
        }
      }

      this.commonService.loaderAndErr(this.data);
      this.changeDetection.markForCheck();
    }
    this.schoolCount = this.data['totalValues'].totalSchools;
    this.studentCount = this.data['totalValues'].totalStudents;
    globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
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
      if (level != "school") {
        markerIcon.on('click', this.onClick_Marker, this)
      }
      markerIcon.myJsonData = markers;
    }
  }

  //Generate dynamic tool-tip
  generateToolTip(markerIcon, markers, levelWise) {
    this.popups(markerIcon, markers, levelWise);
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

    this.reportData.push(orgObject);

    var yourData = this.commonService.getInfoFrom(orgObject, "semester_performance", levelWise, "std-attd", undefined, undefined).join(" <br>");
    const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
      yourData);
    markerIcon.addTo(globalMap).bindPopup(popup);
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
    var eventType = event.type;
    this.btnId = 'marker';
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);

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
  downloadReport(event) {
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType);
    this.reportData.forEach(element => {
      if (element.number_of_students != undefined) {
        element['number_of_students'] = element.number_of_students.replace(/\,/g, '');
      }
      if (element.number_of_schools != undefined) {
        element['number_of_schools'] = element.number_of_schools.replace(/\,/g, '');
      }
    });
    this.commonService.download(this.fileName, this.reportData);
  }
  trackInteract(date, id, type) {
    // var timeStamp = Math.floor(date.getTime() / 1000.0);
    // this.telemData.interact.push(
    //   {
    //     eventId: id, // id of the interaction like button_id, dropdown_id etc
    //     uid: this.userId, // userid
    //     type: type, // click,select,search
    //     pageid: this.telemData.impression.pageId, // unique id of the page where user is interacting
    //     impressionId: this.telemData.impression.impressionId,
    //     timestamp: timeStamp
    //   }
    // );
  }


}
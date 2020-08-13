import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import * as data from '../../assets/india.json';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { KeycloakSecurityService } from '../keycloak-security.service';

var globalMap;

@Component({
  selector: 'app-sem-view',
  templateUrl: './sem-view.component.html',
  styleUrls: ['./sem-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  public myData;

  constructor(
    public http: HttpClient,
    public service: AppServiceComponent,
    public router: Router,
    public keyCloakSevice: KeycloakSecurityService,
    private changeDetection: ChangeDetectorRef,
  ) {
    service.logoutOnToeknExpire();
    // this.userId = this.telemData.impression.uid = keyCloakSevice.kc.tokenParsed.sub;
    // service.telemetryData[1].Semester.push(this.telemData);
  }

  ngOnDestroy() {
    // this.edate = new Date();
    // this.end_time = Math.floor(this.edate.getTime() / 1000.0);
    // this.telemData.impression.endTime = this.end_time;

    // var dateObj = {
    //   year: this.edate.getFullYear(),
    //   month: this.edate.getMonth() + 1,
    //   date: this.edate.getDate()
    // }

    // this.service.telemetry(dateObj).subscribe(res => {
    //   console.log(res);
    // });
  }

  ngOnInit() {
    var eventType = "pageLoad";
    this.btnId = "";
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);

    document.getElementById('backBtn').style.display = "none";
    this.initMap();
    this.districtWise();
    document.getElementById('homeBtn').style.display = "Block";
  }

  //Initialisation of Map  
  initMap() {
    const lat = 22.3660414123535;
    const lng = 71.48396301269531;
    globalMap = L.map('map', { zoomControl: false }).setView([lat, lng], 7);
    applyCountryBorder(globalMap);

    function applyCountryBorder(map) {
      L.geoJSON(data['features'][0], {
        color: "#a9a9a9",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.0
      }).addTo(map);
    }
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}?access_token={token}',
      {
        token: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
        id: 'mapbox.streets',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        minZoom: 4,
        maxZoom: 18,
      }
    ).addTo(globalMap);
  }

  // to load and hide the spinner 
  loaderAndErr() {
    if (this.data.length !== 0) {
      document.getElementById('spinner').style.display = 'none';
    } else {
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('errMsg').style.color = 'red';
      document.getElementById('errMsg').style.display = 'block';
      document.getElementById('errMsg').innerHTML = 'No data found';
    }
  }

  errMsg() {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
  }

  homeClick(event) {
    var eventType = event.type;
    this.btnId = event.target.id;
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);
    this.districtWise();
  }
  // to load all the districts for state data on the map
  districtWise() {
    try {

      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.districtId = undefined;
      this.errMsg();

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
      this.myData = this.service.all_dist_sem_data().subscribe(res => {
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
        this.genericFun(this.data, options);

        // sort the districtname alphabetically
        this.districtMarkers.sort((a, b) => (a.districtName > b.districtName) ? 1 : ((b.districtName > a.districtName) ? -1 : 0));
      }, err => {
        this.data = [];
        this.loaderAndErr();
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
      this.errMsg();
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
      this.myData = this.service.all_block_sem_data().subscribe(res => {
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
          let colors = this.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;
          this.blockMarkers = result;

          if (this.blockMarkers.length !== 0) {
            for (let i = 0; i < this.blockMarkers.length; i++) {
              var markerIcon = L.circleMarker([this.blockMarkers[i].lat, this.blockMarkers[i].lng], {
                // renderer: myRenderer,
                radius: 3.5,
                color: this.colors[i],
                fillColor: this.colors[i],
                fillOpacity: 1,
                strokeWeight: 0.01
              }).addTo(globalMap);

              const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
                "<b>Semester Performance: </b>" + "&nbsp;" + this.blockMarkers[i].assesmentPercentage + " %" +
                "<br><b>District: </b>" + "&nbsp;" + this.blockMarkers[i].districtName +
                "<br><b>Block: </b>" + "&nbsp;" + this.blockMarkers[i].blockName +
                "<br><b>Grade 3:</b>" + "&nbsp;" + this.blockMarkers[i].grade_3 + " %" +
                "<br><b>Grade 4:</b>" + "&nbsp;" + this.blockMarkers[i].grade_4 + " %" +
                "<br><b>Grade 5:</b>" + "&nbsp;" + this.blockMarkers[i].grade_5 + " %" +
                "<br><b>Grade 6:</b>" + "&nbsp;" + this.blockMarkers[i].grade_6 + " %" +
                "<br><b>Grade 7:</b>" + "&nbsp;" + this.blockMarkers[i].grade_7 + " %" +
                "<br><b>Grade 8:</b>" + "&nbsp;" + this.blockMarkers[i].grade_8 + " %" +
                "<br><b>Number of schools:</b>" + "&nbsp;" + this.blockMarkers[i].schoolsCount +
                "<br><b>Number of students:</b>" + "&nbsp;" + this.blockMarkers[i].studentsCount +
                "<br><b>% of less than 33%:</b>" + "&nbsp;" + this.blockMarkers[i].percent_below_33 + " %" + ` (${this.blockMarkers[i].value_below_33} out of ${this.blockMarkers[i].schoolsCount})` +
                "<br><b>% of 33% to 60%:</b>" + "&nbsp;" + this.blockMarkers[i].percent_between_33_60 + " %" + ` (${this.blockMarkers[i].value_between_33_60} out of ${this.blockMarkers[i].schoolsCount})` +
                "<br><b>% of 60% to 75%:</b>" + "&nbsp;" + this.blockMarkers[i].percent_between_60_75 + " %" + ` (${this.blockMarkers[i].value_between_60_75} out of ${this.blockMarkers[i].schoolsCount})` +
                "<br><b>% above 75%:</b>" + "&nbsp;" + this.blockMarkers[i].percent_above_75 + " %" + ` (${this.blockMarkers[i].value_above_75} out of ${this.blockMarkers[i].schoolsCount})`
              );
              markerIcon.addTo(globalMap).bindPopup(popup);

              markerIcon.on('mouseover', function (e) {
                this.openPopup();
              });
              markerIcon.on('mouseout', function (e) {
                this.closePopup();
              });
              markerIcon.on('click', this.onClick_Marker, this);

              this.layerMarkers.addLayer(markerIcon);
              markerIcon.myJsonData = this.blockMarkers[i];
            }

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);

            this.schoolCount = this.data['totalValues'].totalSchools;
            this.studentCount = this.data['totalValues'].totalStudents;

            this.blockMarkers.forEach(schoolData => {
              this.fileName = "Block_wise_report"
              let obj = {
                DistrictId: schoolData.districtId,
                DistrictName: schoolData.districtName,
                BlockId: schoolData.blockId,
                BlockName: schoolData.blockName,
                Semester_Performance: schoolData.assesmentPercentage + " %",
                Grade3: schoolData.grade_3 + " %",
                Grade4: schoolData.grade_4 + " %",
                Grade5: schoolData.grade_5 + " %",
                Grade6: schoolData.grade_6 + " %",
                Grade7: schoolData.grade_7 + " %",
                Grade8: schoolData.grade_8 + " %",
                TotalSchools: Number(schoolData.schoolsCount.replace(/\,/g, '')),
                TotalStudents: Number(schoolData.studentsCount.replace(/\,/g, ''))
              }
              this.reportData.push(obj);
            });
            this.loaderAndErr();
            this.changeDetection.markForCheck();
          }
        }
      }, err => {
        this.data = [];
        this.loaderAndErr();
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
      this.errMsg();
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
      this.myData = this.service.all_cluster_sem_data().subscribe(res => {
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
          let colors = this.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;
          this.clusterMarkers = result;

          if (this.clusterMarkers.length !== 0) {
            for (let i = 0; i < this.clusterMarkers.length; i++) {
              var markerIcon = L.circleMarker([this.clusterMarkers[i].lat, this.clusterMarkers[i].lng], {
                // renderer: myRenderer,
                radius: 0,
                color: this.colors[i],
                fillColor: this.colors[i],
                fillOpacity: 1,
                strokeWeight: 0.01
              }).addTo(globalMap);

              const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
                "<b>Semester Performance: </b>" + "&nbsp;" + this.clusterMarkers[i].assesmentPercentage + " %" +
                "<br><b>District: </b>" + "&nbsp;" + this.clusterMarkers[i].districtName +
                "<br><b>Block: </b>" + "&nbsp;" + this.clusterMarkers[i].blockName +
                "<br><b>Cluster: </b>" + "&nbsp;" + this.clusterMarkers[i].clusterName +
                "<br><b>Grade 3:</b>" + "&nbsp;" + this.clusterMarkers[i].grade_3 + " %" +
                "<br><b>Grade 4:</b>" + "&nbsp;" + this.clusterMarkers[i].grade_4 + " %" +
                "<br><b>Grade 5:</b>" + "&nbsp;" + this.clusterMarkers[i].grade_5 + " %" +
                "<br><b>Grade 6:</b>" + "&nbsp;" + this.clusterMarkers[i].grade_6 + " %" +
                "<br><b>Grade 7:</b>" + "&nbsp;" + this.clusterMarkers[i].grade_7 + " %" +
                "<br><b>Grade 8:</b>" + "&nbsp;" + this.clusterMarkers[i].grade_8 + " %" +
                "<br><b>Number of schools:</b>" + "&nbsp;" + this.clusterMarkers[i].schoolsCount +
                "<br><b>Number of students:</b>" + "&nbsp;" + this.clusterMarkers[i].studentsCount +
                "<br><b>% of less than 33%:</b>" + "&nbsp;" + this.clusterMarkers[i].percent_below_33 + " %" + ` (${this.clusterMarkers[i].value_below_33} out of ${this.clusterMarkers[i].schoolsCount})` +
                "<br><b>% of 33% to 60%:</b>" + "&nbsp;" + this.clusterMarkers[i].percent_between_33_60 + " %" + ` (${this.clusterMarkers[i].value_between_33_60} out of ${this.clusterMarkers[i].schoolsCount})` +
                "<br><b>% of 60% to 75%:</b>" + "&nbsp;" + this.clusterMarkers[i].percent_between_60_75 + " %" + ` (${this.clusterMarkers[i].value_between_60_75} out of ${this.clusterMarkers[i].schoolsCount})` +
                "<br><b>% above 75%:</b>" + "&nbsp;" + this.clusterMarkers[i].percent_above_75 + " %" + ` (${this.clusterMarkers[i].value_above_75} out of ${this.clusterMarkers[i].schoolsCount})`
              );
              markerIcon.addTo(globalMap).bindPopup(popup);

              markerIcon.on('mouseover', function (e) {
                this.openPopup();
              });
              markerIcon.on('mouseout', function (e) {
                this.closePopup();
              });
              markerIcon.on('click', this.onClick_Marker, this);

              this.layerMarkers.addLayer(markerIcon);
              markerIcon.myJsonData = this.clusterMarkers[i];
            }

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);

            this.schoolCount = this.data['totalValues'].totalSchools;
            this.studentCount = this.data['totalValues'].totalStudents;

            this.clusterMarkers.forEach(schoolData => {
              this.fileName = "Cluster_wise_report"
              let obj = {
                DistrictId: schoolData.districtId,
                DistrictName: schoolData.districtName,
                BlockId: schoolData.blockId,
                BlockName: schoolData.blockName,
                ClusterId: schoolData.clusterId,
                ClusterName: schoolData.clusterName,
                Semester_Performance: schoolData.assesmentPercentage + " %",
                Grade3: schoolData.grade_3 + " %",
                Grade4: schoolData.grade_4 + " %",
                Grade5: schoolData.grade_5 + " %",
                Grade6: schoolData.grade_6 + " %",
                Grade7: schoolData.grade_7 + " %",
                Grade8: schoolData.grade_8 + " %",
                TotalSchools: Number(schoolData.schoolsCount.replace(/\,/g, '')),
                TotalStudents: Number(schoolData.studentsCount.replace(/\,/g, ''))
              }
              this.reportData.push(obj);
            });
            this.loaderAndErr();
            this.changeDetection.markForCheck();
          }
        }
      }, err => {
        this.data = [];
        this.loaderAndErr();
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
      this.errMsg();
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
      this.myData = this.service.all_school_sem_data().subscribe(res => {
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
          let colors = this.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;

          this.schoolMarkers = result;
          if (this.schoolMarkers.length !== 0) {
            for (let i = 0; i < this.schoolMarkers.length; i++) {
              var markerIcon = L.circleMarker([this.schoolMarkers[i].lat, this.schoolMarkers[i].lng], {
                // renderer: myRenderer,
                radius: 0,
                color: this.colors[i],
                fillColor: this.colors[i],
                fillOpacity: 1,
                weight: 0,
                strokeWeight: 0
              }).addTo(globalMap);

              const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
                "<b>Semester Performance: </b>" + "&nbsp;" + this.schoolMarkers[i].assesmentPercentage + " %" +
                "<br><b>District: </b>" + "&nbsp;" + this.schoolMarkers[i].districtName +
                "<br><b>Block: </b>" + "&nbsp;" + this.schoolMarkers[i].blockName +
                "<br><b>Cluster: </b>" + "&nbsp;" + this.schoolMarkers[i].clusterName +
                "<br><b>School: </b>" + "&nbsp;" + this.schoolMarkers[i].schoolName +
                "<br><b>Grade 3:</b>" + "&nbsp;" + this.schoolMarkers[i].grade_3 + " %" +
                "<br><b>Grade 4:</b>" + "&nbsp;" + this.schoolMarkers[i].grade_4 + " %" +
                "<br><b>Grade 5:</b>" + "&nbsp;" + this.schoolMarkers[i].grade_5 + " %" +
                "<br><b>Grade 6:</b>" + "&nbsp;" + this.schoolMarkers[i].grade_6 + " %" +
                "<br><b>Grade 7:</b>" + "&nbsp;" + this.schoolMarkers[i].grade_7 + " %" +
                "<br><b>Grade 8:</b>" + "&nbsp;" + this.schoolMarkers[i].grade_8 + " %" +
                "<br><b>Number of students:</b>" + "&nbsp;" + this.schoolMarkers[i].studentsCount
              );
              markerIcon.addTo(globalMap).bindPopup(popup);

              markerIcon.on('mouseover', function (e) {
                this.openPopup();
              });
              markerIcon.on('mouseout', function (e) {
                this.closePopup();
              });

              this.layerMarkers.addLayer(markerIcon);
              markerIcon.myJsonData = this.schoolMarkers[i];
            }

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);

            this.schoolCount = this.data['totalValues'].totalSchools;
            this.studentCount = this.data['totalValues'].totalStudents;

            this.schoolMarkers.forEach(schoolData => {
              this.fileName = "School_wise_report"
              let obj = {
                DistrictId: schoolData.districtId,
                DistrictName: schoolData.districtName,
                BlockId: schoolData.blockId,
                BlockName: schoolData.blockName,
                ClusterId: schoolData.clusterId,
                ClusterName: schoolData.clusterName,
                SchoolId: schoolData.schoolId,
                SchoolName: schoolData.schoolName,
                Semester_Performance: schoolData.assesmentPercentage + " %",
                Grade3: schoolData.grade_3 + " %",
                Grade4: schoolData.grade_4 + " %",
                Grade5: schoolData.grade_5 + " %",
                Grade6: schoolData.grade_6 + " %",
                Grade7: schoolData.grade_7 + " %",
                Grade8: schoolData.grade_8 + " %",
                TotalStudents: Number(schoolData.studentsCount.replace(/\,/g, ''))
              }
              this.reportData.push(obj);
            });
            this.loaderAndErr();
            this.changeDetection.markForCheck();
          }
        }
      }, err => {
        this.data = [];
        this.loaderAndErr();
      });

      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  distSelect(event, districtId) {
    var eventType = event.type;
    this.btnId = event.target.id;
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);
    this.onDistrictSelect(districtId);
  }
  // to load all the blocks for selected district for state data on the map
  onDistrictSelect(districtId) {
    // to clear the existing data on the map layer  
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.errMsg();
    this.blockId = undefined;

    // to show and hide the dropdowns
    this.blockHidden = false;
    this.clusterHidden = true;

    // api call to get the blockwise data for selected district
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.block_wise_sem_data(districtId).subscribe(res => {
      this.data = res;

      this.blockMarkers = this.data['sortedData'];
      // set hierarchy values
      this.districtHierarchy = {
        distId: this.data['sortedData'][0].districtId,
        districtName: this.data['sortedData'][0].districtName
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
      this.genericFun(this.data, options);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.blockName > b.blockName) ? 1 : ((b.blockName > a.blockName) ? -1 : 0));
    }, err => {
      this.data = [];
      this.loaderAndErr();
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  blockSelect(event, blockId) {
    var eventType = event.type;
    this.btnId = event.target.id;
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);
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
    this.errMsg();
    this.clusterId = undefined;

    // to show and hide the dropdowns
    this.blockHidden = false;
    this.clusterHidden = false;

    // api call to get the clusterwise data for selected district, block
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.cluster_wise_sem_data(this.districtHierarchy.distId, blockId).subscribe(res => {
      this.data = res;
      this.clusterMarkers = this.data['sortedData'];
      var myBlocks = [];
      this.blockMarkers.forEach(element => {
        if (element.districtId === this.districtHierarchy.distId) {
          myBlocks.push(element);
        }
      });
      this.blockMarkers = myBlocks;

      this.clusterMarkers.forEach(element => {
        // if (element.clusterName == null) {
        //   element.clusterName = 'NO NAME FOUND';
        // }
      });
      // set hierarchy values
      this.blockHierarchy = {
        distId: this.data['sortedData'][0].districtId,
        districtName: this.data['sortedData'][0].districtName,
        blockId: this.data['sortedData'][0].blockId,
        blockName: this.data['sortedData'][0].blockName
      }
      this.districtId = this.data['sortedData'][0].districtId;
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
      this.genericFun(this.data, options);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.clusterName > b.clusterName) ? 1 : ((b.clusterName > a.clusterName) ? -1 : 0));
    }, err => {
      this.data = [];
      this.loaderAndErr();
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  clusterSelect(event, clusterId) {
    var eventType = event.type;
    this.btnId = event.target.id;
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);
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
    this.errMsg();

    this.blockHidden = false;
    this.clusterHidden = false;
    // api call to get the schoolwise data for selected district, block, cluster
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.all_block_sem_data().subscribe(result => {
      this.myData = this.service.school_wise_sem_data(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId).subscribe(res => {
        this.data = res;
        this.schoolMarkers = this.data['sortedData'];

        var markers = result['sortedData'];
        var myBlocks = [];
        markers.forEach(element => {
          if (element.districtId === this.blockHierarchy.distId) {
            myBlocks.push(element);
          }
        });
        this.blockMarkers = myBlocks;

        var myCluster = [];
        this.clusterMarkers.forEach(element => {
          if (element.blockId === this.blockHierarchy.blockId) {
            myCluster.push(element);
          }
        });
        this.clusterMarkers = myCluster;

        // set hierarchy values
        this.clusterHierarchy = {
          distId: this.data['sortedData'][0].districtId,
          districtName: this.data['sortedData'][0].districtName,
          blockId: this.data['sortedData'][0].blockId,
          blockName: this.data['sortedData'][0].blockName,
          clusterId: this.data['sortedData'][0].clusterId,
          clusterName: this.data['sortedData'][0].clusterName,
        }

        this.districtHierarchy = {
          distId: this.data['sortedData'][0].districtId
        }

        this.districtId = this.data['sortedData'][0].districtId;
        this.blockId = this.data['sortedData'][0].blockId;
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
          level: 'school'
        }
        this.genericFun(this.data, options);
      }, err => {
        this.data = [];
        this.loaderAndErr();
      });
    }, err => {
      this.data = [];
      this.loaderAndErr();
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // common function for all the data to show in the map
  genericFun(data, options) {
    this.reportData = [];
    if (data['sortedData'].length > 0) {
      this.markers = data['sortedData']

      // generate color gradient
      let colors = this.color().generateGradient('#FF0000', '#7FFF00', this.markers.length, 'rgb');
      this.colors = colors;

      // attach values to markers
      for (var i = 0; i < this.markers.length; i++) {
        // this.dateRange = this.markers[i]['data_from_date'] + " to " + this.markers[i]['data_upto_date'];
        var markerIcon;
        if (options.weight) {
          markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: options.radius,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: options.fillOpacity,
            strokeWeight: options.strokeWeight,
            weight: options.weight
          })
        } else {
          markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: options.radius,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: options.fillOpacity,
            strokeWeight: options.strokeWeight
          })
        }

        globalMap.setZoom(options.mapZoom);

        // data to show on the tooltip for the desired levels
        if (options.level == 'district') {
          const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
            "<b>Semester Performance: </b>" + "&nbsp;" + this.markers[i].assesmentPercentage + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].districtName +
            "<br><b>Grade 3:</b>" + "&nbsp;" + this.markers[i].grade_3 + " %" +
            "<br><b>Grade 4:</b>" + "&nbsp;" + this.markers[i].grade_4 + " %" +
            "<br><b>Grade 5:</b>" + "&nbsp;" + this.markers[i].grade_5 + " %" +
            "<br><b>Grade 6:</b>" + "&nbsp;" + this.markers[i].grade_6 + " %" +
            "<br><b>Grade 7:</b>" + "&nbsp;" + this.markers[i].grade_7 + " %" +
            "<br><b>Grade 8:</b>" + "&nbsp;" + this.markers[i].grade_8 + " %" +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schoolsCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].studentsCount +
            "<br><b>% of less than 33%:</b>" + "&nbsp;" + this.markers[i].percent_below_33 + " %" + ` (${this.markers[i].value_below_33} out of ${this.markers[i].schoolsCount})` +
            "<br><b>% of 33% to 60%:</b>" + "&nbsp;" + this.markers[i].percent_between_33_60 + " %" + ` (${this.markers[i].value_between_33_60} out of ${this.markers[i].schoolsCount})` +
            "<br><b>% of 60% to 75%:</b>" + "&nbsp;" + this.markers[i].percent_between_60_75 + " %" + ` (${this.markers[i].value_between_60_75} out of ${this.markers[i].schoolsCount})` +
            "<br><b>% above 75%:</b>" + "&nbsp;" + this.markers[i].percent_above_75 + " %" + ` (${this.markers[i].value_above_75} out of ${this.markers[i].schoolsCount})`
          );
          markerIcon.addTo(globalMap).bindPopup(popup);

          // to download the report
          this.fileName = "District_wise_report";
          let obj = {
            DistrictId: this.markers[i].districtId,
            DistrictName: this.markers[i].districtName,
            Semester_Performance: this.markers[i].assesmentPercentage + " %",
            Grade3: this.markers[i].grade_3 + " %",
            Grade4: this.markers[i].grade_4 + " %",
            Grade5: this.markers[i].grade_5 + " %",
            Grade6: this.markers[i].grade_6 + " %",
            Grade7: this.markers[i].grade_7 + " %",
            Grade8: this.markers[i].grade_8 + " %",
            TotalSchools: Number(this.markers[i].schoolsCount.replace(/\,/g, '')),
            TotalStudents: Number(this.markers[i].studentsCount.replace(/\,/g, ''))
          }
          this.reportData.push(obj);

        } else if (options.level == 'block') {
          const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
            "<b>Semester Performance: </b>" + "&nbsp;" + this.markers[i].assesmentPercentage + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].districtName +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].blockName +
            "<br><b>Grade 3:</b>" + "&nbsp;" + this.markers[i].grade_3 + " %" +
            "<br><b>Grade 4:</b>" + "&nbsp;" + this.markers[i].grade_4 + " %" +
            "<br><b>Grade 5:</b>" + "&nbsp;" + this.markers[i].grade_5 + " %" +
            "<br><b>Grade 6:</b>" + "&nbsp;" + this.markers[i].grade_6 + " %" +
            "<br><b>Grade 7:</b>" + "&nbsp;" + this.markers[i].grade_7 + " %" +
            "<br><b>Grade 8:</b>" + "&nbsp;" + this.markers[i].grade_8 + " %" +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schoolsCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].studentsCount +
            "<br><b>% of less than 33%:</b>" + "&nbsp;" + this.markers[i].percent_below_33 + " %" + ` (${this.markers[i].value_below_33} out of ${this.markers[i].schoolsCount})` +
            "<br><b>% of 33% to 60%:</b>" + "&nbsp;" + this.markers[i].percent_between_33_60 + " %" + ` (${this.markers[i].value_between_33_60} out of ${this.markers[i].schoolsCount})` +
            "<br><b>% of 60% to 75%:</b>" + "&nbsp;" + this.markers[i].percent_between_60_75 + " %" + ` (${this.markers[i].value_between_60_75} out of ${this.markers[i].schoolsCount})` +
            "<br><b>% above 75%:</b>" + "&nbsp;" + this.markers[i].percent_above_75 + " %" + ` (${this.markers[i].value_above_75} out of ${this.markers[i].schoolsCount})`
          );
          markerIcon.addTo(globalMap).bindPopup(popup);
          this.fileName = "Block_Per_dist_report"
          let obj = {
            DistrictId: this.markers[i].districtId,
            DistrictName: this.markers[i].districtName,
            BlockId: this.markers[i].blockId,
            BlockName: this.markers[i].blockName,
            Semester_Performance: this.markers[i].assesmentPercentage + " %",
            Grade3: this.markers[i].grade_3 + " %",
            Grade4: this.markers[i].grade_4 + " %",
            Grade5: this.markers[i].grade_5 + " %",
            Grade6: this.markers[i].grade_6 + " %",
            Grade7: this.markers[i].grade_7 + " %",
            Grade8: this.markers[i].grade_8 + " %",
            TotalSchools: Number(this.markers[i].schoolsCount.replace(/\,/g, '')),
            TotalStudents: Number(this.markers[i].studentsCount.replace(/\,/g, ''))
          }
          this.reportData.push(obj);

        } else if (options.level == 'cluster') {
          const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
            "<b>Semester Performance: </b>" + "&nbsp;" + this.markers[i].assesmentPercentage + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].districtName +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].blockName +
            "<br><b>Cluster: </b>" + "&nbsp;" + this.markers[i].clusterName +
            "<br><b>Grade 3:</b>" + "&nbsp;" + this.markers[i].grade_3 + " %" +
            "<br><b>Grade 4:</b>" + "&nbsp;" + this.markers[i].grade_4 + " %" +
            "<br><b>Grade 5:</b>" + "&nbsp;" + this.markers[i].grade_5 + " %" +
            "<br><b>Grade 6:</b>" + "&nbsp;" + this.markers[i].grade_6 + " %" +
            "<br><b>Grade 7:</b>" + "&nbsp;" + this.markers[i].grade_7 + " %" +
            "<br><b>Grade 8:</b>" + "&nbsp;" + this.markers[i].grade_8 + " %" +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schoolsCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].studentsCount +
            "<br><b>% of less than 33%:</b>" + "&nbsp;" + this.markers[i].percent_below_33 + " %" + ` (${this.markers[i].value_below_33} out of ${this.markers[i].schoolsCount})` +
            "<br><b>% of 33% to 60%:</b>" + "&nbsp;" + this.markers[i].percent_between_33_60 + " %" + ` (${this.markers[i].value_between_33_60} out of ${this.markers[i].schoolsCount})` +
            "<br><b>% of 60% to 75%:</b>" + "&nbsp;" + this.markers[i].percent_between_60_75 + " %" + ` (${this.markers[i].value_between_60_75} out of ${this.markers[i].schoolsCount})` +
            "<br><b>% above 75%:</b>" + "&nbsp;" + this.markers[i].percent_above_75 + " %" + ` (${this.markers[i].value_above_75} out of ${this.markers[i].schoolsCount})`
          );
          markerIcon.addTo(globalMap).bindPopup(popup);
          this.fileName = "Cluster_per_block_report"
          let obj = {
            DistrictId: this.markers[i].districtId,
            DistrictName: this.markers[i].districtName,
            BlockId: this.markers[i].blockId,
            BlockName: this.markers[i].blockName,
            ClusterId: this.markers[i].clusterId,
            ClusterName: this.markers[i].clusterName,
            Semester_Performance: this.markers[i].assesmentPercentage + " %",
            Grade3: this.markers[i].grade_3 + " %",
            Grade4: this.markers[i].grade_4 + " %",
            Grade5: this.markers[i].grade_5 + " %",
            Grade6: this.markers[i].grade_6 + " %",
            Grade7: this.markers[i].grade_7 + " %",
            Grade8: this.markers[i].grade_8 + " %",
            TotalSchools: Number(this.markers[i].schoolsCount.replace(/\,/g, '')),
            TotalStudents: Number(this.markers[i].studentsCount.replace(/\,/g, ''))
          }
          this.reportData.push(obj);

        } else if (options.level == 'school') {
          const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
            "<b>Semester Performance: </b>" + "&nbsp;" + this.markers[i].assesmentPercentage + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].districtName +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].blockName +
            "<br><b>Cluster: </b>" + "&nbsp;" + this.markers[i].clusterName +
            "<br><b>School: </b>" + "&nbsp;" + this.markers[i].schoolName +
            "<br><b>Grade 3:</b>" + "&nbsp;" + this.markers[i].grade_3 + " %" +
            "<br><b>Grade 4:</b>" + "&nbsp;" + this.markers[i].grade_4 + " %" +
            "<br><b>Grade 5:</b>" + "&nbsp;" + this.markers[i].grade_5 + " %" +
            "<br><b>Grade 6:</b>" + "&nbsp;" + this.markers[i].grade_6 + " %" +
            "<br><b>Grade 7:</b>" + "&nbsp;" + this.markers[i].grade_7 + " %" +
            "<br><b>Grade 8:</b>" + "&nbsp;" + this.markers[i].grade_8 + " %" +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].studentsCount
          );
          markerIcon.addTo(globalMap).bindPopup(popup);

          this.fileName = "School_per_cluster_report"
          let obj = {
            DistrictId: this.markers[i].districtId,
            DistrictName: this.markers[i].districtName,
            BlockId: this.markers[i].blockId,
            BlockName: this.markers[i].blockName,
            ClusterId: this.markers[i].clusterId,
            ClusterName: this.markers[i].clusterName,
            SchoolId: this.markers[i].schoolId,
            SchoolName: this.markers[i].schoolName,
            Semester_Performance: this.markers[i].assesmentPercentage + " %",
            Grade3: this.markers[i].grade_3 + " %",
            Grade4: this.markers[i].grade_4 + " %",
            Grade5: this.markers[i].grade_5 + " %",
            Grade6: this.markers[i].grade_6 + " %",
            Grade7: this.markers[i].grade_7 + " %",
            Grade8: this.markers[i].grade_8 + " %",
            TotalStudents: Number(this.markers[i].studentsCount.replace(/\,/g, ''))
          }
          this.reportData.push(obj);
        }

        this.popups(markerIcon, this.markers[i], options);
      }

      this.loaderAndErr();
      this.changeDetection.markForCheck();
    }
    this.schoolCount = this.data['totalValues'].totalSchools;
    this.studentCount = this.data['totalValues'].totalStudents;
    globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
  }

  popups(markerIcon, markers, options) {
    for (var i = 0; i < this.markers.length; i++) {
      markerIcon.on('mouseover', function (e) {
        this.openPopup();
      });
      markerIcon.on('mouseout', function (e) {
        this.closePopup();
      });

      this.layerMarkers.addLayer(markerIcon);
      if (options.level != 'school') {
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
    var eventType = event.type;
    this.btnId = 'marker';
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);

    var data = event.target.myJsonData;
    if (data.districtId && !data.blockId && !data.clusterId) {
      this.stateLevel = 1;
      this.onDistrictSelect(data.districtId)
    }
    if (data.districtId && data.blockId && !data.clusterId) {
      this.stateLevel = 1;
      this.districtHierarchy = {
        distId: data.districtId
      }
      this.onBlockSelect(data.blockId)
    }
    if (data.districtId && data.blockId && data.clusterId) {
      this.stateLevel = 1;
      this.blockHierarchy = {
        distId: data.districtId,
        blockId: data.blockId
      }
      this.onClusterSelect(data.clusterId)
    }
  }

  // to download the excel report
  downloadReport(event) {
    var eventType = event.type;
    this.btnId = event.target.id;
    var date = new Date();
    this.trackInteract(date, this.btnId, eventType);

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

  // to generate the color gradient from red to green based on the attendance percentage values
  color() {
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
    // Taken from the awesome ROT.js roguelike dev library at
    // https://github.com/ondras/rot.js
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
        // case 'hsl':
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
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import * as data from '../../assets/india.json';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';

var globalMap;

@Component({
  selector: 'app-infra-map-visualisation',
  templateUrl: './infra-map-visualisation.component.html',
  styleUrls: ['./infra-map-visualisation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class InfraMapVisualisationComponent implements OnInit {
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
  public infraFilter: any = [];

  public myDistData: any;
  public myBlockData: any = [];
  public myClusterData: any = [];
  public mySchoolData: any = [];

  constructor(
    public http: HttpClient,
    public service: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.initMap();
    this.districtWise();
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
  }

  //Initialisation of Map  
  initMap() {
    const lat = 22.3660414123535;
    const lng = 71.48396301269531;
    globalMap = L.map('infraMap', { zoomControl: false }).setView([lat, lng], 7);
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
      if (this.myDistData != undefined) {
        this.infraFilter = [];
        this.data = this.myDistData['data'];
        for (var i = 0; i < Object.keys(this.data[0].metrics).length; i++) {
          let val = this.changeingStringCases(Object.keys(this.data[0].metrics)[i].replace(/_/g, ' '));
          val = val.replace('Percent', '(%)')
          this.infraFilter.push({ key: Object.keys(this.data[0].metrics)[i], value: val });
        }

        this.infraFilter.unshift({ key: "infrastructure_score", value: "Infrastructure Score" });

        var infraKey = this.infraFilter.filter(function (obj) {
          return obj.key == 'infrastructure_score';
        });

        this.infraFilter = this.infraFilter.filter(function (obj) {
          return obj.key !== 'infrastructure_score';
        });

        this.infraFilter.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        this.infraFilter.splice(0, 0, infraKey[0]);


        // to show only in dropdowns
        this.districtMarkers = this.myDistData['data'];
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
        this.level = options.level;
        var fileName = "District_wise_report";
        this.genericFun(this.myDistData, options, fileName);
        // sort the districtname alphabetically
        this.districtMarkers.sort((a, b) => (a.details.district_name > b.details.district_name) ? 1 : ((b.details.district_name > a.details.district_name) ? -1 : 0));

      } else {
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.infraMapDistWise().subscribe(res => {

          this.myDistData = res;
          this.infraFilter = [];
          this.data = res['data'];
          for (var i = 0; i < Object.keys(this.data[0].metrics).length; i++) {
            let val = this.changeingStringCases(Object.keys(this.data[0].metrics)[i].replace(/_/g, ' '));
            val = val.replace('Percent', '(%)')
            this.infraFilter.push({ key: Object.keys(this.data[0].metrics)[i], value: val });
          }

          this.infraFilter.unshift({ key: "infrastructure_score", value: "Infrastructure Score" });

          var infraKey = this.infraFilter.filter(function (obj) {
            return obj.key == 'infrastructure_score';
          });

          this.infraFilter = this.infraFilter.filter(function (obj) {
            return obj.key !== 'infrastructure_score';
          });

          this.infraFilter.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
          this.infraFilter.splice(0, 0, infraKey[0]);

          // to show only in dropdowns
          this.districtMarkers = this.data;

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
          this.level = options.level;
          this.data.sort((a, b) => (`${a[this.infraData]}` > `${b[this.infraData]}`) ? 1 : ((`${b[this.infraData]}` > `${a[this.infraData]}`) ? -1 : 0));
          var fileName = "District_wise_report";
          this.genericFun(this.myDistData, options, fileName);

          // sort the districtname alphabetically
          this.districtMarkers.sort((a, b) => (a.details.district_name > b.details.district_name) ? 1 : ((b.details.district_name > a.details.district_name) ? -1 : 0));

        }, err => {
          this.data = [];
          this.loaderAndErr();
        });
      }

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
      this.myData = this.service.infraMapAllBlockWise().subscribe(res => {
        this.myBlockData = res['data'];
        //=================================
        this.infraFilter = [];
        this.data = res['data'];
        for (var i = 0; i < Object.keys(this.data[0].metrics).length; i++) {
          let val = this.changeingStringCases(Object.keys(this.data[0].metrics)[i].replace(/_/g, ' '));
          val = val.replace('Percent', '(%)')
          this.infraFilter.push({ key: Object.keys(this.data[0].metrics)[i], value: val });
        }

        this.infraFilter.unshift({ key: "infrastructure_score", value: "Infrastructure Score" });

        var infraKey = this.infraFilter.filter(function (obj) {
          return obj.key == 'infrastructure_score';
        });

        this.infraFilter = this.infraFilter.filter(function (obj) {
          return obj.key !== 'infrastructure_score';
        });

        this.infraFilter.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        this.infraFilter.splice(0, 0, infraKey[0]);
        //=================================
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
          level: "block"
        }
        this.level = 'block_wise';
        this.fileName = "Block_wise_report";

        if (this.data.length > 0) {
          let result = this.data
          this.blockMarkers = [];

          this.blockMarkers = result;

          this.schoolCount = 0;
          if (this.blockMarkers.length !== 0) {
            for (let i = 0; i < this.blockMarkers.length; i++) {
              this.colorGredient(this.blockMarkers[i], this.infraData);
              var markerIcon = L.circleMarker([this.blockMarkers[i].details.latitude, this.blockMarkers[i].details.longitude], {
                radius: 3.5,
                color: this.setColor,
                fillColor: this.setColor,
                fillOpacity: 1,
                strokeWeight: 0.01
              }).addTo(globalMap);

              var infraName = this.infraData;
              let colorText = `style='color:blue !important;'`;
              var details = {};
              var orgObject = {};
              Object.keys(this.blockMarkers[i].details).forEach(key => {
                if (key !== "latitude") {
                  details[key] = this.blockMarkers[i].details[key];
                }
              });
              Object.keys(details).forEach(key => {
                if (key !== "longitude") {
                  orgObject[key] = details[key];
                }
              });
              var yourData = this.getInfoFrom(this.blockMarkers[i].metrics, infraName, colorText, options.level).join(" <br>");
              var yourData1 = this.getInfoFrom(orgObject, infraName, colorText, options.level).join(" <br>");

              const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
                "<b><u>Details</u></b>" +
                "<br>" + yourData1 +
                "<br><br><b><u>School Infrastructure Metrics (% of schools)</u></b>" +
                "<br>" + yourData);
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

              //download report
              var obj = {};
              obj = { ...orgObject, ...this.blockMarkers[i].metrics };
              this.reportData.push(obj);
            }

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);


            //schoolCount
            this.schoolCount = res['footer'];
            this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

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
  clusterWise() {
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
      this.myData = this.service.infraMapAllClusterWise().subscribe(res => {
        this.data = res['data']
        //=================================
        this.infraFilter = [];
        for (var i = 0; i < Object.keys(this.data[0].metrics).length; i++) {
          let val = this.changeingStringCases(Object.keys(this.data[0].metrics)[i].replace(/_/g, ' '));
          val = val.replace('Percent', '(%)')
          this.infraFilter.push({ key: Object.keys(this.data[0].metrics)[i], value: val });
        }

        this.infraFilter.unshift({ key: "infrastructure_score", value: "Infrastructure Score" });

        var infraKey = this.infraFilter.filter(function (obj) {
          return obj.key == 'infrastructure_score';
        });

        this.infraFilter = this.infraFilter.filter(function (obj) {
          return obj.key !== 'infrastructure_score';
        });

        this.infraFilter.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        this.infraFilter.splice(0, 0, infraKey[0]);
        //=================================
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
          level: "cluster"
        }
        this.level = "cluster_wise";
        this.fileName = "Cluster_wise_report";

        if (this.data.length > 0) {
          let result = this.data
          this.clusterMarkers = [];
          this.clusterMarkers = result;
          this.schoolCount = 0;
          if (this.clusterMarkers.length !== 0) {
            for (let i = 0; i < this.clusterMarkers.length; i++) {
              this.colorGredient(this.clusterMarkers[i], this.infraData);
              var markerIcon = L.circleMarker([this.clusterMarkers[i].details.latitude, this.clusterMarkers[i].details.longitude], {
                radius: 0,
                color: this.setColor,
                fillColor: this.setColor,
                fillOpacity: 1,
                strokeWeight: 0.01
              }).addTo(globalMap);

              var infraName = this.infraData;
              let colorText = `style='color:blue !important;'`;
              var details = {};
              var orgObject = {};
              Object.keys(this.clusterMarkers[i].details).forEach(key => {
                if (key !== "latitude") {
                  details[key] = this.clusterMarkers[i].details[key];
                }
              });
              Object.keys(details).forEach(key => {
                if (key !== "longitude") {
                  orgObject[key] = details[key];
                }
              });
              var yourData = this.getInfoFrom(this.clusterMarkers[i].metrics, infraName, colorText, options.level).join(" <br>");
              var yourData1 = this.getInfoFrom(orgObject, infraName, colorText, options.level).join(" <br>");

              const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
                "<b><u>Details</u></b>" +
                "<br>" + yourData1 +
                "<br><br><b><u>School Infrastructure Metrics (% of schools)</u></b>" +
                "<br>" + yourData);
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

              //download report
              var obj = {};
              obj = { ...orgObject, ...this.clusterMarkers[i].metrics };
              this.reportData.push(obj);
            }

            //schoolCount
            this.schoolCount = res['footer'];
            this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);

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
  schoolWise() {
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

      // api call to get the all schools data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.infraMapAllSchoolWise().subscribe(res => {
        this.data = res['data']
        //=================================
        this.infraFilter = [];
        for (var i = 0; i < Object.keys(this.data[0].metrics).length; i++) {
          let val = this.changeingStringCases(Object.keys(this.data[0].metrics)[i].replace(/_/g, ' '));
          val = val.replace('Percent', '(%)')
          this.infraFilter.push({ key: Object.keys(this.data[0].metrics)[i], value: val });
        }

        this.infraFilter.unshift({ key: "infrastructure_score", value: "Infrastructure Score" });

        var infraKey = this.infraFilter.filter(function (obj) {
          return obj.key == 'infrastructure_score';
        });

        this.infraFilter = this.infraFilter.filter(function (obj) {
          return obj.key !== 'infrastructure_score';
        });

        this.infraFilter.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        this.infraFilter.splice(0, 0, infraKey[0]);
        //=================================
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
          level: "school"
        }
        this.level = 'school_wise';
        this.fileName = "School_wise_report";
        this.schoolMarkers = [];
        if (this.data.length > 0) {
          let result = this.data
          this.schoolCount = 0;
          this.schoolMarkers = result;
          if (this.schoolMarkers.length !== 0) {
            for (let i = 0; i < this.schoolMarkers.length; i++) {
              this.colorGredient(this.schoolMarkers[i], this.infraData);
              var markerIcon = L.circleMarker([this.schoolMarkers[i].details.latitude, this.schoolMarkers[i].details.longitude], {
                // renderer: myRenderer,
                radius: 0,
                color: this.setColor,
                fillColor: this.setColor,
                fillOpacity: 1,
                weight: 0,
                strokeWeight: 0
              }).addTo(globalMap);

              var infraName = this.infraData;
              let colorText = `style='color:blue !important;'`;
              var details = {};
              var orgObject = {};
              Object.keys(this.schoolMarkers[i].details).forEach(key => {
                if (key !== "latitude") {
                  details[key] = this.schoolMarkers[i].details[key];
                }
              });
              Object.keys(details).forEach(key => {
                if (key !== "longitude") {
                  orgObject[key] = details[key];
                }
              });
              var detailSchool = {};
              var yourData1;
              if (options.level == "school") {
                Object.keys(orgObject).forEach(key => {
                  if (key !== "total_schools_data_received") {
                    detailSchool[key] = details[key];
                  }
                });
                yourData1 = this.getInfoFrom(detailSchool, infraName, colorText, options.level).join(" <br>");
              } else {
                yourData1 = this.getInfoFrom(orgObject, infraName, colorText, options.level).join(" <br>");
              }
              var yourData = this.getInfoFrom(this.schoolMarkers[i].metrics, infraName, colorText, options.level).join(" <br>");

              const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
                "<b><u>Details</u></b>" +
                "<br>" + yourData1 +
                "<br><br><b><u>School Infrastructure Metrics (% of schools)</u></b>" +
                "<br>" + yourData);
              markerIcon.addTo(globalMap).bindPopup(popup);

              markerIcon.on('mouseover', function (e) {
                this.openPopup();
              });
              markerIcon.on('mouseout', function (e) {
                this.closePopup();
              });

              this.layerMarkers.addLayer(markerIcon);
              markerIcon.myJsonData = this.schoolMarkers[i];

              //download report
              var obj = {};
              obj = { ...detailSchool, ...this.schoolMarkers[i].metrics };
              this.reportData.push(obj);
            }

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);

            //schoolCount
            this.schoolCount = res['footer'];
            this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

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
    this.myData = this.service.infraMapBlockWise(districtId).subscribe(res => {
      this.data = res['data'];
      this.infraFilter = [];
      for (var i = 0; i < Object.keys(this.data[0].metrics).length; i++) {
        let val = this.changeingStringCases(Object.keys(this.data[0].metrics)[i].replace(/_/g, ' '));
        val = val.replace('Percent', '(%)')
        this.infraFilter.push({ key: Object.keys(this.data[0].metrics)[i], value: val });
      }

      this.infraFilter.unshift({ key: "infrastructure_score", value: "Infrastructure Score" });

      var infraKey = this.infraFilter.filter(function (obj) {
        return obj.key == 'infrastructure_score';
      });

      this.infraFilter = this.infraFilter.filter(function (obj) {
        return obj.key !== 'infrastructure_score';
      });

      this.infraFilter.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
      this.infraFilter.splice(0, 0, infraKey[0]);
      //=================================

      this.blockMarkers = this.data;
      // set hierarchy values
      this.districtHierarchy = {
        distId: this.data[0].details.district_id,
        districtName: this.data[0].details.district_name
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
        centerLat: this.data[0].details.latitude,
        centerLng: this.data[0].details.longitude,
        level: 'block'
      }
      this.level = options.level;
      var fileName = "Block_per_dist_report";
      this.genericFun(res, options, fileName);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.details.block_name > b.details.block_name) ? 1 : ((b.details.block_name > a.details.block_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.loaderAndErr();
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the clusters for selected block for state data on the map
  onBlockSelect(blockId) {
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
    this.myData = this.service.infraMapClusterWise(this.districtHierarchy.distId, blockId).subscribe(res => {
      this.data = res['data'];
      //=================================
      this.infraFilter = [];
      for (var i = 0; i < Object.keys(this.data[0].metrics).length; i++) {
        let val = this.changeingStringCases(Object.keys(this.data[0].metrics)[i].replace(/_/g, ' '));
        val = val.replace('Percent', '(%)')
        this.infraFilter.push({ key: Object.keys(this.data[0].metrics)[i], value: val });
      }

      this.infraFilter.unshift({ key: "infrastructure_score", value: "Infrastructure Score" });

      var infraKey = this.infraFilter.filter(function (obj) {
        return obj.key == 'infrastructure_score';
      });

      this.infraFilter = this.infraFilter.filter(function (obj) {
        return obj.key !== 'infrastructure_score';
      });

      this.infraFilter.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
      this.infraFilter.splice(0, 0, infraKey[0]);
      //=================================

      this.clusterMarkers = this.data;
      var myBlocks = [];
      this.blockMarkers.forEach(element => {
        if (element.details.district_id === this.districtHierarchy.distId) {
          myBlocks.push(element);
        }
      });
      this.blockMarkers = myBlocks;

      // set hierarchy values
      this.blockHierarchy = {
        distId: this.data[0].details.district_id,
        districtName: this.data[0].details.district_name,
        blockId: this.data[0].details.block_id,
        blockName: this.data[0].details.block_name
      }
      this.districtId = this.data[0].details.district_id;
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
        centerLat: this.data[0].details.latitude,
        centerLng: this.data[0].details.longitude,
        level: 'cluster'
      }
      this.level = options.level;
      var fileName = "Cluster_per_block_report";
      this.genericFun(res, options, fileName);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.details.cluster_name > b.details.cluster_name) ? 1 : ((b.details.cluster_name > a.details.cluster_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.loaderAndErr();
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the schools for selected cluster for state data on the map
  onClusterSelect(clusterId) {
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
    this.myData = this.service.infraMapAllBlockWise().subscribe((result: any) => {
      this.myData = this.service.infraMapSchoolWise(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId).subscribe(res => {
        this.data = res['data'];
        //=================================
        this.infraFilter = [];
        for (var i = 0; i < Object.keys(this.data[0].metrics).length; i++) {
          let val = this.changeingStringCases(Object.keys(this.data[0].metrics)[i].replace(/_/g, ' '));
          val = val.replace('Percent', '(%)')
          this.infraFilter.push({ key: Object.keys(this.data[0].metrics)[i], value: val });
        }

        this.infraFilter.unshift({ key: "infrastructure_score", value: "Infrastructure Score" });

        var infraKey = this.infraFilter.filter(function (obj) {
          return obj.key == 'infrastructure_score';
        });

        this.infraFilter = this.infraFilter.filter(function (obj) {
          return obj.key !== 'infrastructure_score';
        });

        this.infraFilter.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        this.infraFilter.splice(0, 0, infraKey[0]);
        //=================================

        this.schoolMarkers = this.data;
        var markers = result['data'];
        var myBlocks = [];
        markers.forEach(element => {
          if (element.details.district_id === this.blockHierarchy.distId) {
            myBlocks.push(element);
          }
        });
        this.blockMarkers = myBlocks;

        var myCluster = [];
        this.clusterMarkers.forEach(element => {
          if (element.details.block_id === this.blockHierarchy.blockId) {
            myCluster.push(element);
          }
        });
        this.clusterMarkers = myCluster;

        // set hierarchy values
        this.clusterHierarchy = {
          distId: this.data[0].details.district_id,
          districtName: this.data[0].details.district_name,
          blockId: this.data[0].details.block_id,
          blockName: this.data[0].details.block_name,
          clusterId: this.data[0].details.cluster_id,
          clusterName: this.data[0].details.cluster_name,
        }

        this.districtHierarchy = {
          distId: this.data[0].details.district_id
        }

        this.districtId = this.data[0].details.district_id;
        this.blockId = this.data[0].details.block_id;
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
          centerLat: this.data[0].details.latitude,
          centerLng: this.data[0].details.longitude,
          level: 'school'
        }
        this.level = options.level;
        var fileName = "School_per_block_report";
        this.genericFun(res, options, fileName);
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
  genericFun(data, options, fileName) {
    this.reportData = [];
    this.schoolCount = 0;
    var myData = data['data'];
    if (myData.length > 0) {
      this.markers = myData;
      // attach values to markers
      for (var i = 0; i < this.markers.length; i++) {
        this.colorGredient(this.markers[i], this.infraData);
        var markerIcon: any;
        if (options.weight) {
          markerIcon = L.circleMarker([this.markers[i].details.latitude, this.markers[i].details.longitude], {
            radius: options.radius,
            color: this.setColor,
            fillColor: this.setColor,
            fillOpacity: options.fillOpacity,
            strokeWeight: options.strokeWeight,
            weight: options.weight
          })
        } else {
          markerIcon = L.circleMarker([this.markers[i].details.latitude, this.markers[i].details.longitude], {
            radius: options.radius,
            color: this.setColor,
            fillColor: this.setColor,
            fillOpacity: options.fillOpacity,
            strokeWeight: options.strokeWeight
          })
        }

        globalMap.setZoom(options.mapZoom);

        // data to show on the tooltip for the desired levels
        if (options.level) {
          var infraName = this.infraData;

          //Generate dynamic tool-tip
          let colorText = `style='color:blue !important;'`;
          var details = {};
          var orgObject = {};
          Object.keys(this.markers[i].details).forEach(key => {
            if (key !== "latitude") {
              details[key] = this.markers[i].details[key];
            }
          });
          Object.keys(details).forEach(key => {
            if (key !== "longitude") {
              orgObject[key] = details[key];
            }
          });
          var detailSchool = {};
          var yourData1;
          if (options.level == "school") {
            Object.keys(orgObject).forEach(key => {
              if (key !== "total_schools_data_received") {
                detailSchool[key] = details[key];
              }
            });
            yourData1 = this.getInfoFrom(detailSchool, infraName, colorText, options.level).join(" <br>");
          } else {
            yourData1 = this.getInfoFrom(orgObject, infraName, colorText, options.level).join(" <br>");
          }
          var yourData = this.getInfoFrom(this.markers[i].metrics, infraName, colorText, options.level).join(" <br>");


          const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
            "<b><u>Details</u></b>" +
            "<br>" + yourData1 +
            "<br><br><b><u>School Infrastructure Metrics (% of schools)</u></b>" +
            "<br>" + yourData);
          markerIcon.addTo(globalMap).bindPopup(popup);

          // to download the report
          this.fileName = fileName;
          var obj = {};
          if (options.level == "school") {
            obj = { ...detailSchool, ...this.markers[i].metrics };
          } else {
            obj = { ...orgObject, ...this.markers[i].metrics };
          }
          this.reportData.push(obj);

        }
        this.popups(markerIcon, this.markers[i], options);
      }

      this.loaderAndErr();
      this.changeDetection.markForCheck();
    }
    //schoolCount
    this.schoolCount = data['footer'];
    this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

    globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
  }

  public infraData = 'infrastructure_score';
  public level = '';
  oninfraSelect(data) {
    this.infraData = data;
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

  colorGredient(data, infraData) {
    var dataSet = {};
    if (infraData == 'infrastructure_score') {
      dataSet = data.details;
    } else {
      dataSet = data.metrics;
    }

    if (dataSet[infraData] <= 10) {
      this.setColor = '#a50026';
    }
    if (dataSet[infraData] >= 11 && dataSet[infraData] <= 20) {
      this.setColor = '#d73027';
    }
    if (dataSet[infraData] >= 21 && dataSet[infraData] <= 30) {
      this.setColor = '#f46d43';
    }
    if (dataSet[infraData] >= 31 && dataSet[infraData] <= 40) {
      this.setColor = '#fdae61';
    }
    if (dataSet[infraData] >= 41 && dataSet[infraData] <= 50) {
      this.setColor = '#ffff00';
    }
    if (dataSet[infraData] >= 51 && dataSet[infraData] <= 60) {
      this.setColor = '#bbff33';
    }
    if (dataSet[infraData] >= 61 && dataSet[infraData] <= 70) {
      this.setColor = '#4dff4d';
    }
    if (dataSet[infraData] >= 71 && dataSet[infraData] <= 80) {
      this.setColor = '#66bd63';
    }
    if (dataSet[infraData] >= 81 && dataSet[infraData] <= 90) {
      this.setColor = '#1a9850';
    }
    if (dataSet[infraData] >= 91 && dataSet[infraData] <= 99) {
      this.setColor = '#00b300';
    }
    if (dataSet[infraData] == 100) {
      this.setColor = '#006600';
    }
  }

  //map tooltip automation
  public getInfoFrom(object, infraName, colorText, level) {
    var popupFood = [];
    var stringLine;
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        stringLine = `<span ${infraName == key ? colorText : ''}>` + "<b>" +
          key.replace(
            /\w\S*/g,
            function (txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
          + "</b>" + ": " + object[key] + `</span>`;
      }
      popupFood.push(stringLine);
    }
    return popupFood;
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
    var data = event.target.myJsonData.details;
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

  changeingStringCases(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  // to download the excel report
  downloadReport() {
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
}
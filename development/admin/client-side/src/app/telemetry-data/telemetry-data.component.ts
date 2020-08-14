import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
var globalMap;

@Component({
  selector: 'app-telemetry-data',
  templateUrl: './telemetry-data.component.html',
  styleUrls: ['./telemetry-data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TelemetryDataComponent implements OnInit {
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

  //Choosing year, month, date and hours.......
  years = [{ year: "2020" }];
  months = [];
  dates = [];
  hours = [];

  year;
  month;
  date;
  hour;

  hideMonth = true;
  hideDate = true;
  hideHour = true;

  constructor(
    public http: HttpClient,
    public service: AppService,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
  ) {
  }

  filters() {
    this.months = [];
    this.dates = [];
    this.hours = [];
    var val_i = (new Date()).getMonth() + 1;
    var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (this.year == (new Date()).getFullYear()) {
      for (let i = 0; i < val_i; i++) {
        this.months.push({ id: `${("0" + (i + 1)).slice(-2)}`, name: monthName[i] });
      }
    } else {
      for (let i = 0; i < 12; i++) {
        this.months.push({ id: `${("0" + (i + 1)).slice(-2)}`, name: monthName[i] });
      }
    }

    var dateRange = (new Date()).getDate();
    if (this.month == ("0" + ((new Date()).getMonth() + 1)).slice(-2)) {
      for (let i = 0; i < dateRange; i++) {
        this.dates.push({ date: ("0" + (i + 1)).slice(-2) });
      }
    } else {
      var days = this.getDaysInMonth(this.month, this.year);
      for (let i = 0; i < days; i++) {
        this.dates.push({ date: ("0" + (i + 1)).slice(-2) });
      }
    }

    var hourRange = (new Date()).getHours();
    if (this.date == ("0" + ((new Date()).getDate())).slice(-2)) {
      for (let i = 0; i < hourRange; i++) {
        this.hours.push(({ hour: ("0" + (i)).slice(-2) }));
      }
    } else {
      for (let i = 0; i < 24; i++) {
        this.hours.push(({ hour: ("0" + (i)).slice(-2) }));
      }
    }
    if (this.month != ("0" + ((new Date()).getMonth() + 1)).slice(-2)) {
      for (let i = 0; i < 24; i++) {
        this.hours.push(({ hour: ("0" + (i)).slice(-2) }));
      }
    }
  }

  ngOnInit() {
    this.year = `${(new Date()).getFullYear()}`;
    this.month = ("0" + ((new Date()).getMonth() + 1)).slice(-2);
    this.date = ("0" + ((new Date()).getDate())).slice(-2);
    this.hour = ("0" + ((new Date()).getHours() - 1)).slice(-2);

    document.getElementById('backBtn').style.display = "none";
    this.initMap();
    this.districtWise();
    document.getElementById('homeBtn').style.display = "Block";
    this.filters();
  }

  getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
  };

  //Initialisation of Map  
  initMap() {
    const lat = 22.3660414123535;
    const lng = 71.48396301269531;
    globalMap = L.map('map', { zoomControl: false }).setView([lat, lng], 7);
    // applyCountryBorder(globalMap);

    // function applyCountryBorder(map) {
    //   L.geoJSON(data['features'][0], {
    //     color: "#a9a9a9",
    //     weight: 2,
    //     opacity: 1,
    //     fillOpacity: 0.0
    //   }).addTo(map);
    // }
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

  getYear(year) {
    this.filters();
    this.hideMonth = false;
    this.hideDate = true;
    this.hideHour = true;
    if (this.skul) {
      this.districtWise();
    }
    if (this.dist) {
      this.blockWise();
    }
    if (this.blok) {
      this.clusterWise();
    }
  }
  getMonth(month) {
    this.filters();
    this.hideMonth = false;
    this.hideDate = false;
    this.hideHour = true;
    if (this.skul) {
      this.districtWise();
    }
    if (this.dist) {
      this.blockWise();
    }
    if (this.blok) {
      this.clusterWise();
    }
  }
  getDate(date) {
    this.filters();
    this.hideMonth = false;
    this.hideDate = false;
    this.hideHour = false;
    if (this.skul) {
      this.districtWise();
    }
    if (this.dist) {
      this.blockWise();
    }
    if (this.blok) {
      this.clusterWise();
    }
  }
  getHour(year) {
    this.filters();
    if (this.skul) {
      this.districtWise();
    }
    if (this.dist) {
      this.blockWise();
    }
    if (this.blok) {
      this.clusterWise();
    }
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

      var obj = {
        year: this.year,
        month: this.month,
        date: this.date,
        hour: this.hour
      }
      console.log("myObj: ", obj);
      // api call to get all the districts data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.telemetryDist(obj).subscribe(res => {
        this.data = res;
        // to show only in dropdowns
        this.districtMarkers = this.data['data'];

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
        var fileName = "District_wise_report";
        this.genericFun(this.data, options, fileName);

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
      this.skul = false;
      this.dist = true;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      var obj = {
        year: this.year,
        month: this.month,
        date: this.date,
        hour: this.hour
      }

      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.telemetryBlock(obj).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
        }
        if (this.data['data'].length > 0) {
          let result = this.data['data']
          this.blockMarkers = [];
          // generate color gradient
          let colors = this.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;
          this.blockMarkers = result;

          if (this.blockMarkers.length !== 0) {
            for (let i = 0; i < this.blockMarkers.length; i++) {
              var markerIcon;
              if (this.blockMarkers.length == 1) {
                markerIcon = L.circleMarker([this.blockMarkers[i].lat, this.blockMarkers[i].lng], {
                  radius: 3.5,
                  color: "orange",
                  fillColor: "orange",
                  fillOpacity: 1,
                  strokeWeight: 0.01
                }).addTo(globalMap);
              } else {
                markerIcon = L.circleMarker([this.blockMarkers[i].lat, this.blockMarkers[i].lng], {
                  radius: 3.5,
                  color: this.colors[i],
                  fillColor: this.colors[i],
                  fillOpacity: 1,
                  strokeWeight: 0.01
                }).addTo(globalMap);
              }

              var details = {};
              var orgObject = {};
              Object.keys(this.blockMarkers[i]).forEach(key => {
                if (key !== "lat") {
                  details[key] = this.blockMarkers[i][key];
                }
              });
              Object.keys(details).forEach(key => {
                if (key !== "lng") {
                  orgObject[key] = details[key];
                }
              });
              //Generate dynamic tool-tip
              var yourData = this.getInfoFrom(orgObject).join(" <br>");
              const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
                yourData);
              markerIcon.addTo(globalMap).bindPopup(popup);

              // to download the report
              this.fileName = "Block_wise_report";
              var obj = { ...this.blockMarkers[i] };
              this.reportData.push(obj);

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

            this.schoolCount = this.data['footer'];

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
      this.skul = false;
      this.dist = false;
      this.blok = true;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      var obj = {
        year: this.year,
        month: this.month,
        date: this.date,
        hour: this.hour
      }
      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.telemetryCluster(obj).subscribe(res => {
        console.log(res);
        this.data = res
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
        }
        if (this.data['data'].length > 0) {
          let result = this.data['data']
          this.clusterMarkers = [];
          // generate color gradient
          let colors = this.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;
          this.clusterMarkers = result;

          if (this.clusterMarkers.length !== 0) {
            for (let i = 0; i < this.clusterMarkers.length; i++) {
              var markerIcon;
              if (this.clusterMarkers.length == 1) {
                markerIcon = L.circleMarker([this.clusterMarkers[i].lat, this.clusterMarkers[i].lng], {
                  radius: 2.5,
                  color: "orange",
                  fillColor: "orange",
                  fillOpacity: 1,
                  strokeWeight: 0.01
                }).addTo(globalMap);
              } else {
                markerIcon = L.circleMarker([this.clusterMarkers[i].lat, this.clusterMarkers[i].lng], {
                  radius: 2.5,
                  color: this.colors[i],
                  fillColor: this.colors[i],
                  fillOpacity: 1,
                  strokeWeight: 0.01
                }).addTo(globalMap);
              }

              var details = {};
              var orgObject = {};
              Object.keys(this.clusterMarkers[i]).forEach(key => {
                if (key !== "lat") {
                  details[key] = this.clusterMarkers[i][key];
                }
              });
              Object.keys(details).forEach(key => {
                if (key !== "lng") {
                  orgObject[key] = details[key];
                }
              });
              //Generate dynamic tool-tip
              var yourData = this.getInfoFrom(orgObject).join(" <br>");
              const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
                yourData);
              markerIcon.addTo(globalMap).bindPopup(popup);

              // to download the report
              this.fileName = "Cluster_wise_report";
              var obj = { ...this.clusterMarkers[i] };
              this.reportData.push(obj);

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

            this.schoolCount = this.data['footer'];

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
  /* schoolWise() {
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
      this.myData = this.service.semCompletionSchool().subscribe(res => {
        this.data = res
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
        }
        this.schoolMarkers = [];
        if (this.data['data'].length > 0) {
          let result = this.data['data']
   
          // generate color gradient
          let colors = this.color().generateGradient('#FF0000', '#7FFF00', result.length, 'rgb');
          this.colors = colors;
   
          this.schoolMarkers = result;
          if (this.schoolMarkers.length !== 0) {
            for (let i = 0; i < this.schoolMarkers.length; i++) {
              var markerIcon = L.circleMarker([this.schoolMarkers[i].school_latitude, this.schoolMarkers[i].school_longitude], {
                // renderer: myRenderer,
                radius: 0,
                color: "#fc5e03",
                fillColor: "#fc5e03",
                fillOpacity: 1,
                weight: 1.5,
                strokeWeight: 1
              }).addTo(globalMap);
   
              var details = {};
              var orgObject = {};
              Object.keys(this.schoolMarkers[i]).forEach(key => {
                if (key !== "school_latitude") {
                  details[key] = this.schoolMarkers[i][key];
                }
              });
              Object.keys(details).forEach(key => {
                if (key !== "school_longitude") {
                  orgObject[key] = details[key];
                }
              });
              //Generate dynamic tool-tip
              var yourData = this.getInfoFrom(orgObject).join(" <br>");
              const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
                yourData);
              markerIcon.addTo(globalMap).bindPopup(popup);
   
              // to download the report
              this.fileName = "School_wise_report";
              var obj = { ...this.schoolMarkers[i] };
              this.reportData.push(obj);
   
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
   
            this.schoolCount = this.data['footer'];
   
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
    this.myData = this.service.semCompletionBlockPerDist(districtId).subscribe(res => {
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
        mapZoom: 8.3,
        centerLat: this.data['data'][0].block_latitude,
        centerLng: this.data['data'][0].block_longitude,
        level: 'block'
      }
      var fileName = "Block_per_dist_report";
      this.genericFun(this.data, options, fileName);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.block_name > b.block_name) ? 1 : ((b.block_name > a.block_name) ? -1 : 0));
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
    this.myData = this.service.semCompletionClusterPerBlock(this.districtHierarchy.distId, blockId).subscribe(res => {
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
        radius: 3,
        fillOpacity: 1,
        strokeWeight: 0.01,
        mapZoom: 10,
        centerLat: this.data['data'][0].cluster_latitude,
        centerLng: this.data['data'][0].cluster_longitude,
        level: 'cluster'
      }
      var fileName = "Cluster_per_block_report";
      this.genericFun(this.data, options, fileName);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.cluster_name > b.cluster_name) ? 1 : ((b.cluster_name > a.cluster_name) ? -1 : 0));
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
    this.myData = this.service.semCompletionBlock().subscribe(result => {
      this.myData = this.service.semCompletionSchoolPerClustter(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId).subscribe(res => {
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
          mapZoom: 12,
          centerLat: this.data['data'][0].school_latitude,
          centerLng: this.data['data'][0].school_longitude,
          level: 'school'
        }
        var fileName = "School_per_cluster_report";
        this.genericFun(this.data, options, fileName);
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
  }*/

  // common function for all the data to show in the map
  genericFun(data, options, fileName) {
    this.reportData = [];
    if (data['data'].length > 0) {
      this.markers = data['data']

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
        if (options.weight) {
          markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: options.radius,
            color: "#fc5e03",
            fillColor: "#fc5e03",
            fillOpacity: options.fillOpacity,
            strokeWeight: options.strokeWeight,
            weight: options.weight
          })
        } else {
          if (this.markers.length == 1) {
            markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
              radius: options.radius,
              color: "#fc5e03",
              fillColor: "#fc5e03",
              fillOpacity: options.fillOpacity,
              strokeWeight: options.strokeWeight
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
        }

        globalMap.setZoom(options.mapZoom);

        // data to show on the tooltip for the desired levels
        if (options.level) {
          var details = {};
          var orgObject = {};
          Object.keys(this.markers[i]).forEach(key => {
            if (key !== "lat") {
              details[key] = this.markers[i][key];
            }
          });
          Object.keys(details).forEach(key => {
            if (key !== "lng") {
              orgObject[key] = details[key];
            }
          });
          var detailSchool = {};
          var yourData;
          if (options.level == "school") {
            Object.keys(orgObject).forEach(key => {
              if (key !== "total_schools_not_received") {
                detailSchool[key] = orgObject[key];
              }
            });
            yourData = this.getInfoFrom(detailSchool).join(" <br>");
          } else {
            yourData = this.getInfoFrom(orgObject).join(" <br>");

          }
          //Generate dynamic tool-tip
          const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
            yourData);
          markerIcon.addTo(globalMap).bindPopup(popup);

          // to download the report
          this.fileName = fileName;
          var obj = { ...this.markers[i] };
          this.reportData.push(obj);
        }
        this.popups(markerIcon, this.markers[i], options);
      }

      this.loaderAndErr();
      this.changeDetection.markForCheck();
    }
    this.schoolCount = this.data['footer'];
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
    var data = event.target.myJsonData;
    // if (data.district_id && !data.block_id && !data.cluster_id) {
    //   this.stateLevel = 1;
    //   this.onDistrictSelect(data.district_id)
    // }
    // if (data.district_id && data.block_id && !data.cluster_id) {
    //   this.stateLevel = 1;
    //   this.districtHierarchy = {
    //     distId: data.district_id
    //   }
    //   this.onBlockSelect(data.block_id)
    // }
    // if (data.district_id && data.block_id && data.cluster_id) {
    //   this.stateLevel = 1;
    //   this.blockHierarchy = {
    //     distId: data.district_id,
    //     blockId: data.block_id
    //   }
    //   this.onClusterSelect(data.cluster_id)
    // }
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

  //map tooltip automation
  public getInfoFrom(object) {
    var popupFood = [];
    var stringLine;
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (key == "percentage_schools_not_received") {
          stringLine = "<b>" +
            key.replace(
              /\w\S*/g,
              function (txt) {
                txt = txt.replace(/_/g, ' ');
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
              })
            + "</b>" + ": " + object[key] + " %" + `</span>`;
        } else {
          stringLine = "<b>" +
            key.replace(
              /\w\S*/g,
              function (txt) {
                txt = txt.replace(/_/g, ' ');
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
              })
            + "</b>" + ": " + object[key] + `</span>`;
        }

      }
      popupFood.push(stringLine);
    }
    return popupFood;
  }

}

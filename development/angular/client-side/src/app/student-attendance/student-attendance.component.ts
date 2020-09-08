import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import * as data from './../../assets/india.json';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { KeycloakSecurityService } from '../keycloak-security.service';
var globalMap;

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StudengtAttendanceComponent implements OnInit, OnDestroy {
  impressionId = Math.floor(100000 + Math.random() * 900000);
  pageId = "Student_attendance";
  userId;
  type = "";
  date = new Date();
  edate;
  end_time;
  public btnId;
  start_time = Math.floor(this.date.getTime() / 1000.0);
  public telemData = {}

  ngOnDestroy() {
    // this.edate = new Date();
    // // this.end_time = Math.floor(this.edate.getTime() / 1000.0);

    // var dateObj = {
    //   year: this.edate.getFullYear(),
    //   month: this.edate.getMonth() + 1,
    //   date: this.edate.getDate()
    // }

    // this.service.telemetry(dateObj).subscribe(res => {
    //   console.log(res);
    // });
  }

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
  public colors: any;
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
  public levelWise: any;

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

  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router, public keyCloakSevice: KeycloakSecurityService, private changeDetection: ChangeDetectorRef) {
    service.logoutOnTokenExpire();
    service.getDateRange().subscribe(res => {
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
      this.dateRange = `${this.getMonthYear[`${this.year}`][this.months.length - 1].data_from_date} to ${this.getMonthYear[`${this.year}`][this.months.length - 1].data_upto_date}`;
      if (this.month) {
        this.month_year = {
          month: this.month,
          year: this.year
        };
        // var eventType = "pageLoad";
        // this.btnId = '';
        // var date = new Date();
        // this.trackInteract(date, this.btnId, eventType, undefined);
        this.districtWise();
      }

    }, err => {
      document.getElementById('home').style.display = 'none';
      this.getMonthYear = {};
      this.loaderAndErr();
    });
  }

  ngOnInit() {
    document.getElementById('backBtn').style.display = "none";
    this.skul = true;
    this.element = <HTMLFormElement>document.getElementById('month');
    this.element.disabled = false;
    this.initMap();
    document.getElementById('homeBtn').style.display = "Block";
  }

  //Initialisation of Map  
  initMap() {
    const lat = 22.3660414123535;
    const lng = 71.48396301269531;
    globalMap = L.map('mapContainer', { zoomControl: false }).setView([lat, lng], 7);
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
  public markersList = new L.FeatureGroup();

  loaderAndErr() {
    if (this.markers.length !== 0) {
      document.getElementById('spinner').style.display = 'none';
      this.disabled = true;
    } else {
      this.disabled = false;
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

  public fileName: any;
  public reportData: any = [];

  globalId;

  downloadRoport(event) {
    if (this.globalId == this.myDistrict) {
      var distData = {};
      this.districtData.find(a => {
        if (a.id == this.myDistrict) {
          distData = a;
        }
      });
      this.getTelemetryData(distData, event.target.id, "district");
    }
    if (this.globalId == this.myBlock) {
      var blockData = {};
      this.blockData.find(a => {
        if (a.id == this.myBlock) {
          blockData = a;
        }
      });
      this.getTelemetryData(blockData, event.target.id, "block");
    }
    if (this.globalId == this.myCluster) {
      var clusterData = {};
      this.clusterData.find(a => {
        if (a.id == this.myCluster) {
          clusterData = a;
        }
      });
      this.getTelemetryData(clusterData, event.target.id, "cluster");
    }
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, undefined);

    if (this.reportData.length <= 0) {
      alert("No data fount to download");
    } else {
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

  public month_year;
  getMonth(event) {
    var month = this.getMonthYear[`${this.year}`].find(a => a.month === this.month);
    this.dateRange = `${month.data_from_date} to ${month.data_upto_date}`;
    this.month_year = {
      month: this.month,
      year: this.year
    };
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, undefined);
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
      if (this.levelWise === "School") {
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
  }

  getYear() {
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
    this.element.disabled = false;
  }

  public myData;
  homeClick(event) {
    this.globalId = undefined;
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, undefined);
    this.districtWise();
  }
  distHierarchy(event) {
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, undefined);
    this.districtWise();
  }

  districtData = [];
  async districtWise() {
    this.commonAtStateLevel();
    this.levelWise = "District";
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      this.fileName = `District_wise_report_${month.name.trim()}_${this.year}`;
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.dist_wise_data(this.month_year).subscribe(res => {
        this.districtData = this.mylatlngData = res['distData'];
        var sorted = this.mylatlngData.sort((a, b) => (a.label > b.label) ? 1 : -1);
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        var distNames = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        this.markers = sorted;
        if (this.markers.length > 0) {
          for (var i = 0; i < this.markers.length; i++) {
            this.districtsIds.push(this.markers[i]['id']);
            distNames.push({ id: this.markers[i]['id'], name: this.markers[i]['name'] });

            var markerIcon = this.initMarkers(this.markers[i], this.colors[i], 5, 0.01, 0);
            const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
              "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
              "<br><b>District: </b>" + "&nbsp;" + this.markers[i].name +
              "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
              "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
            );
            markerIcon.addTo(globalMap).bindPopup(popup);
            this.popups(markerIcon, this.markers[i]);
          }
        }

        distNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.districtsNames = distNames;

        globalMap.setView(new L.LatLng(this.lat, this.lng), 7);
        this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

        this.markers.forEach(dist => {
          var obj = {
            DistrictId: dist.id,
            DistrictName: dist.name,
            Attendance: dist.label + " %",
            TotalSchools: Number(dist.schCount.replace(/\,/g, '')),
            TotalStudents: Number(dist.stdCount.replace(/\,/g, ''))
          }
          this.reportData.push(obj);
        });
        this.loaderAndErr();
        this.changeDetection.markForCheck();
      }, err => {
        this.markers = [];
        this.loaderAndErr();
      });
    } else {
      this.markers = [];
      this.loaderAndErr();
    }
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'none';
  }

  blockWise(event) {
    // console.log(event.target.id);
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, undefined);

    this.commonAtStateLevel();
    this.levelWise = "Block";
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      this.fileName = `Block_wise_report_${month.name.trim()}_${this.year}`

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.block_wise_data(this.month_year).subscribe(res => {
        this.mylatlngData = res['blockData'];
        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.label) > parseInt(b.label)) ? 1 : -1);
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        var blockNames = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        this.markers = sorted;
        if (this.markers.length !== 0) {
          for (let i = 0; i < this.markers.length; i++) {
            this.blocksIds.push(this.markers[i]['id']);
            blockNames.push({ id: this.markers[i]['id'], name: this.markers[i]['name'], distId: this.markers[i]['dist'] });

            var markerIcon = this.initMarkers(this.markers[i], this.colors[i], 3.5, 0.01, 0);

            globalMap.setZoom(7);
            const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
              "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
              "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
              "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].name +
              "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
              "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
            );
            markerIcon.addTo(globalMap).bindPopup(popup);
            this.popups(markerIcon, this.markers[i]);
          }
          blockNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.blocksNames = blockNames;
          globalMap.setView(new L.LatLng(this.lat, this.lng), 7);
          // var schStdCount = JSON.parse(localStorage.getItem('schStd'));
          this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.markers.forEach(block => {
            var obj = {
              BlockId: block.id,
              BlockName: block.name,
              DistrictName: block.dist,
              Attendance: block.label + " %",
              TotalSchools: Number(block.schCount.replace(/\,/g, '')),
              TotalStudents: Number(block.stdCount.replace(/\,/g, ''))
            }
            this.reportData.push(obj);
          });
          this.loaderAndErr();
          this.changeDetection.markForCheck();
        }
      }, err => {
        this.markers = [];
        this.loaderAndErr();
      });
    } else {
      this.markers = [];
      this.loaderAndErr();
    }
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
    ;
  }

  schoolWise(event) {
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, undefined);

    this.commonAtStateLevel();
    this.levelWise = "School";
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      this.fileName = `School_wise_report_${month.name.trim()}_${this.year}`

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.school_wise_data(this.month_year).subscribe(res => {
        this.mylatlngData = res['schoolData'];
        this.lat = 22.3660414123535;
        this.lng = 71.48396301269531;

        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.label) > parseInt(b.label)) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        this.markers = sorted;
        if (this.markers.length !== 0) {
          for (let i = 0; i < this.markers.length; i++) {
            this.districtsIds.push(sorted[i]['id']);
            var markerIcon = this.initMarkers(this.markers[i], this.colors[i], 0, 0, 0);

            const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
              "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + "  %" +
              "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
              "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
              "<br><b>Cluster: </b>" + "&nbsp;" + this.markers[i].cluster +
              "<br><b>School: </b>" + "&nbsp;" + this.markers[i].name +
              "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
            );
            markerIcon.addTo(globalMap).bindPopup(popup);

            markerIcon.on('mouseover', function (e) {
              this.openPopup();
            });

            markerIcon.on('mouseout', function (e) {
              this.closePopup();
            });
            markerIcon.on('click', this.onClickSchool, this);

            this.layerMarkers.addLayer(markerIcon);
            markerIcon.myJsonData = this.markers[i];
          }
          globalMap.setView(new L.LatLng(this.lat, this.lng), 7.3);
          this.schoolCount = (this.markers.length).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.markers.forEach(school => {
            var obj = {
              SchoolId: school.id,
              SchoolName: school.name,
              ClusterName: school.cluster,
              BlockName: school.block,
              DistrictName: school.dist,
              Attendance: school.label + " %",
              TotalStudents: Number(school.stdCount.replace(/\,/g, ''))
            }
            this.reportData.push(obj);
          });
          this.loaderAndErr();
          this.changeDetection.markForCheck();
        }
      }, err => {
        this.markers = [];
        this.loaderAndErr();
      });
    } else {
      this.markers = [];
      this.loaderAndErr();
    }
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
    ;
  }


  clusterWise(event) {
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, undefined);

    this.commonAtStateLevel();

    this.levelWise = "Cluster";
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      this.fileName = `Cluster_wise_report_${month.name.trim()}_${this.year}`

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.cluster_wise_data(this.month_year).subscribe(res => {
        this.mylatlngData = res['clusterData'];
        this.lat = 22.3660414123535;
        this.lng = 71.48396301269531;

        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.label) > parseInt(b.label)) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        var clustNames = [];
        var blockNames = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];


        this.markers = sorted;
        if (this.markers.length !== 0) {
          for (let i = 0; i < this.markers.length; i++) {
            this.clusterIds.push(this.markers[i]['id']);
            this.blocksIds.push(this.markers[i]['blockId']);
            if (this.markers[i]['name'] !== null) {
              clustNames.push({ id: this.markers[i]['id'], name: this.markers[i]['name'], blockId: this.markers[i]['blockId'] });
            } else {
              clustNames.push({ id: this.markers[i]['id'], name: 'NO NAME FOUND', blockId: this.markers[i]['blockId'] });
            }
            blockNames.push({ id: this.markers[i]['blockId'], name: this.markers[i]['block'], distId: this.markers[i]['distId'] });
            var markerIcon = this.initMarkers(this.markers[i], this.colors[i], 1, 0.01, 0);
            const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
              "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + "  %" +
              "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
              "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
              "<br><b>Cluster: </b>" + "&nbsp;" + this.markers[i].name +
              "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
              "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
            );
            markerIcon.addTo(globalMap).bindPopup(popup);

            this.popups(markerIcon, this.markers[i]);
          }

          clustNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.clusterNames = clustNames;
          blockNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.blocksNames = blockNames;
          globalMap.setView(new L.LatLng(this.lat, this.lng), 7);
          // var schStdCount = JSON.parse(localStorage.getItem('schStd'));
          this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.markers.forEach(cluster => {
            var obj = {
              ClusterId: cluster.id,
              ClusterName: cluster.name,
              BlockName: cluster.block,
              DistrictName: cluster.dist,
              Attendance: cluster.label + " %",
              TotalSchools: Number(cluster.schCount.replace(/\,/g, '')),
              TotalStudents: Number(cluster.stdCount.replace(/\,/g, ''))
            }
            this.reportData.push(obj);
          });
          this.loaderAndErr();
          this.changeDetection.markForCheck();
        }
      }, err => {
        this.markers = [];
        this.loaderAndErr();
      });
    } else {
      this.markers = [];
      this.loaderAndErr();
    }
    globalMap.addLayer(this.markersList);
    document.getElementById('home').style.display = 'block';
    ;
    this.cluster = [];
  }

  commonAtStateLevel() {
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.errMsg();
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
    this.lat = 22.3660414123535;
    this.lng = 71.48396301269531;
    this.markerData = {};
    this.myDistrict = null;
  }


  clickedMarker(event, label) {
    var level;

    // var eventType = event.type;
    // this.btnId = 'marker';
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, label.id);

    if (this.districtsIds.includes(label.id)) {
      level = "district";
      localStorage.setItem('dist', label.name);
      localStorage.setItem('distId', label.id);
      this.myDistData(label.id);
    }

    if (this.blocksIds.includes(label.id)) {
      level = "block";
      if (this.skul) {
        localStorage.setItem('dist', label.dist);
        localStorage.setItem('distId', label.distId);
      } else {
        localStorage.setItem('dist', localStorage.getItem('dist'));
        localStorage.setItem('distId', localStorage.getItem('distId'));
      }
      localStorage.setItem('block', label.name);
      localStorage.setItem('blockId', label.id);
      this.myBlockData(label.id);
    }

    if (this.clusterIds.includes(label.id)) {
      level = "cluster";
      localStorage.setItem('dist', label.dist);
      localStorage.setItem('distId', label.distId);
      localStorage.setItem('block', label.block);
      localStorage.setItem('blockId', label.blockId);
      localStorage.setItem('cluster', label.name);
      localStorage.setItem('clusterId', label.id);

      this.myClusterData(label.id);
    }
    if (event.latlng) {
      var obj = {
        id: label.id,
        name: label.name,
        lat: event.latlng.lat,
        lng: event.latlng.lng
      }
      this.getTelemetryData(obj, event.type, level);
    }
  };

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
    var level = "school";
    if (event.latlng) {
      var obj = {
        id: event.target.myJsonData.id,
        name: event.target.myJsonData.name,
        lat: event.target.myJsonData.lat,
        lng: event.target.myJsonData.lng
      }
      this.getTelemetryData(obj, event.type, level);
    }
  }

  onClick_Marker(event) {
    var marker = event.target;
    this.markerData = marker.myJsonData;
    this.clickedMarker(event, marker.myJsonData);
  }

  distSelect(event, data) {
    var distData = {};
    this.districtData.find(a => {
      if (a.id == data) {
        distData = a;
      }
    });
    this.getTelemetryData(distData, event.type, "district");

    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, data);
    this.myDistData(data);
  }

  blockData = [];
  myDistData(data) {
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.markers = [];
    this.reportData = [];
    this.errMsg();
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
      this.fileName = `Block_per_district_report_${month.name.trim()}_${this.year}`;
      this.distName = { id: data, name: obj.name };
      this.hierName = obj.name;
      localStorage.setItem('dist', obj.name);
      localStorage.setItem('distId', data);

      this.globalId = this.myDistrict = data;
      this.myBlock = null;

      this.month_year['id'] = data;

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.blockPerDist(this.month_year).subscribe(res => {
        this.blockData = this.mylatlngData = res['blockData'];
        var uniqueData = this.mylatlngData.reduce(function (previous, current) {
          var object = previous.filter(object => object['id'] === current['id']);
          if (object.length == 0) previous.push(current);
          return previous;
        }, []);
        this.mylatlngData = uniqueData;
        this.lat = Number(this.mylatlngData[0]['lat']);
        this.lng = Number(this.mylatlngData[0]['lng']);

        var blokName = [];

        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.label) > parseInt(b.label)) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        this.markers = sorted;
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        for (var i = 0; i < this.markers.length; i++) {
          this.blocksIds.push(this.markers[i]['id']);
          blokName.push({ id: this.markers[i]['id'], name: this.markers[i]['name'] });

          var markerIcon = this.initMarkers(this.markers[i], this.colors[i], 3.5, 0.01, 0);

          const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
            "<b>Attendance : </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );
          markerIcon.addTo(globalMap).bindPopup(popup);
          this.popups(markerIcon, this.markers[i]);
        }
        blokName.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.blocksNames = blokName;

        globalMap.setView(new L.LatLng(this.lat, this.lng), 8.3);
        this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.markers.forEach(block => {
          var obj = {
            BlockId: block.id,
            BlockName: block.name,
            DistrictName: block.dist,
            Attendance: block.label + " %",
            TotalSchools: block.schCount,
            TotalStudents: block.stdCount
          }
          this.reportData.push(obj);
        });
        this.loaderAndErr();
        this.changeDetection.markForCheck();
      }, err => {
        this.markers = [];
        this.loaderAndErr();
      });
    } else {
      this.markers = [];
      this.loaderAndErr();
    }
    document.getElementById('home').style.display = 'block';
    globalMap.addLayer(this.layerMarkers);
  }

  blockSelect(event, data) {
    var blockData = {};
    this.blockData.find(a => {
      if (a.id == data) {
        blockData = a;
      }
    });
    this.getTelemetryData(blockData, event.type, "block");
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, data);
    this.myBlockData(data);
  }

  clusterData = [];
  myBlockData(data) {
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.markers = [];
    this.reportData = [];
    this.errMsg();
    this.markerData = null;

    this.dist = false;
    this.blok = true;
    this.clust = false;
    this.skul = false;
    this.clusterHidden = false;
    this.blockHidden = false;
    if (this.months.length > 0) {
      var month = this.months.find(a => a.id === this.month);
      this.fileName = `Cluster_per_block_report_${month.name.trim()}_${this.year}`;
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
      this.distName = { id: Number(localStorage.getItem('distId')), name: this.titleName };
      this.blockName = { id: data, name: obj.name };
      this.hierName = obj.name;

      this.globalId = this.myBlock = data;
      this.myDistrict = Number(localStorage.getItem('distId'));
      this.myCluster = null;

      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.month_year['id'] = data;
      this.myData = this.service.clusterPerBlock(this.month_year).subscribe(res => {
        this.clusterData = this.mylatlngData = res['clusterDetails'];
        var uniqueData = this.mylatlngData.reduce(function (previous, current) {
          var object = previous.filter(object => object['id'] === current['id']);
          if (object.length == 0) previous.push(current);
          return previous;
        }, []);
        this.mylatlngData = uniqueData;
        this.lat = Number(this.mylatlngData[0]['lat']);
        this.lng = Number(this.mylatlngData[0]['lng']);
        var clustNames = [];

        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.label) > parseInt(b.label)) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        this.markers = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];
        // sorted.pop();
        this.markers = sorted;
        for (var i = 0; i < sorted.length; i++) {
          this.clusterIds.push(sorted[i]['id']);
          if (sorted[i]['name'] !== null) {
            clustNames.push({ id: sorted[i]['id'], name: sorted[i]['name'], blockId: sorted[i]['blockId'] });
          } else {
            clustNames.push({ id: sorted[i]['id'], name: 'NO NAME FOUND', blockId: sorted[i]['blockId'] });
          }
          var markerIcon = this.initMarkers(this.markers[i], this.colors[i], 3.5, 0.01, 0);

          const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
            "<b>Attendance : </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
            "<br><b>Cluster: </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );
          markerIcon.addTo(globalMap).bindPopup(popup);
          this.popups(markerIcon, this.markers[i]);

        };

        clustNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.clusterNames = clustNames;

        globalMap.setView(new L.LatLng(this.lat, this.lng), 10);
        this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.markers.forEach(cluster => {
          var obj = {
            ClusterId: cluster.id,
            ClusterName: cluster.name,
            BlockName: cluster.block,
            DistrictName: cluster.dist,
            Attendance: cluster.label + " %",
            TotalSchools: cluster.schCount,
            TotalStudents: cluster.stdCount
          }
          this.reportData.push(obj);
        });
        this.loaderAndErr();
        this.changeDetection.markForCheck();
      }, err => {
        this.markers = [];
        this.loaderAndErr();
      });
    } else {
      this.markers = [];
      this.loaderAndErr();
    }
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }


  clusterSelect(event, data) {
    var clusterData = {};
    this.clusterData.find(a => {
      if (a.id == data) {
        clusterData = a;
      }
    });
    this.getTelemetryData(clusterData, event.type, "cluster");
    // var eventType = event.type;
    // this.btnId = event.target.id;
    // var date = new Date();
    // this.trackInteract(date, this.btnId, eventType, data);
    this.myClusterData(data);
  }
  myClusterData(data) {
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.markers = [];
    this.reportData = [];
    this.errMsg();
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
      this.fileName = `Schools_per_cluster_report_${month.name.trim()}_${this.year}`;

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
      this.distName = { id: Number(localStorage.getItem('distId')), name: this.titleName };
      this.blockName = { id: blockId, name: this.title, distId: this.distName.id, dist: this.distName.name }
      this.clustName = { id: data };
      this.hierName = obj.name;

      this.globalId = this.myCluster = data;
      this.myBlock = blockId;
      this.myDistrict = Number(localStorage.getItem('distId'));

      if (this.myData) {
        this.myData.unsubscribe();
      }

      this.month_year['id'] = data;
      this.myData = this.service.schoolsPerCluster(this.month_year).subscribe(res => {
        this.mylatlngData = res['schoolsDetails'];
        var uniqueData = this.mylatlngData.reduce(function (previous, current) {
          var object = previous.filter(object => object['id'] === current['id']);
          if (object.length == 0) previous.push(current);
          return previous;
        }, []);
        this.mylatlngData = uniqueData;
        this.lat = Number(this.mylatlngData[0]['lat']);
        this.lng = Number(this.mylatlngData[0]['lng']);

        var sorted = this.mylatlngData.sort((a, b) => (parseInt(a.label) > parseInt(b.label)) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        this.markers = [];
        this.studentCount = res['studentCount'];
        this.schoolCount = res['schoolCount'];

        this.markers = sorted;
        for (var i = 0; i < sorted.length; i++) {
          var markerIcon = this.initMarkers(this.markers[i], this.colors[i], 3.5, 0.01, 0);

          const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
            "<b>Attendance : </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
            "<br><b>Cluster: </b>" + "&nbsp;" + this.markers[i].cluster +
            "<br><b>School: </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );
          markerIcon.addTo(globalMap).bindPopup(popup);
          markerIcon.on('mouseover', function (e) {
            this.openPopup();
          });
          markerIcon.on('mouseout', function (e) {
            this.closePopup();
          });

          markerIcon.on('click', this.onClickSchool, this);

          this.layerMarkers.addLayer(markerIcon);
          markerIcon.myJsonData = this.markers[i];
        };
        globalMap.setView(new L.LatLng(this.lat, this.lng), 12);
        this.schoolCount = (this.markers.length).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.markers.forEach(school => {
          var obj = {
            SchoolId: school.id,
            SchoolName: school.name,
            ClusterName: school.cluster,
            BlockName: school.block,
            DistrictName: school.dist,
            Attendance: school.label + " %",
            TotalStudents: school.stdCount
          }
          this.reportData.push(obj);
        });
        this.loaderAndErr();
        this.changeDetection.markForCheck();
      }, err => {
        this.markers = [];
        this.loaderAndErr();
      });
    } else {
      this.markers = [];
      this.loaderAndErr();
    }
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  popups(markerIcon, markers) {
    markerIcon.on('mouseover', function (e) {
      this.openPopup();
    });
    markerIcon.on('mouseout', function (e) {
      this.closePopup();
    });

    this.layerMarkers.addLayer(markerIcon);
    markerIcon.on('click', this.onClick_Marker, this);

    markerIcon.myJsonData = markers;
  }

  initMarkers(markers, color, radius, strokeWeight, weight) {
    var markerIcon;
    if (this.levelWise !== "School") {
      markerIcon = L.circleMarker([markers.lat, markers.lng], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: strokeWeight,
      });
    } else {
      markerIcon = L.circleMarker([markers.lat, markers.lng], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: strokeWeight,
        weight: weight
      });
    }
    return markerIcon;
  }


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

  // trackInteract(date, eventId, type, id) {
  //   var timeStamp = Math.floor(date.getTime() / 1000.0);
  //   this.telemData.interact.push(
  //     {
  //       eventId: eventId, // id of the interaction like button_id, dropdown_id etc
  //       uid: this.userId, // userid
  //       type: type, // click,select,search
  //       id: id,
  //       pageId: this.telemData.impression.pageId, // unique id of the page where user is interacting
  //       impressionId: this.telemData.impression.impressionId,
  //       timestamp: timeStamp
  //     }
  //   );
  // }
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

      this.service.telemetry(dateObj).subscribe(res => {
      }, err => {
        console.log(err);
      });
    }
  }

}
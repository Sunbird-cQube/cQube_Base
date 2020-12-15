import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TelemetryService } from '../../../services/telemetry.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { AppServiceComponent, globalMap } from '../../../app.service';


@Component({
  selector: 'app-telemetry-data',
  templateUrl: './telemetry-data.component.html',
  styleUrls: ['./telemetry-data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
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

  timePeriod = '';
  timeDetails = [{ id: "overall", time: "Over All" }, { id: "last_30_days", time: "Last 30 Days" }, { id: "last_7_days", time: "Last 7 Days" }, { id: "last_day", time: "Last Day" }];
  state: string;
  // initial center position for the map
  public lat: any;
  public lng: any;

  constructor(
    public http: HttpClient,
    public service: TelemetryService,
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
    this.commonService.initMap('map', [[this.lat, this.lng]]);
    globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.timePeriod = 'overall';
    this.districtWise();

  }

  getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
  };

  getTimePeriod(timePeriod) {
    if (this.skul) {
      this.districtWise();
    }
    if (this.dist) {
      this.blockWise();
    }
    if (this.blok) {
      this.clusterWise();
    }
    if (this.clust) {
      this.schoolWise();
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

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      var obj = {
        timePeriod: this.timePeriod
      }

      globalMap.setView(new L.LatLng(this.lat, this.lng), this.commonService.zoomLevel);
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
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: 'district'
        }
        globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);

        var fileName = "District_wise_report";
        this.genericFun(this.data, options, fileName);

        // sort the districtname alphabetically
        this.districtMarkers.sort((a, b) => (a.districtName > b.districtName) ? 1 : ((b.districtName > a.districtName) ? -1 : 0));
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
        timePeriod: this.timePeriod
      }

      globalMap.setView(new L.LatLng(this.lat, this.lng), this.commonService.zoomLevel);
      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.telemetryBlock(obj).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: "block"
        }
        globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);

        if (this.data['data'].length > 0) {
          let result = this.data['data']
          this.blockMarkers = [];
          this.blockMarkers = result;

          if (this.blockMarkers.length !== 0) {
            for (let i = 0; i < this.blockMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.blockMarkers[i].lat, this.blockMarkers[i].lng, "#42a7f5", 3.5, 1, 1, options.level);
              this.generateToolTip(this.blockMarkers[i], options.level, markerIcon, "lat", "lng");
              // to download the report
              this.fileName = "Block_wise_report";
            }
            this.schoolCount = this.data['footer'];

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
        timePeriod: this.timePeriod
      }

      globalMap.setView(new L.LatLng(this.lat, this.lng), this.commonService.zoomLevel);
      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.telemetryCluster(obj).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: "cluster"
        }
        globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);

        if (this.data['data'].length > 0) {
          let result = this.data['data']
          this.clusterMarkers = [];
          this.clusterMarkers = result;

          if (this.clusterMarkers.length !== 0) {
            for (let i = 0; i < this.clusterMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.clusterMarkers[i].lat, this.clusterMarkers[i].lng, "#42a7f5", 2.5, 1, 1, options.level);
              this.generateToolTip(this.clusterMarkers[i], options.level, markerIcon, "lat", "lng");
              // to download the report
              this.fileName = "Cluster_wise_report";
            }
            this.schoolCount = this.data['footer'];

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
      this.reportData = [];
      // these are for showing the hierarchy names based on selection
      this.skul = false;
      this.dist = false;
      this.blok = false;
      this.clust = true;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      var obj = {
        timePeriod: this.timePeriod
      }

      globalMap.setView(new L.LatLng(this.lat, this.lng), this.commonService.zoomLevel);
      // api call to get the all schools data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.telemetrySchool(obj).subscribe(res => {
        this.data = res
        let options = {
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: "school"
        }
        globalMap.setMaxBounds([[this.lat - 4.5, this.lng - 6], [this.lat + 3.5, this.lng + 6]]);

        this.schoolMarkers = [];
        if (this.data['data'].length > 0) {
          let result = this.data['data']

          this.schoolMarkers = result;
          if (this.schoolMarkers.length !== 0) {
            for (let i = 0; i < this.schoolMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.schoolMarkers[i].lat, this.schoolMarkers[i].lng, "#42a7f5", 2, 1.5, 0, options.level);
              this.generateToolTip(this.schoolMarkers[i], options.level, markerIcon, "lat", "lng");
              // to download the report
              this.fileName = "School_wise_report";
            }

            this.schoolCount = this.data['footer'];

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
  /* onDistrictSelect(districtId) {
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
         this.commonService.loaderAndErr(this.data);
       });
     }, err => {
       this.data = [];
       this.commonService.loaderAndErr(this.data);
     });
     globalMap.addLayer(this.layerMarkers);
     document.getElementById('home').style.display = 'block';
   }*/

  // common function for all the data to show in the map
  genericFun(data, options, fileName) {
    this.reportData = [];
    if (data['data'].length > 0) {
      this.markers = data['data']

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

        var markerIcon = this.commonService.initMarkers(this.markers[i].lat, this.markers[i].lng, "#42a7f5", options.radius, options.strokeWeight, 1, options.level);

        // data to show on the tooltip for the desired levels
        if (options.level) {
          this.generateToolTip(this.markers[i], options.level, markerIcon, "lat", "lng");
          this.fileName = fileName;
        }
      }

      this.commonService.loaderAndErr(this.data);
      this.changeDetection.markForCheck();
    }
    this.schoolCount = this.data['footer'];
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
      // if (level != 'school') {
      //   markerIcon.on('click', this.onClick_Marker, this)
      // }
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
    var yourData;
    this.reportData.push(orgObject);
    yourData = this.commonService.getInfoFrom(orgObject, "", level, "telemetry", undefined, undefined).join(" <br>");

    //Generate dynamic tool-tip
    const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
      yourData);
    markerIcon.addTo(globalMap).bindPopup(popup);
  }
}

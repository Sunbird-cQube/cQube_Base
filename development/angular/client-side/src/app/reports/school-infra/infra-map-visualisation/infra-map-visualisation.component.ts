import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SchoolInfraService } from '../../../services/school-infra.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { AppServiceComponent, globalMap } from '../../../app.service';

@Component({
  selector: 'app-infra-map-visualisation',
  templateUrl: './infra-map-visualisation.component.html',
  styleUrls: ['./infra-map-visualisation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

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
  state: string;
  // initial center position for the map
  public lat: any;
  public lng: any;


  constructor(
    public http: HttpClient,
    public service: SchoolInfraService,
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
    this.commonService.initMap('infraMap', [[this.lat, this.lng]]);
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
        this.getDistricts();
        this.onDistrictSelect(data.id);
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
        this.getDistricts();
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
        this.getDistricts();
        this.getBlocks(data.districtId);
        this.getClusters(data.districtId, data.blockId, data.id);
      }
    } else {
      this.districtWise();
    }
  }

  getDistricts(): void {
    this.service.infraMapDistWise().subscribe(res => {
      this.data = res['data'];
      this.districtMarkers = this.data;
    });
  }

  getBlocks(distId, blockId?: any): void {
    this.service.infraMapBlockWise(distId).subscribe(res => {
      this.data = res['data'];
      this.blockMarkers = this.data;
      if (blockId)
        this.onBlockSelect(blockId);
    });
  }

  getClusters(distId, blockId, clusterId): void {
    this.service.infraMapClusterWise(distId, blockId).subscribe(res => {
      this.data = res['data'];
      this.clusterMarkers = this.data;
      this.onClusterSelect(clusterId);
    });
  }


  // to load all the districts for state data on the map
  districtWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.districtId = undefined;
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
      // api call to get all the districts data
      if (this.myDistData != undefined) {
        this.data = this.myDistData['data'];
        this.gettingInfraFilters(this.data);
        // to show only in dropdowns
        this.districtMarkers = this.myDistData['data'];
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
        this.districtMarkers.sort((a, b) => (a.details.district_name > b.details.district_name) ? 1 : ((b.details.district_name > a.details.district_name) ? -1 : 0));

      } else {
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.infraMapDistWise().subscribe(res => {
          this.myDistData = res;
          this.data = res['data'];
          this.gettingInfraFilters(this.data);

          // to show only in dropdowns
          this.districtMarkers = this.data;

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
          // var MylatLng = [];
          // globalMap.on('click', function (e) {
          //   // console.log('[' + e.latlng.lng + ',' + e.latlng.lat + ']');
          //   MylatLng.push('[' + e.latlng.lng + ',' + e.latlng.lat + ']');
          // });
          // this.latLngArr = MylatLng;
          this.commonService.restrictZoom(globalMap);
          globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
          globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
          this.data.sort((a, b) => (`${a[this.infraData]}` > `${b[this.infraData]}`) ? 1 : ((`${b[this.infraData]}` > `${a[this.infraData]}`) ? -1 : 0));
          this.genericFun(this.myDistData, options, this.fileName);

          // sort the districtname alphabetically
          this.districtMarkers.sort((a, b) => (a.details.district_name > b.details.district_name) ? 1 : ((b.details.district_name > a.details.district_name) ? -1 : 0));

        }, err => {
          this.data = [];
          this.commonService.loaderAndErr(this.data);
        });
      }

      // adding the markers to the map layers
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'none';

    } catch (e) {
      console.log(e);
    }
  }

  // latLngArr = [];
  // showArr() {
  //   console.log(this.latLngArr)
  // }

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

      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.infraMapAllBlockWise().subscribe(res => {
        this.myBlockData = res['data'];
        this.data = res['data'];
        this.gettingInfraFilters(this.data);
        let options = {
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: "block"
        }

        if (this.data.length > 0) {
          let result = this.data
          this.blockMarkers = [];

          this.blockMarkers = result;

          this.schoolCount = 0;
          if (this.blockMarkers.length !== 0) {
            for (let i = 0; i < this.blockMarkers.length; i++) {
              var color = this.commonService.colorGredient(this.blockMarkers[i], this.infraData);
              var markerIcon = this.commonService.initMarkers(this.blockMarkers[i].details.latitude, this.blockMarkers[i].details.longitude, color, 3.5, 0.01, 1, options.level);

              this.generateToolTip(this.blockMarkers[i], options.level, markerIcon, "latitude", "longitude");
              this.getDownloadableData(this.blockMarkers[i], options.level);
            }
            this.commonService.restrictZoom(globalMap);
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);


            //schoolCount
            this.schoolCount = res['footer'];
            this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

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

      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.infraMapAllClusterWise().subscribe(res => {
        this.data = res['data']
        this.gettingInfraFilters(this.data);
        let options = {
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: "cluster"
        }

        if (this.data.length > 0) {
          let result = this.data
          this.clusterMarkers = [];
          this.clusterMarkers = result;
          this.schoolCount = 0;
          if (this.clusterMarkers.length !== 0) {
            for (let i = 0; i < this.clusterMarkers.length; i++) {
              var color = this.commonService.colorGredient(this.clusterMarkers[i], this.infraData);
              var markerIcon = this.commonService.initMarkers(this.clusterMarkers[i].details.latitude, this.clusterMarkers[i].details.longitude, color, 1, 0.01, .5, options.level);

              this.generateToolTip(this.clusterMarkers[i], options.level, markerIcon, "latitude", "longitude");
              this.getDownloadableData(this.clusterMarkers[i], options.level);
            }

            //schoolCount
            this.schoolCount = res['footer'];
            this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            this.commonService.restrictZoom(globalMap);
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);

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

      // api call to get the all schools data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.infraMapAllSchoolWise().subscribe(res => {
        this.data = res['data']
        this.gettingInfraFilters(this.data);
        let options = {
          mapZoom: this.commonService.zoomLevel,
          centerLat: this.lat,
          centerLng: this.lng,
          level: "school"
        }

        this.schoolMarkers = [];
        if (this.data.length > 0) {
          let result = this.data
          this.schoolCount = 0;
          this.schoolMarkers = result;
          if (this.schoolMarkers.length !== 0) {
            for (let i = 0; i < this.schoolMarkers.length; i++) {
              var color = this.commonService.colorGredient(this.schoolMarkers[i], this.infraData);
              var markerIcon = this.commonService.initMarkers(this.schoolMarkers[i].details.latitude, this.schoolMarkers[i].details.longitude, color, 0, 0, 0.3, options.level);

              this.generateToolTip(this.schoolMarkers[i], options.level, markerIcon, "latitude", "longitude");
              this.getDownloadableData(this.schoolMarkers[i], options.level);
            }
            globalMap.doubleClickZoom.enable();
            globalMap.scrollWheelZoom.enable();
            globalMap.setMaxBounds([[options.centerLat - 4.5, options.centerLng - 6], [options.centerLat + 3.5, options.centerLng + 6]]);
            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), this.commonService.zoomLevel);

            //schoolCount
            this.schoolCount = res['footer'];
            this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

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
    this.infraFilter = [];
    // to clear the existing data on the map layer  
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.blockId = undefined;
    this.reportData = [];
    this.level = 'block';
    var fileName = "Block_per_dist_report";

    // api call to get the blockwise data for selected district
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.infraMapBlockWise(districtId).subscribe(res => {
      this.data = res['data'];
      this.gettingInfraFilters(this.data);

      this.blockMarkers = this.data;
      // set hierarchy values
      this.districtHierarchy = {
        distId: this.data[0].details.district_id,
        districtName: this.data[0].details.district_name
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
        centerLat: this.data[0].details.latitude,
        centerLng: this.data[0].details.longitude,
        level: 'block'
      }
      this.commonService.restrictZoom(globalMap);
      globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
      globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
      this.genericFun(res, options, fileName);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.details.block_name > b.details.block_name) ? 1 : ((b.details.block_name > a.details.block_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the clusters for selected block for state data on the map
  onBlockSelect(blockId) {
    this.infraFilter = [];
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.clusterId = undefined;
    this.reportData = [];
    this.level = 'cluster';
    var fileName = "Cluster_per_block_report";

    // api call to get the clusterwise data for selected district, block
    if (this.myData) {
      this.myData.unsubscribe();
    }

    this.myData = this.service.infraMapClusterWise(this.districtHierarchy.distId, blockId).subscribe(res => {
      this.data = res['data'];
      this.gettingInfraFilters(this.data);

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

      // to show and hide the dropdowns
      this.blockHidden = false;
      this.clusterHidden = false;

      this.districtId = this.data[0].details.district_id;
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
        mapZoom: this.commonService.zoomLevel + 3,
        centerLat: this.data[0].details.latitude,
        centerLng: this.data[0].details.longitude,
        level: 'cluster'
      }

      this.commonService.restrictZoom(globalMap);
      globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
      globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
      this.genericFun(res, options, fileName);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.details.cluster_name > b.details.cluster_name) ? 1 : ((b.details.cluster_name > a.details.cluster_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the schools for selected cluster for state data on the map
  onClusterSelect(clusterId) {
    this.infraFilter = [];
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();

    // api call to get the schoolwise data for selected district, block, cluster
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.infraMapAllBlockWise().subscribe((result: any) => {
      this.myData = this.service.infraMapSchoolWise(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId).subscribe(res => {
        this.data = res['data'];
        this.gettingInfraFilters(this.data);

        this.schoolMarkers = this.data;
        var markers = result['data'];
        var myBlocks = [];
        markers.forEach(element => {
          if (element.details.district_id === this.blockHierarchy.distId) {
            myBlocks.push(element);
          }
        });
        this.blockMarkers = myBlocks;
        this.blockMarkers.sort((a, b) => (a.details.block_name > b.details.block_name) ? 1 : ((b.details.block_name > a.details.block_name) ? -1 : 0));

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

        this.blockHidden = false;
        this.clusterHidden = false;

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
          mapZoom: this.commonService.zoomLevel + 5,
          centerLat: this.data[0].details.latitude,
          centerLng: this.data[0].details.longitude,
          level: "school"
        }
        globalMap.doubleClickZoom.enable();
        globalMap.scrollWheelZoom.enable();
        globalMap.setMaxBounds([[options.centerLat - 1.5, options.centerLng - 3], [options.centerLat + 1.5, options.centerLng + 2]]);
        globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
        this.level = options.level;
        var fileName = "School_per_cluster_report";
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
    if (myData.length > 0) {
      this.markers = myData;
      // attach values to markers
      for (var i = 0; i < this.markers.length; i++) {
        var color = this.commonService.colorGredient(this.markers[i], this.infraData);
        var markerIcon = this.commonService.initMarkers(this.markers[i].details.latitude, this.markers[i].details.longitude, color, options.radius, options.strokeWeight, 1, options.level);

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
    this.schoolCount = data['footer'];
    this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  }

  //infra filters.....
  gettingInfraFilters(data) {
    this.infraFilter = [];
    for (var i = 0; i < Object.keys(data[0].metrics).length; i++) {
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

  generateToolTip(markers, level, markerIcon, lat, lng) {
    this.popups(markerIcon, markers, level);
    var infraName = this.infraData;
    let colorText = `style='color:blue !important;'`;
    var details = {};
    var orgObject = {};
    Object.keys(markers.details).forEach(key => {
      if (key !== lat) {
        details[key] = markers.details[key];
      }
    });
    Object.keys(details).forEach(key => {
      if (key !== lng) {
        orgObject[key] = details[key];
      }
    });

    var detailSchool = {};
    var yourData1;
    if (level == "school") {
      Object.keys(orgObject).forEach(key => {
        if (key !== "total_schools_data_received") {
          detailSchool[key] = details[key];
        }
      });
      yourData1 = this.commonService.getInfoFrom(detailSchool, "", level, "infra-map", infraName, colorText).join(" <br>");
    } else {
      yourData1 = this.commonService.getInfoFrom(orgObject, "", level, "infra-map", infraName, colorText).join(" <br>");
    }
    var yourData = this.commonService.getInfoFrom(markers.metrics, "", level, "infra-map", infraName, colorText).join(" <br>");


    const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
      "<b><u>Details</u></b>" +
      "<br>" + yourData1 +
      "<br><br><b><u>School Infrastructure Metrics (% of schools)</u></b>" +
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
    this.infraFilter = [];
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

  // to download the csv report
  downloadReport() {
    this.commonService.download(this.fileName, this.reportData);
  }

  // getting data to download........
  getDownloadableData(markers, level) {
    var details = {};
    var orgObject = {};
    Object.keys(markers.details).forEach(key => {
      if (key !== "latitude") {
        details[key] = markers.details[key];
      }
    });
    Object.keys(details).forEach(key => {
      if (key !== "longitude") {
        orgObject[key] = details[key];
      }
    });
    if (level == "school") {
      var detailSchool = {};
      Object.keys(orgObject).forEach(key => {
        if (key !== "total_schools_data_received") {
          detailSchool[key] = details[key];
        }
      });
    }
    if (level == "district") {
      if (this.infraData !== 'infrastructure_score') {
        let obj = {
          district_id: markers.details.district_id,
          district_name: markers.details.district_name,
          [this.infraData]: markers.metrics[`${this.infraData}`] + "%"
        }
        this.reportData.push(obj);
      } else {
        let myobj = { ...orgObject, ...markers.metrics }
        this.reportData.push(myobj);
      }
    } else if (level == "block") {
      if (this.infraData !== 'infrastructure_score') {
        let obj = {
          district_id: markers.details.district_id,
          district_name: markers.details.district_name,
          block_id: markers.details.block_id,
          block_name: markers.details.block_name,
          [this.infraData]: markers.metrics[`${this.infraData}`] + "%"
        }
        this.reportData.push(obj);
      } else {
        let myobj = { ...orgObject, ...markers.metrics }
        this.reportData.push(myobj);
      }
    }
    else if (level == "cluster") {
      if (this.infraData !== 'infrastructure_score') {
        let obj = {
          district_id: markers.details.district_id,
          district_name: markers.details.district_name,
          block_id: markers.details.block_id,
          block_name: markers.details.block_name,
          cluster_id: markers.details.cluster_id,
          cluster_name: markers.details.cluster_name,
          [this.infraData]: markers.metrics[`${this.infraData}`] + "%"
        }
        this.reportData.push(obj);
      } else {
        let myobj = { ...orgObject, ...markers.metrics }
        this.reportData.push(myobj);
      }
    } else if (level == "school") {
      if (this.infraData !== 'infrastructure_score') {
        let obj = {
          district_id: markers.details.district_id,
          district_name: markers.details.district_name,
          block_id: markers.details.block_id,
          block_name: markers.details.block_name,
          cluster_id: markers.details.cluster_id,
          cluster_name: markers.details.cluster_name,
          school_id: markers.details.school_id,
          school_name: markers.details.school_name,
          [this.infraData]: markers.metrics[`${this.infraData}`] + "%"
        }
        this.reportData.push(obj);
      } else {
        let myobj = { ...detailSchool, ...markers.metrics }
        this.reportData.push(myobj);
      }
    }
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
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { google } from "google-maps";
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
declare var google;

@Component({
  selector: 'app-student-attedence',
  templateUrl: './student-attedence.component.html',
  styleUrls: ['./student-attedence.component.css']
})

export class StudentAttedenceComponent implements OnInit {
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
  public stylesFile = "../assets/mapStyles.json";
  public id = '';
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;
  myDistrict: any;
  myBlock: any;


  dist: boolean = false;
  blok: boolean = false;
  clust: boolean = false;
  skul: boolean = false;

  styles: any = [];

  // google maps zoom level
  zoom: number = 7;

  labelOptions: any = {};

  // initial center position for the map
  lat: any;
  lng: any;

  public markers: any = [];

  public mylatlngData: any = [];

  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router) { }

  async ngOnInit() {
    this.districtWise();
    this.http.get(this.stylesFile).subscribe(data => {
      this.styles = data;
    });
  }

  districtWise() {
    this.myDistrict = '';
    this.blockHidden = true;
    this.clusterHidden = true;
    this.lat = 22.790988462301428;
    this.lng = 72.02733294142871;
    this.zoom = 7;
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
    this.title = "State";
    this.titleName = "Gujarat"
    this.service.dist_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.dist = true;
      this.blok = false;
      this.clust = false;
      this.skul = false;
      this.mylatlngData.forEach(item => {
        this.districtsIds.push(item['x_axis']);
        this.districtsNames.push(item['district_name']);
        if (item['x_value'] > 75) {
          this.districts.push(
            {
              id: item['x_axis'],
              name: item['district_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/green_Block.png",
                scaledSize: {
                  width: 21,
                  height: 22,
                  backgroundColor: "red"
                }
              }
            });
        } else if (item['x_value'] < 75 && item['x_value'] > 60) {
          this.districts.push(
            {
              id: item['x_axis'],
              name: item['district_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],

              icon: {
                url: "../assets/blue_Dist.png",
                scaledSize: {
                  width: 21,
                  height: 22
                }
              }
            });
        } else if (item['x_value'] < 60 && item['x_value'] > 40) {
          this.districts.push(
            {
              id: item['x_axis'],
              name: item['district_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/orange_Dist.png",
                scaledSize: {
                  width: 21,
                  height: 22
                }
              }

            });
        } else if (item['x_value'] < 40) {
          this.districts.push(
            {
              id: item['x_axis'],
              name: item['district_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/red1_Dist.png",
                scaledSize: {
                  width: 21,
                  height: 22
                }
              }

            });
        }
      });

      this.markers = this.districts;
      if (this.markers.length !== 0) {
        document.getElementById('spinner').style.display = 'none';

      } else {
        setTimeout(() => {
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('errMsg').style.color = 'red';
          document.getElementById('errMsg').style.display = 'block';
          document.getElementById('errMsg').innerHTML = 'No data found';
        }, 20000);
      }
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'none';
    console.log(this.districts);
    this.districts = [];

  }

  schoolWise() {
    this.myDistrict = '';
    this.lat = 22.790988462301428;
    this.lng = 72.02733294142871;
    this.zoom = 7;
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
    this.title = "State";
    this.titleName = "Gujarat"
    this.service.school_wise_data().subscribe(res => {
      // localStorage.setItem('schoolWise', JSON.stringify(res));
      this.mylatlngData = res;
      this.dist = false;
      this.blok = false;
      this.clust = false;
      this.skul = true;
      this.mylatlngData.forEach(item => {

        this.districtsIds.push(item['x_axis']);
        if (item['x_value'] > 75) {
          this.schools.push(
            {
              id: item['x_axis'],
              dist: item['district_name'],
              name: item['school_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/green_Block.png",
                scaledSize: {
                  width: 6,
                  height: 7,
                }
              }
            });
        } else if (item['x_value'] < 75 && item['x_value'] > 60) {
          this.schools.push(
            {
              id: item['x_axis'],
              dist: item['district_name'],
              name: item['school_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],

              icon: {
                url: "../assets/blue_Dist.png",
                scaledSize: {
                  width: 6,
                  height: 7
                }
              }
            });
        } else if (item['x_value'] < 60 && item['x_value'] > 40) {
          this.schools.push(
            {
              id: item['x_axis'],
              dist: item['district_name'],
              name: item['school_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/orange_Dist.png",
                scaledSize: {
                  width: 6,
                  height: 7
                }
              }

            });
        } else if (item['x_value'] < 40) {
          this.schools.push(
            {
              id: item['x_axis'],
              dist: item['district_name'],
              name: item['school_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/red1_Dist.png",
                scaledSize: {
                  width: 6,
                  height: 7
                }
              }

            });
        }
      });

      this.markers = this.schools;
      if (this.markers.length !== 0) {
        document.getElementById('spinner').style.display = 'none';

      } else {
        setTimeout(() => {
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('errMsg').style.color = 'red';
          document.getElementById('errMsg').style.display = 'block';
          document.getElementById('errMsg').innerHTML = 'No data found';
        }, 20000);
      }
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'block';
    this.schools = [];
  }

  clusterWise() {

    this.myDistrict = '';
    this.blockHidden = true;
    this.clusterHidden = true;
    this.lat = 22.790988462301428;
    this.lng = 72.02733294142871;
    this.zoom = 7;
    this.markers = [];
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
    this.title = "State";
    this.titleName = "Gujarat"
    this.service.cluster_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.dist = false;
      this.blok = false;
      this.clust = true;
      this.skul = false;
      this.mylatlngData.forEach(item => {
        // console.log(item);
        this.clusterIds.push(item['x_axis']);

        if (item['x_value'] < 6) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF1100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }

            });
        }
        else if (item['x_value'] < 11 && item['x_value'] > 5) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF1100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 16 && item['x_value'] > 10) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF1100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 21 && item['x_value'] > 15) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF1100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 26 && item['x_value'] > 20) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF1100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 31 && item['x_value'] > 25) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF1100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 36 && item['x_value'] > 30) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF1100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 41 && item['x_value'] > 35) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF1100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 46 && item['x_value'] > 40) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF1100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_values'] > 51 && item['x_values'] < 45) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF6900",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 56 && item['x_value'] > 50) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FF7B00",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 61 && item['x_value'] > 55) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FFC100",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 66 && item['x_value'] > 60) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#FFE400",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 71 && item['x_value'] > 65) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#C2FF00",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 76 && item['x_value'] > 70) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#B0FF00",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 81 && item['x_value'] > 75) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#8DFF00",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 86 && item['x_value'] > 80) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#7CFF00",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 91 && item['x_value'] > 85) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#6AFF00",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_value'] < 96 && item['x_value'] > 90) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#24FF00",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }
        else if (item['x_values'] > 95) {
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['cluster_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: "#00FF00",
                fillOpacity: 1,
                strokeWeight: 0.1
              }
            });
        }

      });
      console.log(this.cluster);

      this.markers = this.cluster;
      if (this.markers.length !== 0) {
        document.getElementById('spinner').style.display = 'none';

      } else {
        setTimeout(() => {
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('errMsg').style.color = 'red';
          document.getElementById('errMsg').style.display = 'block';
          document.getElementById('errMsg').innerHTML = 'No data found';
        }, 20000);
      }
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'Block';
    this.cluster = [];
  }

  blockWise() {
    this.myDistrict = '';
    this.blockHidden = true;
    this.clusterHidden = true;
    this.lat = 22.790988462301428;
    this.lng = 72.02733294142871;
    this.zoom = 7;
    this.markers = [];
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
    this.title = "State";
    this.titleName = "Gujarat"
    this.service.block_wise_data().subscribe(res => {
      // localStorage.setItem('schoolWise', JSON.stringify(res));
      this.mylatlngData = res;
      this.dist = false;
      this.blok = true;
      this.clust = false;
      this.skul = false;
      this.mylatlngData.forEach(item => {
        this.blocksIds.push(item['x_axis']);
        if (item['x_value'] > 75) {
          this.blocks.push(
            {
              id: item['x_axis'],
              dist: item['district_name'],
              name: item['block_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/green_Block.png",
                scaledSize: {
                  width: 6,
                  height: 7,
                }
              }
            });
        } else if (item['x_value'] < 75 && item['x_value'] > 60) {
          this.blocks.push(
            {
              id: item['x_axis'],
              dist: item['district_name'],
              name: item['block_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],

              icon: {
                url: "../assets/blue_Dist.png",
                scaledSize: {
                  width: 6,
                  height: 7
                }
              }
            });
        } else if (item['x_value'] < 60 && item['x_value'] > 40) {
          this.blocks.push(
            {
              id: item['x_axis'],
              dist: item['district_name'],
              name: item['block_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/orange_Dist.png",
                scaledSize: {
                  width: 6,
                  height: 7
                }
              }

            });
        } else if (item['x_value'] < 40) {
          this.blocks.push(
            {
              id: item['x_axis'],
              dist: item['district_name'],
              name: item['block_name'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/red1_Dist.png",
                scaledSize: {
                  width: 6,
                  height: 7
                }
              }

            });
        }
      });

      this.markers = this.blocks;
      if (this.markers.length !== 0) {
        document.getElementById('spinner').style.display = 'none';

      } else {
        setTimeout(() => {
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('errMsg').style.color = 'red';
          document.getElementById('errMsg').style.display = 'block';
          document.getElementById('errMsg').innerHTML = 'No data found';
        }, 20000);
      }
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'Block';
    this.blocks = [];
  }

  // clickedMarker(label) {

  //   if (this.districtsIds.includes(label[2])) {
  //     this.myDistrict = '';
  //     this.zoom = 9;
  //     this.lat = Number(label[3]);
  //     this.lng = Number(label[4]);

  //     this.markers = [];
  //     this.blocks = [];
  //     document.getElementById('errMsg').style.display = 'none';
  //     document.getElementById('spinner').style.display = 'block';
  //     document.getElementById('spinner').style.marginTop = '3%';

  //     this.title = "District";
  //     this.titleName = label[1];
  //     localStorage.setItem('dist', label[1]);
  //     this.service.blockPerDist(label[2], label[1]).subscribe(res => {
  //       this.dist = false;
  //       this.blok = true;
  //       this.clust = false;
  //       this.skul = false;

  //       this.mylatlngData = res;
  //       this.blocksIds = [];
  //       this.mylatlngData.forEach(item => {
  //         this.blocksIds.push(item['x_axis']);
  //         this.blocksNames.push(item['block_name']);
  //         if (item['x_value'] > 75) {
  //           this.blocks.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['block_name'],
  //               dist: item['distName'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/green_Block.png",
  //                 scaledSize: {
  //                   width: 15,
  //                   height: 16
  //                 }
  //               }
  //             });
  //         } else if (item['x_value'] < 75 && item['x_value'] > 60) {
  //           this.blocks.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['block_name'],
  //               dist: item['distName'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/blue_Dist.png",
  //                 scaledSize: {
  //                   width: 15,
  //                   height: 16
  //                 }
  //               }
  //             });
  //         } else if (item['x_value'] < 60 && item['x_value'] > 40) {
  //           this.blocks.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['block_name'],
  //               dist: item['distName'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/orange_Dist.png",
  //                 scaledSize: {
  //                   width: 15,
  //                   height: 16
  //                 }
  //               }
  //             });
  //         } else if (item['x_value'] < 40) {
  //           this.blocks.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['block_name'],
  //               dist: item['distName'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/red1_Dist.png",
  //                 scaledSize: {
  //                   width: 15,
  //                   height: 16
  //                 }
  //               }
  //             });
  //         }

  //       });

  //       this.markers = this.blocks;
  //       if (this.markers.length !== 0) {
  //         document.getElementById('spinner').style.display = 'none';
  //       } else {
  //         setTimeout(() => {
  //           document.getElementById('spinner').style.display = 'none';
  //           document.getElementById('errMsg').style.color = 'red';
  //           document.getElementById('errMsg').style.display = 'block';
  //           document.getElementById('errMsg').innerHTML = 'No data found';
  //         }, 20000);
  //       }
  //     });
  //     var element1: any = document.getElementsByClassName('btn-secondary');
  //     element1[0].style.display = 'block';
  //     // element1[1].style.display = 'block';
  //     // this.markers = [];
  //     this.blocks = [];

  //   }


  //   if (this.blocksIds.includes(label[2])) {
  //     this.myDistrict = '';
  //     this.zoom = 11;
  //     this.lat = Number(label[3]);
  //     this.lng = Number(label[4]);

  //     this.markers = [];
  //     this.cluster = [];
  //     document.getElementById('errMsg').style.display = 'none';
  //     document.getElementById('spinner').style.display = 'block';
  //     document.getElementById('spinner').style.marginTop = '3%';

  //     this.title = "Block";
  //     this.titleName = label[1];
  //     this.service.clusterPerBlock(label[2], label[1]).subscribe(res => {
  //       var distId = localStorage.getItem('dist');
  //       localStorage.setItem('block', label[1]);
  //       this.dist = false;
  //       this.blok = false;
  //       this.clust = true;
  //       this.skul = false;

  //       this.mylatlngData = res;
  //       this.clusterIds = [];
  //       this.mylatlngData.forEach(item => {
  //         this.clusterIds.push(item['x_axis']);
  //         // this.clusterIds.push(item['x_axis']);
  //         if (item['x_value'] > 75) {
  //           this.cluster.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['crc_name'],
  //               // name: item[''],
  //               dist: distId,
  //               blockId: item['blockName'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/green_Block.png",
  //                 scaledSize: {
  //                   width: 12,
  //                   height: 13
  //                 }
  //               }
  //             });
  //         } else if (item['x_value'] < 75 && item['x_value'] > 60) {
  //           this.cluster.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['crc_name'],
  //               // name: item[''],
  //               dist: distId,
  //               blockId: item['blockName'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/blue_Dist.png",
  //                 scaledSize: {
  //                   width: 12,
  //                   height: 13
  //                 }
  //               }
  //             });
  //         } else if (item['x_value'] < 60 && item['x_value'] > 40) {
  //           this.cluster.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['crc_name'],
  //               // name: item[''],
  //               dist: distId,
  //               blockId: item['blockName'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/orange_Dist.png",
  //                 scaledSize: {
  //                   width: 12,
  //                   height: 13
  //                 }
  //               }
  //             });
  //         } else if (item['x_value'] < 40) {
  //           this.cluster.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['crc_name'],
  //               // name: item[''],
  //               dist: distId,
  //               blockId: item['blockName'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/red1_Dist.png",
  //                 scaledSize: {
  //                   width: 12,
  //                   height: 13
  //                 }
  //               }
  //             });
  //         }

  //       });

  //       this.markers = this.cluster;
  //       if (this.markers.length !== 0) {
  //         document.getElementById('spinner').style.display = 'none';
  //       } else {
  //         setTimeout(() => {
  //           document.getElementById('spinner').style.display = 'none';
  //           document.getElementById('errMsg').style.color = 'red';
  //           document.getElementById('errMsg').style.display = 'block';
  //           document.getElementById('errMsg').innerHTML = 'No data found';
  //         }, 20000);
  //       }
  //     });
  //     var element1: any = document.getElementsByClassName('btn-secondary');
  //     element1[0].style.display = 'block';
  //     // element1[1].style.display = 'block';
  //     // this.markers = [];
  //     this.cluster = [];
  //   }

  //   if (this.clusterIds.includes(label[2])) {
  //     console.log(label[1]);
  //     this.myDistrict = '';
  //     this.zoom = 13;
  //     this.lat = Number(label[3]);
  //     this.lng = Number(label[4]);

  //     this.markers = [];
  //     this.schools = [];
  //     document.getElementById('errMsg').style.display = 'none';
  //     document.getElementById('spinner').style.display = 'block';
  //     document.getElementById('spinner').style.marginTop = '3%';

  //     this.title = "Cluster";
  //     this.titleName = label[1]+"(crc)";
  //     this.service.schoolsPerCluster("",label[1]).subscribe(res => {
  //       var block = localStorage.getItem('block');
  //       var distId = localStorage.getItem('dist');
  //       this.dist = false;
  //       this.blok = false;
  //       this.clust = false;
  //       this.skul = true;

  //       this.mylatlngData = res;
  //       this.mylatlngData.forEach(item => {
  //         if (item['x_value'] > 75) {
  //           this.schools.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['schoolName'],
  //               blockId: block,
  //               dist: distId,
  //               clusterId: item['clusterId'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/green_Block.png",
  //                 scaledSize: {
  //                   width: 6,
  //                   height: 7
  //                 }
  //               }
  //             });
  //         } else if (item['x_value'] < 75 && item['x_value'] > 60) {
  //           this.schools.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['schoolName'],
  //               blockId: block,
  //               dist: distId,
  //               clusterId: item['clusterId'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/blue_Dist.png",
  //                 scaledSize: {
  //                   width: 6,
  //                   height: 7
  //                 }
  //               }
  //             });
  //         } else if (item['x_value'] < 60 && item['x_value'] > 40) {
  //           this.schools.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['schoolName'],
  //               blockId: block,
  //               dist: distId,
  //               clusterId: item['clusterId'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/orange_Dist.png",
  //                 scaledSize: {
  //                   width: 6,
  //                   height: 7
  //                 }
  //               }
  //             });
  //         } else if (item['x_value'] < 40) {
  //           this.schools.push(
  //             {
  //               id: item['x_axis'],
  //               name: item['schoolName'],
  //               blockId: block,
  //               dist: distId,
  //               clusterId: item['clusterId'],
  //               label: item['x_value'],
  //               lat: item['y_value'],
  //               lng: item['z_value'],
  //               icon: {
  //                 url: "../assets/red1_Dist.png",
  //                 scaledSize: {
  //                   width: 6,
  //                   height: 7
  //                 }
  //               }
  //             });
  //         }

  //       });

  //       this.markers = this.schools;
  //       if (this.markers.length !== 0) {
  //         document.getElementById('spinner').style.display = 'none';
  //       } else {
  //         setTimeout(() => {
  //           document.getElementById('spinner').style.display = 'none';
  //           document.getElementById('errMsg').style.color = 'red';
  //           document.getElementById('errMsg').style.display = 'block';
  //           document.getElementById('errMsg').innerHTML = 'No data found';
  //         }, 20000);
  //       }
  //     });
  //     var element1: any = document.getElementsByClassName('btn-secondary');
  //     element1[0].style.display = 'block';
  //     // element1[1].style.display = 'block';
  //     // this.markers = [];
  //     this.schools = [];
  //   }
  // };

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


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  // myDistData(data) {
  //   document.getElementById('errMsg').style.display = 'none';
  //   document.getElementById('spinner').style.display = 'block';
  //   document.getElementById('spinner').style.marginTop = '3%';

  //   this.title = "District";
  //   this.titleName = data;
  //   localStorage.setItem('dist', data);
  //   this.service.blockPerDist(2401, data).subscribe(res => {
  //     this.blockHidden = false;
  //     this.dist = false;
  //     this.blok = true;
  //     this.clust = false;
  //     this.skul = false;

  //     this.mylatlngData = res;
  //     this.blocksIds = [];
  //     this.mylatlngData.forEach(item => {
  //       this.blocksIds.push(item['x_axis']);
  //       this.blocksNames.push(item['block_name']);
  //       if (item['x_value'] > 75) {
  //         this.blocks.push(
  //           {
  //             id: item['x_axis'],
  //             name: item['block_name'],
  //             dist: item['distName'],
  //             label: item['x_value'],
  //             lat: item['y_value'],
  //             lng: item['z_value'],
  //             icon: {
  //               url: "../assets/green_Block.png",
  //               scaledSize: {
  //                 width: 15,
  //                 height: 16
  //               }
  //             }
  //           });
  //       } else if (item['x_value'] < 75 && item['x_value'] > 60) {
  //         this.blocks.push(
  //           {
  //             id: item['x_axis'],
  //             name: item['block_name'],
  //             dist: item['distName'],
  //             label: item['x_value'],
  //             lat: item['y_value'],
  //             lng: item['z_value'],
  //             icon: {
  //               url: "../assets/blue_Dist.png",
  //               scaledSize: {
  //                 width: 15,
  //                 height: 16
  //               }
  //             }
  //           });
  //       } else if (item['x_value'] < 60 && item['x_value'] > 40) {
  //         this.blocks.push(
  //           {
  //             id: item['x_axis'],
  //             name: item['block_name'],
  //             dist: item['distName'],
  //             label: item['x_value'],
  //             lat: item['y_value'],
  //             lng: item['z_value'],
  //             icon: {
  //               url: "../assets/orange_Dist.png",
  //               scaledSize: {
  //                 width: 15,
  //                 height: 16
  //               }
  //             }
  //           });
  //       } else if (item['x_value'] < 40) {
  //         this.blocks.push(
  //           {
  //             id: item['x_axis'],
  //             name: item['block_name'],
  //             dist: item['distName'],
  //             label: item['x_value'],
  //             lat: item['y_value'],
  //             lng: item['z_value'],
  //             icon: {
  //               url: "../assets/red1_Dist.png",
  //               scaledSize: {
  //                 width: 15,
  //                 height: 16
  //               }
  //             }
  //           });
  //       }

  //     });

  //     this.markers = this.blocks;
  //     if (this.markers.length !== 0) {
  //       document.getElementById('spinner').style.display = 'none';
  //     } else {
  //       setTimeout(() => {
  //         document.getElementById('spinner').style.display = 'none';
  //         document.getElementById('errMsg').style.color = 'red';
  //         document.getElementById('errMsg').style.display = 'block';
  //         document.getElementById('errMsg').innerHTML = 'No data found';
  //       }, 20000);
  //     }
  //   });
  //   var element1: any = document.getElementsByClassName('btn-secondary');
  //   element1[0].style.display = 'block';
  //   // element1[1].style.display = 'block';
  //   // this.markers = [];
  //   this.blocks = [];
  //   console.log("myData clicked", data);
  // }

}

interface marker {
  lat: any;
  lng: any;
  label?: string;
  url?: string;
  id?: number
}
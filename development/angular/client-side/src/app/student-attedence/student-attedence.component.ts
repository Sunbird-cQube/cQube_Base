import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MouseEvent } from '@agm/core';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-attedence',
  templateUrl: './student-attedence.component.html',
  styleUrls: ['./student-attedence.component.css']
})
export class StudentAttedenceComponent implements OnInit {
  public title: string = '';
  public districts: any = [];
  public blocks: any = [];
  public cluster: any = [];
  public schools: any = [];
  public districtsIds: any = [];
  public blocksIds: any = [];
  public clusterIds: any = [];
  public schoolsIds: any = [];
  public stylesFile = "../assets/mapStyles.json";
  public id = '';

  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;



  dist: boolean = false;
  blok: boolean = false;
  clust: boolean = false;
  skul: boolean = false;

  styles: any = [];
  viewType: any = 'hybrid';

  // google maps zoom level
  zoom: number = 7;

  labelOptions: any = {};

  // initial center position for the map
  lat: any;
  lng: any;

  public markers: any = [];

  async ngOnInit() {
    this.districtWise();
    this.http.get(this.stylesFile).subscribe(data => {
      this.styles = data;
    });
  }

  public mylatlngData: any = [];

  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router) { }


  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;

    // here our in other method after you get the coords; but make sure map is loaded
    var pointArray = new google.maps.MVCArray(this.markers);

    const coords: google.maps.LatLng[] = pointArray; // can also be a google.maps.MVCArray with LatLng[] inside    
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: coords
    });
  }

  districtWise() {
    this.lat = 22.790988462301428;
    this.lng = 72.02733294142871;
    this.zoom = 7;
    document.getElementById('spinner').style.display = 'block';
    this.title = "District-wise";
    this.service.dist_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.dist = true;
      this.blok = false;
      this.clust = false;
      this.skul = false;
      this.mylatlngData.forEach(item => {

        this.districtsIds.push(item['x_axis']);
        if (item['x_value'] > 75) {
          this.districts.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                url: "../assets/green_Block.png",
                scaledSize: {
                  width: 21,
                  height: 22
                }
              }
            });
        } else if (item['x_value'] < 75 && item['x_value'] > 60) {
          this.districts.push(
            {
              id: item['x_axis'],
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
      }
    });

    var element1 = <HTMLInputElement>document.getElementById('districtWise');
    element1.disabled = true;
    this.markers = [];
    this.districts = [];
  }

  clickedMarker(label, infowindow) {

    if (this.districtsIds.includes(label[1])) {

      this.zoom = 9;
      this.lat = Number(label[2]);
      this.lng = Number(label[3]);

      this.markers = [];
      this.blocks = [];
      document.getElementById('spinner').style.display = 'block';
      this.title = "Blocks per district";
      this.service.blcokPerDist(label[1]).subscribe(res => {
        localStorage.setItem('dist', label[1]);
        this.dist = false;
        this.blok = true;
        this.clust = false;
        this.skul = false;
        console.log(res);
        this.mylatlngData = res;
        this.blocksIds = [];
        this.mylatlngData.forEach(item => {
          this.blocksIds.push(item['x_axis']);
          if (item['x_value'] > 75) {
            this.blocks.push(
              {
                id: item['x_axis'],
                dist: item['distId'],
                label: item['x_value'],
                lat: item['y_value'],
                lng: item['z_value'],
                icon: {
                  url: "../assets/green_Block.png",
                  scaledSize: {
                    width: 15,
                    height: 16
                  }
                }
              });
          } else if (item['x_value'] < 75 && item['x_value'] > 60) {
            this.blocks.push(
              {
                id: item['x_axis'],
                dist: item['distId'],
                label: item['x_value'],
                lat: item['y_value'],
                lng: item['z_value'],
                icon: {
                  url: "../assets/blue_Dist.png",
                  scaledSize: {
                    width: 15,
                    height: 16
                  }
                }
              });
          } else if (item['x_value'] < 60 && item['x_value'] > 40) {
            this.blocks.push(
              {
                id: item['x_axis'],
                dist: item['distId'],
                label: item['x_value'],
                lat: item['y_value'],
                lng: item['z_value'],
                icon: {
                  url: "../assets/orange_Dist.png",
                  scaledSize: {
                    width: 15,
                    height: 16
                  }
                }
              });
          } else if (item['x_value'] < 40) {
            this.blocks.push(
              {
                id: item['x_axis'],
                dist: item['distId'],
                label: item['x_value'],
                lat: item['y_value'],
                lng: item['z_value'],
                icon: {
                  url: "../assets/red1_Dist.png",
                  scaledSize: {
                    width: 15,
                    height: 16
                  }
                }
              });
          }

        });

        this.markers = this.blocks;
        if (this.markers.length !== 0) {
          document.getElementById('spinner').style.display = 'none';
        }
      });
      var element1 = <HTMLInputElement>document.getElementById('districtWise');
      element1.disabled = false;
      this.markers = [];
      this.blocks = [];

    }


    if (this.blocksIds.includes(label[1])) {
      this.zoom = 11;
      this.lat = Number(label[2]);
      this.lng = Number(label[3]);

      this.markers = [];
      this.cluster = [];
      document.getElementById('spinner').style.display = 'block';
      this.title = "Clusters per block";
      this.service.clusterPerBlock(label[1]).subscribe(res => {
        var distId = localStorage.getItem('dist');
        localStorage.setItem('block', label[1]);
        this.dist = false;
        this.blok = false;
        this.clust = true;
        this.skul = false;
        console.log(res);
        this.mylatlngData = res;
        this.clusterIds = [];
        this.mylatlngData.forEach(item => {
          this.clusterIds.push(item['x_axis']);
          if (item['x_value'] > 75) {
            this.cluster.push(
              {
                id: item['x_axis'],
                dist: distId,
                blockId: item['blockId'],
                label: item['x_value'],
                lat: item['y_value'],
                lng: item['z_value'],
                icon: {
                  url: "../assets/green_Block.png",
                  scaledSize: {
                    width: 12,
                    height: 13
                  }
                }
              });
          } else if (item['x_value'] < 75 && item['x_value'] > 60) {
            this.cluster.push(
              {
                id: item['x_axis'],
                dist: distId,
                blockId: item['blockId'],
                label: item['x_value'],
                lat: item['y_value'],
                lng: item['z_value'],
                icon: {
                  url: "../assets/blue_Dist.png",
                  scaledSize: {
                    width: 12,
                    height: 13
                  }
                }
              });
          } else if (item['x_value'] < 60 && item['x_value'] > 40) {
            this.cluster.push(
              {
                id: item['x_axis'],
                dist: distId,
                blockId: item['blockId'],
                label: item['x_value'],
                lat: item['y_value'],
                lng: item['z_value'],
                icon: {
                  url: "../assets/orange_Dist.png",
                  scaledSize: {
                    width: 12,
                    height: 13
                  }
                }
              });
          } else if (item['x_value'] < 40) {
            this.cluster.push(
              {
                id: item['x_axis'],
                dist: distId,
                blockId: item['blockId'],
                label: item['x_value'],
                lat: item['y_value'],
                lng: item['z_value'],
                icon: {
                  url: "../assets/red1_Dist.png",
                  scaledSize: {
                    width: 12,
                    height: 13
                  }
                }
              });
          }

        });

        this.markers = this.cluster;
        if (this.markers.length !== 0) {
          document.getElementById('spinner').style.display = 'none';
        }
      });
      var element1 = <HTMLInputElement>document.getElementById('districtWise');
      element1.disabled = false;
      this.markers = [];
      this.cluster = [];
    }

    if (this.clusterIds.includes(label[1])) {

      this.zoom = 13;
      this.lat = Number(label[2]);
      this.lng = Number(label[3]);

      this.markers = [];
      this.schools = [];
      document.getElementById('spinner').style.display = 'block';
      this.title = "Schools per cluster";
      this.service.schoolsPerCluster(label[1]).subscribe(res => {
        var block = localStorage.getItem('block');
        var distId = localStorage.getItem('dist');
        this.dist = false;
        this.blok = false;
        this.clust = false;
        this.skul = true;
        console.log(res);
        this.mylatlngData = res;
        this.mylatlngData.forEach(item => {
          if (item['x_value'] > 75) {
            this.schools.push(
              {
                id: item['x_axis'],
                blockId: block,
                dist: distId,
                clusterId: item['clusterId'],
                label: item['x_value'],
                lat: item['y_value'],
                lng: item['z_value'],
                icon: {
                  url: "../assets/green_Block.png",
                  scaledSize: {
                    width: 6,
                    height: 7
                  }
                }
              });
          } else if (item['x_value'] < 75 && item['x_value'] > 60) {
            this.schools.push(
              {
                id: item['x_axis'],
                blockId: block,
                dist: distId,
                clusterId: item['clusterId'],
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
                blockId: block,
                dist: distId,
                clusterId: item['clusterId'],
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
                blockId: block,
                dist: distId,
                clusterId: item['clusterId'],
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
        }
      });
      var element1 = <HTMLInputElement>document.getElementById('districtWise');
      element1.disabled = false;
      this.markers = [];
      this.schools = [];
    }
  };



  markerDragEnd(m: any, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }


  mapClicked($event: MouseEvent) {
    // console.log($event);
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   //  draggable: false
    // });
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


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

}

interface marker {
  lat: any;
  lng: any;
  label?: string;
  url?: string;
  id?: number
}

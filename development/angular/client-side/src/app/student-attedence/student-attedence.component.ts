import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MouseEvent } from '@agm/core';
import { AppServiceComponent } from '../app.service';

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
  public stylesFile = "../assets/mapStyles.json";

  styles: any = [];
  viewType: any = 'hybrid';

  // google maps zoom level
  zoom: number = 7.5;

  labelOptions: any = {};

  // initial center position for the map
  lat: any;
  lng: any;

  public markers: marker[] = [];

  async ngOnInit() {
    this.lat = 22.3521,
      this.lng = 71.7178
    this.schoolWise();
    this.http.get(this.stylesFile).subscribe(data => {
      this.styles = data;
    });
  }

  public mylatlngData: any = [];

  constructor(public http: HttpClient, public service: AppServiceComponent) { }


  districtWise() {
    document.getElementById('spinner').style.display = 'block';
    this.title = "District";
    this.service.dist_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.mylatlngData.forEach(item => {
        this.lat = Number(item['y_value']);
        this.lng = Number(item['z_value']);
        if (item['x_value'] > 75) {
          this.districts.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/green_Dist.png"
            });
        } else if (item['x_value'] < 75 && item['x_value'] > 60) {
          this.districts.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/blue_Dist.png"
            });
        } else if (item['x_value'] < 60 && item['x_value'] > 40) {
          this.districts.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/orange_Dist.png"
            });
        } else if (item['x_value'] < 40) {
          this.districts.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/red1_Dist.png"
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
    var element2 = <HTMLInputElement>document.getElementById('blockWise');
    element2.disabled = false;
    var element3 = <HTMLInputElement>document.getElementById('schoolWise');
    element3.disabled = false;
    var element4 = <HTMLInputElement>document.getElementById('clusterWise');
    element4.disabled = false;

    this.markers = [];
    this.districts = [];
  }

  blockWise() {
    document.getElementById('spinner').style.display = 'block';
    this.title = "Block";
    this.service.block_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.mylatlngData.forEach(item => {
        if (item['x_value'] > 75) {
          this.blocks.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/green_Block.png"
            });
        } else if (item['x_value'] < 75 && item['x_value'] > 60) {
          this.blocks.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/blue_Block.png"
            });
        } else if (item['x_value'] < 60 && item['x_value'] > 40) {
          this.blocks.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/orange_Block.png"
            });
        } else if (item['x_value'] < 40) {
          this.blocks.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/red1_Block.png"
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
    var element2 = <HTMLInputElement>document.getElementById('blockWise');
    element2.disabled = true;
    var element3 = <HTMLInputElement>document.getElementById('schoolWise');
    element3.disabled = false;
    var element4 = <HTMLInputElement>document.getElementById('clusterWise');
    element4.disabled = false;

    this.blocks = [];
    this.markers = [];
  }

  clusterWise() {
    document.getElementById('spinner').style.display = 'block';
    this.title = "Cluster";
    this.service.cluster_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.mylatlngData.forEach(item => {
        if (item['x_value'] > 75) {
          this.cluster.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/green_Cluster.png"
            });
        } else if (item['x_value'] < 75 && item['x_value'] > 60) {
          this.cluster.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/blue_Cluster.png"
            });
        } else if (item['x_value'] < 60 && item['x_value'] > 40) {
          this.cluster.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/orange_Cluster.png"
            });
        } else if (item['x_value'] < 40) {
          this.cluster.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/red1_Cluster.png"
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
    var element2 = <HTMLInputElement>document.getElementById('blockWise');
    element2.disabled = false;
    var element3 = <HTMLInputElement>document.getElementById('schoolWise');
    element3.disabled = false;
    var element4 = <HTMLInputElement>document.getElementById('clusterWise');
    element4.disabled = true;

    this.markers = [];
    this.cluster = [];
  }

  schoolWise() {
    document.getElementById('spinner').style.display = 'block';
    this.title = "School";
    this.service.school_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.mylatlngData.forEach(item => {
        if (item['x_value'] > 75) {
          this.schools.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/green_3_4.png"
            });
        } else if (item['x_value'] < 75 && item['x_value'] > 60) {
          this.schools.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/blue_2_4_small.png"
            });
        } else if (item['x_value'] < 60 && item['x_value'] > 40) {
          this.schools.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/orange_Small.png"
            });
        } else if (item['x_value'] < 40) {
          this.schools.push(
            {
              id: item['x_axis'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              url: "../assets/red1_4_small.png"
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
    var element2 = <HTMLInputElement>document.getElementById('blockWise');
    element2.disabled = false;
    var element3 = <HTMLInputElement>document.getElementById('schoolWise');
    element3.disabled = true;
    var element4 = <HTMLInputElement>document.getElementById('clusterWise');
    element4.disabled = false;


    this.markers = [];
    this.schools = [];
  }


  // previous;

  clickedMarker(label, infowindow) {
    // this.zoom = 10;
    // this.lat = Number(label[2]);
    // this.lng = Number(label[3]);
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

}

interface marker {
  lat: any;
  lng: any;
  label?: string;
  url?: string;
  id?: number
}

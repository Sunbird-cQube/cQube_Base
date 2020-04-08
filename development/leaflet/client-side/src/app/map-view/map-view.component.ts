import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { latLng, tileLayer, icon, marker } from 'leaflet';
import { google } from "google-maps";
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
declare let L;

var globalMap;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  public title: string = '';
  public districts: any = [];
  public blocks: any = [];
  public cluster: any = [];
  public schools: any = [];
  public districtsIds: any = [];
  public blocksIds: any = [];
  public clusterIds: any = [];
  public schoolsIds: any = [];
  public colors: any;
  public id = '';
  public districtsNames: any = [];
  public blocksNames: any = [];
  public clusterNames: any = [];
  public schoolsNames: any = [];
  public studentCount: any;
  myDistrict: any;
  zoom: number = 7;
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;
  markerList:any;

  titleName: any;
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;
  public skul: boolean = false;

  lat: any;
  lng: any;
  lati: any;
  longi: any;
  public markers: any = [];
  public mylatlngData: any = [];
  public LatlongList: any = [];

  

  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router) { }

  async ngOnInit() {
    this.initMap();
    this.districtWise();

  }
  
  //Initialisation of Map  
  initMap() {
    const lat = 22.790988462301428;
    const lng = 72.02733294142871;
    var options = {
      center: [lat, lng],
      zoom: 7
    };
    globalMap = new L.Map('mapContainer', options);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      token: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      id: 'mapbox.streets',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      minZoom: 4,
      maxZoom: 18,

    }).addTo(globalMap);
  }
  markersList = new L.FeatureGroup();
  loaderAndErr() {
    if (this.markers.length !== 0) {
      document.getElementById('spinner').style.display = 'none';
    } else {
      // setTimeout(() => {
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('errMsg').style.color = 'red';
      document.getElementById('errMsg').style.display = 'block';
      document.getElementById('errMsg').innerHTML = 'No data found';
      // }, 20000);
    }
  }

  //District-Wise
  districtWise() {
    this.myDistrict = '';
    this.districtsNames = [];
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
      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
      this.colors = colors;
      for (var i = 0; i < sorted.length; i++) {
        this.districtsIds.push(sorted[i]['x_axis']);
        this.districtsNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['district_name'] });
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        this.districts.push(
          {
            id: sorted[i]['x_axis'],
            name: sorted[i]['district_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            icon: {
              // url: "../assets/green_Block.png",
              scaledSize: {
                width: 21,
                height: 22,
                fillColor: this.colors[sorted[i]],
                backgroundColor: "red"
              }
            }
          });
        };
      this.markers = this.districts;
      if (this.markers.length !== 0) {
        for (let i = 0; i < this.markers.length; i++) {

         var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            draggable: true,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            icon: L.icon({
              iconUrl: this.markers[i].icon.url,
              // iconSize: [18, 28],
              //iconAnchor: [30 / 2, 35],
            })
          })

          marker.addTo(globalMap).bindPopup("<b>District_name : </b>" + this.markers[i].name + "<br><b>Attendance Percentage: </b>" + this.markers[i].label);
          this.markersList.addLayer(marker);

        }
        globalMap.addLayer(this.markersList);
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
    this.districts = [];
    

  }

 //District-Wise Data end 

 //Block-wise Data

blockWise() {

  this.blockHidden = true;
    this.clusterHidden = true;
  this.lat = 22.790988462301428;
  this.lng = 72.02733294142871;
  this.zoom = 7;
  // this.markers=[];
  globalMap.removeLayer(this.markersList);
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
    var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
      this.colors = colors;
      for (var i = 0; i < sorted.length; i++) {
        this.blocksIds.push(sorted[i]['x_axis']);
        this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        this.blocks.push(
          {
            id: sorted[i]['x_axis'],
            dist: sorted[i]['district_name'],
            name: sorted[i]['block_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            icon: {
              // url: "../assets/green_Block.png",
              scaledSize: {
                width: 21,
                height: 22,
                fillColor: this.colors[sorted[i]],
                backgroundColor: "red"
              }
            }
          });
        };
    this.markers = this.blocks;
    if (this.markers.length !== 0) {
      for (let i = 0; i < this.markers.length; i++) {
       // console.log(this.markers[i].markerList.options.color)
       var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
          radius: 7,
          draggable: true,
          color: this.colors[i],
          fillColor: this.colors[i],
          fillOpacity: 1,

          })
          marker.addTo(globalMap).bindPopup("<b>Attendance:</b>" + this.markers[i].label+"%" + "<br><b>District: </b>" + this.markers[i].dist +"<br><b> Block: </b>" +this.markers[i].name);

        }
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

clusterWise() {
  
  this.blockHidden = true;
    this.clusterHidden = true;
  this.lat = 22.790988462301428;
  this.lng = 72.02733294142871;
  this.zoom = 5;
  // this.markers=[];
  globalMap.removeLayer(this.markersList);
  document.getElementById('errMsg').style.display = 'none';
  document.getElementById('spinner').style.display = 'block';
  document.getElementById('spinner').style.marginTop = '3%';
  this.title = "State";
  this.titleName = "Gujarat"
  this.service.cluster_wise_data().subscribe(res => {
    // localStorage.setItem('schoolWise', JSON.stringify(res));
    this.mylatlngData = res;
    this.dist = false;
    this.blok = false;
    this.clust = true;
    this.skul = false;
    var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
    let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
    this.colors = colors;
    for (var i = 0; i < sorted.length; i++) {
      this.clusterIds.push(sorted[i]['x_axis']);
        this.cluster.push(
          {
            id: sorted[i]['x_axis'],
            dist: sorted[i]['district_name'],
            block: sorted[i]['block_name'],
            name: sorted[i]['cluster_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            icon: {
              // url: "../assets/green_Block.png",
              scaledSize: {
                width: 21,
                height: 22,
                fillColor: this.colors[sorted[i]],
                backgroundColor: "red"
              }
            }
          });
        };
    this.markers = this.cluster;
    if (this.markers.length !== 0) {
      for (let i = 0; i < this.markers.length; i++) {
       // console.log(this.markers[i].markerList.options.color)
       var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
          radius: 3.5,
          draggable: true,
          color: this.colors[i],
          fillColor: this.colors[i],
          fillOpacity: 1,

          })
          marker.addTo(globalMap).bindPopup("<b>Attendance:</b>" + this.markers[i].label+"%" + "<br><b>District: </b>" + this.markers[i].dist +"<br><b> Block: </b>" +this.markers[i].block+"<br><b> Cluster: </b>" +this.markers[i].name);

        }
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
//Block-wise Data end

//Cluster-wise Data
  
//Cluster-wise Data end


//School-wise Data
schoolWise() {
  console.log('school-wise')
  this.blockHidden = true;
    this.clusterHidden = true;
  this.lat = 22.790988462301428;
  this.lng = 72.02733294142871;
  this.zoom = 7;
  globalMap.removeLayer(this.markersList);

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
    var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
      this.colors = colors;
      for (var i = 0; i < sorted.length; i++) {
        this.districtsIds.push(sorted[i]['x_axis']);
        this.schools.push(
          {
            id: sorted[i]['x_axis'],
            dist: sorted[i]['district_name'],
            block: sorted[i]['block_name'],
            cluster: sorted[i]['cluster_name'],
            name: sorted[i]['school_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            icon: {
              // url: "../assets/green_Block.png",
              scaledSize: {
                width: 21,
                height: 22,
                fillColor: this.colors[sorted[i]],
                backgroundColor: "red"
              }
            }
          });
        };
    console.log(this.schools);
    this.markers = this.schools;
    console.log(this.markers);
    if (this.markers.length !== 0) {
      for (let i = 0; i < this.markers.length; i++) {
       // console.log(this.markers[i].markerList.options.color)
       var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
          radius: 3.5,
          draggable: true,
          color: this.colors[i],
          fillColor: this.colors[i],
          fillOpacity: 1,

          })
          marker.addTo(globalMap).bindPopup("<b>Attendance:</b>" + this.markers[i].label+"%" + "<br><b>District: </b>" + this.markers[i].dist +"<br><b> Block: </b>" +this.markers[i].block+"<br><b> Cluster: </b>" +this.markers[i].cluster+"<br><b> School: </b>" +this.markers[i].name);
   }
      document.getElementById('spinner').style.display = 'none';


    }else {
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
 
//School-wise Data end
  


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  myDistData(data) {
    if (this.clust === true) {
      document.getElementById('errMsg').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('spinner').style.marginTop = '3%';

      this.title = "Dist";
      this.titleName = data.name;

      localStorage.setItem('dist', data.name);
      this.service.clusterPerDist(data.id).subscribe(res => {
        this.clusterHidden = true;
        this.blockHidden = false;
        this.dist = false;
        this.blok = false;
        this.clust = true;
        this.skul = false;

        this.mylatlngData = res;
        this.blocksNames = [];
        this.zoom = 15;
        this.lat = Number(this.mylatlngData[5]['y_value']);
        this.lng = Number(this.mylatlngData[5]['z_value']);
        this.studentCount = 0;

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
        this.colors = colors;

        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['blockName'] });
          this.cluster.push(
              {
                id: sorted[i]['x_axis'],
                dist: sorted[i]['district_name'],
                block: sorted[i]['block_name'],
                name: sorted[i]['crc_name'],
                label: sorted[i]['x_value'],
                lat: sorted[i]['y_value'],
                lng: sorted[i]['z_value'],
              });
          };
          
    
          this.markers = this.cluster;
          if (this.markers.length !== 0) {
            for (let i = 0; i < this.markers.length; i++) {
             // console.log(this.markers[i].markerList.options.color)
             var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
                radius: 3.5,
                draggable: true,
                color: this.colors[i],
                fillColor: this.colors[i],
                fillOpacity: 1,
                zoom:15
      
                })
                marker.addTo(globalMap).bindPopup("<b>Attendance:</b>" + this.markers[i].label+"%" + "<br><b>District: </b>" + this.markers[i].dist +"<br><b> Block: </b>" +this.markers[i].block+"<br><b> Cluster: </b>" +this.markers[i].name);
      
              }
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
      

    } else if (this.skul === true) {
      document.getElementById('errMsg').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('spinner').style.marginTop = '3%';

      this.title = "Cluster";
      this.titleName = data.name;
      localStorage.setItem('dist', data.name);
      this.service.schoolPerDist(data.id).subscribe(res => {
        this.dist = false;
        this.blok = false;
        this.clust = false;
        this.skul = true;
        this.blocksNames = [];

        this.mylatlngData = res;
        this.zoom = 25;
        this.schools = [];
        this.studentCount = 0;
        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
        this.colors = colors;

        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.schoolsIds.push(sorted[i]['x_axis']);
          this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
          this.schools.push(
            {
              id: sorted[i]['x_axis'],
              dist: sorted[i]['district_name'],
              block: sorted[i]['block_name'],
              cluster: sorted[i]['cluster_name'],
              name: sorted[i]['school_name'],
              label: sorted[i]['x_value'],
              lat: sorted[i]['y_value'],
              lng: sorted[i]['z_value'],
              icon: {
                // url: "../assets/green_Block.png",
                scaledSize: {
                  width: 21,
                  height: 22,
                  fillColor: this.colors[sorted[i]],
                  backgroundColor: "red"
                }
              }
            });
          };
      console.log(this.schools);
      this.markers = this.schools;
      console.log(this.markers);
      if (this.markers.length !== 0) {
        for (let i = 0; i < this.markers.length; i++) {
         // console.log(this.markers[i].markerList.options.color)
         var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
            radius: 3.5,
            draggable: true,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
  
            })
            marker.addTo(globalMap).bindPopup("<b>Attendance:</b>" + this.markers[i].label+"%" + "<br><b>District: </b>" + this.markers[i].dist +"<br><b> Block: </b>" +this.markers[i].block+"<br><b> Cluster: </b>" +this.markers[i].cluster+"<br><b> School: </b>" +this.markers[i].name);
     }
        document.getElementById('spinner').style.display = 'none';
  
  
      }else {
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
    else {
      document.getElementById('errMsg').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('spinner').style.marginTop = '3%';

      this.studentCount = 0;
      this.title = "District";
      this.titleName = data.name;
      localStorage.setItem('dist', data.name);
      this.service.blockPerDist(data.id).subscribe(res => {
        this.blockHidden = false;
        this.clusterHidden = true;
        this.dist = false;
        this.blok = true;
        this.clust = false;
        this.skul = false;

        this.mylatlngData = res;
        this.blocksNames = [];
        this.zoom = 10;
        
        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
        this.colors = colors;

        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.blocksIds.push(sorted[i]['x_axis']);
          this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
          this.blocks.push(
            {
              id: sorted[i]['x_axis'],
              dist: sorted[i]['district_name'],
              name: sorted[i]['block_name'],
              label: sorted[i]['x_value'],
              lat: sorted[i]['y_value'],
              lng: sorted[i]['z_value'],
              icon: {
                // url: "../assets/green_Block.png",
                scaledSize: {
                  width: 21,
                  height: 22,
                  fillColor: this.colors[sorted[i]],
                  backgroundColor: "red"
                }
              }
            });
          };
      this.markers = this.blocks;
      if (this.markers.length !== 0) {
        for (let i = 0; i < this.markers.length; i++) {
         // console.log(this.markers[i].markerList.options.color)
         var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
            radius: 7,
            draggable: true,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
  
            })
            marker.addTo(globalMap).bindPopup("<b>Attendance:</b>" + this.markers[i].label+"%" + "<br><b>District: </b>" + this.markers[i].dist +"<br><b> Block: </b>" +this.markers[i].name);
  
          }
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
}

  
  myBlockData(data) {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';

    this.studentCount = 0;
    this.title = "Block";
    this.titleName = data.name;
    localStorage.setItem('dist', data.name);
    this.service.clusterPerBlock(data.id).subscribe(res => {
      this.clusterHidden = false;
      this.blockHidden = false;
      this.dist = false;
      this.blok = false;
      this.clust = true;
      this.skul = false;

      this.mylatlngData = res;
      this.clusterNames = [];
      this.zoom = 15;
      
      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
      this.colors = colors;

      for (var i = 0; i < sorted.length; i++) {
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        console.log({ name: sorted[i]['crc_name'] });
        this.clusterNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['crc_name'] });
        this.cluster.push(
          {
            id: sorted[i]['x_axis'],
            name: sorted[i]['crc_name'],
            // name: sorted[i][''],
            dist: sorted[i]['distName'],
            blockId: sorted[i]['blockName'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            icon: {
              // url: "../assets/green_Block.png",
              scaledSize: {
                width: 21,
                height: 22,
                fillColor: this.colors[sorted[i]],
                backgroundColor: "red"
              }
            }
          });
        };
        this.markers = this.cluster;
        if (this.markers.length !== 0) {
          for (let i = 0; i < this.markers.length; i++) {
           // console.log(this.markers[i].markerList.options.color)
           var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
              radius: 3.5,
              draggable: true,
              color: this.colors[i],
              fillColor: this.colors[i],
              fillOpacity: 1,
    
              })
              marker.addTo(globalMap).bindPopup("<b>Attendance:</b>" + this.markers[i].label+"%" + "<br><b>District: </b>" + this.markers[i].dist +"<br><b> Block: </b>" +this.markers[i].block+"<br><b> Cluster: </b>" +this.markers[i].name);
    
            }
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

    myClusterData(data) {
      document.getElementById('errMsg').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('spinner').style.marginTop = '3%';
      var distId = localStorage.getItem('dist');
  
      this.studentCount = 0;
      this.title = "Cluster";
      this.titleName = data.name;
      localStorage.setItem('dist', data.name);
      this.service.schoolsPerCluster(data.id).subscribe(res => {
        this.dist = false;
        this.blok = false;
        this.clust = false;
        this.skul = true;
  
        this.mylatlngData = res;
        this.schools = [];
        
        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
        this.colors = colors;
  
        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.schoolsIds.push(sorted[i]['x_axis']);
          // this.schoolsNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
          this.schools.push(
            {
              id: sorted[i]['x_axis'],
              name: sorted[i]['schoolName'],
              blockId: sorted[i]['blockName'],
              dist: distId,
              clusterId: sorted[i]['crc'],
              label: sorted[i]['x_value'],
              lat: sorted[i]['y_value'],
              lng: sorted[i]['z_value'],
            });
        };
  
        this.markers = this.schools;
        console.log(this.markers);
        if (this.markers.length !== 0) {
          for (let i = 0; i < this.markers.length; i++) {
           // console.log(this.markers[i].markerList.options.color)
           var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
              radius: 3.5,
              draggable: true,
              color: this.colors[i],
              fillColor: this.colors[i],
              fillOpacity: 1,
    
              })
              marker.addTo(globalMap).bindPopup("<b>Attendance:</b>" + this.markers[i].label+"%" + "<br><b>District: </b>" + this.markers[i].dist +"<br><b> Block: </b>" +this.markers[i].block+"<br><b> Cluster: </b>" +this.markers[i].cluster+"<br><b> School: </b>" +this.markers[i].name);
       }
          document.getElementById('spinner').style.display = 'none';
    
    
        }else {
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

  }
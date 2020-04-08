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
  myDistrict: any;
  zoom: number = 7;
  public blockHidden: boolean = true;
  markerList:any;

  titleName: any;
  dist: boolean = false;
  blok: boolean = false;
  clust: boolean = false;
  skul: boolean = false;

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

  //District-Wise
  districtWise() {
    this.myDistrict = '';
    this.blockHidden = true;
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
                // url: "../assets/green_Block.png",
                scaledSize: {
                  width: 21,
                  height: 22,
                  fillColor: this.colors[item],
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

          marker.addTo(globalMap).bindPopup("<b>District_name : </b>" + this.markers[i].id + "<br><b>Attendance Percentage: </b>" + this.markers[i].label);
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
  
  this.myDistrict = '';
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
            markerList:  L.circleMarker([this.lat, this.lng], /*45,*/ {
              color: '#00cc00',
              fillColor: '#00cc00',
              fillOpacity: 1,
             
          })
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

            markerList: L.circleMarker([this.lat, this.lng], /*45,*/ {
              color: '#3333ff',
              fillColor: '#3333ff',
              fillOpacity: 1,
              
          })
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
            markerList: L.circleMarker([this.lat, this.lng], /*45,*/ {
              color: '#FF4500',
              fillColor: '#FF4500',
              fillOpacity: 1,
              
          })

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
             markerList:L.circleMarker([this.lat, this.lng], /*45,*/ {
              color: '#FF0000',
              fillColor: '#FF0000',
              fillOpacity: 1,
             
          })

          });
      }
    });

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
  
  this.myDistrict = '';
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
    this.mylatlngData.forEach(item => {
      this.clusterIds.push(item['x_axis']);
      if (item['x_value'] > 75) {
        this.cluster.push(
          {
            id: item['x_axis'],
            dist: item['district_name'],
            block: item['block_name'],
            name:item['cluster_name'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],
            markerList:  L.circleMarker([this.lat, this.lng], /*45,*/ {
              color: '#00cc00',
              fillColor: '#00cc00',
              fillOpacity: 1,
             
          })
          });
      } else if (item['x_value'] < 75 && item['x_value'] > 60) {
        this.cluster.push(
          {
            id: item['x_axis'],
            dist: item['district_name'],
            block: item['block_name'],
            name:item['cluster_name'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],

            markerList: L.circleMarker([this.lat, this.lng], /*45,*/ {
              color: '#3333ff',
              fillColor: '#3333ff',
              fillOpacity: 1,
              
          })
          });
      } else if (item['x_value'] < 60 && item['x_value'] > 40) {
        this.cluster.push(
          {
            id: item['x_axis'],
            dist: item['district_name'],
            block: item['block_name'],
            name:item['cluster_name'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],
            markerList: L.circleMarker([this.lat, this.lng], /*45,*/ {
              color: '#FF4500',
              fillColor: '#FF4500',
              fillOpacity: 1,
              
          })

          });
      } else if (item['x_value'] < 40) {
        this.cluster.push(
          {
            id: item['x_axis'],
            dist: item['district_name'],
            block: item['block_name'],
            name:item['cluster_name'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],
             markerList:L.circleMarker([this.lat, this.lng], /*45,*/ {
              color: '#FF0000',
              fillColor: '#FF0000',
              fillOpacity: 1,
             
          })

          });
      }
    });

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
  this.myDistrict = '';
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
    this.mylatlngData.forEach(item => {

      this.schoolsIds.push(item['x_axis']);
      if (item['x_value'] > 75) {
        this.schools.push(
          {
            id: item['x_axis'],
            dist: item['district_name'],
            block:item['block_name'],
            cluster:item['cluster_name'],
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
            block:item['block_name'],
            cluster:item['cluster_name'],
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
            block:item['block_name'],
            cluster:item['cluster_name'],
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
            block:item['block_name'],
            cluster:item['cluster_name'],
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

    // function rgb2hsl(color) {
    //   const r = color[0] / 255;
    //   const g = color[1] / 255;
    //   const b = color[2] / 255;

    //   const max = Math.max(r, g, b), min = Math.min(r, g, b);
    //   let h, s, l = (max + min) / 2;

    //   if (max == min) {
    //     h = s = 0; // achromatic
    //   } else {
    //     let d = max - min;
    //     s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
    //     switch (max) {
    //       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    //       case g: h = (b - r) / d + 2; break;
    //       case b: h = (r - g) / d + 4; break;
    //     }
    //     h /= 6;
    //   }

    //   return [h, s, l];
    // }

    // function hue2rgb(p, q, t) {
    //   if (t < 0) t += 1;
    //   if (t > 1) t -= 1;
    //   if (t < 1 / 6) return p + (q - p) * 6 * t;
    //   if (t < 1 / 2) return q;
    //   if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    //   return p;
    // }

    // function hsl2rgb(color) {
    //   let l = color[2];

    //   if (color[1] == 0) {
    //     l = Math.round(l * 255);
    //     return [l, l, l];
    //   } else {
    //     let s = color[1];
    //     let q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
    //     let p = 2 * l - q;
    //     let r = hue2rgb(p, q, color[0] + 1 / 3);
    //     let g = hue2rgb(p, q, color[0]);
    //     let b = hue2rgb(p, q, color[0] - 1 / 3);
    //     return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    //   }
    // }

    // function _interpolateHsl(color1, color2, factor) {
    //   if (arguments.length < 3) { factor = 0.5; }

    //   let hsl1 = rgb2hsl(color1);
    //   let hsl2 = rgb2hsl(color2);
    //   for (let i = 0; i < 3; i++) {
    //     hsl1[i] += factor * (hsl2[i] - hsl1[i]);
    //   }
    //   return hsl2rgb(hsl1);
    // }

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

    // function colorsToGradientHsl(startColor, endColor, steps) {
    //   // returns array of hex values for color, since rgb would be an array of arrays and not strings, easier to handle hex strings
    //   let arrReturnColors = [];
    //   let interimColorRGB;
    //   let interimColorHex;
    //   const totalColors = steps;
    //   const factorStep = 1 / (totalColors - 1);

    //   for (let idx = 0; idx < totalColors; idx++) {
    //     interimColorRGB = _interpolateHsl(startColor, endColor, factorStep * idx);
    //     interimColorHex = rgb2hex(interimColorRGB);
    //     arrReturnColors.push(interimColorHex);
    //   }

    //   return arrReturnColors;
    // }

    return {
      generateGradient
    };
  }

}

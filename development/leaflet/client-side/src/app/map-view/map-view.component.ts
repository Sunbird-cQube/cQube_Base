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
  public blocksNames: any = [];

  public colors: any;
  public studentCount: any;
  public schoolCount: any;
  public dateRange: any = '';
  public id = '';
  public districtsNames: any = [];
  public clusterNames: any = [];
  myDistrict: any;
  zoom: number = 7;
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;

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
  markerList1=new L.FeatureGroup();
  markerList2 = new L.FeatureGroup();
  markerList3 = new L.FeatureGroup();

  //District-Wise
  districtWise() {
    this.districtsNames = [];
    this.blockHidden = true;
    this.clusterHidden = true;
    
<<<<<<< HEAD
    globalMap.removeLayer(this.markerList1);
    globalMap.removeLayer(this.markerList2);
    globalMap.removeLayer(this.markerList3)
=======
>>>>>>> upstream/cQube-release-0.11

    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
    this.title = "State";
    this.titleName = "Gujarat"
    this.service.dist_wise_data().subscribe(res => {
     
      this.lat = 22.790988462301428;
      this.lng = 72.02733294142871;
      this.zoom = 7;
     
      this.mylatlngData = res;
      this.dist = true;
      this.blok = false;
      this.clust = false;
      this.skul = false;
      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
      this.colors = colors;
      this.studentCount = 0;
      this.schoolCount = 0;
      this.dateRange = sorted[0]['data_from_date'] + " to " + sorted[0]['data_upto_date'];
      for (var i = 0; i < sorted.length; i++) {
        this.districtsIds.push(sorted[i]['x_axis']);
        this.districtsNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['district_name'] });
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
        this.districts.push(
          {
            id: sorted[i]['x_axis'],
            name: sorted[i]['district_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            stdCount: sorted[i]['students_count'],
            schCount: sorted[i]['total_schools'],
          
          });
      };
      
<<<<<<< HEAD
      console.log(this.districts);
=======

>>>>>>> upstream/cQube-release-0.11
      this.markers = this.districts;
      console.log(this.markers);


      if (this.markers.length !== 0) {
        for (let i = 0; i < this.markers.length; i++) {

         var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
           radius:5,
            draggable: true,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            strokeWeight: 0.01

           
          })

          marker.addTo(globalMap).bindPopup(
<<<<<<< HEAD
            "<b>Attendance : </b>"+"&nbsp;" + this.markers[i].label + "%"+
            "<br><b>District: </b>"+"&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>"+"&nbsp;"+this.markers[i].schCount +
            "<br><b>Number of students:</b>"+"&nbsp;" +this.markers[i].stdCount);
=======
            "<b>Attendance : </b>" + this.markers[i].label + "%"+
            "<br><b>District: </b>" + this.markers[i].name +
            "<br><b>Number of schools:</b>"+this.markers[i].schCount +
            "<br><b>Number of students:</b>" +this.markers[i].stdCount);
>>>>>>> upstream/cQube-release-0.11
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
    this.studentCount=0;
    this.schoolCount=0;
    this.service.schoolCount().subscribe(res => {
      this.schoolCount = res[0]['total_schools'];
    });

  }
//District-Wise Data end 

 //Block-wise Data

blockWise() {

  this.blockHidden = true;
  this.clusterHidden = true;
  this.markers = [];
  
  

  globalMap.removeLayer(this.markersList);
  globalMap.removeLayer(this.markerList1);
  globalMap.removeLayer(this.markerList2);
<<<<<<< HEAD
  globalMap.removeLayer(this.markerList3);

  
=======
>>>>>>> upstream/cQube-release-0.11
  document.getElementById('errMsg').style.display = 'none';
  document.getElementById('spinner').style.display = 'block';
  document.getElementById('spinner').style.marginTop = '3%';
  this.title = "State";
  this.titleName = "Gujarat"
  this.service.block_wise_data().subscribe(res => {
    this.mylatlngData = res;
    this.lat = 22.790988462301428;
    this.lng = 72.02733294142871;
    this.zoom = 7;
    this.dist = false;
    this.blok = true;
    this.clust = false;
    this.skul = false;
    
    this.blocksNames=[]
    this.studentCount = 0;
    this.schoolCount = 0;

    var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#336600', sorted.length, 'rgb');
      this.colors = colors;
      for (var i = 0; i < sorted.length; i++) {
        this.blocksIds.push(sorted[i]['x_axis']);
        this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
        this.blocks.push(
          {
            id: sorted[i]['x_axis'],
            dist: sorted[i]['district_name'],
            name: sorted[i]['block_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            stdCount: sorted[i]['students_count'],
            schCount: sorted[i]['total_schools'],
            // icon: {
            //   path: google.maps.SymbolPath.CIRCLE,
            //   scale: 5.5,
            //   fillColor: this.colors[i],
            //   fillOpacity: 1,
            //   strokeWeight: 0.01
            // }
          });
      };
<<<<<<< HEAD
     console.log(this.blocks);
=======

>>>>>>> upstream/cQube-release-0.11
    this.markers = this.blocks;
    console.log(this.markers);
    
    if (this.markers.length !== 0) {
      for (let i = 0; i < this.markers.length; i++) {
       // console.log(this.markers[i].markerList.options.color)
       var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
        radius:5,
        draggable: true,
        color: this.colors[i],
        fillColor: this.colors[i],
        fillOpacity: 1,
        strokeWeight: 0.01

          })
          marker.addTo(globalMap).bindPopup(
<<<<<<< HEAD
            "<b>Attendance:</b>"+"&nbsp;" + this.markers[i].label+"%" 
          + "<br><b>District: </b>"+"&nbsp;" +this.markers[i].dist +
          "<br><b> Block: </b>"+"&nbsp;" +this.markers[i].name+
          "<br><b>Number of schools:</b>"+"&nbsp;"+this.markers[i].schCount +
          "<br> <b>Number of students:</b>"+"&nbsp;" +this.markers[i].stdCount);
          this.markerList1.addLayer(marker);       
=======
            "<b>Attendance:</b>" + this.markers[i].label+"%" 
          + "<br><b>District: </b>" +this.markers[i].dist +
          "<br><b> Block: </b>" +this.markers[i].name+
          "<br><b>Number of schools:</b>"+this.markers[i].schCount +
          "<br> <b>Number of Students:</b>" +this.markers[i].stdCount);
                       this.markerList1.addLayer(marker);       
>>>>>>> upstream/cQube-release-0.11

        }
        globalMap.addLayer(this.markerList1);

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


clusterWise() {
  this.blockHidden = true;
  this.clusterHidden = true;

  this.markers = [];
  globalMap.removeLayer(this.markersList);
  globalMap.removeLayer(this.markerList1);
  globalMap.removeLayer(this.markerList2);
  globalMap.removeLayer(this.markerList3);

  document.getElementById('errMsg').style.display = 'none';
  document.getElementById('spinner').style.display = 'block';
  document.getElementById('spinner').style.marginTop = '3%';
  this.title = "State";
  this.titleName = "Gujarat"
  this.service.cluster_wise_data().subscribe(res => {
    this.mylatlngData = res;
    this.lat = 22.790988462301428;
    this.lng = 72.02733294142871;
    this.zoom = 7;
    this.dist = false;
    this.blok = false;
    this.clust = true;
    this.skul = false;
    this.studentCount = 0;
    this.schoolCount = 0;

    var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
    let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
    this.colors = colors;
    for (var i = 0; i < sorted.length; i++) {
      this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
      this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
      this.clusterIds.push(sorted[i]['x_axis']);
      this.cluster.push(
        {
          id: sorted[i]['x_axis'],
          name: sorted[i]['crc_name'],
          dist: sorted[i]['district_name'],
          blockId: sorted[i]['block_name'],
          label: sorted[i]['x_value'],
          lat: sorted[i]['y_value'],
          lng: sorted[i]['z_value'],
          stdCount: sorted[i]['students_count'],
          schCount: sorted[i]['total_schools'],
          // icon: {
          //   path: google.maps.SymbolPath.CIRCLE,
          //   scale: 4.5,
          //   fillColor: this.colors[i],
          //   fillOpacity: 1,
          //   strokeWeight: 0.01
          // }
        });
    };
<<<<<<< HEAD
    console.log(this.markers);
=======
>>>>>>> upstream/cQube-release-0.11
    console.log(this.cluster);

    this.markers = this.cluster;
    console.log(this.markers);
    if (this.markers.length !== 0) {
      for (let i = 0; i < this.markers.length; i++) {
       // console.log(this.markers[i].markerList.options.color)
       var marker= L.circleMarker([this.markers[i].lat, this.markers[i].lng],{
<<<<<<< HEAD
        radius:4.0,
=======
        radius:5,
>>>>>>> upstream/cQube-release-0.11
        draggable: true,
        color: this.colors[i],
        fillColor: this.colors[i],
        fillOpacity: 1,
        strokeWeight: 0.01

          })
          marker.addTo(globalMap).bindPopup(
<<<<<<< HEAD
            "<b>Attendance:</b>"+"&nbsp;" + this.markers[i].label+"%" 
          + "<br><b>District: </b>"+"&nbsp;" +this.markers[i].dist +
          "<br><b>Block:</b>"+"&nbsp;"+this.markers[i].blockId+
          "<br><b>Cluster (CRC) :</b>"+"&nbsp;"+this.markers[i].name +
          "<br><b>Number of schools:</b>"+"&nbsp;"+this.markers[i].schCount +
          "<br> <b>Number of students:</b>"+"&nbsp;" +this.markers[i].stdCount);
=======
            "<b>Attendance:</b>" + this.markers[i].label+"%" 
          + "<br><b>District: </b>" +this.markers[i].dist +
          "<br><b>Block:</b>"+this.markers[i].blockId+
          "<br><b>Cluster(CRC) </b>"+this.markers[i].name +
          "<br><b>Number of schools:</b>"+this.markers[i].schCount +
          "<br> <b>Number of Students:</b>" +this.markers[i].stdCount);
>>>>>>> upstream/cQube-release-0.11
          this.markerList2.addLayer(marker);

        }
        globalMap.addLayer(this.markerList2);
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
  
//Cluster-wise Data end


//School-wise Data
schoolWise() {
  console.log('school-wise')
  this.blockHidden = true;
  this.clusterHidden = true;
  this.markers = [];
  
  globalMap.removeLayer(this.markersList);
  globalMap.removeLayer(this.markerList2);
  globalMap.removeLayer(this.markerList1);

  document.getElementById('errMsg').style.display = 'none';
  document.getElementById('spinner').style.display = 'block';
  document.getElementById('spinner').style.marginTop = '3%';
  this.title = "State";
  this.titleName = "Gujarat"
  this.service.school_wise_data().subscribe(res => {

    this.mylatlngData = res;
    this.lat = 22.790988462301428;
    this.lng = 72.02733294142871;
    this.zoom = 7;

    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.skul = true;
   
    var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
    let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
    this.colors = colors;
    
    for (var i = 0; i < sorted.length; i++) {
      this.districtsIds.push(sorted[i]['x_axis']);
      this.schools.push(
        {
          id: sorted[i]['x_axis'],
          dist: sorted[i]['district_name'],
          name: sorted[i]['school_name'],
          label: sorted[i]['x_value'],
          lat: sorted[i]['y_value'],
          lng: sorted[i]['z_value'],
          stdCount: sorted[i]['students_count'],
          schCount: sorted[i]['total_schools'],
         

          // icon: {
          //   path: google.maps.SymbolPath.CIRCLE,
          //   scale: 3.5,
          //   fillColor: this.colors[i],
          //   fillOpacity: 1,
          //   strokeWeight: 0.01
          // }
        });
    };

    
    console.log(this.schools);
    this.markers = this.schools;
    if (this.markers.length !== 0) {
      for (let i = 0; i < this.markers.length; i++) {

        var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
<<<<<<< HEAD
          radius:2.0,
=======
          radius:5,
>>>>>>> upstream/cQube-release-0.11
          draggable: true,
          color: this.colors[i],
          fillColor: this.colors[i],
          fillOpacity: 1,
          strokeWeight: 0.01
          
         })

         marker.addTo(globalMap).bindPopup(
<<<<<<< HEAD
           "<b>Attendance : </b>"+"&nbsp;" + this.markers[i].label + 
           "<br><b>District: </b>"+"&nbsp;" + this.markers[i].dist+
           "<br><b>Block:</b>"+"&nbsp;"+''+
           "<br><b>Cluster (CRC):</b>"+"&nbsp;"+''+
            "<br><b>School:</b>"+"&nbsp;" +this.markers[i].name +
           "<br><b>Number of students :</b>"+"&nbsp;" +this.markers[i].stdCount);
=======
           "<b>Attendance : </b>" + this.markers[i].label + 
           "<br><b>District: </b>" + this.markers[i].dist+
           "<br><b>Block:</b>"+''+
           "<br><b>Cluster (CRC):</b>"+''+
            "<br><b>School:</b>" +this.markers[i].name +
           "<br><b>Number of students :</b>" +this.markers[i].stdCount);
>>>>>>> upstream/cQube-release-0.11
        this.markerList3.addLayer(marker)
       }
       globalMap.addLayer(this.markerList3)
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
 
//School-wise Data end
  
// myDistrictData




//myDistrictDataEnd

//myBlockData

//myBlockDataEnd

//myClusterData


//myClusterDataEnd


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
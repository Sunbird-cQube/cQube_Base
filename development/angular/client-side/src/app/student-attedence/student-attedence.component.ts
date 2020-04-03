import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  public colors: any;

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

  loaderAndErr() {
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
      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
      this.colors = colors;
      sorted.forEach((item, index) => {
        this.districtsIds.push(item['x_axis']);
        this.districtsNames.push({ id: item['x_axis'], name: item['district_name'] });
        this.districts.push(
          {
            id: item['x_axis'],
            name: item['district_name'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8.5,
              fillColor: this.colors[index],
              fillOpacity: 1,
              strokeWeight: 0.01
            }
          });
      });
      this.markers = this.districts;
      this.loaderAndErr();
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'none';
    this.districts = [];
  }

  schoolWise() {
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
    this.service.school_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.dist = false;
      this.blok = false;
      this.clust = false;
      this.skul = true;

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
      this.colors = colors;
      sorted.forEach((item, index) => {
        this.districtsIds.push(item['x_axis']);
        this.schools.push(
          {
            id: item['x_axis'],
            dist: item['district_name'],
            name: item['school_name'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 3.5,
              fillColor: this.colors[index],
              fillOpacity: 1,
              strokeWeight: 0.01
            }
          });
      });

      this.markers = this.schools;
      this.loaderAndErr();
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

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
      this.colors = colors;
      sorted.forEach((item, index) => {
        this.clusterIds.push(item['x_axis']);
        this.cluster.push(
          {
            id: item['x_axis'],
            name: item['crc_name'],
            dist: item['district_name'],
            blockId: item['block_name'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 4.5,
              fillColor: this.colors[index],
              fillOpacity: 1,
              strokeWeight: 0.01
            }
          });
      });
      console.log(this.cluster);

      this.markers = this.cluster;
      this.loaderAndErr();
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
      this.blocksNames = [];

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
      this.colors = colors;
      sorted.forEach((item, index) => {
        this.blocksIds.push(item['x_axis']);
        this.blocksNames.push({ id: item['x_axis'], name: item['block_name'] });

        this.blocks.push(
          {
            id: item['x_axis'],
            dist: item['district_name'],
            name: item['block_name'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 5.5,
              fillColor: this.colors[index],
              fillOpacity: 1,
              strokeWeight: 0.01
            }
          });
      });

      this.markers = this.blocks;
      this.loaderAndErr();
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'Block';
    this.blocks = [];
  }

  clickedMarker(label) {

    if (this.districtsIds.includes(label[2])) {
      this.myDistrict = '';
      this.blockHidden = true;
      this.clusterHidden = true;
      this.zoom = 9;
      this.lat = Number(label[3]);
      this.lng = Number(label[4]);

      this.markers = [];
      this.blocks = [];
      document.getElementById('errMsg').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('spinner').style.marginTop = '3%';

      this.title = "District";
      this.titleName = label[1];
      localStorage.setItem('dist', label[1]);
      this.service.blockPerDist(label[2]).subscribe(res => {
        this.dist = false;
        this.blok = true;
        this.clust = false;
        this.skul = false;

        this.mylatlngData = res;
        this.blocksNames = [];
        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
        this.colors = colors;
        sorted.forEach((item, index) => {
          this.blocksIds.push(item['x_axis']);
          this.blocksNames.push({ id: item['x_axis'], name: item['block_name'] });

          this.blocks.push(
            {
              id: item['x_axis'],
              name: item['block_name'],
              dist: item['distName'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5.5,
                fillColor: this.colors[index],
                fillOpacity: 1,
                strokeWeight: 0.01
              }
            });
        });

        this.markers = this.blocks;
        this.loaderAndErr();
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
      // element1[1].style.display = 'block';
      // this.markers = [];
      this.blocks = [];

    }


    if (this.blocksIds.includes(label[2])) {
      this.myDistrict = '';
      this.blockHidden = true;
      this.clusterHidden = true;
      this.zoom = 11;
      this.lat = Number(label[3]);
      this.lng = Number(label[4]);

      this.markers = [];
      this.cluster = [];
      document.getElementById('errMsg').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('spinner').style.marginTop = '3%';

      this.title = "Block";
      this.titleName = label[1];
      this.service.clusterPerBlock(label[2]).subscribe(res => {
        var distId = localStorage.getItem('dist');
        localStorage.setItem('block', label[2]);
        this.dist = false;
        this.blok = false;
        this.clust = true;
        this.skul = false;
        this.blockHidden = false;
        this.mylatlngData = res;
        this.clusterIds = [];
        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
        this.colors = colors;
        sorted.forEach((item, index) => {
          this.clusterIds.push(item['x_axis']);
          this.clusterNames.push({ id: item['x_axis'], name: item['crc_name'] });

          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['crc_name'],
              // name: item[''],
              dist: distId,
              blockId: item['blockName'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 4.5,
                fillColor: this.colors[index],
                fillOpacity: 1,
                strokeWeight: 0.01
              }
            });
        });
        this.markers = this.cluster;
        this.loaderAndErr();
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
      // element1[1].style.display = 'block';
      // this.markers = [];
      this.cluster = [];
    }

    if (this.clusterIds.includes(label[2])) {
      this.myDistrict = '';
      this.blockHidden = true;
      this.clusterHidden = true;
      this.zoom = 13;
      this.lat = Number(label[3]);
      this.lng = Number(label[4]);

      this.markers = [];
      this.schools = [];
      document.getElementById('errMsg').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('spinner').style.marginTop = '3%';

      this.title = "Cluster";
      this.titleName = label[1] + "(crc)";
      this.service.schoolsPerCluster(label[2]).subscribe(res => {
        var distId = localStorage.getItem('dist');
        this.dist = false;
        this.blok = false;
        this.clust = false;
        this.skul = true;
        this.mylatlngData = res;

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
        this.colors = colors;

        sorted.forEach((item, index) => {
          this.schools.push(
            {
              id: item['x_axis'],
              name: item['schoolName'],
              blockId: item['blockName'],
              dist: distId,
              clusterId: item['crc'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3.5,
                fillColor: this.colors[index],
                fillOpacity: 1,
                strokeWeight: 0.01
              }
            });
        });

        this.markers = this.schools;
        this.loaderAndErr();
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
      // element1[1].style.display = 'block';
      // this.markers = [];
      this.schools = [];
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


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  myDistData(data) {
    console.log(data.name);
    if (this.clust === true) {
      document.getElementById('errMsg').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('spinner').style.marginTop = '3%';

      this.title = "Dist"; var block = localStorage.getItem('block');

      this.titleName = data.name;
      localStorage.setItem('dist', data);
      this.service.clusterPerDist(data.id).subscribe(res => {
        // this.clusterHidden = false;
        this.blockHidden = false;
        this.dist = false;
        this.blok = false;
        this.clust = true;
        this.skul = false;

        this.mylatlngData = res;
        this.blocksNames = [];
        this.zoom = 9;
        this.lat = Number(this.mylatlngData[5]['y_value']);
        this.lng = Number(this.mylatlngData[5]['z_value']);

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
        this.colors = colors;

        sorted.forEach((item, index) => {
          console.log(item['block_name']);
          this.blocksNames.push({ id: item['x_axis'], name: item['block_name'] });
          this.cluster.push(
            {
              id: item['x_axis'],
              name: item['crc_name'],
              // name: item[''],
              dist: item['distName'],
              blockId: item['blockName'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 4.5,
                fillColor: this.colors[index],
                fillOpacity: 1,
                strokeWeight: 0.01
              }
            });

        });
        console.log(this.blocksNames);
        this.markers = this.cluster;
        this.loaderAndErr();
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
      // element1[1].style.display = 'block';
      this.districts = [];
      this.cluster = [];
      console.log("myData clicked", data);
    } else {
      document.getElementById('errMsg').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('spinner').style.marginTop = '3%';

      this.title = "District";
      this.titleName = data.name;
      localStorage.setItem('dist', data);
      this.service.blockPerDist(data.id).subscribe(res => {
        this.blockHidden = false;
        this.clusterHidden = true;
        this.dist = false;
        this.blok = true;
        this.clust = false;
        this.skul = false;

        this.mylatlngData = res;
        this.blocksNames = [];

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
        this.colors = colors;

        sorted.forEach((item, index) => {
          this.blocksIds.push(item['x_axis']);
          this.blocksNames.push({ id: item['x_axis'], name: item['block_name'] });
          this.blocks.push(
            {
              id: item['x_axis'],
              name: item['block_name'],
              dist: item['distName'],
              label: item['x_value'],
              lat: item['y_value'],
              lng: item['z_value'],
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5.5,
                fillColor: this.colors[index],
                fillOpacity: 1,
                strokeWeight: 0.01
              }
            });

        });

        this.markers = this.blocks;
        this.loaderAndErr();
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
      // element1[1].style.display = 'block';
      // this.markers = [];
      this.blocks = [];
      console.log("myData clicked", data);
    }
  }

  myBlockData(data) {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';

    this.title = "Block";
    this.titleName = data.name;
    localStorage.setItem('dist', data);
    this.service.clusterPerBlock(data.id).subscribe(res => {
      this.clusterHidden = false;
      this.blockHidden = false;
      this.dist = false;
      this.blok = false;
      this.clust = true;
      this.skul = false;

      this.mylatlngData = res;
      this.clusterNames = [];

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
      this.colors = colors;

      sorted.forEach((item, index) => {
        console.log({ name: item['crc_name'] });
        this.clusterNames.push({ id: item['x_axis'], name: item['crc_name'] });
        this.cluster.push(
          {
            id: item['x_axis'],
            name: item['crc_name'],
            // name: item[''],
            dist: item['distName'],
            blockId: item['blockName'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 4.5,
              fillColor: this.colors[index],
              fillOpacity: 1,
              strokeWeight: 0.01
            }
          });

      });
      console.log(this.clusterNames)
      this.markers = this.cluster;
      this.loaderAndErr();
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'block';
    // element1[1].style.display = 'block';
    // this.markers = [];
    this.cluster = [];
    console.log("myData clicked", data);
  }

  myClusterData(data) {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';

    this.title = "Cluster";
    this.titleName = data.name;
    localStorage.setItem('dist', data);
    this.service.schoolsPerCluster(data.id).subscribe(res => {
      this.dist = false;
      this.blok = false;
      this.clust = false;
      this.skul = true;

      this.mylatlngData = res;
      this.schools = [];

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#517e01', sorted.length, 'rgb');
      this.colors = colors;

      sorted.forEach((item, index) => {
        this.schoolsIds.push(item['x_axis']);
        this.schoolsNames.push({ id: item['x_axis'], name: item['block_name'] });
        this.schools.push(
          {
            id: item['x_axis'],
            name: item['schoolName'],
            blockId: item['blockName'],
            dist: item['distName'],
            clusterId: item['crc'],
            label: item['x_value'],
            lat: item['y_value'],
            lng: item['z_value'],
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 3.5,
              fillColor: this.colors[index],
              fillOpacity: 1,
              strokeWeight: 0.01
            }
          });
      });

      this.markers = this.schools;
      this.loaderAndErr();
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'block';
    // element1[1].style.display = 'block';
    // this.markers = [];
    this.schools = [];
    console.log("myData clicked", data);
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

interface marker {
  lat: any;
  lng: any;
  label?: string;
  url?: string;
  id?: number
}
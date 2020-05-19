import { Component, OnInit } from '@angular/core';
declare let L;
var globalMap;

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  zoom: number = 8;

  labelOptions: any = {};

  // initial center position for the map
  lat: any;
  lng: any;

  public markers: any = [];

  initMap() {
    const lat = 22.3660414123535;
    const lng = 71.48396301269531;
    globalMap = L.map('mapContainer').setView([lat, lng], 7);
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
  constructor() {
    // this.getPosition().then(res => {
    //   this.lat = res.lat;
    //   this.lng = res.lng;
    // })
  }

  ngOnInit() {
    this.initMap()
  }

}

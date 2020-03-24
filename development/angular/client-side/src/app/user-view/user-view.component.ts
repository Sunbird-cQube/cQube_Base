import { Component, OnInit } from '@angular/core';

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

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });
  }
  constructor() {
    // this.getPosition().then(res => {
    //   this.lat = res.lat;
    //   this.lng = res.lng;
    // })
  }

  ngOnInit() {
    this.lat = 22.790988462301428;
    this.lng = 72.02733294142871;
    this.zoom = 7;
  }

}

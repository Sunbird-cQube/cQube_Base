import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppServiceComponent } from '../app.service';
import { KeycloakSecurityService } from '../keycloak-security.service';

@Injectable({
  providedIn: 'root'
})
export class HealthCardService {
  public baseUrl;
  public telemetryData = [];

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  metaData(level) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/healthCard/metaData`, { level });
  }

  stateData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/healthCard/stateData`, {});
  }

  districtWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/healthCard/distWise`, data);
  }

  blockWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/healthCard/blockWise`, data);
  }

  clusterWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/healthCard/clusterWise`, data);
  }

  schoolWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/healthCard/schoolWise`, data);
  }

  public colors = {
    2: 'red',
    6: '#fc0500',
    10: '#f71000',
    14: '#f21a00',
    18: '#ed2400',
    22: '#e72f00',
    26: '#e23900',
    30: '#dd4400',
    34: '#d84e00',
    38: '#d35800',
    42: '#cd6300',
    46: '#c86d00',
    50: '#c37800',
    54: '#be8200',
    58: '#b88d00',
    62: '#b39700',
    66: '#aea100',
    70: '#a9ac00',
    74: '#a4b600',
    78: '#9ec100',
    82: '#99cb00',
    86: '#94d500',
    90: '#8fe000',
    94: '#89ea00',
    98: '#84f500',
    100: '#7fff00',
  }

  public colors1 = {
    100: 'red',
    95: '#fc0500',
    90: '#ed2400',
    85: '#d84e00',
    80: '#d35800',
    75: '#cd6300',
    70: '#c86d00',
    65: '#c37800',
    60: '#be8200',
    55: '#b88d00',
    50: '#b39700',
    45: '#aea100',
    40: '#a9ac00',
    35: '#a4b600',
    30: '#9ec100',
    25: '#99cb00',
    20: '#94d500',
    15: '#8fe000',
    10: '#89ea00',
    5: '#84f500',
    0: '#7fff00',
  }

  colorGredient(data) {
    var keys = Object.keys(this.colors);
    var setColor = '';

    for (let i = 0; i < keys.length; i++) {
      if (data <= parseInt(keys[i])) {
        setColor = this.colors[keys[i]];
        break;
      } else if (data > parseInt(keys[i]) && data <= parseInt(keys[i + 1])) {
        setColor = this.colors[keys[i + 1]];
        break;
      }
    }
    return setColor;
  }

  colorGredient1(data) {
    var keys = Object.keys(this.colors1);
    var setColor = '';

    for (let i = 0; i < keys.length; i++) {
      if (parseInt(data) <= parseInt(keys[i])) {
        setColor = this.colors1[keys[i]];
        break;
      } else if (parseInt(data) > parseInt(keys[i]) && parseInt(data) <= parseInt(keys[i + 1])) {
        setColor = this.colors1[keys[i + 1]];
        break;
      }
    }
    return setColor;
  }
}

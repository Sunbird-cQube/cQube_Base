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

  metaData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/healthCard/metaData`, {});
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
}

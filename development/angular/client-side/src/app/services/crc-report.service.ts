import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class CrcReportService {
  public map;
  public baseUrl;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  // crc new apis
  crcDistWiseData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/districtWise`, {});
  }
  crcBlockWiseData(distId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/blockWise/${distId}`, {});
  }
  crcClusterWiseData(distId, blockId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/clusterWise/${distId}/${blockId}`, {});
  }

  crcSchoolWiseData(distId, blockId, clusterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/schoolWise/${distId}/${blockId}/${clusterId}`, {});
  }

  crcAllBlockWiseData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/allBlockWise`, {});
  }

  crcAllClusterWiseData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/allClusterWise`, {});
  }

  crcAllSchoolWiseData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/allSchoolWise`, {});
  }

}

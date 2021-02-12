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
  crcDistWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/districtWise`, data);
  }
  crcBlockWiseData(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/blockWise/${distId}`, data);
  }
  crcClusterWiseData(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/clusterWise/${distId}/${blockId}`, data);
  }

  crcSchoolWiseData(distId, blockId, clusterId,data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/schoolWise/${distId}/${blockId}/${clusterId}`, data);
  }

  crcAllBlockWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/allBlockWise`, data);
  }

  crcAllClusterWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/allClusterWise`, data);
  }

  crcAllSchoolWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/allSchoolWise`, data);
  }

}

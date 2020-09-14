import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class CrcReportService {
  public map;
  public baseUrl = environment.apiEndpoint;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) { }
  
  // crc new apis
  crcDistWiseData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/districtWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  crcBlockWiseData(distId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/blockWise/${distId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  crcClusterWiseData(distId, blockId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/clusterWise/${distId}/${blockId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  crcSchoolWiseData(distId, blockId, clusterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  crcAllBlockWiseData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/allBlockWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  crcAllClusterWiseData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/allClusterWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  crcAllSchoolWiseData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/crc/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

}

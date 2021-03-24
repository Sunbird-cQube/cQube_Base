import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceReportService {
  public baseUrl;
  public telemetryData = [];

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  //Attendance report
  dist_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/distWise`, data);
  }

  block_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/blockWise`, data);
  }

  cluster_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/clusterWise`, data);
  }

  school_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/schoolWise`, data);
  }


  blockPerDist(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/blockPerDist`, data);
  }

  clusterPerBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/clusterPerBlock`, data);
  }

  schoolsPerCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/schoolPerCluster`, data);
  }

  getDateRange() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/attendance/getDateRange`);
  }

  getRawMeta(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/rawMeta`, data);
  }

  // download raw data
  downloadFile(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/getDownloadUrl`, data);
  }

  //capturing telemetry.....
  telemetrySar(date) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/telemetry/sar`, { telemetryData: this.telemetryData, date: date });
  }


  //attendance line-chart
  getStateData(data){
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/line-chart/stateWise`, data);
  }
  
  getDistrictData(data){
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/line-chart/distWise`, data);
  }
  getYears(){
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/line-chart/getDateRange`);
  }
}

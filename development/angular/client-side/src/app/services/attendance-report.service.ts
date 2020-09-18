import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceReportService {
  public baseUrl = environment.apiEndpoint;
  public telemetryData = [];

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) { }
  //Attendance report
  dist_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/distWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  block_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/blockWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  cluster_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/clusterWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  school_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/schoolWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }


  blockPerDist(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/blockPerDist`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  clusterPerBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/clusterPerBlock`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  schoolsPerCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/schoolPerCluster`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  getDateRange() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/attendance/getDateRange`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  //capturing telemetry.....
  telemetry(date) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/telemetry`, { telemetryData: this.telemetryData, date: date }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
}

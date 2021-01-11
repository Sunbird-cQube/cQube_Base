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
    return this.http.post(`${this.baseUrl}/attendance/blockPerDist`, { data: data, baseUrl: this.baseUrl });
  }

  clusterPerBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/clusterPerBlock`, { data: data, baseUrl: this.baseUrl });
  }

  schoolsPerCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/attendance/schoolPerCluster`, { data: data, baseUrl: this.baseUrl });
  }

  getDateRange() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/attendance/getDateRange`);
  }
  //capturing telemetry.....
  telemetrySar(date) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/telemetry/sar`, { telemetryData: this.telemetryData, date: date });
  }
}

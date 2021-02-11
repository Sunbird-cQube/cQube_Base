import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { AppServiceComponent } from '../app.service';
@Injectable({
  providedIn: 'root'
})
export class TeacherAttendanceReportService {
  public baseUrl;
  public telemetryData = [];

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }
  //Attendance report
  dist_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/teacher_attendance/distWise`, data);
  }

  block_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/teacher_attendance/blockWise`, data);
  }

  cluster_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/teacher_attendance/clusterWise`, data);
  }

  school_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/teacher_attendance/schoolWise`, data);
  }


  blockPerDist(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/teacher_attendance/blockPerDist`, data);
  }

  clusterPerBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/teacher_attendance/clusterPerBlock`, data);
  }

  schoolsPerCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/teacher_attendance/schoolPerCluster`, data);
  }

  getDateRange() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/teacher_attendance/getDateRange`);
  }
  //capturing telemetry.....
  telemetrySar(date) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/telemetry/sar`, { telemetryData: this.telemetryData, date: date });
  }
}

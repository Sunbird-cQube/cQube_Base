import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  public baseUrl = environment.apiEndpoint;
  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, private service: AppService) { }

  //summary statistics
  getAttendanceSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/stdAttendance`, {});
  }
  getSemSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/sem`, {});
  }

  getCrcSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/crc`, {});
  }

  getInfraSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/infra`, {});
  }
  getInspecSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/inspec`, {});
  }

  getstDistSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/stDist`, {});
  }

  getstBlockSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/stBlock`, {});
  }
  getstClusterSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/stCluster`, {});
  }
  getstSchoolSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/stSchool`, {});
  }

  getDikshaSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/summaryDiksha`, {});
  }

  getUdiseSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/summaryUDISE`, {});
  }

  getPATSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/summaryPAT`, {});
  }
  getDiskhaTPDummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/summaryDikshaTPD`, {});
  }
  
}

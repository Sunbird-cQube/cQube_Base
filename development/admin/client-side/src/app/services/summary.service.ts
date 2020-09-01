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
    return this.http.post(`${this.baseUrl}/summary/stdAttendance`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }
  getSemSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/sem`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  getCrcSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/crc`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  getInfraSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/infra`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }
  getInspecSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/inspec`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  getstDistSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/stDist`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  getstBlockSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/stBlock`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }
  getstClusterSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/stCluster`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }
  getstSchoolSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/stSchool`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  getDikshaSummary() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/summary/summaryDiksha`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }
}

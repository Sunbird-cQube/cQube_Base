import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';


@Injectable({
  providedIn: 'root'
})
export class ExceptionReportService {
  public map;
  public baseUrl = environment.apiEndpoint;
  public token;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) { }

  //Semester Completion
  semCompletionDist() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/semCompDist/allDistrictWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  semCompletionBlock() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/semCompBlock/allBlockWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionCluster() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/semCompCluster/allClusterWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionSchool() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompSchool/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionBlockPerDist(distId) {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/semCompBlock/blockWise/${distId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionClusterPerBlock(distId, blockId) {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/semCompCluster/clusterWise/${distId}/${blockId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionSchoolPerClustter(distId, blockId, clusterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompSchool/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  //missing school data api
  school_invalid() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/school_invalid/school_invalid_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

}

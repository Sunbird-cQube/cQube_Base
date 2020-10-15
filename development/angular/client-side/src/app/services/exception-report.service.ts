import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';


@Injectable({
  providedIn: 'root'
})
export class ExceptionReportService {
  public map;
  public baseUrl;
  public token;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  //Semester Completion
  semCompletionDist(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompDist/allDistrictWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  semCompletionBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompBlock/allBlockWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompCluster/allClusterWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionSchool(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompSchool/allSchoolWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionBlockPerDist(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompBlock/blockWise/${distId}`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionClusterPerBlock(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompCluster/clusterWise/${distId}/${blockId}`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
  semCompletionSchoolPerClustter(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompSchool/schoolWise/${distId}/${blockId}/${clusterId}`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  //missing school data api
  school_invalid() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/school_invalid/school_invalid_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

}

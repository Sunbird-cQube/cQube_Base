import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class PatReportService {
  public map;
  public baseUrl;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  gradeMetaData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/grades`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATDistWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/distWise`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATBlockWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/allBlockWise`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATBlocksPerDistData(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/blockWise/${distId}`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATClusterWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/allClusterWise`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATClustersPerBlockData(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/clusterWise/${distId}/${blockId}`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATSchoolWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/allSchoolWise`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATSchoolssPerClusterData(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/schoolWise/${distId}/${blockId}/${clusterId}`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class PatReportService {
  public map;
  public baseUrl = environment.apiEndpoint;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) { }

  gradeMetaData() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/pat/grades`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATDistWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/distWise`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATBlockWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/allBlockWise`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATBlocksPerDistData(distId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/blockWise/${distId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATClusterWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/allClusterWise`, { data }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATClustersPerBlockData(distId, blockId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/clusterWise/${distId}/${blockId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATSchoolWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/allSchoolWise`, {data}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  PATSchoolssPerClusterData(distId, blockId, clusterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
}

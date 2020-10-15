import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class CompositReportService {
  public baseUrl;
  public telemetryData = [];

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  //Composit report
  dist_wise_data() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/distWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  block_wise_data() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/blockWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  block_per_dist_data(distId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/blockWise/${distId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  cluster_wise_data() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/clusterWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  cluster_per_block_data(distId, blockId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/clusterWise/${distId}/${blockId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  school_wise_data() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/schoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }

  school_per_cluster_data(distId, blockId, clusterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
  }
}

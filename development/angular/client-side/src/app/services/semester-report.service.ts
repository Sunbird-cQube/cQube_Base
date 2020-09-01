import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class SemesterReportService {
  public map;
  public baseUrl = environment.apiEndpoint;
  public token;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) { }

  // sem wise services
  all_dist_sem_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/districtWise`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  all_block_sem_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/allBlockWise`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  block_wise_sem_data(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/blockWise/${distId}`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  all_cluster_sem_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/allClusterWise`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  cluster_wise_sem_data(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/clusterWise/${distId}/${blockId}`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  all_school_sem_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/allSchoolWise`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  school_wise_sem_data(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/schoolWise/${distId}/${blockId}/${clusterId}`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }
  
}

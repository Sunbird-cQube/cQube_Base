import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class SemesterReportService {
  public map;
  public baseUrl;
  public token;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  // sem wise services
  all_dist_sem_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/districtWise`, data);
  }

  all_block_sem_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/allBlockWise`, data);
  }

  block_wise_sem_data(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/blockWise/${distId}`, data);
  }

  all_cluster_sem_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/allClusterWise`, data);
  }

  cluster_wise_sem_data(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/clusterWise/${distId}/${blockId}`, data);
  }

  all_school_sem_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/allSchoolWise`, data);
  }

  school_wise_sem_data(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/schoolWise/${distId}/${blockId}/${clusterId}`, data);
  }

  semMetaData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/metadata`, {});
  }

}

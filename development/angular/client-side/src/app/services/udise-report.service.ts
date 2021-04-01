import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class UdiseReportService {
  public baseUrl;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  //UDISE-report
  udise_dist_wise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/distWise`, data);
  }

  udise_block_wise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/allBlockWise`, data);
  }

  udise_blocks_per_dist(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/blockWise/${distId}`, data);
  }

  udise_cluster_wise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/allClusterWise`, data);
  }

  udise_cluster_per_block(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/clusterWise/${distId}/${blockId}`, data);
  }

  udise_school_wise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/allSchoolWise`, data);
  }

  udise_school_per_cluster(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/schoolWise/${distId}/${blockId}/${clusterId}`, data);
  }
}

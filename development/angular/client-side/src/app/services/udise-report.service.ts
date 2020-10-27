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
  udise_dist_wise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/distWise`, {});
  }

  udise_block_wise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/allBlockWise`, {});
  }

  udise_blocks_per_dist(distId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/blockWise/${distId}`, {});
  }

  udise_cluster_wise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/allClusterWise`, {});
  }

  udise_cluster_per_block(distId, blockId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/clusterWise/${distId}/${blockId}`, {});
  }

  udise_school_wise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/allSchoolWise`, {});
  }

  udise_school_per_cluster(distId, blockId, clusterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/udise/schoolWise/${distId}/${blockId}/${clusterId}`, {});
  }
}

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
    return this.http.post(`${this.baseUrl}/composit/distWise`, {});
  }

  block_wise_data() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/blockWise`, {});
  }

  block_per_dist_data(distId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/blockWise/${distId}`, {});
  }

  cluster_wise_data() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/clusterWise`, {});
  }

  cluster_per_block_data(distId, blockId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/clusterWise/${distId}/${blockId}`, {});
  }

  school_wise_data() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/schoolWise`, {});
  }

  school_per_cluster_data(distId, blockId, clusterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/composit/schoolWise/${distId}/${blockId}/${clusterId}`, {});
  }
}

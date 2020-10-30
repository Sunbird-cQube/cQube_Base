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
    return this.http.post(`${this.baseUrl}/pat/grades`, { data });
  }

  PATDistWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/distWise`, { data });
  }

  PATBlockWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/allBlockWise`, { data });
  }

  PATBlocksPerDistData(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/blockWise/${distId}`, { data });
  }

  PATClusterWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/allClusterWise`, { data });
  }

  PATClustersPerBlockData(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/clusterWise/${distId}/${blockId}`, { data });
  }

  PATSchoolWiseData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/allSchoolWise`, { data });
  }

  PATSchoolssPerClusterData(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/schoolWise/${distId}/${blockId}/${clusterId}`, { data });
  }


  PATHeatMapAllData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/heatChart/distWise`, data);
  }

  PATHeatMapDistData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/heatChart/blockWise`, data);
  }

  PATHeatMapMetaData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/heatChart/metaData`, {});
  }

  PATHeatMapBlockData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/heatChart/clusterWise`, data);
  }
  PATHeatMapClusterData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/heatChart/schoolWise`, data);
  }

  patLOTableDistData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/lotable/distWise`, data);
  }
  patLOTableBlockData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/lotable/blockWise`, data);
  }

  patLOTableClusterData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/lotable/clusterWise`, data);
  }
  patLOTableSchoolData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/pat/lotable/schoolWise`, data);
  }
}


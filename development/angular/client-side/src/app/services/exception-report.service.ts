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
    return this.http.post(`${this.baseUrl}/semCompDist/allDistrictWise`, data);
  }

  semCompletionBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompBlock/allBlockWise`, data);
  }
  semCompletionCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompCluster/allClusterWise`, data);
  }
  semCompletionSchool(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompSchool/allSchoolWise`, data);
  }
  semCompletionBlockPerDist(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompBlock/blockWise/${distId}`, data);
  }
  semCompletionClusterPerBlock(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompCluster/clusterWise/${distId}/${blockId}`, data);
  }
  semCompletionSchoolPerClustter(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompSchool/schoolWise/${distId}/${blockId}/${clusterId}`, data);
  }

  //missing school data api
  school_invalid() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/school_invalid/school_invalid_data`);
  }


  semExceptionMetaData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/metadata`, {});
  }

}

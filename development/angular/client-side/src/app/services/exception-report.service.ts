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
  school_invalid(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/school_invalid/school_invalid_data`, data);
  }


  semExceptionMetaData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/getSemesters`, data);
  }

  patExceptionDistWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/allDistrictWise`, data);
  }

  patExceptionBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/allBlockWise`, data);
  }
  patExceptionCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/allClusterWise`, data);
  }
  patExceptionSchool(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/allSchoolWise`, data);
  }

  patExceptionBlockPerDist(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/blockWise/${distId}`, data);
  }
  patExceptionClusterPerBlock(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/clusterWise/${distId}/${blockId}`, data);
  }
  patExceptionSchoolPerClustter(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/schoolWise/${distId}/${blockId}/${clusterId}`, data);
  }

  //sarException report
  dist_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/distWise`, data);
  }

  block_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/blockWise`, data);
  }

  cluster_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/clusterWise`, data);
  }

  school_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/schoolWise`, data);
  }


  blockPerDist(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/blockPerDist`, data);
  }

  clusterPerBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/clusterPerBlock`, data);
  }

  schoolsPerCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/schoolPerCluster`, data);
  }

  getDateRange(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/getDateRange`, data);
  }

  gradeMetaData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/grades`, data);
  }


}

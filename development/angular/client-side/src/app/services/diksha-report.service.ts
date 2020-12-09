import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class DikshaReportService {
  public map;
  public baseUrl;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  // diksha apis for stack bar chart
  dikshaAllData(type, timePeriod) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/diksha/dikshaAllData`, { login_type: type, timePeriod: timePeriod });
  }

  dikshaDistData(districtId, type, timePeriod) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/diksha/dikshaData`, { districtId: districtId, login_type: type, timePeriod: timePeriod });
  }

  dikshaDataDownload(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/diksha/dikshaDataDownload`, data);
  }

  // diksha apis for table
  dikshaMetaData() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/diksha/dikshaMetaData`);
  }

  dikshaTableMetaData() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/dikshaTable/dikshaMetaData`);
  }  

  dikshaAllTableData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/dikshaTable/dikshaAllTableData`, data);
  }

  dikshaDistrictTableData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/dikshaTable/dikshaDistrictTableData`, data);
  }

  dikshaTimeRangeTableData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/dikshaTable/dikshaTimeRangeTableData`, data);
  }

  //diksha bar chart....
  dikshaBarChart(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/dikshaBarChart/dikshaAllData`, data);
  }

  listCollectionNames(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/dikshaBarChart/dikshaGetCollections`, data);
  }

  getDataByCollectionNames(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/dikshaBarChart/dikshaGetCollectionData`, data);
  }

  tpdDistWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/diksha/tpd/distWise`, data);
  }

  tpdBlockWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/diksha/tpd/blockWise`, data);
  }

  tpdClusterWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/diksha/tpd/clusterWise`, data);
  }

  tpdSchoolWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/diksha/tpd/schoolWise`, data);
  }

  //diksha TPD enrollment/completion
  tpdDistEnrollCompAll(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/tpd/allDistData`, data);
  }

  tpdgetCollection(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/tpd/getCollections`, data);
  }

  getCollectionData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/tpd/getCollectionData`, data);
  }

  tpdBlockEnrollCompAll(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/tpd/blockData`, data);
  }

  tpdClusterEnrollCompAll(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/tpd/clusterData`, data);
  }

  tpdSchoolEnrollCompAll(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/tpd/schoolData`, data);
  }

}


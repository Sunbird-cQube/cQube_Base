import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolInfraService {
  public map;
  public baseUrl;
  public token;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  //Infra
  infraDistWise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/distWise`, {});
  }
  infraAllBlockWise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/blockWise`, {});
  }

  infraBlockWise(distId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/blockWise/${distId}`, {});
  }

  infraClusterWise(distId, blockId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/clusterWise/${distId}/${blockId}`, {});
  }

  infraAllClusterWise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/allClusterWise`, {});
  }

  infraSchoolWise(distId, blockId, clusterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/schoolWise/${distId}/${blockId}/${clusterId}`, {});
  }

  infraAllSchoolWise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/allSchoolWise`, {});
  }
  //infra map...
  infraMapDistWise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/distWise`, {});
  }
  infraMapAllBlockWise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/allBlockWise`, {});
  }

  infraMapBlockWise(distId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/blockWise/${distId}`, {});
  }

  infraMapAllClusterWise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/allClusterWise`, {});
  }

  infraMapClusterWise(distId, blockId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/clusterWise/${distId}/${blockId}`, {});
  }

  infraMapAllSchoolWise() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/allSchoolWise`, {});
  }

  infraMapSchoolWise(distId, blockId, clusterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/schoolWise/${distId}/${blockId}/${clusterId}`, {});
  }
}

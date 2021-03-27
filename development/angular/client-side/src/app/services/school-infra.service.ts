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
  infraDistWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/distWise`, data);
  }
  infraAllBlockWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/blockWise`, data);
  }

  infraBlockWise(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/blockWise/${distId}`, data);
  }

  infraClusterWise(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/clusterWise/${distId}/${blockId}`, data);
  }

  infraAllClusterWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/allClusterWise`, data);
  }

  infraSchoolWise(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/schoolWise/${distId}/${blockId}/${clusterId}`, data);
  }

  infraAllSchoolWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infra/allSchoolWise`, data);
  }


  //infra map...
  infraMapDistWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/distWise`, data);
  }
  infraMapAllBlockWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/allBlockWise`, data);
  }

  infraMapBlockWise(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/blockWise/${distId}`, data);
  }

  infraMapAllClusterWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/allClusterWise`, data);
  }

  infraMapClusterWise(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/clusterWise/${distId}/${blockId}`, data);
  }

  infraMapAllSchoolWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/allSchoolWise`, data);
  }

  infraMapSchoolWise(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/infraMap/schoolWise/${distId}/${blockId}/${clusterId}`, data);
  }
}

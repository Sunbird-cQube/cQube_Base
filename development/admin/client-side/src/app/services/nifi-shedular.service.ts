import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class NifiShedularService {
  public baseUrl = environment.apiEndpoint;
  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, private service: AppService) { }

  //nifi scheduler
  nifiGetProcessorId() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/nifi/getProcessorId`, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  nifiGetProcessorDetails(id) {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/nifi/getProcessorDetails/${id}`, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  nifiScheduleProcessor(id, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/nifi/scheduleProcessor/${id}`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }
}

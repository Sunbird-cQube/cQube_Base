import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  public baseUrl = environment.apiEndpoint;
  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, private service: AppService) { }

  //Logs========================
  getLogMenu() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/logs/getMenus`);
  }

  showLogs(type) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/logs/logType/${type}`, {});
  }

  getLogData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/logs/showLogs`, { data: data });
  }
}

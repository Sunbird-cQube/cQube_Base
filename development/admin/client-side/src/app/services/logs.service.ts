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

  showLogs(menuType, type) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/logs/logType/${menuType}/${type}`, {});
  }

  getLogData(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/logs/showLogs`, { data: data });
  }

  getPreviousFiles() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/logs/getPreviousLogFiles`);
  }

  downloadLogFile(file: any) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/logs/downloadLogFile`, { fileName: file.fileName, path: file.path, gz: file.gz }, { observe: 'response', responseType: 'arraybuffer' as 'blob' });
  }
}

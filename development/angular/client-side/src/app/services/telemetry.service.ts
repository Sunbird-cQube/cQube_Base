import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  public baseUrl = environment.apiEndpoint;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) { }

  //telemetry data
  telemetryDist(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/showDistTelemetry`, data, {
        'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
}

telemetryBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/showBlockTelemetry/all_Block`, data, {
        'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
}

telemetryCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/showClusterTelemetry/all_Cluster`, data, {
        'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
}

telemetrySchool(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/showSchoolTelemetry/all_school`, data, {
        'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
}
}

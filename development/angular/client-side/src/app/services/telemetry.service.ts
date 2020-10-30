import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Injectable({
    providedIn: 'root'
})
export class TelemetryService {
    public baseUrl;

    constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
        this.baseUrl = service.baseUrl;
    }

    //telemetry data
    telemetryDist(data) {
        this.service.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/showDistTelemetry`, data);
    }

    telemetryBlock(data) {
        this.service.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/showBlockTelemetry/all_Block`, data);
    }

    telemetryCluster(data) {
        this.service.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/showClusterTelemetry/all_Cluster`, data);
    }

    telemetrySchool(data) {
        this.service.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/showSchoolTelemetry/all_school`, data);
    }
}

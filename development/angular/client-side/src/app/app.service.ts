import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppServiceComponent {
    baseUrl = environment.apiEndpoint;

    constructor(public http: HttpClient) { };

    c3StdPerformanceStateWise() {
        return this.http.get(`${this.baseUrl}/getSchoolPerformance`);
    }
    c3StdAttendanceSchoolWise() {
        return this.http.get(`${this.baseUrl}/s3-school-wise`);
    }

    s3StdAttendanceGenderWise() {
        return this.http.get(`${this.baseUrl}/s3-gender-wise`);
    }

    s3StdAttendanceMonthWise() {
        return this.http.get(`${this.baseUrl}/s3-month-wise`);
    }

    s3KPI() {
        return this.http.get(`${this.baseUrl}/s3-kpi`);
    }
}
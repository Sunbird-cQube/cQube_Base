import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppServiceComponent {
    baseUrl = environment.apiEndpoint;

    constructor(public http: HttpClient) { };
    dist_wise_data() {
        return this.http.get(`${this.baseUrl}/dist_wise_data`);
    }

    block_wise_data() {
        return this.http.get(`${this.baseUrl}/block_wise_data`);
    }

    cluster_wise_data() {
        return this.http.get(`${this.baseUrl}/cluster_wise_data`);
    }

    school_wise_data() {
        return this.http.get(`${this.baseUrl}/school_wise_data`);
    }

    getSchoolData() {
        return this.http.get(`${this.baseUrl}/getSchoolData`);
    }
}
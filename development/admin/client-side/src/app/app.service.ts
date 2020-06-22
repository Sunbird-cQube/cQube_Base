import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AppService {

    public baseUrl = environment.apiEndpoint;

    constructor(public http: HttpClient) { }

    login(data) {
        return this.http.post(`${this.baseUrl}/roleBasedLogin`, data);
    }

    addUser(data) {
        return this.http.post(`${this.baseUrl}/addUser`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    changePassword(data) {
        return this.http.post(`${this.baseUrl}/changePassword`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    nodeLogs() {
        return this.http.get(`${this.baseUrl}/nodeLog`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

}
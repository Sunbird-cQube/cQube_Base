import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';
import { KeycloakSecurityService } from './keycloak-security.service';
@Injectable({
    providedIn: 'root'
})
export class AppService {

    public baseUrl = environment.apiEndpoint;

    public myData: any = {};
    public token;
    constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService) {
        this.token = keyCloakService.kc.token;
        localStorage.setItem('token', this.token);
    }

    logoutOnTokenExpire() {
        if (this.keyCloakService.kc.isTokenExpired() == true) {
            // alert("Session expired, Please login again!");
            let options = {
                redirectUri: environment.appUrl
            }
            this.keyCloakService.kc.logout(options);
        }
    }

    addUser(data) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/addUser`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    changePassword(data, id) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/changePassword/${id}`, { cnfpass: data }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    //Logs========================
    getLogMenu() {
       this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/logs/getMenus`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    showLogs(type) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/logs/logType/${type}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getLogData(data) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/logs/showLogs`, { data: data }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    //=========================================


    allUsers() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/allUsers`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getCreatedUser(data) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/addUser/getAllUsers`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }


    getRoles() {
       this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/addUser/roles`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    addRole(id, role) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/addUser/setRoles`, { userId: id, role: role }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });

    }

    changeStatus(id, updaterId) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/allUsers/changeStatus/${id}`, { updaterId: updaterId }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    deleteUser(id) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/allUsers/deleteUser/${id}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    editUser(id, data) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/allUsers/editUser/${id}`, { data: data }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getCurrentUser(id) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/allUsers/getUser/${id}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    //s3 downloads
    listBuckets() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/s3Download/listBuckets`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    listFolders(bucketName) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/s3Download/listFolders/${bucketName}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    listFiles(bucketName, folderName) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/s3Download/listFiles/${bucketName}/${folderName}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    downloadFile(fileName, bucketName) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/s3Download/getDownloadUrl/`, { fileName: fileName, bucketName: bucketName }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    //summary statistics
    getAttendanceSummary() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/summary/stdAttendance`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    getSemSummary() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/summary/sem`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getCrcSummary() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/summary/crc`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getInfraSummary() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/summary/infra`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    getInspecSummary() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/summary/inspec`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getstDistSummary() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/summary/stDist`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getstBlockSummary() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/summary/stBlock`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    getstClusterSummary() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/summary/stCluster`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    getstSchoolSummary() {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/summary/stSchool`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    //nifi scheduler
    nifiGetProcessorId() {
       this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/nifi/getProcessorId`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    nifiGetProcessorDetails(id) {
       this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/nifi/getProcessorDetails/${id}`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    nifiScheduleProcessor(id, data) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/nifi/scheduleProcessor/${id}`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    //telemetry data
    showTelemetry(date) {
       this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/showTelemetry`, date, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }


}
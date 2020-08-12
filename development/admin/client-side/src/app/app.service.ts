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

    login(data) {
        return this.http.post(`${this.baseUrl}/roleBasedLogin`, data);
    }

    addUser(data) {
        return this.http.post(`${this.baseUrl}/addUser`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    changePassword(data, id) {
        return this.http.post(`${this.baseUrl}/changePassword/${id}`, { cnfpass: data }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    //Logs========================
    getLogMenu() {
        return this.http.get(`${this.baseUrl}/logs/getMenus`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    showLogs(type) {
        return this.http.post(`${this.baseUrl}/logs/logType/${type}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getLogData(data) {
        return this.http.post(`${this.baseUrl}/logs/showLogs`, { data: data }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    //=========================================


    allUsers() {
        return this.http.post(`${this.baseUrl}/allUsers`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getCreatedUser(data) {
        return this.http.post(`${this.baseUrl}/addUser/getAllUsers`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }


    getRoles() {
        return this.http.get(`${this.baseUrl}/addUser/roles`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    addRole(id, role) {
        return this.http.post(`${this.baseUrl}/addUser/setRoles`, { userId: id, role: role }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });

    }

    changeStatus(id, updaterId) {
        return this.http.post(`${this.baseUrl}/allUsers/changeStatus/${id}`, { updaterId: updaterId }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    deleteUser(id) {
        return this.http.post(`${this.baseUrl}/allUsers/deleteUser/${id}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    editUser(id, data) {
        return this.http.post(`${this.baseUrl}/allUsers/editUser/${id}`, { data: data }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getCurrentUser(id) {
        return this.http.post(`${this.baseUrl}/allUsers/getUser/${id}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    //s3 downloads
    listBuckets() {
        return this.http.post(`${this.baseUrl}/s3Download/listBuckets`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    listFolders(bucketName) {
        return this.http.post(`${this.baseUrl}/s3Download/listFolders/${bucketName}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    listFiles(bucketName, folderName) {
        return this.http.post(`${this.baseUrl}/s3Download/listFiles/${bucketName}/${folderName}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    downloadFile(fileName, bucketName) {
        return this.http.post(`${this.baseUrl}/s3Download/getDownloadUrl/`, { fileName: fileName, bucketName: bucketName }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    //summary statistics
    getAttendanceSummary() {
        return this.http.post(`${this.baseUrl}/summary/stdAttendance`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    getSemSummary() {
        return this.http.post(`${this.baseUrl}/summary/sem`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getCrcSummary() {
        return this.http.post(`${this.baseUrl}/summary/crc`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getInfraSummary() {
        return this.http.post(`${this.baseUrl}/summary/infra`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    getInspecSummary() {
        return this.http.post(`${this.baseUrl}/summary/inspec`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getstDistSummary() {
        return this.http.post(`${this.baseUrl}/summary/stDist`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getstBlockSummary() {
        return this.http.post(`${this.baseUrl}/summary/stBlock`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    getstClusterSummary() {
        return this.http.post(`${this.baseUrl}/summary/stCluster`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }
    getstSchoolSummary() {
        return this.http.post(`${this.baseUrl}/summary/stSchool`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    //nifi scheduler
    nifiGetProcessorId() {
        return this.http.get(`${this.baseUrl}/nifi/getProcessorId`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    nifiGetProcessorDetails(id) {
        return this.http.get(`${this.baseUrl}/nifi/getProcessorDetails/${id}`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    nifiScheduleProcessor(id, data) {
        return this.http.post(`${this.baseUrl}/nifi/scheduleProcessor/${id}`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    //telemetry data
    showTelemetry(date) {
        return this.http.post(`${this.baseUrl}/showTelemetry`, date, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }


}
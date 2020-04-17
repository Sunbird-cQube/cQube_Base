import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppServiceComponent {
    baseUrl = environment.apiEndpoint;

    constructor(public http: HttpClient) { };

    login(data) {
        return this.http.post(`${this.baseUrl}/roleBasedLogin`, data);
    }

    dist_wise_data() {
        return this.http.get(`${this.baseUrl}/dist_wise_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    block_wise_data() {
        return this.http.get(`${this.baseUrl}/block_wise_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    cluster_wise_data() {
        return this.http.get(`${this.baseUrl}/cluster_wise_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    school_wise_data() {
        return this.http.get(`${this.baseUrl}/school_wise_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    getSchoolData() {
        return this.http.get(`${this.baseUrl}/getSchoolData`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    blockPerDist(distId) {
        return this.http.post(`${this.baseUrl}/blcokPerDist`, { distId: distId, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    clusterPerBlock(blockId) {
        return this.http.post(`${this.baseUrl}/clustePerBlock`, { blockId: blockId, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    schoolsPerCluster(clusterId) {
        return this.http.post(`${this.baseUrl}/schoolPerCluster`, { clusterId: clusterId, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    clusterPerDist(distId) {
        return this.http.post(`${this.baseUrl}/clusterPerDist`, { distId: distId, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    schoolPerDist(distId) {
        return this.http.post(`${this.baseUrl}/schoolPerDist`, { distId: distId, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    schoolPerBlock(blockId) {
        return this.http.post(`${this.baseUrl}/schoolPerDist`, { blockId: blockId, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    schoolCount() {
        return this.http.get(`${this.baseUrl}/schoolCount`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    downloadFile(data, filename = 'data') {
        let csvData = this.ConvertToCSV(data, ['id', 'name', 'label', 'stdCount', 'schCount',]);
        console.log(csvData)
        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename + ".csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }
    ConvertToCSV(objArray, headerList) {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        let row = 'S.No,';
        for (let index in headerList) {
            row += headerList[index] + ',';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        for (let i = 0; i < array.length; i++) {
            let line = (i + 1) + '';
            for (let index in headerList) {
                let head = headerList[index];
                line += ',' + array[i][head];
            }
            str += line + '\r\n';
        }
        console.log(str);
        return str;
    }
}
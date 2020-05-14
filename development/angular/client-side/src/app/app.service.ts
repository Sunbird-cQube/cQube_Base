import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppServiceComponent {
    public baseUrl = environment.apiEndpoint;

    constructor(public http: HttpClient) { };

    login(data) {
        return this.http.post(`${this.baseUrl}/roleBasedLogin`, data);
    }

    dist_wise_data(data) {
        return this.http.post(`${this.baseUrl}/dist_wise_data`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    block_wise_data(data) {
        return this.http.post(`${this.baseUrl}/block_wise_data`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    cluster_wise_data(data) {
        return this.http.post(`${this.baseUrl}/cluster_wise_data`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    school_wise_data(data) {
        return this.http.post(`${this.baseUrl}/school_wise_data`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // getSchoolData() {
    //     return this.http.get(`${this.baseUrl}/getSchoolData`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    // }

    blockPerDist(data) {
        return this.http.post(`${this.baseUrl}/blcokPerDist`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    clusterPerBlock(data) {
        return this.http.post(`${this.baseUrl}/clustePerBlock`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    schoolsPerCluster(data) {
        return this.http.post(`${this.baseUrl}/schoolPerCluster`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // clusterPerDist(distId) {
    //     return this.http.post(`${this.baseUrl}/clusterPerDist`, { distId: distId, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    // }

    // schoolPerDist(distId) {
    //     return this.http.post(`${this.baseUrl}/schoolPerDist`, { distId: distId, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    // }
    // schoolPerBlock(blockId) {
    //     return this.http.post(`${this.baseUrl}/schoolPerDist`, { blockId: blockId, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    // }

    schoolCount() {
        return this.http.get(`${this.baseUrl}/schoolCount`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // crc new apis
    crcDistWiseData() {
        return this.http.post(`${this.baseUrl}/crc/districtWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crcBlockWiseData(distId) {
        return this.http.post(`${this.baseUrl}/crc/blockWise/${distId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crcClusterWiseData(distId, blockId) {
        return this.http.post(`${this.baseUrl}/crc/clusterWise/${distId}/${blockId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcSchoolWiseData(distId, blockId, clusterId) {
        return this.http.post(`${this.baseUrl}/crc/schoolWise/${distId}/${blockId}/${clusterId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcAllBlockWiseData() {
        return this.http.post(`${this.baseUrl}/crc/allBlockWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcAllClusterWiseData() {
        return this.http.post(`${this.baseUrl}/crc/allClusterWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcAllSchoolWiseData() {
        return this.http.post(`${this.baseUrl}/crc/allSchoolWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }



    // sem wise services
    all_dist_sem_data() {
        return this.http.post(`${this.baseUrl}/sem/districtWise`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            'startDate': '01-08-2019',
            'endDate': '31-10-2019'
        });
    }

    all_block_sem_data() {
        return this.http.post(`${this.baseUrl}/sem/allBlockWise`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            'startDate': '01-08-2019',
            'endDate': '31-10-2019'
        });
    }

    block_wise_sem_data(distId) {
        return this.http.post(`${this.baseUrl}/sem/blockWise/${distId}`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            'startDate': '01-08-2019',
            'endDate': '31-10-2019'
        });
    }

    all_cluster_sem_data() {
        return this.http.post(`${this.baseUrl}/sem/allClusterWise`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            'startDate': '01-08-2019',
            'endDate': '31-10-2019'
        });
    }

    cluster_wise_sem_data(distId, blockId) {
        return this.http.post(`${this.baseUrl}/sem/clusterWise/${distId}/${blockId}`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            'startDate': '01-08-2019',
            'endDate': '31-10-2019'
        });
    }

    all_school_sem_data() {
        return this.http.post(`${this.baseUrl}/sem/allSchoolWise`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            'startDate': '01-08-2019',
            'endDate': '31-10-2019'
        });
    }

    school_wise_sem_data(distId, blockId, clusterId) {
        return this.http.post(`${this.baseUrl}/sem/schoolWise/${distId}/${blockId}/${clusterId}`, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            'startDate': '01-08-2019',
            'endDate': '31-10-2019'
        });
    }

    changePassword(data) {
        return this.http.post(`${this.baseUrl}/changePassword`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    addUser(data) {
        console.log(data);
        return this.http.post(`${this.baseUrl}/addUser`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

}
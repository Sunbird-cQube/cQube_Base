import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppServiceComponent {
   public baseUrl: any = environment.apiEndpoint;

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

    crc_all_districts() {
        return this.http.get(`${this.baseUrl}/crcData/getDistricts`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crc_all_blocks(distId) {
        return this.http.get(`${this.baseUrl}/crcData/getBlocks/${distId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crc_all_clusters(distId, blockId) {
        return this.http.get(`${this.baseUrl}/crcData/getClusters/${distId}/${blockId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crc_all_Schools(distId, blockId, clusterId) {
        return this.http.get(`${this.baseUrl}/crcData/getSchools/${distId}/${blockId}/${clusterId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcData() {
        return this.http.get(`${this.baseUrl}/crcData`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crcData_block(distId) {
        return this.http.get(`${this.baseUrl}/crcData/district/${distId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crcData_cluster(distId, blockId) {
        return this.http.get(`${this.baseUrl}/crcData/district/${distId}/block/${blockId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crcData_school(distId, blockId, clusterId) {
        return this.http.get(`${this.baseUrl}/crcData/district/${distId}/block/${blockId}/cluster/${clusterId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    distWiseData(){
        return this.http.post(`${this.baseUrl}/districtWiseCRC/districtWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

}
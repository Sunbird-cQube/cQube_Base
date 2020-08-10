import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';
import { KeycloakSecurityService } from './keycloak-security.service';

@Injectable({
    providedIn: 'root'
})
export class AppServiceComponent {
    public baseUrl = environment.apiEndpoint;
    public token;
    constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService) {
        this.token = keyCloakService.kc.token;
        localStorage.setItem('token', this.token);
    };

    login(data) {
        return this.http.post(`${this.baseUrl}/roleBasedLogin`, data);
    }


    //Attendance report
    dist_wise_data(data) {
        return this.http.post(`${this.baseUrl}/attendance/distWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    block_wise_data(data) {
        return this.http.post(`${this.baseUrl}/attendance/blockWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    cluster_wise_data(data) {
        return this.http.post(`${this.baseUrl}/attendance/clusterWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    school_wise_data(data) {
        return this.http.post(`${this.baseUrl}/attendance/schoolWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }


    blockPerDist(data) {
        return this.http.post(`${this.baseUrl}/attendance/blockPerDist`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    clusterPerBlock(data) {
        return this.http.post(`${this.baseUrl}/attendance/clusterPerBlock`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    schoolsPerCluster(data) {
        return this.http.post(`${this.baseUrl}/attendance/schoolPerCluster`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    getDateRange() {
        return this.http.get(`${this.baseUrl}/attendance/getDateRange`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // crc new apis
    crcDistWiseData() {
        return this.http.post(`${this.baseUrl}/crc/districtWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crcBlockWiseData(distId) {
        return this.http.post(`${this.baseUrl}/crc/blockWise/${distId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crcClusterWiseData(distId, blockId) {
        return this.http.post(`${this.baseUrl}/crc/clusterWise/${distId}/${blockId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcSchoolWiseData(distId, blockId, clusterId) {
        return this.http.post(`${this.baseUrl}/crc/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcAllBlockWiseData() {
        return this.http.post(`${this.baseUrl}/crc/allBlockWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcAllClusterWiseData() {
        return this.http.post(`${this.baseUrl}/crc/allClusterWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcAllSchoolWiseData() {
        return this.http.post(`${this.baseUrl}/crc/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // sem wise services
    all_dist_sem_data() {
        return this.http.post(`${this.baseUrl}/sem/districtWise`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            // 'startDate': '01-08-2019',
            // 'endDate': '31-10-2019'
        });
    }

    all_block_sem_data() {
        return this.http.post(`${this.baseUrl}/sem/allBlockWise`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            // 'startDate': '01-08-2019',
            // 'endDate': '31-10-2019'
        });
    }

    block_wise_sem_data(distId) {
        return this.http.post(`${this.baseUrl}/sem/blockWise/${distId}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            // 'startDate': '01-08-2019',
            // 'endDate': '31-10-2019'
        });
    }

    all_cluster_sem_data() {
        return this.http.post(`${this.baseUrl}/sem/allClusterWise`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            // 'startDate': '01-08-2019',
            // 'endDate': '31-10-2019'
        });
    }

    cluster_wise_sem_data(distId, blockId) {
        return this.http.post(`${this.baseUrl}/sem/clusterWise/${distId}/${blockId}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            // 'startDate': '01-08-2019',
            // 'endDate': '31-10-2019'
        });
    }

    all_school_sem_data() {
        return this.http.post(`${this.baseUrl}/sem/allSchoolWise`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            // 'startDate': '01-08-2019',
            // 'endDate': '31-10-2019'
        });
    }

    school_wise_sem_data(distId, blockId, clusterId) {
        return this.http.post(`${this.baseUrl}/sem/schoolWise/${distId}/${blockId}/${clusterId}`, {}, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') },
            // 'startDate': '01-08-2019',
            // 'endDate': '31-10-2019'
        });
    }

    changePassword(data, id) {
        return this.http.post(`${this.baseUrl}/changePassword/${id}`, { cnfpass: data }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    // dashboard data 

    dashboard() {
        return this.http.post(`${this.baseUrl}/dashboard`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    //Infra
    infraDistWise() {
        return this.http.post(`${this.baseUrl}/infra/distWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    infraAllBlockWise() {
        return this.http.post(`${this.baseUrl}/infra/blockWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraBlockWise(distId) {
        return this.http.post(`${this.baseUrl}/infra/blockWise/${distId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraClusterWise(distId, blockId) {
        return this.http.post(`${this.baseUrl}/infra/clusterWise/${distId}/${blockId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraAllClusterWise() {
        return this.http.post(`${this.baseUrl}/infra/allClusterWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraSchoolWise(distId, blockId, clusterId) {
        return this.http.post(`${this.baseUrl}/infra/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraAllSchoolWise() {
        return this.http.post(`${this.baseUrl}/infra/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    //infra map...
    infraMapDistWise() {
        return this.http.post(`${this.baseUrl}/infraMap/distWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    infraMapAllBlockWise() {
        return this.http.post(`${this.baseUrl}/infraMap/allBlockWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapBlockWise(distId) {
        return this.http.post(`${this.baseUrl}/infraMap/blockWise/${distId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapAllClusterWise() {
        return this.http.post(`${this.baseUrl}/infraMap/allClusterWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapClusterWise(distId, blockId) {
        return this.http.post(`${this.baseUrl}/infraMap/clusterWise/${distId}/${blockId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapAllSchoolWise() {
        return this.http.post(`${this.baseUrl}/infraMap/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapSchoolWise(distId, blockId, clusterId) {
        return this.http.post(`${this.baseUrl}/infraMap/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // diksha apis for stack bar chart
    dikshaAllData(type, timePeriod) {
        return this.http.post(`${this.baseUrl}/diksha/dikshaAllData`, { login_type: type, timePeriod: timePeriod }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaDistData(districtId, type, timePeriod) {
        return this.http.post(`${this.baseUrl}/diksha/dikshaData`, { districtId: districtId, login_type: type, timePeriod: timePeriod }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaDataDownload(data) {
        return this.http.post(`${this.baseUrl}/diksha/dikshaDataDownload`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // diksha apis for table

    dikshaMetaData() {
        return this.http.get(`${this.baseUrl}/diksha/dikshaMetaData`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaAllTableData(data) {
        return this.http.post(`${this.baseUrl}/dikshaTable/dikshaAllTableData`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaDistrictTableData(districtId) {
        return this.http.post(`${this.baseUrl}/dikshaTable/dikshaDistrictTableData`, { districtId: districtId }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaTimeRangeTableData(districtId, timePeriod) {
        return this.http.post(`${this.baseUrl}/dikshaTable/dikshaTimeRangeTableData`, { districtId: districtId, timePeriod: timePeriod }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    //Semester Completion
    semCompletionDist() {
        return this.http.get(`${this.baseUrl}/semCompDist/allDistrictWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    semCompletionBlock() {
        return this.http.get(`${this.baseUrl}/semCompBlock/allBlockWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionCluster() {
        return this.http.get(`${this.baseUrl}/semCompCluster/allClusterWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionSchool() {
        return this.http.post(`${this.baseUrl}/semCompSchool/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionBlockPerDist(distId) {
        return this.http.get(`${this.baseUrl}/semCompBlock/blockWise/${distId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionClusterPerBlock(distId, blockId) {
        return this.http.get(`${this.baseUrl}/semCompCluster/clusterWise/${distId}/${blockId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionSchoolPerClustter(distId, blockId, clusterId) {
        return this.http.post(`${this.baseUrl}/semCompSchool/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    //-----------------------------------------------
    school_invalid() {
        return this.http.get(`${this.baseUrl}/school_invalid/school_invalid_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

}
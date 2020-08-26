import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';
import { KeycloakSecurityService } from './keycloak-security.service';
import * as data from './../assets/india.json';
import * as L from 'leaflet';
export var globalMap;

@Injectable({
    providedIn: 'root'
})
export class AppServiceComponent {
    public map;
    public baseUrl = environment.apiEndpoint;
    public token;
    public telemetryData = [];

    constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService) {
        this.token = keyCloakService.kc.token;
        localStorage.setItem('token', this.token);
    }

    logoutOnTokenExpire() {
        if (this.keyCloakService.kc.isTokenExpired()) {
            // alert("Session expired, Please login again!");
            let options = {
                redirectUri: environment.appUrl
            }
            this.keyCloakService.kc.logout(options);
        }
    }

    //Initialisation of Map  
    initMap(map) {
        const lat = 22.3660414123535;
        const lng = 71.48396301269531;
        globalMap = L.map(map, { zoomControl: false }).setView([lat, lng], 7);
        applyCountryBorder(globalMap);
        function applyCountryBorder(map) {
            L.geoJSON(data['features'][0], {
                color: "#a9a9a9",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.0
            }).addTo(map);
        }
        L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}?access_token={token}',
            {
                token: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
                id: 'mapbox.streets',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                minZoom: 4,
                maxZoom: 18,
            }
        ).addTo(globalMap);
    }


    //Attendance report
    dist_wise_data(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/attendance/distWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    block_wise_data(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/attendance/blockWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    cluster_wise_data(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/attendance/clusterWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    school_wise_data(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/attendance/schoolWise`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }


    blockPerDist(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/attendance/blockPerDist`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    clusterPerBlock(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/attendance/clusterPerBlock`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    schoolsPerCluster(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/attendance/schoolPerCluster`, { data: data, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    getDateRange() {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/attendance/getDateRange`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // crc new apis
    crcDistWiseData() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/crc/districtWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crcBlockWiseData(distId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/crc/blockWise/${distId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    crcClusterWiseData(distId, blockId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/crc/clusterWise/${distId}/${blockId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcSchoolWiseData(distId, blockId, clusterId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/crc/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcAllBlockWiseData() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/crc/allBlockWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcAllClusterWiseData() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/crc/allClusterWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    crcAllSchoolWiseData() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/crc/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // sem wise services
    all_dist_sem_data(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/sem/districtWise`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    all_block_sem_data(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/sem/allBlockWise`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    block_wise_sem_data(distId, data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/sem/blockWise/${distId}`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    all_cluster_sem_data(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/sem/allClusterWise`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    cluster_wise_sem_data(distId, blockId, data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/sem/clusterWise/${distId}/${blockId}`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    all_school_sem_data(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/sem/allSchoolWise`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    school_wise_sem_data(distId, blockId, clusterId, data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/sem/schoolWise/${distId}/${blockId}/${clusterId}`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    changePassword(data, id) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/changePassword/${id}`, { cnfpass: data }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    // dashboard data 

    dashboard() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/dashboard`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    //Infra
    infraDistWise() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infra/distWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    infraAllBlockWise() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infra/blockWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraBlockWise(distId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infra/blockWise/${distId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraClusterWise(distId, blockId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infra/clusterWise/${distId}/${blockId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraAllClusterWise() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infra/allClusterWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraSchoolWise(distId, blockId, clusterId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infra/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraAllSchoolWise() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infra/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    //infra map...
    infraMapDistWise() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infraMap/distWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    infraMapAllBlockWise() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infraMap/allBlockWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapBlockWise(distId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infraMap/blockWise/${distId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapAllClusterWise() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infraMap/allClusterWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapClusterWise(distId, blockId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infraMap/clusterWise/${distId}/${blockId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapAllSchoolWise() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infraMap/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    infraMapSchoolWise(distId, blockId, clusterId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/infraMap/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // diksha apis for stack bar chart
    dikshaAllData(type, timePeriod) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/diksha/dikshaAllData`, { login_type: type, timePeriod: timePeriod }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaDistData(districtId, type, timePeriod) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/diksha/dikshaData`, { districtId: districtId, login_type: type, timePeriod: timePeriod }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaDataDownload(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/diksha/dikshaDataDownload`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    // diksha apis for table

    dikshaMetaData() {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/diksha/dikshaMetaData`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaAllTableData(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/dikshaTable/dikshaAllTableData`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaDistrictTableData(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/dikshaTable/dikshaDistrictTableData`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaTimeRangeTableData(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/dikshaTable/dikshaTimeRangeTableData`, data, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    dikshaBarChart(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/dikshaBarChart/dikshaAllData`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    listCollectionNames(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/dikshaBarChart/dikshaGetCollections`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    getDataByCollectionNames(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/dikshaBarChart/dikshaGetCollectionData`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    //Semester Completion
    semCompletionDist() {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/semCompDist/allDistrictWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    semCompletionBlock() {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/semCompBlock/allBlockWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionCluster() {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/semCompCluster/allClusterWise`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionSchool() {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/semCompSchool/allSchoolWise`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionBlockPerDist(distId) {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/semCompBlock/blockWise/${distId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionClusterPerBlock(distId, blockId) {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/semCompCluster/clusterWise/${distId}/${blockId}`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }
    semCompletionSchoolPerClustter(distId, blockId, clusterId) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/semCompSchool/schoolWise/${distId}/${blockId}/${clusterId}`, {}, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    //-----------------------------------------------
    school_invalid() {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/school_invalid/school_invalid_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    //------------------------------------
    telemetry(date) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/telemetry`, { telemetryData: this.telemetryData, date: date }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    //telemetry data
    telemetryDist(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/showDistTelemetry`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    telemetryBlock(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/showBlockTelemetry/all_Block`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    telemetryCluster(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/showClusterTelemetry/all_Cluster`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    telemetrySchool(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/showSchoolTelemetry/all_school`, data, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }


}
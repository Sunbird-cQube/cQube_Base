import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';
import { KeycloakSecurityService } from './keycloak-security.service';
import * as data from '../assets/india.json';
import * as L from 'leaflet';
import { ExportToCsv } from 'export-to-csv';
export var globalMap;

@Injectable({
    providedIn: 'root'
})
export class AppServiceComponent {
    public map;
    public baseUrl = environment.apiEndpoint;
    public token;
    service: any;
    telemetryData: any;

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

    changePassword(data, id) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/changePassword/${id}`, { cnfpass: data }, {
            'headers': { 'token': "Bearer " + localStorage.getItem('token') }
        });
    }

    // to load and hide the spinner 
    loaderAndErr(data) {
        if (data.length !== 0) {
            document.getElementById('spinner').style.display = 'none';
        } else {
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('errMsg').style.color = 'red';
            document.getElementById('errMsg').style.display = 'block';
            document.getElementById('errMsg').innerHTML = 'No data found';
        }
    }
    errMsg() {
        document.getElementById('errMsg').style.display = 'none';
        document.getElementById('spinner').style.display = 'block';
        document.getElementById('spinner').style.marginTop = '3%';
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
                weight: 1,
                fillOpacity: 0
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


    //Initialise markers.....
    public initMarkers(lat, lng, color, radius, strokeWeight, weight, levelWise) {
        var markerIcon;
        if (levelWise !== "school") {
            markerIcon = L.circleMarker([lat, lng], {
                radius: radius,
                color: color,
                fillColor: color,
                fillOpacity: 1,
                strokeWeight: strokeWeight,
            });
        } else {
            markerIcon = L.circleMarker([lat, lng], {
                radius: radius,
                color: color,
                fillColor: color,
                fillOpacity: 1,
                strokeWeight: strokeWeight,
                weight: weight
            });
        }
        return markerIcon;
    }


    //map tooltip automation
    public getInfoFrom(object, value, levelWise, reportType, infraName, colorText) {
        var popupFood = [];
        var stringLine;
        var selected = '';
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                if (key == value) {
                    if (reportType == "infra-map" || reportType == "patReport") {
                        selected = `<span ${infraName == key.trim() ? colorText : ''}>`
                    }
                    stringLine = selected + "<b>" +
                        key.replace(
                            /\w\S*/g,
                            function (txt) {
                                txt = txt.replace(/_/g, ' ');
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            })
                        + "</b>" + ": " + object[key] + " %" + `</span>`;
                } else {
                    if (reportType == "infra-map" || reportType == "patReport") {
                        selected = `<span ${infraName == key.trim() ? colorText : ''}>`
                    }
                    stringLine = selected + "<b>" +
                        key.replace(
                            /\w\S*/g,
                            function (txt) {
                                txt = txt.replace(/_/g, ' ');
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            })
                        + "</b>" + ": " + object[key] + `</span>`;
                }
            }
            popupFood.push(stringLine);
        }
        return popupFood;
    }

    //Download reports....
    download(fileName, reportData) {
        if (reportData.length <= 0) {
            alert("No data found to download");
        } else {
            const options = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                showTitle: false,
                title: 'My Awesome CSV',
                useTextFile: false,
                useBom: true,
                useKeysAsHeaders: true,
                filename: fileName
            };
            const csvExporter = new ExportToCsv(options);
            csvExporter.generateCsv(reportData);
        }
    }

    //color gredient generation....
    public color() {
        // Converts a #ffffff hex string into an [r,g,b] array
        function hex2rgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : null;
        }

        // Inverse of the above
        function rgb2hex(rgb) {
            return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
        }

        // Interpolates two [r,g,b] colors and returns an [r,g,b] of the result

        function _interpolateRgb(color1, color2, factor) {
            if (arguments.length < 3) { factor = 0.5; }

            let result = color1.slice();

            for (let i = 0; i < 3; i++) {
                result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
            }
            return result;
        }

        function generateGradient(color1, color2, total, interpolation) {
            const colorStart = typeof color1 === 'string' ? hex2rgb(color1) : color1;
            const colorEnd = typeof color2 === 'string' ? hex2rgb(color2) : color2;

            // will the gradient be via RGB or HSL
            switch (interpolation) {
                case 'rgb':
                    return colorsToGradientRgb(colorStart, colorEnd, total);
                case 'hsl':
                //   return colorsToGradientHsl(colorStart, colorEnd, total);
                default:
                    return false;
            }
        }

        function colorsToGradientRgb(startColor, endColor, steps) {
            // returns array of hex values for color, since rgb would be an array of arrays and not strings, easier to handle hex strings
            let arrReturnColors = [];
            let interimColorRGB;
            let interimColorHex;
            const totalColors = steps;
            const factorStep = 1 / (totalColors - 1);

            for (let idx = 0; idx < totalColors; idx++) {
                interimColorRGB = _interpolateRgb(startColor, endColor, factorStep * idx);
                interimColorHex = rgb2hex(interimColorRGB);
                arrReturnColors.push(interimColorHex);
            }
            return arrReturnColors;
        }
        return {
            generateGradient
        };
    }

    // color gredient based on intervals
    colorGredient(data, infraData) {
        var dataSet = {};
        var setColor = '';
        if (infraData == 'Infrastructure_Score') {
            dataSet = data.details;
        } else {
            dataSet = data.indices;
        }

        if (dataSet[infraData] <= 10) {
            setColor = '#a50026';
        }
        if (dataSet[infraData] >= 11 && dataSet[infraData] <= 20) {
            setColor = '#d73027';
        }
        if (dataSet[infraData] >= 21 && dataSet[infraData] <= 30) {
            setColor = '#f46d43';
        }
        if (dataSet[infraData] >= 31 && dataSet[infraData] <= 40) {
            setColor = '#fdae61';
        }
        if (dataSet[infraData] >= 41 && dataSet[infraData] <= 50) {
            setColor = '#ffff00';
        }
        if (dataSet[infraData] >= 51 && dataSet[infraData] <= 60) {
            setColor = '#bbff33';
        }
        if (dataSet[infraData] >= 61 && dataSet[infraData] <= 70) {
            setColor = '#4dff4d';
        }
        if (dataSet[infraData] >= 71 && dataSet[infraData] <= 80) {
            setColor = '#66bd63';
        }
        if (dataSet[infraData] >= 81 && dataSet[infraData] <= 90) {
            setColor = '#1a9850';
        }
        if (dataSet[infraData] >= 91 && dataSet[infraData] <= 99) {
            setColor = '#00b300';
        }
        if (dataSet[infraData] == 100) {
            setColor = '#006600';
        }
        return setColor;
    }

    //capturing telemetry.....
    telemetry(date) {
        console.log(this.telemetryData);
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/telemetry`, { telemetryData: this.telemetryData, date: date }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    getTelemetry() {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/telemetry`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    //
    edate;
    getTelemetryData(reportId, event) {
        this.telemetryData = [];
        var obj = {};
        this.edate = new Date();
        var dateObj = {
            year: this.edate.getFullYear(),
            month: ("0" + (this.edate.getMonth() + 1)).slice(-2),
            date: ("0" + (this.edate.getDate())).slice(-2),
            hour: ("0" + (this.edate.getHours())).slice(-2),
            minut: ("0" + (this.edate.getMinutes())).slice(-2),
            seconds: ("0" + (this.edate.getSeconds())).slice(-2),
        }
        obj = {
            uid: this.keyCloakService.kc.tokenParsed.sub,
            eventType: event,
            reportId: reportId,
            time: dateObj.year + '-' + dateObj.month + '-' + dateObj.date + ' ' + dateObj.hour + ':' + dateObj.minut + ':' + dateObj.seconds
        }

        this.telemetryData.push(obj);

        this.telemetry(dateObj).subscribe(res => {
        }, err => {
            console.log(err);
        });
    }
}
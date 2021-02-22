import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';
import { KeycloakSecurityService } from './keycloak-security.service';
import * as data from '../assets/states_for_cQube.json';
import * as config from '../assets/config.json';
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
    telemetryData: any;
    showBack = true;
    showHome = true;
    zoomLevel = 7;
    mapCenterLatlng = config.default[`${environment.stateName}`];

    public state = this.mapCenterLatlng.name;
    date = new Date();
    dateAndTime: string;

    constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService) {
        this.token = keyCloakService.kc.token;
        localStorage.setItem('token', this.token);
        this.dateAndTime = `${("0" + (this.date.getDate())).slice(-2)}-${("0" + (this.date.getMonth() + 1)).slice(-2)}-${this.date.getFullYear()}`;
    }


    homeControl() {
        if (window.location.hash == '#/dashboard') {
            this.showBack = true;
            this.showHome = false;
        } else {
            this.showBack = false;
            this.showHome = true;
        }
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
        return this.http.post(`${this.baseUrl}/changePassword/${id}`, { cnfpass: data });
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
    initMap(map, maxBounds) {
        globalMap = L.map(map, { zoomControl: false, maxBounds: maxBounds }).setView([maxBounds[0][0], maxBounds[0][1]], this.mapCenterLatlng.zoomLevel);
        applyCountryBorder(globalMap);
        function applyCountryBorder(map) {
            L.geoJSON(data.default[`${environment.stateName}`]['features'], {
                color: "#6e6d6d",
                weight: 2,
                fillOpacity: 0,
                fontWeight: "bold"
            }).addTo(map);
        }
        L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}?access_token={token}',
            {
                token: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
                id: 'mapbox.streets',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                minZoom: this.mapCenterLatlng.zoomLevel,
                maxZoom: this.mapCenterLatlng.zoomLevel + 10,
            }
        ).addTo(globalMap);
    }

    restrictZoom(globalMap) {
        globalMap.touchZoom.disable();
        globalMap.doubleClickZoom.disable();
        globalMap.scrollWheelZoom.disable();
        globalMap.boxZoom.disable();
        globalMap.keyboard.disable();
    }


    //Initialise markers.....
    public initMarkers(lat, lng, color, radius, strokeWeight, weight, levelWise) {
        var markerIcon;
        if (radius >= 1) {
            markerIcon = L.circleMarker([lat, lng], {
                radius: radius + 1,
                color: "gray",
                fillColor: color,
                fillOpacity: 1,
                strokeWeight: strokeWeight,
                weight: weight
            });
        } else {
            markerIcon = L.circleMarker([lat, lng], {
                radius: 1,
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
            if (object[key] && typeof object[key] != 'number' && object[key].includes('%')) {
                var split = object[key].split("% ");
                object[`${key}`] = parseFloat(split[0].replace(` `, '')).toFixed(1) + ' % ' + split[1];
            }
            if (object.hasOwnProperty(key)) {
                if (key == value) {
                    if (reportType == "infra-map" || reportType == "patReport") {
                        selected = `<span ${infraName == key.trim() ? colorText : ''}>`
                    }
                    stringLine = selected + "<b>" +
                        key.replace(
                            /\w\S*/g,
                            function (txt) {
                                txt = txt.replace('Id', '_id');
                                txt = txt.replace('Name', '_name');
                                txt = txt.replace(/_/g, ' ');
                                if (txt.includes('percent') && txt != 'percentage schools with missing data') {
                                    txt = txt.replace('percent', '(%)');
                                }
                                txt = txt == 'students count' ? 'student count' : txt;
                                if (txt.includes('id')) {
                                    return txt.charAt(0).toUpperCase();
                                } else {
                                    return toTitleCase(txt);
                                }
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
                                txt = txt.replace('Id', '_id');
                                txt = txt.replace('Name', '_name');
                                txt = txt.replace(/_/g, ' ');
                                if (txt.includes('percent') && txt != 'percentage schools with missing data') {
                                    txt = txt.replace('percent', '(%)');
                                }
                                txt = txt == 'students count' ? 'student count' : txt;
                                if (txt.includes('id')) {
                                    txt = txt.replace('id', 'ID');
                                    return txt.charAt(0).toUpperCase() + txt.substr(1);
                                } else {
                                    return toTitleCase(txt);
                                }
                            })

                        + "</b>" + ": " + object[key] + `</span>`;
                }
            }
            popupFood.push(stringLine);
        }
        function toTitleCase(phrase) {
            var key = phrase
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            key = key.replace("Nsqf", "NSQF");
            key = key.replace("Ict", "ICT");
            key = key.replace("Crc", "CRC");
            key = key.replace("Cctv", "CCTV");
            key = key.replace("Cwsn", "CWSN");
            key = key.replace("Ff Uuid", "UUID");
            return key;
        }
        return popupFood;
    }

    capitalize(key) {
        key = key.replace("Id", "ID");
        key = key.replace("Nsqf", "NSQF");
        key = key.replace("Ict", "ICT");
        key = key.replace("Crc", "CRC");
        key = key.replace("Cctv", "CCTV");
        key = key.replace("Cwsn", "CWSN");
        key = key.replace("Ff Uuid", "UUID");
        return key;
    }


    //Download reports....
    download(fileName, reportData) {
        if (reportData.length <= 0) {
            alert("No data found to download");
        } else {
            var keys = Object.keys(reportData[0]);
            var updatedKeys = [];
            keys.map(key => {
                key = key.replace(/_/g, ' ').toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                key = this.capitalize(key);
                updatedKeys.push(key);
            });
            const options = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                showTitle: false,
                title: 'My Awesome CSV',
                useTextFile: false,
                useBom: true,
                // useKeysAsHeaders: true,
                headers: updatedKeys,
                filename: fileName
            };
            const csvExporter = new ExportToCsv(options);
            csvExporter.generateCsv(reportData);
        }
    }

    //color gredient generation....
    public color(data, filter) {
        var keys = Object.keys(this.colors);
        var dataSet = {};
        var setColor = '';
        dataSet = data;
        for (let i = 0; i < keys.length; i++) {
            if (dataSet[filter] <= parseInt(keys[i])) {
                setColor = this.colors[keys[i]];
                break;
            } else if (dataSet[filter] > parseInt(keys[i]) && dataSet[filter] <= parseInt(keys[i + 1])) {
                setColor = this.colors[keys[i + 1]];
                break;
            }
        }
        return setColor;
    }

    // color gredient based on intervals
    colorGredient(data, filter) {
        var keys = Object.keys(this.colors);
        var dataSet = {};
        var setColor = '';
        if (filter == 'Infrastructure_Score' || filter == 'infrastructure_score') {
            dataSet = data.details;
        } else {
            if (data.indices) {
                dataSet = data.indices;
            } else {
                dataSet = data.metrics;
            }
        }
        for (let i = 0; i < keys.length; i++) {
            if (dataSet[filter] <= parseInt(keys[i])) {
                setColor = this.colors[keys[i]];
                break;
            } else if (dataSet[filter] > parseInt(keys[i]) && dataSet[filter] <= parseInt(keys[i + 1])) {
                setColor = this.colors[keys[i + 1]];
                break;
            }
        }
        return setColor;
    }

    //generating relative colors
    // color gredient based on intervals
    relativeColorGredient(data, filter, colors) {
        var keys = Object.keys(colors);
        var dataSet = {};
        var setColor = '';
        if (!filter.report) {
            if (filter == 'Infrastructure_Score' || filter == 'infrastructure_score') {
                dataSet = data.details;
            } else {
                if (data.indices) {
                    dataSet = data.indices;
                } else {
                    dataSet = data.metrics;
                }
            }
        } else {
            if (!filter.selected) {
                var objkeys = Object.keys(data);
                if (!objkeys.includes(filter.value)) {
                    filter.value = `total_schools_with_missing_data`;
                }
                dataSet = data;
            } else {
                if (filter.selected == 'G' || filter.selected == 'GS') {
                    dataSet = data.Subjects;
                } else {
                    dataSet = data.Details;
                }
            }
        }
        if (filter.report == 'exception') {
            keys = keys.sort(function (a: any, b: any) { return (a - b) });
        }
        for (let i = 0; i < keys.length; i++) {
            let val = filter.value ? filter.value : filter;
            if (parseFloat(dataSet[val]) == parseFloat(keys[i])) {
                setColor = colors[keys[i]];
                break;
            }
        }
        return setColor;
    }

    getRelativeColors(markers, filter) {
        var values = [];
        markers.map(item => {
            if (!filter.report) {
                if (filter == 'infrastructure_score' || filter == 'Infrastructure_Score') {
                    values.push(item.details[`${filter}`]);
                } else {
                    if (item.metrics) {
                        values.push(item.metrics[`${filter}`]);
                    } else {
                        values.push(item.indices[`${filter}`]);
                    }
                }
            } else {
                if (!filter.selected) {
                    var keys = Object.keys(item);
                    if (keys.includes(filter.value)) {
                        values.push(item[`${filter.value}`]);
                    } else {
                        values.push(item[`total_schools_with_missing_data`]);
                    }
                } else {
                    if (filter.selected == 'G' || filter.selected == 'GS') {
                        values.push(item.Subjects[`${filter.value}`]);
                    } else {
                        values.push(item.Details[`${filter.value}`]);
                    }
                }

            }
        });
        let uniqueItems = [...new Set(values)];
        uniqueItems = uniqueItems.sort(function (a, b) { return filter.report != 'exception' ? parseFloat(a) - parseFloat(b) : parseFloat(b) - parseFloat(a) });
        var colorsArr = uniqueItems.length == 1 ? (filter.report != 'exception' ? ['#00FF00'] : ['red']) : this.exceptionColor().generateGradient('#FF0000', '#00FF00', uniqueItems.length, 'rgb');
        var colors = {};
        uniqueItems.map((a, i) => {
            colors[`${a}`] = colorsArr[i]
        });
        return colors;
    }


    //capturing telemetry.....
    telemetry(date) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/telemetry`, { telemetryData: this.telemetryData, date: date });
    }

    getTelemetry(data) {
        this.logoutOnTokenExpire();
        return this.http.post(`${this.baseUrl}/telemetry/data`, { period: data });
    }

    //data-source::::::::::::
    getDataSource() {
        this.logoutOnTokenExpire();
        return this.http.get(`${this.baseUrl}/dataSource`, {});
    }


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

    public colors = {
        2: 'red',
        4: '#ff0000',
        6: '#fc0500',
        8: '#fa0a00',
        10: '#f71000',
        12: '#f51500',
        14: '#f21a00',
        16: '#ef1f00',
        18: '#ed2400',
        20: '#ea2a00',
        22: '#e72f00',
        24: '#e53400',
        26: '#e23900',
        28: '#e03e00',
        30: '#dd4400',
        32: '#da4900',
        34: '#d84e00',
        36: '#d55300',
        38: '#d35800',
        40: '#d05e00',
        42: '#cd6300',
        44: '#cb6800',
        46: '#c86d00',
        48: '#c67200',
        50: '#c37800',
        52: '#c07d00',
        54: '#be8200',
        56: '#bb8700',
        58: '#b88d00',
        60: '#b69200',
        62: '#b39700',
        64: '#b19c00',
        66: '#aea100',
        68: '#aba700',
        70: '#a9ac00',
        72: '#a6b100',
        74: '#a4b600',
        76: '#a1bb00',
        78: '#9ec100',
        80: '#9cc600',
        82: '#99cb00',
        84: '#97d000',
        86: '#94d500',
        88: '#91db00',
        90: '#8fe000',
        92: '#8ce500',
        94: '#89ea00',
        96: '#87ef00',
        98: '#84f500',
        100: '#00FF00',
    }
    //color gredient generation....
    public exceptionColor() {
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
}
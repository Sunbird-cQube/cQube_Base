import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppServiceComponent } from '../app.service';


@Injectable({
  providedIn: 'root'
})
export class ExceptionReportService {
  public map;
  public baseUrl;
  public token;

  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, public service: AppServiceComponent) {
    this.baseUrl = service.baseUrl;
  }

  //Semester Completion
  semCompletionDist(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompDist/allDistrictWise`, data);
  }

  semCompletionBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompBlock/allBlockWise`, data);
  }
  semCompletionCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompCluster/allClusterWise`, data);
  }
  semCompletionSchool(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompSchool/allSchoolWise`, data);
  }
  semCompletionBlockPerDist(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompBlock/blockWise/${distId}`, data);
  }
  semCompletionClusterPerBlock(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompCluster/clusterWise/${distId}/${blockId}`, data);
  }
  semCompletionSchoolPerClustter(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/semCompSchool/schoolWise/${distId}/${blockId}/${clusterId}`, data);
  }

  //missing school data api
  school_invalid() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/school_invalid/school_invalid_data`);
  }


  semExceptionMetaData() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sem/metadata`, {});
  }

  patExceptionDistWise(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/allDistrictWise`, data);
  }

  patExceptionBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/allBlockWise`, data);
  }
  patExceptionCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/allClusterWise`, data);
  }
  patExceptionSchool(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/allSchoolWise`, data);
  }

  patExceptionBlockPerDist(distId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/blockWise/${distId}`, data);
  }
  patExceptionClusterPerBlock(distId, blockId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/clusterWise/${distId}/${blockId}`, data);
  }
  patExceptionSchoolPerClustter(distId, blockId, clusterId, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/patExcetpion/schoolWise/${distId}/${blockId}/${clusterId}`, data);
  }

  //sarException report
  dist_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/distWise`, data);
  }

  block_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/blockWise`, data);
  }

  cluster_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/clusterWise`, data);
  }

  school_wise_data(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/schoolWise`, data);
  }


  blockPerDist(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/blockPerDist`, data);
  }

  clusterPerBlock(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/clusterPerBlock`, data);
  }

  schoolsPerCluster(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/schoolPerCluster`, data);
  }

  getDateRange(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/sarException/getDateRange`, data);
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class S3DownloadsService {
  public baseUrl = environment.apiEndpoint;
  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, private service: AppService) { }

  //s3 downloads
  listBuckets() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/s3Download/listBuckets`, {});
  }

  listFiles(bucketName) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/s3Download/listFiles/${bucketName}`, {});
  }

  downloadFile(fileName, bucketName) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/s3Download/getDownloadUrl/`, { fileName: fileName, bucketName: bucketName });
  }
}

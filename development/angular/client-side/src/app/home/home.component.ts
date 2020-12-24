import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { AppServiceComponent } from '../app.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  edate: Date;

  constructor(public http: HttpClient, public service: AppServiceComponent, public keyCloakService: KeycloakSecurityService) { }
  email: any;
  role: any;
  showSubmenu1: any = false;
  showSubmenu2: any = false;
  showSubmenu3: any = false;
  showSubmenu4: any = false;
  showSubmenu5: any = false;
  showSubmenu6: any = false;
  showSubmenu7: any = false;
  showSubmenu8: any = false;
  showSubmenu9: any = false;
  showsideMenu: boolean = false;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showUser: boolean = true;
  currentURL;
  public userType = localStorage.getItem('roleName') === "admin";
  public roleName;

  // diksha columns
  diksha_column = 'diksha_columns' in environment ? environment['diksha_columns'] : true

  //for coming soon page
  nifi_crc;
  nifi_attendance;
  nifi_semester;
  nifi_infra;
  nifi_diksha;
  nifi_telemetry;
  nifi_udise;
  nifi_pat;
  nifi_composite;


  ngOnInit() {
    this.changeDataSourceStatus();
    this.email = localStorage.getItem('userName');
    this.role = localStorage.getItem('roleName');
    if (this.role == "admin") {
      this.showsideMenu = false;
      this.showUser = false;
    } else {
      this.showUser = true;
    }

  }

  changeDataSourceStatus() {
    this.service.getDataSource().subscribe((res: any) => {
      res.forEach(element => {
        if (element.template == 'nifi_crc') {
          this.nifi_crc = element.status;
        }
        if (element.template == 'nifi_attendance') {
          this.nifi_attendance = element.status;
        }
        if (element.template == 'nifi_semester') {
          this.nifi_semester = element.status;
        }
        if (element.template == 'nifi_infra') {
          this.nifi_infra = element.status;
        }
        if (element.template == 'nifi_diksha') {
          this.nifi_diksha = element.status;
        }
        if (element.template == 'nifi_telemetry') {
          this.nifi_telemetry = element.status;
        }
        if (element.template == 'nifi_udise') {
          this.nifi_udise = element.status;
        }
        if (element.template == 'nifi_pat') {
          this.nifi_pat = element.status;
        }
        if (element.template === 'nifi_composite') {
          this.nifi_composite = element.status;
        }
      });
    })
  }

  logout() {
    localStorage.clear();
    this.clearSessionStorage();
    let options = {
      redirectUri: environment.appUrl
    }
    this.keyCloakService.kc.logout(options);
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  fetchTelemetry(event, report) {
    this.service.getTelemetryData(report, event.type);
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }
}
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
  showBack = true;
  showHome = true;
  constructor( public http: HttpClient, public service: AppServiceComponent, public keyCloakService: KeycloakSecurityService) { }
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
  showsideMenu: boolean = false;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showUser: boolean = true;
  currentURL;
  public userType = localStorage.getItem('roleName') === "admin";
  public roleName;
  ngOnInit() {
    console.log(window.location.href);
    if (window.location.hash == '#/dashboard') {
      this.showBack = true;
      this.showHome = false;
    } else {
      this.showBack = false;
      this.showHome = true;
    }
    this.email = localStorage.getItem('userName');
    this.role = localStorage.getItem('roleName');
    if (this.role == "admin") {
      this.showsideMenu = false;
      this.showUser = false;
    } else {
      this.showUser = true;
    }

  }


  logout() {
    localStorage.clear();
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
}
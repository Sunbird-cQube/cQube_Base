import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { AppServiceComponent } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, public http: HttpClient, public service: AppServiceComponent, public keyCloakService: KeycloakSecurityService) { }
  email: any;
  role: any;
  showSubmenu1: any = false;
  showsideMenu: boolean = false;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showUser: boolean = true;
  currentURL;
  public userType = localStorage.getItem('roleName') === "admin";

  ngOnInit() {
    this.email = localStorage.getItem('email');
    this.role = localStorage.getItem('role');
    if (this.role == 1) {
      this.showsideMenu = false;
      this.showUser = false;
    }
    if (this.role == 3) {
      this.showsideMenu = false;
    }
  }


  logout() {
    localStorage.clear();
    this.keyCloakService.kc.logout();
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

  sendTelemetry() {
    this.service.telemetry().subscribe(res => {
      console.log(res);
    })
  }


}

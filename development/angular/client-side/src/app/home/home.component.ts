import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { KeycloakSecurityService } from '../keycloak-security.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, public http: HttpClient, public keyCloakService: KeycloakSecurityService) { }
  email: any;
  role: any;
  showSubmenu1: any = false;
  showSubmenu2: any = false;
  showsideMenu: boolean = false;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showUser: boolean = true;
  currentURL;
  public userType = localStorage.getItem('roleName') === "admin";

  ngOnInit() {
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


}

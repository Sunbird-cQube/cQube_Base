import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { environment } from '../../environments/environment'
import { KeycloakSecurityService } from '../keycloak-security.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public grafanaUrl = environment.grafanaEndPoint;

  constructor(private router: Router, private service: AppService, public keyCloakService: KeycloakSecurityService) { }
  email: any;
  role: any;
  showSubmenu1: any = false;
  showsideMenu: boolean = false;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showLogs: boolean = true;

  navItems: any = [
    {
      name: 'All Logs',
      children: []
    },
  ];

  logNames: any = [];

  ngOnInit() {
    this.email = localStorage.getItem('email');
    this.role = localStorage.getItem('role');
    if (this.role == 1) {
      this.showsideMenu = false;
      this.showLogs = true;
    }
    this.service.getLogMenu().subscribe((res: any) => {
      this.navItems[0].children = res;
      this.navItems[0].children.forEach(element => {
        element.children.forEach(item => {
          item['route'] = "all-logs";
        });
      });
    })
  }
  logout() {
    localStorage.clear();
    window.location.replace("http://172.31.23.205:4200");
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

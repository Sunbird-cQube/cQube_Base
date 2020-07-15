import { Component, OnInit } from '@angular/core';
import { KeycloakSecurityService } from '../keycloak-security.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  // userRole: boolean;
  constructor(public keycloakService: KeycloakSecurityService) { }

  ngOnInit(): void {
  //  this.userRole =  (localStorage.getItem('roleName') == "admin");
  }

  logout() {
    localStorage.clear();
    this.keycloakService.kc.logout();
  }

}

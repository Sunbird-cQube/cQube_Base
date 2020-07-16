import { Component, OnInit } from '@angular/core';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  adminUrl;
  constructor(public keycloakService: KeycloakSecurityService) { }

  ngOnInit(): void {
    this.adminUrl = environment.adminUrl;
  }

  logout() {
    localStorage.clear();
    this.keycloakService.kc.logout();
  }

}

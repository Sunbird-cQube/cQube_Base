import { Component, OnInit } from '@angular/core';
import { KeycloakSecurityService } from './keycloak-security.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "";

  constructor(public keycloakService: KeycloakSecurityService, public router: Router) {
    if (this.keycloakService.kc.tokenParsed.realm_access) {
      if (!this.keycloakService.kc.tokenParsed.realm_access.roles.includes('admin')) {
        localStorage.setItem('roleName', 'admin');
        alert("Only admin has access to admin console");
        let options = {
          redirectUri: environment.appUrl
        }
        window.location.href = environment.appUrl;
      }
    }

  }

  ngOnInit() {

  }
}
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { KeycloakInstance } from 'keycloak-js';
declare var Keycloak: any;
@Injectable({
  providedIn: 'root'
})
export class KeycloakSecurityService {
  public kc: KeycloakInstance;
  constructor(public router: Router) {

  }
  async init() {
    this.kc = new Keycloak({
      url: "http://localhost:8080/auth",
      realm: "cQube",
      clientId: "cQube_Admin"
    });
    await this.kc.init({
      onLoad: 'login-required'
    });
    localStorage.setItem('email', this.kc.tokenParsed['email']);
  }
}

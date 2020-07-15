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
      url: "http://172.31.23.205:8080/auth",
      realm: "cQube",
      clientId: "cQube_Application",
      credentials: { secret: 'c45d54f7-b0aa-43c9-a6bb-9b77a47c73a2' }
    });
    await this.kc.init({
      onLoad: 'login-required'
    });

    localStorage.setItem('email', this.kc.tokenParsed['email']);
  }
}

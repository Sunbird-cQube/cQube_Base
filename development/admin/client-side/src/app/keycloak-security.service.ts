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
      clientId: "cQube_Admin",
      credentials: { secret: '12522d38-9ec0-4e9d-a740-c19bc96bc1a9' }
    });
    await this.kc.init({
      onLoad: 'login-required'
    });
    localStorage.setItem('email', this.kc.tokenParsed['email']);
  }
}

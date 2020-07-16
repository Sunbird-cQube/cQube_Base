import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { KeycloakInstance } from 'keycloak-js';
import { environment } from '../../src/environments/environment';
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
      url: environment.keycloakUrl,
      realm: environment.realm,
      clientId: environment.clientId,
      credentials: environment.credentials
    });
    await this.kc.init({
      onLoad: 'login-required'
    });
    localStorage.setItem('email', this.kc.tokenParsed['email']);
  }
}

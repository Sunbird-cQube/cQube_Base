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
      // credentials: environment.credentials
      enableBearerInterceptor: true,
    });
    await this.kc.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
    });

    localStorage.setItem('user_id', this.kc.tokenParsed.sub);
    localStorage.setItem('userName', this.kc.tokenParsed['preferred_username']);
  }
}

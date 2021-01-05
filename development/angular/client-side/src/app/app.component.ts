import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeycloakSecurityService } from './keycloak-security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(public keyclockService: KeycloakSecurityService, public router: Router) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    sessionStorage.clear();
  }

}
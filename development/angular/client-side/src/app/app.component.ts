import { Component, OnInit } from '@angular/core';
import { KeycloakSecurityService } from './keycloak-security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public securityService: KeycloakSecurityService) {

  }
  ngOnInit() {

  }
}
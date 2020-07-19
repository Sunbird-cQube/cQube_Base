import { Component, OnInit } from '@angular/core';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  adminUrl;
  constructor(public keycloakService: KeycloakSecurityService, public router: Router) { }

  ngOnInit(): void {
    this.adminUrl = environment.adminUrl;
    if (localStorage.getItem('roleName') != 'admin') {
      this.router.navigate(['/home']);
    }
  }

  logout() {
    localStorage.clear();
    this.keycloakService.kc.logout();
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { KeycloakSecurityService } from '../keycloak-security.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AppServiceComponent } from '../app.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomePageComponent implements OnInit {
  adminUrl;
  constructor(public keycloakService: KeycloakSecurityService, public router: Router, public service: AppServiceComponent) {
    // service.logoutOnTokenExpire();
  }

  ngOnInit(): void {
    this.adminUrl = environment.adminUrl;
    if (localStorage.getItem('roleName') != 'admin') {
      this.router.navigate(['/home']);
    }
    if (this.keycloakService.kc.tokenParsed.realm_access) {
      if (this.keycloakService.kc.tokenParsed.realm_access.roles.includes('admin')) {
        localStorage.setItem('roleName', 'admin');
        this.router.navigate(['/home']);
      } else if (this.keycloakService.kc.tokenParsed.realm_access.roles.includes('report_viewer')) {
        localStorage.setItem('roleName', 'report_viewer');
        this.router.navigate(['/dashboard']);
      } else {
        if (!this.keycloakService.kc.tokenParsed.realm_access.roles.includes('report_viewer')
          || !this.keycloakService.kc.tokenParsed.realm_access.roles.includes('admin')) {
          alert("Unauthorised user, Only admin and viewer can login")
          let options = {
            redirectUri: environment.appUrl
          }
          this.keycloakService.kc.logout(options);
        }
      }
    } else {
      alert("Please assign role to user");
      let options = {
        redirectUri: environment.appUrl
      }
      this.keycloakService.kc.logout(options);
    }
  }
  logout() {
    localStorage.clear();
    let options = {
      redirectUri: environment.appUrl
    }
    this.keycloakService.kc.logout(options);
  }

}

import { Component, OnInit } from '@angular/core';
import { KeycloakSecurityService } from './keycloak-security.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public keyclockService: KeycloakSecurityService, public router: Router) { };

  ngOnInit() {
    if (this.keyclockService.kc.tokenParsed.realm_access) {
      if (this.keyclockService.kc.tokenParsed.realm_access.roles.length > 1) {
        alert("One user can not be assigned multiple roles");
        this.keyclockService.kc.logout();
      } else {
        this.keyclockService.kc.tokenParsed.realm_access.roles.forEach(role => {
          if (role == "admin") {
            localStorage.setItem('roleName', role);
            this.router.navigate(['/homePage']);
          } else if (role == "report_viewer") {
            localStorage.setItem('roleName', role);
            this.router.navigate(['home']);
          } else {
            alert("Unauthorized user");
            this.keyclockService.kc.logout();
          }
        });
      }
    } else {
      alert("Please assign role to user");
      this.keyclockService.kc.logout();
    }
  }

}
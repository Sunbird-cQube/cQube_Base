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
    if (this.keycloakService.kc.tokenParsed.realm_access) {
      if (this.keycloakService.kc.tokenParsed.realm_access.roles.length > 1) {
        alert("One user can not be assigned multiple roles");
        this.keycloakService.kc.logout();
      } else {
        this.keycloakService.kc.tokenParsed.realm_access.roles.forEach(role => {
          if (role == "admin") {
            localStorage.setItem('roleName', role);
            this.router.navigate(['/homePage']);
          } else if (role == "report_viewer") {
            localStorage.setItem('roleName', role);
            this.router.navigate(['home']);
          } else {
            alert("Unauthorized user");
            this.keycloakService.kc.logout();
          }
        });
      }
    } else {
      alert("Please assign role to user");
      this.keycloakService.kc.logout();
    }
  }

  logout() {
    localStorage.clear();
    this.keycloakService.kc.logout();
  }

}

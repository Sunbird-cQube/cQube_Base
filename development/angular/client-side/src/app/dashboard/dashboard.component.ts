import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AppServiceComponent } from '../app.service';
import { KeycloakSecurityService } from '../keycloak-security.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  hiddenPass = false;
  edate: Date;
  sarViews;

  constructor(private router: Router, private service: AppServiceComponent, public keyCloakService: KeycloakSecurityService) {
    service.logoutOnTokenExpire();
  }
  ngOnInit() {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('backBtn').style.display = "block";
    document.getElementById('homeBtn').style.display = "None";
    if (localStorage.getItem('roleName') == "admin") {
      this.hiddenPass = false;
    } else {
      this.hiddenPass = true;
    }
    this.getViews24hrs();
    setTimeout(() => {
      this.getViews24hrs();
      setInterval(() => {
        this.getViews24hrs();
      }, 15000);
    }, 45000);
    setTimeout(() => {
      this.getViews7days();
      setInterval(() => {
        this.getViews7days();
      }, 30000);
    }, 15000);
    setTimeout(() => {
      this.getViews30days();
      setInterval(() => {
        this.getViews30days();
      }, 45000);
    }, 30000);
  }

  fetchTelemetry(event, report) {
    this.service.getTelemetryData(report, event.type);
  }

  getViews24hrs() {
    this.service.getTelemetry().subscribe(res => {
      console.log(res);
      this.sarViews = res['objArr'][0].views + " (" + res['objArr'][0].period + ")";
    })
  }

  getViews7days() {
    this.service.getTelemetry().subscribe(res => {
      console.log(res);
      this.sarViews = res['objArr'][1].views + " (" + res['objArr'][1].period + ")";
    })
  }

  getViews30days() {
    this.service.getTelemetry().subscribe(res => {
      console.log(res);
      this.sarViews = res['objArr'][2].views + " (" + res['objArr'][2].period + ")";
    })
  }



}

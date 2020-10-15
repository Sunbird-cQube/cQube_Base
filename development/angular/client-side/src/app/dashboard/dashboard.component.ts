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
  telemetryData = [];
  timePeriod;

  imrViews;
  crViews;
  udiseViews;
  compositeViews;
  dscViews;
  dccViews;
  dtrViews;
  crcrViews;
  srViews;
  patViews;
  semExpViews;
  isdataViews;
  sarViews;
  tarViews;
  telemDataViews;

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
    this.callOnInterval();
    setInterval(() => {
      this.callOnInterval();
    }, 30000);
  }

  callOnInterval() {
    this.getViews24hrs();
    setTimeout(() => {
      this.getViews7days();
    }, 10000);
    setTimeout(() => {
      this.getViews30days();
    }, 20000);
  }

  fetchTelemetry(event, report) {
    this.service.getTelemetryData(report, event.type);
  }

  getViews24hrs() {
    this.service.getTelemetry('last_day').subscribe(res => {
      this.telemetryData = res['telemetryData'];
      this.assignViews(this.telemetryData);
    })
  }

  getViews7days() {
    this.service.getTelemetry('last_7_days').subscribe(res => {
      this.telemetryData = res['telemetryData'];
      this.assignViews(this.telemetryData);
    })
  }

  getViews30days() {
    this.service.getTelemetry('last_30_days').subscribe(res => {
      this.telemetryData = res['telemetryData'];
      this.assignViews(this.telemetryData);
    })
  }

  assignViews(views) {
    this.imrViews = "";
    this.crViews = "";
    this.udiseViews = "";
    this.compositeViews = "";
    this.dscViews = "";
    this.dccViews = "";
    this.dtrViews = "";
    this.crcrViews = "";
    this.srViews = "";
    this.patViews = "";
    this.semExpViews = "";
    this.isdataViews = "";
    this.sarViews = "";
    this.tarViews = "";
    this.telemDataViews = "";


    var myStr = this.removeUnderscore(views[0].time_range);
    this.timePeriod = " (" + myStr + ")";

    views.forEach(element => {
      let timeStr = this.removeUnderscore(element.time_range);
      if (element.reportid == 'imr') {
        this.imrViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'cr') {
        this.crViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'udise') {
        this.udiseViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'composite') {
        this.compositeViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'dsc') {
        this.dscViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'dcc') {
        this.dccViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'dtr') {
        this.dtrViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'crcr') {
        this.crcrViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'sr') {
        this.srViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'pat') {
        this.patViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'SemExp') {
        this.semExpViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'isdata') {
        this.isdataViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'sar') {
        this.sarViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'tar') {
        this.tarViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'telemData') {
        this.telemDataViews = element.number_of_views + " (" + timeStr + ")";
      }
    });
  }

  removeUnderscore(data) {
    var mydata = data.replace(/_/g, ' ');
    var myStr = mydata.charAt(0).toUpperCase() + mydata.substr(1).toLowerCase();
    return myStr;
  }


}

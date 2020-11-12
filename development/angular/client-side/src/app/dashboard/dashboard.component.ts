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
  //tooltip texts::::::::::::::
  imrTooltip = "The School Infrastructure dashboard visualises the data on school infrastructure metrics for Gujarat based on the data collected through UDISE 2020.";
  crTooltip = "The dashboard here provides insights on selected infrastructure metrics calculated using the UDISE data. A key feature of this dashboard is its ability to Zoom In and Out at various administrative levels. The administrative levels include District, Block and Cluster. This has been done to provide relevant insights at the appropriate administrative level. In addition to visualising data, the dashboard also gives you the ability to download the data at various administrative levels. This feature has been enabled to provide freedom to power users to derive additional insights that may not be captured in this dashboard. You can download the data using the dropdown option on the top right corner.";
  udiseTooltip = "The dashboard visualises data on various indices calculated using the metrics captured in the UDISE 2019 for Gujarat. Each of the indices has been derived using multiple metrics that have been normalised and benchmarked for a fair comparison. The data here can be broken at multiple administrative levels (i.e. District, Block, Cluster and School) and you can view and download the data for any of the available indices.";
  compositeTooltip = "Composite report is the combination of multiple existing reports and creating the scatter plot visualisation based on the metrics derived for individual reports.";
  dscTooltip = "Report Description";
  dccTooltip = "Report Description";
  utTooltip = "Report Description";
  dtrTooltip = "Report Description";
  utcTooltip = "Report Description";
  crcrTooltip = "The dashboard here provides insights using the CRC App data. We have derived several normalised metrics using the raw data and you can read more about them using the following link. A key feature of this dashboard is its ability to Zoom In and Out at various administrative levels. The administrative levels include District, Block and Cluster. This has been done to provide relevant insights at the appropriate administrative level. In addition to visualising data, the dashboard also gives you the ability to download the data at various administrative levels. This feature has been enabled to provide freedom to power users to derive additional insights that may not be captured in this dashboard. You can download the data using the dropdown option on the top right corner.";
  srTooltip = "This dashboard provides information about student's performance in the semester exams across all subjects and grades. The data has been collated at various administrative levels (i.e. District, Block, Cluster and School) and this dashboard allows you to view and download the data at these various administrative levels.";
  patTooltip = "This dashboard provides information about student's performance in the Periodic Assessment Test across all subjects and grades. The data has been collated at various administrative levels (i.e. District, Block, Cluster and School) and this dashboard allows you to view and download the data at these various administrative levels.";
  semExpTooltip = "This dashboard provides information about those schools whose data is missing from the Semester Exam results. The data has been collated at various administrative levels (i.e. District, Block, Cluster and School) and this dashboard allows you to view and download the data at these various administrative levels.";
  isdataTooltip = "Report Description";
  sarTooltip = "This dashboard provides information about student attendance calculated at a monthly level. The data has been collated at various administrative levels (i.e. District, Block, Cluster and School) and this dashboard allows you to view and download the data at these various administrative levels. You can select a different month/year combination to view student attendance for any other time period.";
  tarTooltip = "Report Description";
  telemDataTooltip = "Report Description";
  heatChartTooltip = "Report Description";
  lotableTooltip = "Report Description";
  tpdtpTooltip = "Report Description";
  tpdcpTooltip = "Report Description";

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
  utViews;
  dtrViews;
  utcViews;
  crcrViews;
  srViews;
  patViews;
  semExpViews;
  isdataViews;
  sarViews;
  tarViews;
  telemDataViews;
  heatChartViews;
  lotableViews;
  tpdtpViews;
  tpdcpViews;

  constructor(private router: Router, private service: AppServiceComponent, public keyCloakService: KeycloakSecurityService) {
    service.logoutOnTokenExpire();
  }
  ngOnInit() {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('homeBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'block';
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
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.service.homeControl();
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
    this.utViews = "";
    this.dtrViews = "";
    this.utcViews = "";
    this.crcrViews = "";
    this.srViews = "";
    this.patViews = "";
    this.semExpViews = "";
    this.isdataViews = "";
    this.sarViews = "";
    this.tarViews = "";
    this.telemDataViews = "";
    this.heatChartViews = "";
    this.lotableViews = "";
    this.tpdcpViews = "";
    this.tpdtpViews = "";

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
      if (element.reportid == 'ut') {
        this.utViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'dtr') {
        this.dtrViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'utc') {
        this.utcViews = element.number_of_views + " (" + timeStr + ")";
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
      if (element.reportid == 'heatChart') {
        this.heatChartViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'lotable') {
        this.lotableViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'tpd-cp') {
        this.tpdcpViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'tpd-tp') {
        this.tpdtpViews = element.number_of_views + " (" + timeStr + ")";
      }

    });
  }

  removeUnderscore(data) {
    var mydata = data.replace(/_/g, ' ');
    var myStr = mydata.charAt(0).toUpperCase() + mydata.substr(1).toLowerCase();
    return myStr;
  }


}

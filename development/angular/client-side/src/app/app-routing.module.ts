import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './reports/users/change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { StudengtAttendanceComponent } from './reports/attendance/student-attendance/student-attendance.component';
import { TeacherAttendanceComponent } from './reports/attendance/teacher-attendance/teacher-attendance.component';
import { SemViewComponent } from './reports/student-performance/sem-view/sem-view.component';
import { SchoolInfrastructureComponent } from './reports/school-infra/school-infrastructure/school-infrastructure.component';
import { CrcReportComponent } from './reports/school-monitoring/crc-report/crc-report.component';
import { InfraMapVisualisationComponent } from './reports/school-infra/infra-map-visualisation/infra-map-visualisation.component';
import { DikshaChartComponent } from './reports/diksha/diksha-chart/diksha-chart.component';
import { DikshaTableComponent } from './reports/diksha/diksha-table/diksha-table.component';
import { DikshaBarChartComponent } from './reports/diksha/diksha-bar-chart/diksha-bar-chart.component';
import { SemesterExceptionComponent } from './reports/exception-list/semester-exception/semester-exception.component';
import { TelemetryDataComponent } from './reports/telemetry/telemetry-data/telemetry-data.component';
import { MissingDataComponent } from './reports/exception-list/missing-data/missing-data.component';
import { UdiseReportComponent } from './reports/UDISE/udise-report/udise-report.component';

const routes: Routes = [
  {
    path: '', redirectTo: `/homePage`, pathMatch: 'full'
  },
  {
    path: 'homePage', component: HomePageComponent,
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      {
        path: '', component: DashboardComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'attendance-report', component: StudengtAttendanceComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'teacher-attendance', component: TeacherAttendanceComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'semester-report', component: SemViewComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'school-infrastructure', component: SchoolInfrastructureComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'crc-report', component: CrcReportComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'changePassword', component: ChangePasswordComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'school-infra-map', component: InfraMapVisualisationComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'diksha-chart', component: DikshaChartComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'diksha-table', component: DikshaTableComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'diksha-column-chart', component: DikshaBarChartComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'sem-exception', component: SemesterExceptionComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'telemetry', component: TelemetryDataComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'download-missing-data', component: MissingDataComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'udise-report', component: UdiseReportComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
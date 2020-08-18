import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserViewComponent } from './user-view/user-view.component';
import { StudengtAttendanceComponent } from './student-attendance/student-attendance.component';
import { HomeComponent } from './home/home.component';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { SemViewComponent } from './sem-view/sem-view.component';
import { CrcReportComponent } from './crc-report/crc-report.component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SchoolInfrastructureComponent } from './school-infrastructure/school-infrastructure.component';
import { InfraMapVisualisationComponent } from './infra-map-visualisation/infra-map-visualisation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DikshaChartComponent } from './diksha-chart/diksha-chart.component';
import { DikshaTableComponent } from './diksha-table/diksha-table.component';
import { SemesterExceptionComponent } from './semester-exception/semester-exception.component';
import { TelemetryDataComponent } from './telemetry-data/telemetry-data.component';
import { DikshaBarChartComponent } from './diksha-bar-chart/diksha-bar-chart.component';
import { MissingDataComponent } from './missing-data/missing-data.component';

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
      }
    ]
  }
  ,
  {
    path: 'user-view', component: UserViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
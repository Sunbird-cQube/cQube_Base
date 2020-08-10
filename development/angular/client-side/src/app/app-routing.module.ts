import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserViewComponent } from './user-view/user-view.component';
<<<<<<< HEAD
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
<<<<<<< HEAD
=======
import { MapViewComponent } from './map-view/map-view.component';
import { ChartViewComponent } from './chart-view/chart-view.component';

>>>>>>> upstream/cQube-release-0.12
=======
import { DikshaChartComponent } from './diksha-chart/diksha-chart.component';
import { DikshaTableComponent } from './diksha-table/diksha-table.component';
import { SemesterExceptionComponent } from './semester-exception/semester-exception.component';
>>>>>>> upstream/cQube-release-new

const routes: Routes = [
  {
    path: '', redirectTo: `/homePage`, pathMatch: 'full'
  },
  {
    path: 'homePage', component: HomePageComponent,
  },
  {
<<<<<<< HEAD
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
        path: 'sem-exception', component: SemesterExceptionComponent, canActivateChild: [AuthGuard]
      }
    ]
=======
    path: 'chart-view', component: ChartViewComponent
>>>>>>> upstream/cQube-release-0.12
  }
  ,
  {
    path: 'user-view', component: UserViewComponent
<<<<<<< HEAD
  },
<<<<<<< HEAD
=======
  {
    path:'map-view',component:MapViewComponent
  }
>>>>>>> upstream/cQube-release-0.12
=======
  }
>>>>>>> upstream/cQube-release-new
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
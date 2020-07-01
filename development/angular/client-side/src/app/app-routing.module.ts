import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
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

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
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
      }
    ]
  }
  ,
  {
    path: 'user-view', component: UserViewComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
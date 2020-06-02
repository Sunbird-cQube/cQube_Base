import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserViewComponent } from './user-view/user-view.component';
import { MapViewComponent } from './map-view/map-view.component';
import { HomeComponent } from './home/home.component';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { SemViewComponent } from './sem-view/sem-view.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchoolInfrastructureComponent } from './school-infrastructure/school-infrastructure.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      // {
      //   path: 'dashboard', component: DashboardComponent, canActivateChild: [AuthGuard]
      // },
      {
        path: 'attendance-report', component: MapViewComponent, canActivateChild: [AuthGuard]
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
        path: 'crc-report', component: BarChartComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'changePassword', component: ChangePasswordComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'addUser', component: CreateUserComponent, canActivateChild: [AuthGuard]
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
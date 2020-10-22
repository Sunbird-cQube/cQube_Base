import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { InfrastructureModule } from './reports/school-infra/infrastructure.module'

const routes: Routes = [
  {
    path: '', redirectTo: `home`, pathMatch: 'full'
  },
  {
    path: 'home', component: HomePageComponent
  },
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      {
        path: 'dashboard', component: DashboardComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'diksha', loadChildren: './reports/diksha/diksha.module#DikshaModule'
      },
      {
        path: 'attendance', loadChildren: './reports/attendance/attendance.module#AttendancModule'
      },
      {
        path: 'exception', loadChildren: './reports/exception-list/exception.module#ExceptionModule'
      },
      {
        path: 'infrastructure', loadChildren: './reports/school-infra/infrastructure.module#InfrastructureModule'
      },
      {
        path: 'student-performance', loadChildren: './reports/student-performance/student-performance.module#StudentPerformanceModule'
      }
    ]
  }
  // ,
  // {
  //   path: 'infrastructure', loadChildren: './reports/school-infra/infrastructure.module#InfrastructureModule'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
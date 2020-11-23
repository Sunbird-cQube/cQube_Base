import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ComingSoonComponent } from './common/coming-soon/coming-soon.component';

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
        path: 'coming-soon', component: ComingSoonComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'diksha', loadChildren: () => import('./reports/diksha/diksha.module').then(m => m.DikshaModule)
      },
      {
        path: 'attendance', loadChildren: () => import('./reports/attendance/attendance.module').then(m => m.AttendancModule)
      },
      {
        path: 'exception', loadChildren: () => import('./reports/exception-list/exception.module').then(m => m.ExceptionModule)
      },
      {
        path: 'infrastructure', loadChildren: () => import('./reports/school-infra/infrastructure.module').then(m => m.InfrastructureModule)
      },
      {
        path: 'student-performance', loadChildren: () => import('./reports/student-performance/student-performance.module').then(m => m.StudentPerformanceModule)
      },
      {
        path: '', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
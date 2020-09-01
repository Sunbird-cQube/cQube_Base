import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AllLogsComponent } from './components/allLogs/allLogs.component';
import { UsersComponent } from './components/users/users.component';
import { S3FilesDownloadComponent } from './components/s3-files-download/s3-files-download.component';
import { SummaryStatistictsComponent } from './components/summary-statisticts/summary-statisticts.component';
import { NifiShedularComponent } from './components/nifi-shedular/nifi-shedular.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent, children: [
      {
        path: '', component: DashboardComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'create-user', component: CreateUserComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'change-password', component: ChangePasswordComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'all-logs', component: AllLogsComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'users', component: UsersComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 's3FileDownload', component: S3FilesDownloadComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'summary-statistics', component: SummaryStatistictsComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'nifi-shedular', component: NifiShedularComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AllLogsComponent } from './allLogs/allLogs.component';
import { UsersComponent } from './users/users.component';
import { S3FilesDownloadComponent } from './s3-files-download/s3-files-download.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SummaryStatistictsComponent } from './summary-statisticts/summary-statisticts.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent, children: [
      {
        path: '', component: DashboardComponent, canActivateChild: [AuthGuard]
      },
      // {
      //   path: 'create-user', component: CreateUserComponent, canActivateChild: [AuthGuard]
      // },
      // {
      //   path: 'change-password', component: ChangePasswordComponent, canActivateChild: [AuthGuard]
      // },
      {
        path: 'all-logs', component: AllLogsComponent, canActivateChild: [AuthGuard]
      },
      // {
      //   path: 'users', component: UsersComponent, canActivateChild: [AuthGuard]
      // },
      {
        path: 's3FileDownload', component: S3FilesDownloadComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'summary-statistics', component: SummaryStatistictsComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

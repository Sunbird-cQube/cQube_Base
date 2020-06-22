import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AllLogsComponent } from './allLogs/allLogs.component';
import { NodeLogsComponent } from './node-logs/node-logs.component';

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
        path: 'create-user', component: CreateUserComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'change-password', component: ChangePasswordComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'all-logs', component: AllLogsComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'node-logs', component: NodeLogsComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

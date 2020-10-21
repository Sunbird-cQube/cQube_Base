import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: `/home`, pathMatch: 'full'
  },
  {
    path: 'home', component: HomePageComponent,
  },
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      {
        path: 'dashboard', component: DashboardComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
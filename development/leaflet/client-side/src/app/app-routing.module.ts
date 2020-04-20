import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserViewComponent } from './user-view/user-view.component';
import { MapViewComponent } from './map-view/map-view.component';
import { ChartViewComponent } from './chart-view/chart-view.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'chart-view', component: ChartViewComponent
  }
  ,
  {
    path: 'user-view', component: UserViewComponent
  },
  {
    path:'map-view',component:MapViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

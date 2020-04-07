import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentAttedenceComponent } from './student-attedence/student-attedence.component';
import { LoginComponent } from './login/login.component';
import { UserViewComponent } from './user-view/user-view.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'admin-view', component: StudentAttedenceComponent
  }
  ,
  {
    path: 'user-view', component: UserViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

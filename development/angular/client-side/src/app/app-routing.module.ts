import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentAttedenceComponent } from './student-attedence/student-attedence.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  // {
  //   path: '', component: LoginComponent
  // },
  {
    path: '', component: StudentAttedenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

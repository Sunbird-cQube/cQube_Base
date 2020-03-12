import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { C3StudentPerformanceComponent } from './c3-student-performance/c3-student-performance.component';
import { C3StudentAttendanceComponent } from './c3-student-attendance/c3-student-attendance.component';

const routes: Routes = [

  {
    path: '', component: C3StudentAttendanceComponent,
  },
  {
    path: 'stdPerformance', component: C3StudentPerformanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

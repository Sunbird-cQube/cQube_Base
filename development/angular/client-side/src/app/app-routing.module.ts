import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentAttedenceComponent } from './student-attedence/student-attedence.component';
import { LoginComponent } from './login/login.component';
import { UserViewComponent } from './user-view/user-view.component';
import { MapViewComponent } from './map-view/map-view.component';
import { HomeComponent } from './home/home.component';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { SemesterReportComponent } from './semester-report/semester-report.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'home', component: HomeComponent, children: [
      {
        path: 'map-view', component: MapViewComponent
      },
      {
        path: 'teacher-attendance', component: TeacherAttendanceComponent
      },
      {
        path: 'semester-report', component: SemesterReportComponent
      },
      {
        path: 'crc-report', component: BarChartComponent
      }
    ]
  },
  {
    path: 'admin-view', component: StudentAttedenceComponent
  }
  ,
  {
    path: 'user-view', component: UserViewComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

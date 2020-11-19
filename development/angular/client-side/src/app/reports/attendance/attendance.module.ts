import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { StudengtAttendanceComponent } from './student-attendance/student-attendance.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from 'src/app/auth.guard';
import { ComingSoonComponent } from 'src/app/common/coming-soon/coming-soon.component';

const sttendanceRoutes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      {
        path: 'student-attendance', component: StudengtAttendanceComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'teacher-attendance', component: TeacherAttendanceComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
]

@NgModule({
  declarations: [
    StudengtAttendanceComponent,
    TeacherAttendanceComponent,
    ComingSoonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(sttendanceRoutes)
  ]
})
export class AttendancModule { }

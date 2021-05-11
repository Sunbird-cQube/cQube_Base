import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { MissingDataComponent } from './missing-data/missing-data.component';
import { SemesterExceptionComponent } from './sat-exception/semester-exception.component';
import { FormsModule } from '@angular/forms';
import { PATExceptionComponent } from './pat-exception/pat-exception.component';
import { StudentAttendanceExceptionComponent } from './student-attendance-exception/student-attendance-exception.component';
import { TeacherAttendanceExceptionComponent } from './teacher-attendance-exception/teacher-attendance-exception.component';

const exceptionRoutes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      {
        path: 'sem-exception', component: SemesterExceptionComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'download-missing-data', component: MissingDataComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'pat-exception', component: PATExceptionComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'student-attendance-exception', component: StudentAttendanceExceptionComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'teacher-attendance-exception', component: TeacherAttendanceExceptionComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
]

@NgModule({
  declarations: [
    SemesterExceptionComponent,
    MissingDataComponent,
    PATExceptionComponent,
    StudentAttendanceExceptionComponent,
    TeacherAttendanceExceptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(exceptionRoutes)
  ]
})
export class ExceptionModule { }

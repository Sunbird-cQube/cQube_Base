import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { MissingDataComponent } from './missing-data/missing-data.component';
import { SemesterExceptionComponent } from './semester-exception/semester-exception.component';
import { FormsModule } from '@angular/forms';
import { PATExceptionComponent } from './pat-exception/pat-exception.component';

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
      }
    ]
  }
]

@NgModule({
  declarations: [
    SemesterExceptionComponent,
    MissingDataComponent,
    PATExceptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(exceptionRoutes)
  ]
})
export class ExceptionModule { }

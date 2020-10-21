import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { HomeComponent } from 'src/app/home/home.component';
import { PATReportComponent } from './pat-report/pat-report.component';
import { SemViewComponent } from './sem-view/sem-view.component';
import { FormsModule } from '@angular/forms';

const performRoute: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], children:
      [
        {
          path: 'student-performance', canActivate: [AuthGuard], children: [
            {
              path: 'semester-report', component: SemViewComponent, canActivateChild: [AuthGuard]
            },
            {
              path: 'pat-report', component: PATReportComponent, canActivateChild: [AuthGuard]
            }
          ]
        }
      ]
  }
]

@NgModule({
  declarations: [
    SemViewComponent,
    PATReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(performRoute)
  ]
})
export class StudentPerformanceModule { }

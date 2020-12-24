import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AuthGuard } from 'src/app/auth.guard';
import { DikshaBarChartComponent } from './diksha-bar-chart/diksha-bar-chart.component';
import { DikshaChartComponent } from './diksha-chart/diksha-chart.component';
import { DikshaTableComponent } from './diksha-table/diksha-table.component';
import { DikshaUsageByTextBookComponent } from './diksha-usage-by-text-book/diksha-usage-by-text-book.component';
import { UsageByTextbookContentComponent } from './usage-by-textbook-content/usage-by-textbook-content.component';
import { DikshaTPDContentProgressComponent } from './tpd/diksha-tpd-course-progress/diksha-tpd-content-progress.component';
import { DikshaTPDTeachersPercentageComponent } from './tpd/diksha-tpd-teachers-percentage/diksha-tpd-teachers-percentage.component';
import { DikshaTpdEnrollmentComponent } from './diksha-tpd-enrollment-and-completion/diksha-tpd-enrollment.component';
import { DikshaTpdCompletionComponent } from './diksha-tpd-completion-percentage/diksha-tpd-completion.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { MultiSelectComponent } from './tpd/multi-select/multi-select.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

const dikshaRoutes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      {
        path: 'usage-by-user-profile', component: DikshaChartComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'usage-by-course-content', component: DikshaTableComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'usage-by-course', component: DikshaBarChartComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'usage-by-textbook', component: DikshaUsageByTextBookComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'usage-by-textbook-content', component: UsageByTextbookContentComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'tpd-course-progress', component: DikshaTPDContentProgressComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'tpd-teacher-percentage', component: DikshaTPDTeachersPercentageComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'tpd-enrollment', component: DikshaTpdEnrollmentComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'tpd-completion', component: DikshaTpdCompletionComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
]

@NgModule({
  declarations: [
    DikshaTableComponent,
    DikshaBarChartComponent,
    DikshaUsageByTextBookComponent,
    UsageByTextbookContentComponent,
    DikshaTPDContentProgressComponent,
    DikshaTPDTeachersPercentageComponent,
    DikshaTpdEnrollmentComponent,
    DikshaTpdCompletionComponent,
    BarChartComponent,
    MultiSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    NgbPaginationModule,
    RouterModule.forChild(dikshaRoutes)
  ]
})
export class DikshaModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../auth.guard';
import { CompositReportComponent } from './composit/composit-report/composit-report.component';
import { CrcReportComponent } from './school-monitoring/crc-report/crc-report.component';
import { TelemetryDataComponent } from './telemetry/telemetry-data/telemetry-data.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { HealthCardComponent } from './healthCard/health-card/health-card.component';

const otherRoutes = [
  {
    path: 'crc', canActivate: [AuthGuard], children: [
      {
        path: 'crc-report', component: CrcReportComponent, canActivateChild: [AuthGuard]
      }]
  },
  {
    path: 'user', canActivate: [AuthGuard], children: [
      {
        path: 'changePassword', component: ChangePasswordComponent, canActivateChild: [AuthGuard]
      }]
  },
  {
    path: '', canActivate: [AuthGuard], children: [
      {
        path: 'telemetry', component: TelemetryDataComponent, canActivateChild: [AuthGuard]
      }]
  },
  {
    path: 'composite', canActivate: [AuthGuard], children: [
      {
        path: 'composite-report', component: CompositReportComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
]


@NgModule({
  declarations: [
    CrcReportComponent,
    ChangePasswordComponent,
    TelemetryDataComponent,
    CompositReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(otherRoutes)
  ]
})
export class ReportsModule { }
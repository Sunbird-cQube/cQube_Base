import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendancModule } from './attendance/attendance.module';
// import { DikshaModule } from './diksha/diksha.module';
import { ExceptionModule } from './exception-list/exception.module';
import { InfrastructureModule } from './school-infra/infrastructure.module';
import { StudentPerformanceModule } from './student-performance/student-performance.module';
import { AuthGuard } from '../auth.guard';
import { CompositReportComponent } from './composit/composit-report/composit-report.component';
import { CrcReportComponent } from './school-monitoring/crc-report/crc-report.component';
import { TelemetryDataComponent } from './telemetry/telemetry-data/telemetry-data.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { RouterModule } from '@angular/router';

const otherRoutes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], children:
      [
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
    AttendancModule,
    // DikshaModule,
    InfrastructureModule,
    StudentPerformanceModule,
    ExceptionModule,
    RouterModule.forChild(otherRoutes)
  ]
})
export class ReportsModule {
  constructor() {
    console.log("Other module");
  }
}

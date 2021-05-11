import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KeycloakSecurityService } from './keycloak-security.service';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthInterceptor } from './auth.interceptor';
import { InfoComponent } from './common/info/info.component';
import { DikshaChartComponent } from './reports/diksha/diksha-chart/diksha-chart.component';
import { HealthCardComponent } from './reports/healthCard/health-card/health-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BubblesComponent } from './reports/healthCard/bubbles/bubbles.component';
import { ProgressCircleComponent } from './reports/healthCard/progress-circle/progress-circle.component';
import { MapLegendsComponent } from './common/map-legends/map-legends.component';
import { MultiSelectComponent } from './common/multi-select/multi-select.component';
import { DikshaTPDContentProgressComponent } from './reports/diksha/tpd/diksha-tpd-course-progress/diksha-tpd-content-progress.component';
import { DikshaTPDTeachersPercentageComponent } from './reports/diksha/tpd/diksha-tpd-teachers-percentage/diksha-tpd-teachers-percentage.component';
import { StudentAttendanceChartComponent } from './reports/attendance/student-attendance-chart/student-attendance-chart.component';
import { LineChartComponent } from './common/line-chart/line-chart.component';
import { ComingSoonComponent } from './common/coming-soon/coming-soon.component';
import { StudengtAttendanceComponent } from './reports/attendance/student-attendance/student-attendance.component';
import { TeacherAttendanceComponent } from './reports/attendance/teacher-attendance/teacher-attendance.component';
import { BarChartComponent } from './reports/diksha/bar-chart/bar-chart.component';
import { DikshaBarChartComponent } from './reports/diksha/diksha-bar-chart/diksha-bar-chart.component';
import { DikshaTableComponent } from './reports/diksha/diksha-table/diksha-table.component';
import { DikshaTpdCompletionComponent } from './reports/diksha/diksha-tpd-completion-percentage/diksha-tpd-completion.component';
import { DikshaTpdEnrollmentComponent } from './reports/diksha/diksha-tpd-enrollment-and-completion/diksha-tpd-enrollment.component';
import { DikshaUsageByTextBookComponent } from './reports/diksha/diksha-usage-by-text-book/diksha-usage-by-text-book.component';
import { UsageByTextbookContentComponent } from './reports/diksha/usage-by-textbook-content/usage-by-textbook-content.component';
import { MissingDataComponent } from './reports/exception-list/missing-data/missing-data.component';
import { PATExceptionComponent } from './reports/exception-list/pat-exception/pat-exception.component';
import { SemesterExceptionComponent } from './reports/exception-list/sat-exception/semester-exception.component';
import { StudentAttendanceExceptionComponent } from './reports/exception-list/student-attendance-exception/student-attendance-exception.component';
import { TeacherAttendanceExceptionComponent } from './reports/exception-list/teacher-attendance-exception/teacher-attendance-exception.component';
import { InfraMapVisualisationComponent } from './reports/school-infra/infra-map-visualisation/infra-map-visualisation.component';
import { SchoolInfrastructureComponent } from './reports/school-infra/school-infrastructure/school-infrastructure.component';
import { UdiseReportComponent } from './reports/school-infra/udise-report/udise-report.component';
import { HeatChartComponent } from './reports/student-performance/heat-chart/heat-chart.component';
import { PATLOTableComponent } from './reports/student-performance/pat-lo-table/pat-lo-table.component';
import { PATReportComponent } from './reports/student-performance/pat-report/pat-report.component';
import { SatHeatChartComponent } from './reports/student-performance/sat-heat-chart/sat-heat-chart.component';
import { SatReportComponent } from './reports/student-performance/sat-report/sat-report.component';
import { SemViewComponent } from './reports/student-performance/sem-view/sem-view.component';
import { CompositReportComponent } from './reports/composit/composit-report/composit-report.component';
import { CrcReportComponent } from './reports/school-monitoring/crc-report/crc-report.component';
import { TelemetryDataComponent } from './reports/telemetry/telemetry-data/telemetry-data.component';
import { ChangePasswordComponent } from './reports/users/change-password/change-password.component';


export function kcFactory(kcSecurity: KeycloakSecurityService) {
  return () => kcSecurity.init();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    HomePageComponent,
    InfoComponent,
    DikshaChartComponent,
    HealthCardComponent,
    BubblesComponent,
    ProgressCircleComponent,
    MapLegendsComponent,
    MultiSelectComponent,
    DikshaTPDContentProgressComponent,
    DikshaTPDTeachersPercentageComponent,
    StudentAttendanceChartComponent,
    LineChartComponent,
    TeacherAttendanceComponent,
    ComingSoonComponent,
    StudengtAttendanceComponent,
    DikshaTableComponent,
    DikshaBarChartComponent,
    DikshaUsageByTextBookComponent,
    UsageByTextbookContentComponent,
    DikshaTpdEnrollmentComponent,
    DikshaTpdCompletionComponent,
    BarChartComponent,
    SemesterExceptionComponent,
    MissingDataComponent,
    PATExceptionComponent,
    StudentAttendanceExceptionComponent,
    TeacherAttendanceExceptionComponent,
    SchoolInfrastructureComponent,
    InfraMapVisualisationComponent,
    UdiseReportComponent,
    SemViewComponent,
    PATReportComponent,
    HeatChartComponent,
    PATLOTableComponent,
    SatReportComponent,
    SatHeatChartComponent,
    CrcReportComponent,
    ChangePasswordComponent,
    TelemetryDataComponent,
    CompositReportComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    // MatPaginatorModule,
    // MatSortModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    NgCircleProgressModule.forRoot({})
  ],
  exports: [
    MatTableModule,
    // MatPaginatorModule,
    // MatSortModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakSecurityService],
      useFactory: kcFactory,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

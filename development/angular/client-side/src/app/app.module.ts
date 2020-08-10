import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserViewComponent } from './user-view/user-view.component';
<<<<<<< HEAD
import { StudengtAttendanceComponent } from './student-attendance/student-attendance.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { SemViewComponent } from './sem-view/sem-view.component';
import { CrcReportComponent } from './crc-report/crc-report.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatSortModule } from '@angular/material';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchoolInfrastructureComponent } from './school-infrastructure/school-infrastructure.component';
import { InfraMapVisualisationComponent } from './infra-map-visualisation/infra-map-visualisation.component';
import { KeycloakSecurityService } from './keycloak-security.service';
import { HomePageComponent } from './home-page/home-page.component';
import { DikshaChartComponent } from './diksha-chart/diksha-chart.component';
import { DikshaTableComponent } from './diksha-table/diksha-table.component';
import { SemesterExceptionComponent } from './semester-exception/semester-exception.component';

export function kcFactory(kcSecurity: KeycloakSecurityService) {
  return () => kcSecurity.init();
}
=======
import { MapViewComponent } from './map-view/map-view.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ChartViewComponent } from './chart-view/chart-view.component';
>>>>>>> upstream/cQube-release-0.12

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserViewComponent,
<<<<<<< HEAD
    StudengtAttendanceComponent,
    HomeComponent,
    TeacherAttendanceComponent,
    SemViewComponent,
    CrcReportComponent,
    ChangePasswordComponent,
    ComingSoonComponent,
    DashboardComponent,
    SchoolInfrastructureComponent,
    InfraMapVisualisationComponent,
<<<<<<< HEAD
    HomePageComponent
=======
    MapViewComponent,
    ChartViewComponent,
>>>>>>> upstream/cQube-release-0.12
=======
    HomePageComponent,
    DikshaChartComponent,
    DikshaTableComponent,
    SemesterExceptionComponent
>>>>>>> upstream/cQube-release-new
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    LeafletModule.forRoot(),
    FormsModule,
<<<<<<< HEAD
<<<<<<< HEAD
=======
    ChartsModule,
>>>>>>> upstream/cQube-release-new
    BrowserAnimationsModule
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakSecurityService],
      useFactory: kcFactory,
      multi: true
    }
=======
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCbRPhVlxgVwBC0bBOgyB-Dn_K8ONrxb_g' + '&libraries=visualization'
    }),
    AgmDirectionModule
>>>>>>> upstream/cQube-release-0.12
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

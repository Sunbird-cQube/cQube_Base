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
import { MatPaginatorModule, MatSortModule } from '@angular/material';
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
    MapLegendsComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
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
    MatPaginatorModule,
    MatSortModule
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

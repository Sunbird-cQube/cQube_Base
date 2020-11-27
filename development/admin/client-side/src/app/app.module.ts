import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KeycloakSecurityService } from './keycloak-security.service';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { ChangePasswordComponent } from './components/users/change-password/change-password.component';
import { ListUsersComponent } from './components/users/list-users/list-users.component';
import { AllLogsComponent } from './components/allLogs/allLogs.component';
import { S3FilesDownloadComponent } from './components/s3-files-download/s3-files-download.component';
import { SummaryStatistictsComponent } from './components/summary-statisticts/summary-statisticts.component';
import { NifiShedularComponent } from './components/nifi-shedular/nifi-shedular.component';
import { AuthInterceptor } from './auth.interceptor';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

export function kcFactory(kcSecurity: KeycloakSecurityService) {
  return () => kcSecurity.init();
}


@NgModule({
  declarations: [
    AppComponent,
    CreateUserComponent,
    HomeComponent,
    ChangePasswordComponent,
    AllLogsComponent,
    ListUsersComponent,
    S3FilesDownloadComponent,
    DashboardComponent,
    SummaryStatistictsComponent,
    NifiShedularComponent,
  ],
  imports: [
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot() 
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
  bootstrap: [AppComponent]
})
export class AppModule { }
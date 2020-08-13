import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AllLogsComponent } from './allLogs/allLogs.component';
import { UsersComponent } from './users/users.component';
import { S3FilesDownloadComponent } from './s3-files-download/s3-files-download.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SummaryStatistictsComponent } from './summary-statisticts/summary-statisticts.component';
import { KeycloakSecurityService } from './keycloak-security.service';
import { NifiShedularComponent } from './nifi-shedular/nifi-shedular.component';

export function kcFactory(kcSecurity: KeycloakSecurityService) {
  return () => kcSecurity.init();
}


@NgModule({
  declarations: [
    AppComponent,
    CreateUserComponent,
    LoginComponent,
    HomeComponent,
    ChangePasswordComponent,
    AllLogsComponent,
    UsersComponent,
    S3FilesDownloadComponent,
    DashboardComponent,
    SummaryStatistictsComponent,
    NifiShedularComponent
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
    NoopAnimationsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakSecurityService],
      useFactory: kcFactory,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
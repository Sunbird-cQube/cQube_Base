import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentAttedenceComponent } from './student-attedence/student-attedence.component';
import { AgmDirectionModule } from 'agm-direction';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentAttedenceComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCbRPhVlxgVwBC0bBOgyB-Dn_K8ONrxb_g'
    }),
    AgmDirectionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

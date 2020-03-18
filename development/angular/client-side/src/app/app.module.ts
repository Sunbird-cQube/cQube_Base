import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { C3StudentAttendanceComponent } from './c3-student-attendance/c3-student-attendance.component';
import { C3StudentPerformanceComponent } from './c3-student-performance/c3-student-performance.component';
import { C3AttendanceMonthWiseComponent } from './c3-student-attendance/c3-attendance-month-wise/c3-attendance-month-wise.component';
import { C3AttendanceGenderWiseComponent } from './c3-student-attendance/c3-attendance-gender-wise/c3-attendance-gender-wise.component';
import { C3AttendanceSchoolWiseComponent } from './c3-student-attendance/c3-attendance-school-wise/c3-attendance-school-wise.component';
import { C3KpiComponent } from './c3-student-attendance/c3-kpi/c3-kpi.component';
import { C3StdPerformanceStateWiseComponent } from './c3-student-performance/c3-std-performance-state-wise/c3-std-performance-state-wise.component';

@NgModule({
  declarations: [
    AppComponent,
    C3StudentAttendanceComponent,
    C3StudentPerformanceComponent,
    C3AttendanceMonthWiseComponent,
    C3AttendanceGenderWiseComponent,
    C3AttendanceSchoolWiseComponent,
    C3KpiComponent,
    C3StdPerformanceStateWiseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

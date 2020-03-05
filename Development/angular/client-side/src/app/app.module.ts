import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarchartComponent } from './barchart/barchart.component';
import { StudentWiseComponent } from './student-wise/student-wise.component';
import { PieComponent } from './pie/pie.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PolarAreaChartComponent } from './polar-area-chart/polar-area-chart.component';
import { StackedbarChartComponent } from './stackedbar-chart/stackedbar-chart.component';
import {MonthWiseComponent} from './month-wise/month-wise.component';
import { KpiComponent } from './kpi/kpi.component'
@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    StudentWiseComponent,
    PieComponent,
    DoughnutChartComponent,
    LineChartComponent,
    PolarAreaChartComponent,
    StackedbarChartComponent,
    MonthWiseComponent,
    KpiComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AuthGuard } from 'src/app/auth.guard';
import { DikshaBarChartComponent } from './diksha-bar-chart/diksha-bar-chart.component';
import { DikshaChartComponent } from './diksha-chart/diksha-chart.component';
import { DikshaTableComponent } from './diksha-table/diksha-table.component';
import { HomeComponent } from 'src/app/home/home.component';

const dikshaRoutes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], children:
      [
        {
          path: 'diksha', canActivate: [AuthGuard], children: [
            {
              path: 'diksha-chart', component: DikshaChartComponent, canActivateChild: [AuthGuard]
            },
            {
              path: 'diksha-table', component: DikshaTableComponent, canActivateChild: [AuthGuard]
            },
            {
              path: 'diksha-column-chart', component: DikshaBarChartComponent, canActivateChild: [AuthGuard]
            },
          ]
        }
      ]
  }
]

@NgModule({
  declarations: [
    DikshaChartComponent,
    DikshaTableComponent,
    DikshaBarChartComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    RouterModule.forChild(dikshaRoutes)
  ]
})
export class DikshaModule { }
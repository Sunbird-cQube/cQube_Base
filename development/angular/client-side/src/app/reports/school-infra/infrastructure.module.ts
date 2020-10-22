import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { InfraMapVisualisationComponent } from './infra-map-visualisation/infra-map-visualisation.component';
import { SchoolInfrastructureComponent } from './school-infrastructure/school-infrastructure.component';
import { FormsModule } from '@angular/forms';
import { UdiseReportComponent } from './udise-report/udise-report.component';

const infraRoutes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      {
        path: 'school-infrastructure', component: SchoolInfrastructureComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'school-infra-map', component: InfraMapVisualisationComponent, canActivateChild: [AuthGuard]
      },
      {
        path: 'udise-report', component: UdiseReportComponent, canActivateChild: [AuthGuard]
      }
    ]
  }
]


@NgModule({
  declarations: [
    SchoolInfrastructureComponent,
    InfraMapVisualisationComponent,
    UdiseReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(infraRoutes)
  ]
})
export class InfrastructureModule { }
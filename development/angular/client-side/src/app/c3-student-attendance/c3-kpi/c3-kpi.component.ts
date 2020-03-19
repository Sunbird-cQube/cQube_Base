import { Component, OnInit } from '@angular/core';
import { AppServiceComponent } from '../../app.service'

@Component({
  selector: 'app-c3-kpi',
  templateUrl: './c3-kpi.component.html',
  styleUrls: ['./c3-kpi.component.css']
})
export class C3KpiComponent implements OnInit {
  constructor(private service: AppServiceComponent) { }
  data: any;

  ngOnInit() {
    this.service.s3KPI().subscribe(res => {
      this.data = res;
      console.log(this.data);
    })
  }

}

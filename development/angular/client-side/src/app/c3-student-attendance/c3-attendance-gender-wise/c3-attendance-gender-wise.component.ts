import { Component, OnInit } from '@angular/core';
import { AppServiceComponent } from '../../app.service'
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-c3-attendance-gender-wise',
  templateUrl: './c3-attendance-gender-wise.component.html',
  styleUrls: ['./c3-attendance-gender-wise.component.css']
})
export class C3AttendanceGenderWiseComponent implements OnInit {
  label = [];
  value = [];
  stackedbarchart = [];
  result;
  constructor(private service: AppServiceComponent) {
    this.service.s3StdAttendanceGenderWise().subscribe(res => {
      this.result = res;
      this.result.forEach(item => {
        this.label.push(item.label);
        this.value.push(item.value);

      })

    })

  }
  ngOnInit() {
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          var a = ctx.dataset.data
          let sum = 0
          for (let i = 0; i < ctx.dataset.data.length; i++) {
            sum = sum + Number(a[i])
          }
          let percentage = (value * 100 / sum).toFixed(2) + "%";
          return percentage;
        },
      },
    }
  };
  public pieChartLabels: Label[] = this.label;
  public pieChartData: number[] = this.value;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];
}

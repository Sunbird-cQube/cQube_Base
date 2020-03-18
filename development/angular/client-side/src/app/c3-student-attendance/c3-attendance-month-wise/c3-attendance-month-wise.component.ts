import { Component, OnInit } from '@angular/core';
import { AppServiceComponent } from '../../app.service';
import { Chart } from 'chart.js'

@Component({
  selector: 'app-c3-attendance-month-wise',
  templateUrl: './c3-attendance-month-wise.component.html',
  styleUrls: ['./c3-attendance-month-wise.component.css']
})
export class C3AttendanceMonthWiseComponent implements OnInit {

  constructor(private service: AppServiceComponent) { }
  label = [];
  value = [];
  barchart = []
  ngOnInit() {
    this.service.s3StdAttendanceMonthWise().subscribe((result: any[]) => {
      result.forEach(x => {
        this.label.push(x.label);
        this.value.push(x.value);
      });
      this
      this.barchart.push(new Chart('bar1', {
        type: 'line',
        data: {
          labels: this.label,
          datasets: [
            {
              label: '',
              data: this.value,
              borderColor: '#3cba9f',
              backgroundColor: [
                "#3cb371",
                "#0000FF",
                "#9966FF",
                "#4C4CFF",
                "#00FFFF",
                "#f990a7",
                "#aad2ed",
                "#FF00FF",
                "Blue",
                ,
                "Blue"
              ],
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'MONTH',
                fontStyle: 'bold'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'TOTAL ATTENDANCE',
                fontStyle: 'bold'
              }
            },
            ],
          },
          title: {
            display: true,
            text: "MONTH-WISE ATTENDANCE OF ALL SCHOOLS"
          },
          legend: {
            display: false,
            position: 'top',
          },
          animation: {
            animateScale: true,
            animateRotate: true

          }

        },

      }
      ));
    });
  }


}

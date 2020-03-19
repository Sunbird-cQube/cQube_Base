import { Component, OnInit } from '@angular/core';
import { AppServiceComponent } from '../../app.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-c3-attendance-school-wise',
  templateUrl: './c3-attendance-school-wise.component.html',
  styleUrls: ['./c3-attendance-school-wise.component.css']
})
export class C3AttendanceSchoolWiseComponent implements OnInit {
  label = [];
  barchart = [];
  value = [];

  constructor(private service: AppServiceComponent) { }

  ngOnInit() {
    this.service.c3StdAttendanceSchoolWise().subscribe((result: any) => {
      result.forEach(x => {
        this.label.push(x.label);
        this.value.push(x.value);
      });
      this
      this.barchart.push(new Chart('bar', {
        type: 'bar',
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
              fill: true
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
                labelString: 'SCHOOL ID',
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
            text: "ATTENDANCE OF ALL SCHOOLS"
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

      })
      );
    });

  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from '../data';
import { Chart } from 'chart.js';  

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
  data: Data[];  
  url = 'http://localhost:8091/S3-gender-wise';  
  label = [];  
  value = [];  
  piechart = [];  
  constructor(private http: HttpClient) { }  
  ngOnInit() {  
    this.http.get(this.url).subscribe((result: Data[]) => {  
      result.forEach(x => {  
        this.label.push(x.label);  
        this.value.push(x.value);  
      });  
      this  
      this.piechart = new Chart('pie', {  
        type: 'pie',  
        data: {  
          labels: this.label ,  
          datasets: [  
            {  
              label: '',
              data: this.value,  
              borderColor: '#3cba9f',  
              backgroundColor: [  
                 
                  
                  
                "#FF00FF",  
                "Blue",  
                  
              ],  
              fill: true 
            }  
          ]  
        },  
        options: {
           
          title:{
            display: true,
            text: "STUDENTS  BY GENDER",
            fontStyle: 'bold'
          } ,
          legend: {  
            position:'top',
          },
          animation:{
            animateScale:true,
            animateRotate:true

          },
            display: true  
          },ticks: {
            beginAtZero: true
        },  
          scales: {  
            xAxes: [{  
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'SCHOOL NAME'
              }  
            }],  
            yAxes: [{  
              display: true ,
              scaleLabel: {
                display: true,
                labelString: 'NO. OF DAYS PRESENT'
              }
            },
          ],  
          }  
        }  
      );  
    });  
  }
}

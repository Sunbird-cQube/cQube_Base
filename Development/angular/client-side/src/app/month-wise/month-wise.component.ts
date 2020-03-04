import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from '../data';
import {Chart} from 'chart.js'
@Component({
  selector: 'app-month-wise',
  templateUrl: './month-wise.component.html',
  styleUrls: ['./month-wise.component.css']
})
export class MonthWiseComponent implements OnInit {
  data: Data[];  
  url = 'http://localhost:8091/s3-month-wise';  
  label = [];  
  value = [];  
  barchart = [];  
  constructor(private http: HttpClient) { }  
  ngOnInit() {  
    this.http.get(this.url).subscribe((result: Data[]) => {  
      result.forEach(x => {  
        this.label.push(x.label);  
        this.value.push(x.value);  
      });  
      this  
      this.barchart = new Chart('bar1', {  
        type: 'line',  
        data: {  
          labels: this.label ,  
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
              display: true ,
              scaleLabel: {
                display: true,
                labelString:'TOTAL ATTENDANCE',
                fontStyle: 'bold'
              }
            },
          ],  
          }  ,
          title:{
            display: true,
            text: "MONTH-WISE ATTENDANCE OF ALL SCHOOLS"
          } ,
          legend: {  
            display: false,
            position:'top',
          },
          animation:{
            animateScale:true,
            animateRotate:true

          }
          ,ticks: {
            major: {
              fontStyle: 'bold',
              fontColor: '#FF0000'
            },
            beginAtZero: true
        }
            
          },  
          
        }  
      );  
    });  
  }
}

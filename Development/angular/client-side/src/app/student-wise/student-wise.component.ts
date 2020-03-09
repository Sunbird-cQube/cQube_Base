import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';  
import { Data } from '../data';  

@Component({
  selector: 'app-student-wise',
  templateUrl: './student-wise.component.html',
  styleUrls: ['./student-wise.component.css']
})
export class StudentWiseComponent implements OnInit {
  data: Data[];  
  url = 'http://localhost:8088/s3data';  
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
        type: 'bar',  
        data: {  
          labels: this.label ,  
          datasets: [  
            {  
              label: 'DefaultLabel',
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
                "Blue"  
                  
                  
              ],  
              fill: true 
            }  
          ]  
        },  
        options: { 
          resposive:true,
          title:{
            display: true,
            text: "NO. OF STUDENTS PRESENT"
          } ,
          legend: {  
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
      });  
    });  
  }  
}
 



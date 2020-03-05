import { Component, OnInit } from '@angular/core';
import { Data } from '../data';
import { HttpClient } from '@angular/common/http';
import {Chart} from 'chart.js'
@Component({
  selector: 'app-stackedbar-chart',
  templateUrl: './stackedbar-chart.component.html',
  styleUrls: ['./stackedbar-chart.component.css']
})
export class StackedbarChartComponent implements OnInit {
  data: Data[];  
  url = 'http://localhost:8080/s3data';  
  label = [];  
  value = [];  
  stackedbarchart = []; 
  result;
  constructor(private http: HttpClient) { }  
  ngOnInit() {  
    this.http.get(this.url).subscribe((res) => {  
      this.result =res;  
       
      this.stackedbarchart = new Chart('stacked', {  
        type: 'bar',  
        data:this.result,
          options: {
            legend: {  
              position:'right',
            },
            animation:{
              animateScale:true,
              animateRotate:true
  
            },
            scales: {
              xAxes: [{
                stacked: true
              }],
              yAxes: [{
                stacked: true
              }]
            }
          }
        
         
    });  
  });
}
}

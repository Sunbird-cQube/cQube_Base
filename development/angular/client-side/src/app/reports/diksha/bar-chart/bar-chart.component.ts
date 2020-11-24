import { Component, Input, OnInit } from "@angular/core";
import * as Highcharts from 'highcharts/highstock'

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions;
  @Input() public category: String[];
  @Input() public data: Number[];
  @Input() public xAxisLabel: String;
  @Input() public yAxisLabel: String;
  constructor() { }

  ngOnInit() {
    this.createBarChart();
  }

  createBarChart() {  
    console.log(this.category);  
    this.chartOptions = {
      chart: {
        type: "bar",
      },
      title: {
        text: null
      },
      xAxis: {
        type: "category",
        gridLineColor: 'transparent',
        categories: this.category,
        title: {
          text: this.yAxisLabel
        },
        min: 0,
        max: 4,
        scrollbar: {
          enabled: true
        },
        tickLength: 0
      },
      yAxis: {
        min: 0,
        gridLineColor: 'transparent',
        title: {
          text: this.xAxisLabel,
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: this.xAxisLabel,
          data: this.data
        }
      ]
    }
    this.Highcharts.chart("container", this.chartOptions);
  }
}
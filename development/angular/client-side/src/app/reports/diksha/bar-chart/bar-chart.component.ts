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
    let scrollBarX

    if (this.data.length < 25) {
      scrollBarX = false
    } else {
      scrollBarX = true
    }

    this.chartOptions = {
      chart: {
        type: "bar",
        backgroundColor: 'transparent',
      },
      title: {
        text: null
      },
      xAxis: {
        labels: {
          style: {
            color: 'black',
            fontSize: "10px"
          }
        },
        type: "category",
        gridLineColor: 'transparent',
        categories: this.category,
        title: {
          text: this.yAxisLabel,
          style: {
            color: 'black',
            fontSize: "10px"
          }
        },
        min: 0,
        max: 25,
        scrollbar: {
          enabled: scrollBarX,
        },
        tickLength: 0
      },
      yAxis: {
        labels: {
          style: {
            color: 'black',
            fontSize: "10px"
          }
        },
        min: 0,
        opposite: true,
        max: Math.max.apply(Math, this.data),
        gridLineColor: 'transparent',
        title: {
          text: this.xAxisLabel,
          style: {
            color: 'black',
            fontSize: "10px"
          }
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        },
        series: {
          pointPadding: 0,
          groupPadding: 0
        }
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: this.xAxisLabel,
          data: this.data
        }
      ],
      // tooltip: {
      //   formatter: function () {
      //     // return '<b>' + getPointCategoryName(this.point, 'y', level) + '</b>';
      //   }
      // }
    }
    this.Highcharts.chart("container", this.chartOptions);
  }
}
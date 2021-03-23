import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as Highcharts from 'highcharts/highstock'

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions;
  @Input() selectedYear;
  @Input() lineData:any = [];
  @Input() xAxisLabels:any = [];
  @Input() level = '';
  @Input() xAxisTitle;
  @Input() yAxisTitle;
  constructor(private changeDetection: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.onResize();
    this.changeDetection.detectChanges();
  }

  height = window.innerHeight;
 onResize() {
    this.height = window.innerHeight;
    this.getCurrentData();
    this.changeDetection.detectChanges();
    this.createChart();
  }


  ngOnChanges(){
    this.onResize();
  }

  public currentData:any = [];
  getCurrentData(){
    this.currentData = [];
    this.lineData.map(item=>{
      var obj = {
        marker: {
          radius: this.height > 1760 ? 8 : this.height > 1180 && this.height < 1760 ? 6 : this.height > 667 && this.height < 1180 ? 3 : 2.2
        },
        dataLabels: {
          enabled: true,
          style: {
            fontWeight: 1,
            fontSize: this.height > 1760 ? "32px" : this.height > 1180 && this.height < 1760 ? "22px" : this.height > 667 && this.height < 1180 ? "12px" : "10px"
          },
          formatter: function () {
            return this.y.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          }
        },
        lineWidth: this.height > 1760 ? 6 : this.height > 1180 && this.height < 1760 ? 5 : this.height > 667 && this.height < 1180 ? 3 : 2.2,
        data: [],
        name: '',
        color: ''
      }
      obj.data = item.data;
      obj.name = item.name;
      obj.color = item.color;
      this.currentData.push(obj);
    })
  }

  createChart() {
    var academicYear = this.selectedYear;
    var level = this.level;
    var xAxisTitle = this.xAxisTitle;
    var yAxisTitle = this.yAxisTitle;
    this.chartOptions = {
      chart: {
        type: "line",
        backgroundColor: 'transparent',
      },
      title: {
        text: null
      },
      xAxis: {
        labels: {
          style: {
            color: 'black',
            fontSize: this.height > 1760 ? "32px" : this.height > 1180 && this.height < 1760 ? "22px" : this.height > 667 && this.height < 1180 ? "12px" : "10px"
          }
        },
        type: "category",
        gridLineColor: 'transparent',
        categories: this.xAxisLabels,
        min:0,
        startOnTick: true,
        title: {
          text: xAxisTitle,
          style: {
            color: 'black',
            fontSize: this.height > 1760 ? "32px" : this.height > 1180 && this.height < 1760 ? "22px" : this.height > 667 && this.height < 1180 ? "12px" : "10px",
            fontWeight: "bold"
          }
        },
        scrollbar: {
          minWidth: 6,
          enabled: false,
        },
        tickLength: 0
      },
      yAxis: {
        labels: {
          style: {
            color: 'black',
            fontSize: this.height > 1760 ? "26px" : this.height > 1180 && this.height < 1760 ? "16px" : this.height > 667 && this.height < 1180 ? "12px" : "10px"
          },
          formatter: function () {
            return this.value.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          }
        },
        min: 0,
        max: 100,
        startOnTick: false,
        opposite: false,
        gridLineColor: 'transparent',
        title: {
          text: yAxisTitle,
          style: {
            color: 'black',
            fontSize: this.height > 1760 ? "32px" : this.height > 1180 && this.height < 1760 ? "22px" : this.height > 667 && this.height < 1180 ? "12px" : "10px",
            fontWeight: "bold"
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
      series: this.currentData,
      tooltip: {
        style: {
          fontSize: this.height > 1760 ? "32px" : this.height > 1180 && this.height < 1760 ? "22px" : this.height > 667 && this.height < 1180 ? "12px" : "10px",
          opacity: 1,
          backgroundColor: "white"
        },
        formatter: function () {
          if (this.point.category != 0) {
            return '<b>' + getPointCategoryName(this.point,level, academicYear) + '</b>';
          }else{
            return false;
        }
        }
      }
    }
    this.Highcharts.chart("container", this.chartOptions);

    function getPointCategoryName(point, level, academicYear) {
      var obj = '';
        obj = `<b>Acedmic Year:</b> ${academicYear} 
        <br><b>Month:</b> ${point.category}
        <br> ${level != 'state' ? `<b>District Name:</b> ${point.series.name}` : `<b>State Name:</b> ${point.series.name}`}
        <br> ${point.y !== null ? `<b>Attendance:</b> ${point.y.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")} % ` : ''}`
        return obj;
    }
  }

}

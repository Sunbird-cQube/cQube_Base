import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { AppServiceComponent } from '../../app.service';
import 'chartjs-plugin-annotation';

@Component({
  selector: 'app-c3-std-performance-state-wise',
  templateUrl: './c3-std-performance-state-wise.component.html',
  styleUrls: ['./c3-std-performance-state-wise.component.css']
})
export class C3StdPerformanceStateWiseComponent implements OnInit {
  dataForBubbleChart: any = [];

  public bubbleChartOptions: any = {
    responsive: true,
    title: {
      text: 'my title',
      display: false
    },
    hover: {
      mode: "nearest",
      intersec: true,
    },
    interaction: {
      mode: "nearest",
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var label = "SchoolName: "+'"'+ data.datasets[tooltipItem.datasetIndex].label+'"' +"  "+"SchoolId: " +data.datasets[tooltipItem.datasetIndex].key || '' ;
          if (label) {
            label += ': ';
          }
          label += 'Avg Performance' + tooltipItem.xLabel + ', '+'Avg Attendance' + tooltipItem.yLabel ;
          return [label, 'String1', 'String2'];
        }
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        },
        ticks: {
          min: 0,
          max: 100,
        },
        scaleLabel: {
          display: true,
          labelString: 'School Avg Performance Percentage',
          fontSize: 16,
          fontColor: "blue"
        }
      }],
      yAxes: [{
        title: "Performance in percentage...",
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        },
        ticks: {
          min: 0,
          max: 100,
        },
        scaleLabel: {
          display: true,
          labelString: 'School Avg Attendance Percentage',
          fontSize: 16,
          fontColor: "blue",
        }
      }]
    },
    annotation: {
      annotations: [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 35,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        label: {
          enabled: true,
          content: '35% attendance',
          position: "right",
          backgroundColor: "powderblue",
          fontColor: "gray"
        }
      },
      {
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: 35,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        label: {
          enabled: true,
          content: '35% pass',
          position: "top",
          backgroundColor: "powderblue",
          fontColor: "gray"
        }
      },
      {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 60,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        label: {
          enabled: true,
          content: '60% attendance',
          position: "right",
          backgroundColor: "powderblue",
          fontColor: "gray"
        }
      },
      {
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: 60,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        label: {
          enabled: true,
          content: '60% pass',
          position: "top",
          backgroundColor: "powderblue",
          fontColor: "gray"
        }
      }]
    }
  };
  ChartAnnotation: any = {

  }
  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartLegend = false;

  public bubbleChartData: any = [{
    data: [
      { x: 1, y: 1, r: 5 }
    ],
    label: "",
    backgroundColor: "",
    key: undefined
  }];

  chartClicked1(e) {
    if (e.active.length > 0) {
      let datasetIndex = e.active[0]._datasetIndex
      let data = e.active[0]._chart.data.datasets[datasetIndex];
      console.log({ "schoolName": data.label, "schoolId": data.key });
    }
  }
  myArr: any = []
  constructor(public service: AppServiceComponent) {
    this.service.c3StdPerformanceStateWise().subscribe(res => {
      this.myArr = res;
      this.myArr.forEach(item => {
        var obj = {
          data: [
            { x: item.Attendance_perc, y: item.Performance_percentage, r: 5 }
          ],
          label: item.School_name,
          backgroundColor: "",
          key: item.School_Id
        }

        this.dataForBubbleChart.push(obj);
      });
      this.bubbleChartData = this.dataForBubbleChart;

      this.bubbleChartData.forEach(item => {
        if (item.data[0]['x'] <= 35 && item.data[0]['y'] <= 35) {
          item.backgroundColor = "Red"
        }
        if (item.data[0]['x'] > 35 && item.data[0]['y'] > 35 && item.data[0]['x'] < 60 && item.data[0]['y'] < 60) {
          item.backgroundColor = "blue"
        }
        if (item.data[0]['x'] > 35 && item.data[0]['y'] < 35 || item.data[0]['x'] < 35 && item.data[0]['y'] > 35) {
          item.backgroundColor = "powderBlue"
        } if (item.data[0]['x'] < 60 && item.data[0]['y'] > 60 || item.data[0]['x'] > 60 && item.data[0]['y'] < 60) {
          item.backgroundColor = "orange"
        }
        else if (item.data[0]['x'] > 60 && item.data[0]['y'] > 60) {
          item.backgroundColor = "green"
        }
      });
      console.log(this.bubbleChartData);
      console.log(this.dataForBubbleChart);
      console.log()
    });


  }

  getValue(data){
    console.log("value got.........", data.target.value);
  }
  ngOnInit() {
  }
}

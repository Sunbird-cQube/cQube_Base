import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Chart from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppServiceComponent } from '../app.service';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartViewComponent implements OnInit {

  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router, private changeDetection: ChangeDetectorRef) { }

  public canvas: any;
  public ctx: any;
  public colors: any;
  ngOnInit() {
    this.districtWise()
  }

  districtWise() {
    this.service.districtWiseCRC().subscribe(res => {
      this.chartRender(res);
    })
  }

  blockWise() {
    this.service.blockWiseCRC().subscribe(res => {
      this.chartRender(res);
    })
  }

  clusterWise() {
    this.service.clusterWiseCRC().subscribe(res => {
      this.chartRender(res);
    })
  }

  schoolWise() {
    this.service.schoolWiseCRC().subscribe(res => {
      this.chartRender(res);
    })
  }

  chartRender(resData) {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    var lables = [];
    var data = [];
    let colors = this.color().generateGradient('#FF0000', '#7FFF00', resData.length, 'rgb');
    this.colors = colors;

    for (var i = 0; i < resData.length; i++) {
      lables.push(resData[i].visits_frequency);
      if (resData[i].districts) {
        data.push(resData[i].districts)
      }
      if (resData[i].blocks) {
        data.push(resData[i].blocks)
      }
      if (resData[i].clusters) {
        data.push(resData[i].clusters)
      }
      if (resData[i].schools) {
        data.push(resData[i].schools)
      }
    }

    let myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: lables,
        datasets: [{
          label: '# of Visits',
          data: data,
          backgroundColor: this.colors,
          borderWidth: 2
        }],

      },
      options: {
        responsive: false,
        display: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '# of Schools'
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: '# of Visits'
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }]
        },
        offset: true,
      }
    });

    this.loaderAndErr();
    this.changeDetection.markForCheck();
  }

  loaderAndErr() {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('errMsg').style.color = 'red';
    document.getElementById('errMsg').style.display = 'block';
    // document.getElementById('errMsg').innerHTML = 'No data found';
  }

  color() {
    // Converts a #ffffff hex string into an [r,g,b] array
    function hex2rgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null;
    }

    // Inverse of the above
    function rgb2hex(rgb) {
      return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }

    // Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
    // Taken from the awesome ROT.js roguelike dev library at
    // https://github.com/ondras/rot.js
    function _interpolateRgb(color1, color2, factor) {
      if (arguments.length < 3) { factor = 0.5; }

      let result = color1.slice();

      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      }
      return result;
    }

    function generateGradient(color1, color2, total, interpolation) {
      const colorStart = typeof color1 === 'string' ? hex2rgb(color1) : color1;
      const colorEnd = typeof color2 === 'string' ? hex2rgb(color2) : color2;

      // will the gradient be via RGB or HSL
      switch (interpolation) {
        case 'rgb':
          return colorsToGradientRgb(colorStart, colorEnd, total);
        // case 'hsl':
        //   return colorsToGradientHsl(colorStart, colorEnd, total);
        default:
          return false;
      }
    }

    function colorsToGradientRgb(startColor, endColor, steps) {
      // returns array of hex values for color, since rgb would be an array of arrays and not strings, easier to handle hex strings
      let arrReturnColors = [];
      let interimColorRGB;
      let interimColorHex;
      const totalColors = steps;
      const factorStep = 1 / (totalColors - 1);

      for (let idx = 0; idx < totalColors; idx++) {
        interimColorRGB = _interpolateRgb(startColor, endColor, factorStep * idx);
        interimColorHex = rgb2hex(interimColorRGB);
        arrReturnColors.push(interimColorHex);
      }
      return arrReturnColors;
    }
    return {
      generateGradient
    };
  }

}

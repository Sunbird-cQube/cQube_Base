import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.css']
})
export class ProgressCircleComponent implements OnInit {
  @Input() value;
  @Input() color;

  screenWidth: any;
  radius;
  titleFontSize;
  outerStrokeWidth;
  innerStrokeWidth;
  space;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.renderSpinner();
  }

  constructor() {
    this.screenWidth = window.innerWidth;
    this.renderSpinner();
  }

  ngOnInit(): void {
  }

  renderSpinner(): void {
    //console.log(this.screenWidth);
    if (this.screenWidth <= 1920) {
      this.radius = 100;
      this.titleFontSize = 50;
      this.outerStrokeWidth = 25;
      this.innerStrokeWidth = 10;
      this.space = -20;
    } else if (this.screenWidth > 1920 && this.screenWidth < 2540) {
      this.radius = 250;
      this.titleFontSize = 100;
      this.outerStrokeWidth = 40;
      this.innerStrokeWidth = 20;
      this.space = -25;
    } else if (this.screenWidth > 2540 && this.screenWidth < 3800) {
      this.radius = 450;
      this.titleFontSize = 200;
      this.outerStrokeWidth = 150;
      this.innerStrokeWidth = 120;
      this.space = -120;
    } else {
      this.radius = 580;
      this.titleFontSize = 320;
      this.outerStrokeWidth = 200;
      this.innerStrokeWidth = 170;
      this.space = -170;
    }
    //console.log(this.radius);
  }

}

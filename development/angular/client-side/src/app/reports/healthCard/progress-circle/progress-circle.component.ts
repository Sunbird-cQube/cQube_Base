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
      this.radius = 80;
      this.titleFontSize = 40;
    } else if (this.screenWidth > 1920 && this.screenWidth <= 2560) {
      this.radius = 160;
      this.titleFontSize = 50;
    } else {
      this.radius = 250;
      this.titleFontSize = 90;
    }
    //console.log(this.radius);
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bubbles',
  templateUrl: './bubbles.component.html',
  styleUrls: ['./bubbles.component.css']
})
export class BubblesComponent implements OnInit {
  @Input() cardData: any;
  @Input() Value: number;
  @Input() color: any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.Value);
  }

}

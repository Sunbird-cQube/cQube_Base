import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-legends',
  templateUrl: './map-legends.component.html',
  styleUrls: ['./map-legends.component.css']
})
export class MapLegendsComponent implements OnInit {

  public legendColors: any = ["#ff0000", "#f50a00", "#e81700", "#db2400", "#ce3100", "#c13e00", "#b44b00", "#a75800", "#9b6400", "#8e7100", "#817e00", "#748b00", "#679800", "#5aa500", "#4db200", "#40bf00", "#34cb00", "#27d800", "#1ae500", "#00ff00"];
  public values = ['0-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '61-65', '66-70', '71-75', '76-80', '81-85', '86-90', '91-95', '96-100'];

  constructor() { }

  ngOnInit(): void {
  }

}

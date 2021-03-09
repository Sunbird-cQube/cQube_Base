import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-legends',
  templateUrl: './map-legends.component.html',
  styleUrls: ['./map-legends.component.css']
})
export class MapLegendsComponent implements OnInit {
 
  public legendColors: any = ["#ff0000", "#f20d00", "#e41b00", "#d72800", "#c93600", "#bc4300", "#ae5100", "#a15e00", "#946b00", "#867900", "#798600", "#6b9400", "#5ea100", "#51ae00", "#43bc00", "#36c900", "#28d700", "#1be400", "#0df200", "#00ff00"];
  public values = ['0-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '61-65', '66-70', '71-75', '76-80', '81-85', '86-90', '91-95', '96-100']
  
  constructor() { }

  ngOnInit(): void {
  }

}

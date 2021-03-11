import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-legends',
  templateUrl: './map-legends.component.html',
  styleUrls: ['./map-legends.component.css']
})
export class MapLegendsComponent implements OnInit {

  public legendColors: any = ["#ff0000", "#e51a00", "#cb3400", "#b14e00", "#976800", "#7d8200", "#639c00", "#49b600", "#2fd000", "#00ff00"];
  public values = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'];

  constructor() { }

  ngOnInit(): void {
  }

}

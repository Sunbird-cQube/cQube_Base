import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-legends',
  templateUrl: './map-legends.component.html',
  styleUrls: ['./map-legends.component.css']
})
export class MapLegendsComponent implements OnInit {

  public legendColors: any = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"];
  public values = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'];

  constructor() { }

  ngOnInit(): void {
  }

}

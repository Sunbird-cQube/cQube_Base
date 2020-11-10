import { Component, OnInit } from '@angular/core';
declare const $;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public fun = $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

}

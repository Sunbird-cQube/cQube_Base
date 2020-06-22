import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-angular-logs',
  templateUrl: './angular-logs.component.html',
  styleUrls: ['./angular-logs.component.css']
})
export class AngularLogsComponent implements OnInit {
  public logs;
  constructor(private router: Router, private service: AppService) { }

  ngOnInit() {
    this.service.nodeLogs().subscribe(res => {
      this.logs = res;
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-node-logs',
  templateUrl: './node-logs.component.html',
  styleUrls: ['./node-logs.component.css']
})
export class NodeLogsComponent implements OnInit {
  public logs;
  constructor(private router: Router, private service: AppService) { }

  ngOnInit() {
    this.service.nodeLogs().subscribe(res => {
      this.logs = res;
    })
  }

}

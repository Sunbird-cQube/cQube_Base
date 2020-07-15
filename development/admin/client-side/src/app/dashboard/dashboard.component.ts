import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public grafanaUrl = environment.grafanaEndPoint;
  constructor() { }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "block";
    document.getElementById('homeBtn').style.display = "None";
  }

}

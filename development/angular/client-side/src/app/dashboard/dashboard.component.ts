import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AppServiceComponent } from '../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // hiddenPass: boolean;
  constructor(private router: Router, private service: AppServiceComponent) {
    // if (Number(localStorage.getItem('role')) === 1) {
    //   this.hiddenPass = true;
    // }
  }
  ngOnInit() {
    document.getElementById('backBtn').style.display = "block";
    document.getElementById('homeBtn').style.display = "None";
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AppServiceComponent } from '../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hiddenPass = false;
  constructor(private router: Router, private service: AppServiceComponent) {

  }
  ngOnInit() {
    if (localStorage.getItem('roleName') == "admin") {
      this.hiddenPass = false;
    } else {
      this.hiddenPass = true;
    }
    document.getElementById('backBtn').style.display = "block";
    document.getElementById('homeBtn').style.display = "None";
  }

}

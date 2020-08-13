import { Component, OnInit } from '@angular/core';
import { AppServiceComponent } from '../app.service';

@Component({
  selector: 'app-teacher-attendance',
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.css']
})
export class TeacherAttendanceComponent implements OnInit {

  constructor(service: AppServiceComponent) { 
    service.logoutOnToeknExpire();
  }

  ngOnInit() {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
  }

}

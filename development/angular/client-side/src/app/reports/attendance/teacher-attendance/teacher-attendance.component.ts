import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppServiceComponent } from '../../../app.service';

@Component({
  selector: 'app-teacher-attendance',
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TeacherAttendanceComponent implements OnInit {
  constructor(service: AppServiceComponent) {
    service.logoutOnTokenExpire();
  }

  ngOnInit() {
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
  }

}

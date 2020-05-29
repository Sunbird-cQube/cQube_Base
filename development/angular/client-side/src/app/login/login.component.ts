import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router'
import { AppServiceComponent } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  err: string = '';
  logData: any = {};
  modal = true;
  role: any;
  email: any;

  emailRegex: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private router: Router, private service: AppServiceComponent) { }

  goto() {
    this.router.navigate(['/stdAttendance']);
  }

  onSubmit() {
    this.service.login(this.logData).subscribe(res => {
      if (res['msg']) {
        localStorage.clear();
        localStorage.setItem('email', this.logData.email);
        localStorage.setItem('token', res['token']);
        localStorage.setItem('role', res['role']);
        localStorage.setItem('user_id', res['user_id']);
        this.role = res['role'];

        if (this.role == 1) {
          this.router.navigate(['home/attendance-report']);
        }
        else if (this.role == 3) {
          this.router.navigate(['home/attendance-report'])
        }
        else if (this.role == 5) {
          this.router.navigate(['home/changePassword']);
        }
      } else if (res['errMsg']) {
        this.email = this.logData.email;
        this.err = res['errMsg'];
      }
    });
  }

  forgotPass(email) {
    console.log(email.model);
  }

  ngOnInit() {
  }

}
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

  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private router: Router, private service: AppServiceComponent) { }

  goto() {
    this.router.navigate(['/stdAttendance']);
  }

  onSubmit() {
    this.service.login(this.logData).subscribe(res => {
      if (res['msg']) {
        localStorage.setItem('token', res['token']);
       // this.router.navigate(['/admin-view']);
       this.router.navigate(['/map-view'])
      } else if (res['notEmail']) {
        this.err = res['notEmail'];
      } else if (res['wrongPasswd']) {
        this.err = res['wrongPasswd'];
      }
    });
  }

  ngOnInit() {
  }

}
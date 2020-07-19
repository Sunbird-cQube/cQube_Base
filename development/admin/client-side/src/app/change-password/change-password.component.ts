import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
declare const $;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public changePasswdData: any = {};
  public err;
  public successMsg;
  public isDisabled;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(public service: AppService, public router: Router) {
    this.changePasswdData['email'] = localStorage.getItem('email');
  }

  ngOnInit() {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
  }

  onSubmit(formData: NgForm) {
    document.getElementById('spinner').style.display = 'block';
    this.isDisabled = false;
    if (this.changePasswdData.email === localStorage.getItem('email')) {
      if (this.changePasswdData.newPasswd != this.changePasswdData.cnfpass) {
        this.err = "Password not matched";
        document.getElementById('spinner').style.display = 'none';
      } else {
        this.changePasswdData['updaterId'] = localStorage.getItem('user_id');
        this.service.changePassword(this.changePasswdData).subscribe(res => {
          document.getElementById('success').style.display = "Block";
          this.err = '';
          this.successMsg = res['msg'] + "\n" + " please login aging...";
          document.getElementById('spinner').style.display = 'none';
          this.isDisabled = true;
          formData.resetForm();
          setTimeout(() => {
            localStorage.clear();
            this.router.navigate(['/']);
          }, 2000);
        }, err => {
          this.err = "Something went wrong"
          document.getElementById('spinner').style.display = 'none';
        })
      }
    } else {
      this.err = "Invalid email";
      document.getElementById('spinner').style.display = 'none';
    }
  }

}

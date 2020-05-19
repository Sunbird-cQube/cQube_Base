import { Component, OnInit } from '@angular/core';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
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

  constructor(public service: AppServiceComponent, public router: Router) {
    this.changePasswdData['email'] = localStorage.getItem('email');
  }

  ngOnInit() {
    $("#exampleInputEmail").attr("disabled", "disabled");
    // document.addEventListener('contextmenu', function (e) {
    //   e.preventDefault();
    // });
    // $(document).keydown(function (e) {
    //   if (e.which === 123) {
    //     return false;
    //   }
    // });
  }

  onSubmit() {
    this.isDisabled = false;
    if (this.changePasswdData.email === localStorage.getItem('email')) {
      if (this.changePasswdData.newPasswd != this.changePasswdData.cnfpass) {
        this.err = "Password not matched";
      } else {
        this.changePasswdData['updaterId'] = localStorage.getItem('user_id');
        this.service.changePassword(this.changePasswdData).subscribe(res => {
          if (res['msg'] === 'Password changed successfully') {
            document.getElementById('success').style.display = "Block";
            this.err = '';
            this.successMsg = res['msg'] + "\n" + " please login aging...";
            this.isDisabled = true;
            setTimeout(() => {
              localStorage.clear();
              this.router.navigate(['/']);
            }, 2000);
          }
        })
      }
    } else {
      this.err = "Invalid email";
    }
  }

}

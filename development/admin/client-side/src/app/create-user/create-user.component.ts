import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  logData: any = {};
  err;
  msg;
  roleId;
  errMail;
  errUsername;
  roleIds: any = [];
  selectedRole = {};
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private service: AppService, private router: Router) {
    service.logoutOnTokenExpire();
  }

  onSelectRole() {
    this.roleId = this.logData['roleid'];
    this.selectedRole = this.roleIds.find(o => o.id == this.roleId);
  }

  ngOnInit() {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
    this.service.getRoles().subscribe(res => {
      this.roleIds = res['roles'];
    })
  }

  verifyEmail() {

  }


  onSubmit(formData: NgForm) {
    var currUser = this.logData;
    document.getElementById('spinner').style.display = 'block';
    this.logData['createrId'] = localStorage.getItem('user_id');
    this.service.addUser(this.logData).subscribe(res => {
      this.msg = res['msg'];

      this.err = '';
      this.errUsername = undefined;
      this.errMail = undefined;
      setTimeout(() => {
        this.service.getCreatedUser(currUser).subscribe(user => {
          this.service.addRole(user['id'], this.selectedRole).subscribe();
        });
        formData.resetForm();
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('success').style.display = "block";
      }, 2000);
      setTimeout(() => {
        document.getElementById('success').style.display = "none";
      }, 4000);
    }, err => {
      this.errMail = undefined; this.errUsername = undefined;
      if (err.error['errMsg'] == "User exists with same username") {
        this.errUsername = err.error['errMsg'];
      } else if (err.error['errMsg'] == "User exists with same email") {
        this.errMail = err.error['errMsg'];
      } else {
        this.err = err.error['errMsg'];
      }
      document.getElementById('spinner').style.display = 'none';
    });

  }
}
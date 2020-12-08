import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
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
  hidePassword = false;
  showToken = false;
  token;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private service: UsersService, private router: Router) { }

  onSelectRole() {
    this.roleId = this.logData['roleid'];
    this.selectedRole = this.roleIds.find(o => o.id == this.roleId);
    this.showToken = false;
    if (this.selectedRole['name'] == 'emission') {
      this.hidePassword = true;
    } else {
      this.hidePassword = false;
    }
  }

  ngOnInit() {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
    this.service.getRoles().subscribe(res => {
      this.roleIds = res['roles'];
    })
  }

  resetForm(formData: NgForm) {
    this.err = '';
    this.showToken = false;
    this.hidePassword = false;
    formData.resetForm();
  }


  onSubmit(formData: NgForm) {
    var currUser = this.logData;
    document.getElementById('spinner').style.display = 'block';
    this.logData['createrId'] = localStorage.getItem('user_id');
    if (this.selectedRole['name'] == 'emission') {
      this.service.getToken(this.logData.username).subscribe(res => {
        this.token = res['token'];
        this.showToken = true;
        if (res['errMsg']) {
          this.err = res['errMsg'];
          document.getElementById('spinner').style.display = 'none';
        } else {
          this.msg = res['msg'];
          formData.resetForm();
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('success').style.display = "block";
        }
      }, err => {

      })
    } else {
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
}
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
  roleIds: any = [{ roleId: 1, roleName: "Admin" }, { roleId: 2, roleName: "Dashboard report creator" }, { roleId: 3, roleName: "Dashboard report viewer" }, { roleId: 4, roleName: "Adhoc analyst" }, { roleId: 5, roleName: "Data emission" }];
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private service: AppService, private router: Router) {

  }

  ngOnInit() {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
  }


  onSubmit(formData: NgForm) {
    document.getElementById('spinner').style.display = 'block';
    this.logData['createrId'] = localStorage.getItem('user_id');
    this.service.addUser(this.logData).subscribe(res => {
      document.getElementById('success').style.display = "Block";
      this.msg = res['msg'];
      document.getElementById('spinner').style.display = 'none';
      this.err = '';
      setTimeout(() => {
        formData.resetForm();
        document.getElementById('success').style.display = "none";
      }, 2000);
    }, err => {
      this.err = err.error['msg'];
      document.getElementById('spinner').style.display = 'none';
    });
  }
}
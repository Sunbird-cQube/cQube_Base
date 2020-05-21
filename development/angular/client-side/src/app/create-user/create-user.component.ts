import { Component, OnInit, OnChanges } from '@angular/core';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';

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


  today = new Date();

  minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + (this.today.getDate())).slice(-2)}`
  futureDate;
  maxDate;

  constructor(private service: AppServiceComponent, private router: Router) {

  }

  ngOnInit() {
    this.dateCheck();
  }

  dateCheck() {
    if (this.logData.start_date === undefined) {
      var element = <HTMLFormElement>document.getElementById('endDate');
      element.disabled = true;
    } else {
      var element = <HTMLFormElement>document.getElementById('endDate');
      element.disabled = false;
    }
  }

  test() {
    var date: any = new Date(new Date(this.logData.start_date + " " + "00:00:00")).getTime();
    this.futureDate = new Date(date + 86400000 * 2);
    this.maxDate = `${this.futureDate.getFullYear()}-${("0" + (this.futureDate.getMonth() + 1)).slice(-2)}-${("0" + (this.futureDate.getDate() - 1)).slice(-2)}`;
  }

  onSubmit() {
    this.logData['createrId'] = localStorage.getItem('user_id');
    this.service.addUser(this.logData).subscribe(res => {
      if (res['msg'] === "User Added") {
        document.getElementById('success').style.display = "Block";
        this.msg = res['msg'];
        this.err = '';
        setTimeout(() => {
          this.router.navigate(['home/map-view']);
        }, 2000);
      }
      if (res['msg'] === "User already exist") {
        this.err = res['msg'];
      }
    })

  }

}
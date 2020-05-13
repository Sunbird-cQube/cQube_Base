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
  roleIds = [1,2,3,4,5];

  today = new Date();

  minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + (this.today.getDate())).slice(-2)}`
  futureDate;
  maxDate;

  constructor(private service: AppServiceComponent, private router: Router) {

  }

  ngOnInit() {
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
declare const $;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  result: any = [];
  tableData: any = [];
  user_status = 1;
  err;
  currentDate = `${(new Date()).getFullYear()}-${("0" + ((new Date()).getMonth() + 1)).slice(-2)}-${("0" + ((new Date()).getDate())).slice(-2)} ${(new Date()).toLocaleTimeString('en-IN', { hour12: false })}`;

  constructor(private router: Router, private service: AppService) { }

  ngOnInit(): void {
    this.showUsers();
  }

  showUsers() {
    document.getElementById('spinner').style.display = 'block';
    if (this.result.length! > 0) {
      $('#table').DataTable().destroy();
    }
    this.service.allUsers().subscribe(res => {
      this.result = res;
      this.result.forEach(item => {
        this.user_status = item.user_status;
        if (item.role_id == 1) {
          item['role_name'] = "Admin";
        }
        if (item.role_id == 2) {
          item['role_name'] = "Dashboard report creator";
        }
        if (item.role_id == 3) {
          item['role_name'] = "Dashboard report viewer";
        }
        if (item.role_id == 4) {
          item['role_name'] = "Adhoc analyst";
        }
        if (item.role_id == 5) {
          item['role_name'] = "Data emission";
        }
      });
      this.tableData = this.result;

      $(document).ready(function () {
        $('#table').DataTable({
          destroy: false, bLengthChange: false, bInfo: false,
          bPaginate: false, scrollY: 420, scrollX: true,
          scrollCollapse: true, paging: false, searching: true,
          fixedColumns: {
            leftColumns: 1
          }
        });
      });
      document.getElementById('spinner').style.display = 'none';
    })
  }

  changeUserStatus(id, usrStatus) {
    if (id != localStorage.getItem('user_id')) {
      if (usrStatus == 1) {
        var status = confirm("Are you sure to deactivate user?");
      } else {
        status = confirm("Are you sure to activate user?");
      }
      if (status == true) {
        document.getElementById('spinner').style.display = 'block';
        var updaterId = localStorage.getItem('user_id');
        this.service.changeStatus(id, updaterId).subscribe(res => {
          this.showUsers();
        });
      }
    } else {
      alert("Logged in user can not change his own status...")
    }
  }
}

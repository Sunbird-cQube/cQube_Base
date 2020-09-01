import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
declare const $;

@Component({
  selector: 'app-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  result: any = [];
  tableData: any = [];
  user_status = 1;
  err;
  currentDate = `${(new Date()).getFullYear()}-${("0" + ((new Date()).getMonth() + 1)).slice(-2)}-${("0" + ((new Date()).getDate())).slice(-2)} ${(new Date()).toLocaleTimeString('en-IN', { hour12: false })}`;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "none";
    this.showUsers();
    document.getElementById('homeBtn').style.display = "Block";
  }

  showUsers() {
    document.getElementById('spinner').style.display = 'block';
    if (this.result.length! > 0) {
      $('#table').DataTable().destroy();
    }
    this.service.allUsers().subscribe(res => {
      this.result = res['users'];
      this.tableData = this.result;
      $(document).ready(function () {
        $('#table').DataTable({
          destroy: false, bLengthChange: false, bInfo: false,
          bPaginate: false, scrollY: 380, scrollX: true,
          scrollCollapse: true, paging: false, searching: true,
          fixedColumns: {
            leftColumns: 1
          }
        });
      });
      document.getElementById('spinner').style.display = 'none';
    }, err => {
      this.err = "No data found";
    })
  }

}

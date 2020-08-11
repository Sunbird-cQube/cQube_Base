import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
declare const $;

@Component({
  selector: 'app-show-telemetry',
  templateUrl: './show-telemetry.component.html',
  styleUrls: ['./show-telemetry.component.css']
})
export class ShowTelemetryComponent implements OnInit {
  result: any = [];
  tableData: any = [];
  err;
  years = [{ year: 2019 }, { year: 2020 }];
  year;
  todaysDate = new Date();
  dateObj = {
    year: this.todaysDate.getFullYear(),
    month: this.todaysDate.getMonth() + 1,
    date: this.todaysDate.getDate()
  };
  constructor(private router: Router, private service: AppService) { }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "none";
    this.showTelemetry();
    document.getElementById('homeBtn').style.display = "Block";
  }
  impression = [];
  showTelemetry() {
    this.year = this.todaysDate.getFullYear();

    document.getElementById('spinner').style.display = 'block';
    if (this.result.length! > 0) {
      $('#table').DataTable().destroy();
    }
    this.service.showTelemetry(this.dateObj).subscribe((res: any) => {

      res.forEach(each => {
        if (each.Student_attendance) {
          each.Student_attendance.forEach(item => {
            this.impression.push(item.impression)
          })
        }
        if (each.Semester) {
          each.Semester.forEach(item => {
            this.impression.push(item.impression)
          })
        }

      });
      console.log(this.impression);

      $(document).ready(function () {
        $('#table').DataTable({
          destroy: false, bLengthChange: false, bInfo: false,
          bPaginate: false, scrollY: 250, scrollX: true,
          scrollCollapse: true, paging: false, searching: true,
          fixedColumns: {
            leftColumns: 1
          }
        });
      });

      $(document).ready(function () {
        $('#table1').DataTable({
          destroy: false, bLengthChange: false, bInfo: false,
          bPaginate: false, scrollY: 250, scrollX: true,
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

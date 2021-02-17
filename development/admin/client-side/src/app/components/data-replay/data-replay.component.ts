import { Component, OnInit } from '@angular/core';
import { DataReplayService } from 'src/app/services/data-replay.service';
import { Router } from '@angular/router';
declare const $;

@Component({
  selector: 'app-data-replay',
  templateUrl: './data-replay.component.html',
  styleUrls: ['./data-replay.component.css']
})
export class DataReplayComponent implements OnInit {
  dataSources: any = [];
  formObj: any = {};
  years1 = [];
  months1 = [];
  years2 = [];
  months2 = [];
  selectedStdYear;
  selectedTchrYear;
  fromDate;
  toDate;
  constructor(private service: DataReplayService, public router: Router) { }
  getMonthYears1: any;
  getMonthYears2: any;
  ngOnInit(): void {
    this.service.getMonthYear({ report: 'sar' }).subscribe(res => {
      this.getMonthYears1 = res;
      var years = Object.keys(this.getMonthYears1);
      years.splice(0, 0, "Select Year");
      years.forEach(year => {
        this.years1.push({ value: year, selected: year == "Select Year" ? true : false })
      })
    })
    this.service.getMonthYear({ report: 'tar' }).subscribe(res => {
      this.getMonthYears2 = res;
      var years = Object.keys(this.getMonthYears2);
      years.splice(0, 0, "Select Year");
      years.forEach(year => {
        this.years2.push({ value: year, selected: year == "Select Year" ? true : false })
      })
    })
    this.service.getDataSources().subscribe(res => {
      this.dataSources = res;
      this.createDataTable();
    })
  }

  createDataTable() {
    $(document).ready(function () {
      $('#table').DataTable({
        destroy: true, bLengthChange: false, bInfo: false,
        bPaginate: false, scrollY: 380, scrollX: true,
        scrollCollapse: true, paging: false, searching: false,
        fixedColumns: {
          leftColumns: 1
        }
      });
    });
  }

  onSelectStdYear(value) {
    this.selectedStdYear = value;
    if (this.selectedStdYear != 'Select Year') {
      this.months1 = [];
      var allMonths = this.getMonthYears1[`${this.selectedStdYear}`];
      allMonths.forEach((element) => {
        this.months1.push({ id: element.month, name: element.month_name.trim() });
      });
      var obj = {
        year: this.selectedStdYear,
        months: []
      }
      this.formObj['student_attendance'] = obj;
      this.shareCheckedList1([]);
    } else {
      this.months1 = [];
    }
  }
  onSelectTchrYear(value) {
    console.log(document.getElementById('stdyear')['value']);
    this.selectedTchrYear = value;
    if (this.selectedTchrYear != 'Select Year') {
      this.months2 = [];
      var allMonths = this.getMonthYears2[`${this.selectedTchrYear}`];
      allMonths.forEach((element) => {
        this.months2.push({ id: element.month, name: element.month_name.trim() });
      });
      var obj = {
        year: this.selectedTchrYear,
        months: []
      }
      this.formObj['teacher_attendance'] = obj;
      this.shareCheckedList2([]);
    } else {
      this.months2 = [];
    }
  }
  selectedMonths1 = [];
  selectedMonths2 = [];
  shareCheckedList1(item: any[]) {
    this.selectedMonths1 = item;
    this.formObj['student_attendance']['months'] = this.selectedMonths1;
  }
  shareCheckedList2(item: any[]) {
    this.selectedMonths2 = item;
    this.formObj['teacher_attendance']['months'] = this.selectedMonths2;
  }

  onSelectFromDate() {
    if (this.fromDate) {
      var date = `${("0" + (this.fromDate.getDate())).slice(-2)}-${("0" + (this.fromDate.getMonth() + 1)).slice(-2)}-${this.fromDate.getFullYear()}`;
      this.formObj['crc'] = {
        fromDate: date,
        toDate: ''
      }
    }
  }

  onSelectToDate() {
    if (this.toDate) {
      var date = `${("0" + (this.toDate.getDate())).slice(-2)}-${("0" + (this.toDate.getMonth() + 1)).slice(-2)}-${this.toDate.getFullYear()}`;
      this.formObj['crc']['toDate'] = date;
    }
  }

  onSubmit() {
    console.log(this.formObj);
  }
  onCancel() {
    this.formObj = {};
    document.getElementById('stdyear')['value'] = 'Select Year';
    document.getElementById('tchryear')['value'] = 'Select Year';
    this.onSelectStdYear('Select Year');
    this.onSelectTchrYear('Select Year');
    this.fromDate = undefined;
    this.toDate = undefined;
  }

}

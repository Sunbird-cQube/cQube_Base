import { Component, OnInit } from '@angular/core';
import { DataReplayService } from 'src/app/services/data-replay.service';
declare const $;

@Component({
  selector: 'app-data-replay',
  templateUrl: './data-replay.component.html',
  styleUrls: ['./data-replay.component.css']
})
export class DataReplayComponent implements OnInit {
  dataSources: any = [];
  years1 = [];
  months1 = [];
  selectedStdYear;
  selectedTchrYear;
  fromDate;
  toDate;
  constructor(private service: DataReplayService) { }
  getMonthYears: any;
  ngOnInit(): void {
    this.service.getMonthYear({ report: 'sar' }).subscribe(res => {
      this.getMonthYears = res;
      var years = Object.keys(this.getMonthYears);
      years.splice(0, 0, "Select Year");
      years.forEach(year => {
        this.years1.push({ value: year, selected: year == "Select Year" ? true : false })
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
      var allMonths = this.getMonthYears[`${this.selectedStdYear}`];
      allMonths.forEach((element) => {
        this.months1.push({ id: element.month, name: element.month_name.trim() });
      });
      this.shareCheckedList([]);
    } else {
      this.months1 = [];
    }
  }

  selectedMonths = [];
  shareCheckedList(item: any[]) {
    this.selectedMonths = item;
  }

  onSelectDate() {
    console.log(this.fromDate);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
declare const $;

@Component({
  selector: 'app-summary-statisticts',
  templateUrl: './summary-statisticts.component.html',
  styleUrls: ['./summary-statisticts.component.css']
})
export class SummaryStatistictsComponent implements OnInit {
  err;
  tableData: any = [];
  constructor(private router: Router, private service: AppService) { }

  ngOnInit(): void {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('homeBtn').style.display = "Block";
    this.service.getSummary().subscribe((res: any) => {
      this.tableData = res;
      this.tableData.forEach(element => {
        if (element.total_records == null) {
          element.total_records = 0;
        }
      });
      $(document).ready(function () {
        $('#table').DataTable({
          destroy: false, bLengthChange: false, bInfo: false,
          bPaginate: false, scrollY: 420, scrollX: true,
          scrollCollapse: true, paging: false, searching: false,
          fixedColumns: {
            leftColumns: 1
          }
        });
      });
      document.getElementById('spinner').style.display = 'none';
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummaryService } from '../../services/summary.service';
declare const $;

@Component({
  selector: 'app-summary-statisticts',
  templateUrl: './summary-statisticts.component.html',
  styleUrls: ['./summary-statisticts.component.css']
})
export class SummaryStatistictsComponent implements OnInit {
  err;
  tableData: any = [];
  tableData1: any = [];
  tableData2: any = [];
  tableData3: any = [];
  tableData4: any = [];
  tableData5: any = [];
  tableData6: any = [];
  tableData7: any = [];
  tableData8: any = [];
  tableData9: any = [];
  tableData10: any = [];
  tableData11: any = [];
  tableData12: any = [];
  constructor(private router: Router, private service: SummaryService) { }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('homeBtn').style.display = "Block";
    this.service.getAttendanceSummary().subscribe((res: any) => {
      this.tableData = res;
      if (this.tableData.length > 0) {
        this.tableWithSubHeaders(this.tableData, "table1");
      }
    });
    this.service.getSemSummary().subscribe((res: any) => {
      this.tableData1 = res;
      if (this.tableData1.length > 0) {
        this.tableWithSubHeaders(this.tableData1, "table2");
      }
    });
    this.service.getCrcSummary().subscribe((res: any) => {
      this.tableData2 = res;
      if (this.tableData2.length > 0) {
        this.tableWithSubHeaders(this.tableData2, "table3");
      }
    });

    this.service.getInfraSummary().subscribe((res: any) => {
      this.tableData3 = res;
      if (this.tableData3.length > 0) {
        this.tableWithSubHeaders(this.tableData3, "table4");
      }
    });

    this.service.getInspecSummary().subscribe((res: any) => {
      this.tableData4 = res;
      if (this.tableData4.length > 0) {
        this.tableWithSubHeaders(this.tableData4, "table5");
      }
    });

    this.service.getstDistSummary().subscribe((res: any) => {
      this.tableData5 = res;
      if (this.tableData5.length > 0) {
        this.tableWithSubHeaders(this.tableData5, "table6");
      }
    });
    this.service.getstBlockSummary().subscribe((res: any) => {
      this.tableData6 = res;
      if (this.tableData6.length > 0) {
        this.tableWithSubHeaders(this.tableData6, "table7");
      }
    });
    this.service.getstClusterSummary().subscribe((res: any) => {
      this.tableData7 = res;
      if (this.tableData7.length > 0) {
        this.tableWithSubHeaders(this.tableData7, "table8");
      }

    });
    this.service.getstSchoolSummary().subscribe((res: any) => {
      this.tableData8 = res;
      if (this.tableData8.length > 0) {
        this.tableWithSubHeaders(this.tableData8, "table9");
        document.getElementById('spinner').style.display = 'none';
      }
    });
    this.service.getDikshaSummary().subscribe((res: any) => {
      this.tableData9 = res;
      if (this.tableData9.length > 0) {
        this.tableWithSubHeaders(this.tableData9, "table10");
        document.getElementById('spinner').style.display = 'none';
      }
    });
    this.service.getUdiseSummary().subscribe((res: any) => {
      this.tableData10 = res;
      if (this.tableData10.length > 0) {
        this.tableWithSubHeaders(this.tableData10, "table11");
        document.getElementById('spinner').style.display = 'none';
      }
    });
    this.service.getPATSummary().subscribe((res: any) => {
      this.tableData11 = res;
      if (this.tableData11.length > 0) {
        this.tableWithSubHeaders(this.tableData11, "table12");
        document.getElementById('spinner').style.display = 'none';
      }
    });

    this.service.getDiskhaTPDummary().subscribe((res: any) => {
      this.tableData12 = res;
      if (this.tableData12.length > 0) {
        this.tableWithSubHeaders(this.tableData12, "table13");
        document.getElementById('spinner').style.display = 'none';
      }
    });
  }

  tableWithSubHeaders(dataSet, tablename) {
    var my_columns = [];
    $.each(dataSet[0], function (key, value) {
      var my_item = {};
      my_item['data'] = key;
      my_item['value'] = value;
      my_columns.push(my_item);
    });
    var sub_column = []
    my_columns.forEach(val => {
      if (typeof val.value == "object") {
        $.each(val.value, function (key, value) {
          var my_item = {};
          my_item['data'] = key;
          my_item['value'] = value;
          sub_column.push(my_item);
        });
      }
    })


    var colspanlength = sub_column.length;

    $(document).ready(function () {
      var headers = '<thead><tr>'
      var subheader = '<tr>';
      var body = '<tbody>';

      my_columns.forEach((column, i) => {
        if (column.data != 'ff_uuid') {
          var col = (column.data.replace(/_/g, ' ')).replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
          headers += `<th ${(column.data != 'records_with_null_value') ? 'rowspan="2" style = "text-transform:capitalize;"' : `colspan= ${colspanlength}  style = 'text-transform:capitalize;'`}>${col}</th>`
        }
      });

      sub_column.forEach((column, i) => {
        var col = (column.data.replace(/_/g, ' ')).replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        subheader += `<th>${col}</th>`
      });

      let newArr = [];
      $.each(dataSet, function (a, b) {
        let temp = [];
        $.each(b, function (key, value) {
          if (key != "records_with_null_value") {
            var new_item = {};
            new_item['data'] = key;
            new_item['value'] = value;
            temp.push(new_item);
          }
          else {
            if (typeof value == "object") {
              $.each(value, function (key1, value1) {
                var new_item = {};
                new_item['data'] = key1;
                new_item['value'] = value1;
                temp.push(new_item);
              })
            }
          }
        });
        newArr.push(temp)
      });

      newArr.forEach((columns) => {
        body += '<tr>';
        columns.forEach((column) => {
          if (column.data != 'ff_uuid') {
            body += `<td>${column.value}</td>`
          }
        });
        body += '</tr>';
      });

      subheader += '</tr>'
      headers += `</tr>${subheader}</thead>`
      body += '</tr></tbody>';
      $(`#${tablename}`).empty();
      $(`#${tablename}`).append(headers);
      $(`#${tablename}`).append(body);
      $(`#${tablename}`).DataTable({
        destroy: true, bLengthChange: false, bInfo: false,
        bPaginate: false, scrollY: "58vh", scrollX: true,
        scrollCollapse: true, paging: false, searching: false,
        fixedColumns: {
          leftColumns: 1
        }
      });
    });
  }
}
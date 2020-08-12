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
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('homeBtn').style.display = "Block";
    this.service.getAttendanceSummary().subscribe((res: any) => {
      this.tableData = res;
      if (this.tableData) {
        this.tableData.forEach(element => {
          if (element.total_records == null) {
            element.total_records = 0;
          }
        });
        this.tableWithSubHeaders(this.tableData, "table1");
      }
    });
    this.service.getSemSummary().subscribe((res: any) => {
      this.tableData = res;
      if (this.tableData) {
        this.tableData.forEach(element => {
          if (element.total_records == null) {
            element.total_records = 0;
          }
        });
        this.tableWithSubHeaders(this.tableData, "table2");
      }
    });
    this.service.getCrcSummary().subscribe((res: any) => {
      this.tableData = res;
      if (this.tableData) {
        this.tableData.forEach(element => {
          if (element.total_records == null) {
            element.total_records = 0;
          }
        });
        this.tableWithSubHeaders(this.tableData, "table3");
      }
    });

    this.service.getInfraSummary().subscribe((res: any) => {
      this.tableData = res;
      if (this.tableData) {
        this.tableData.forEach(element => {
          if (element.total_records == null) {
            element.total_records = 0;
          }
        });
        this.tableWithSubHeaders(this.tableData, "table4");
      }
    });

    this.service.getInspecSummary().subscribe((res: any) => {
      this.tableData = res;
      if (this.tableData) {
        this.tableData.forEach(element => {
          if (element.total_records == null) {
            element.total_records = 0;
          }
        });
        this.tableWithSubHeaders(this.tableData, "table5");
      }
    });

    this.service.getstDistSummary().subscribe((res: any) => {
      this.tableData = res;
      if (this.tableData) {
        this.tableData.forEach(element => {
          if (element.total_records == null) {
            element.total_records = 0;
          }
        });
        this.tableWithSubHeaders(this.tableData, "table6");
      }
    });
    this.service.getstBlockSummary().subscribe((res: any) => {
      this.tableData = res;
      if (this.tableData) {
        this.tableData.forEach(element => {
          if (element.total_records == null) {
            element.total_records = 0;
          }
        });
        this.tableWithSubHeaders(this.tableData, "table7");
      }
    });
    this.service.getstClusterSummary().subscribe((res: any) => {
      this.tableData = res;
      this.tableData.forEach(element => {
        if (element.total_records == null) {
          element.total_records = 0;
        }
        if (element.category == null) {
          element.category = 0;
        }
        if (element.processed_records == null) {
          element.processed_records = 0;
        }
      });
      this.tableWithSubHeaders(this.tableData, "table8");
    });
    this.service.getstSchoolSummary().subscribe((res: any) => {
      this.tableData = res;
      this.tableData.forEach(element => {
        if (element.total_records == null) {
          element.total_records = 0;
        }
      });
      this.tableWithSubHeaders(this.tableData, "table9");
      document.getElementById('spinner').style.display = 'none';
    });

  }

  // createTable(dataSet) {
  //   var my_columns = [];
  //   $.each(dataSet[0], function (key, value) {
  //     var my_item = {};
  //     my_item['data'] = key;
  //     my_item['value'] = value;
  //     my_columns.push(my_item);
  //   });
  //   $(document).ready(function () {
  //     var headers = '<thead><tr>'
  //     var body = '<tbody>';

  //     my_columns.forEach((column, i) => {
  //       var col = (column.data.replace(/_/g, ' ')).replace(/\w\S*/g, (txt) => {
  //         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  //       });
  //       if (column.data !== "ff_uuid") {
  //         headers += `<th>  ${col}</th>`
  //       }
  //     });

  //     let newArr = [];
  //     $.each(dataSet, function (a, b) {
  //       let temp = [];
  //       $.each(b, function (key, value) {
  //         var new_item = {};
  //         new_item['data'] = key;
  //         new_item['value'] = value;
  //         temp.push(new_item);
  //       })
  //       newArr.push(temp)
  //     });

  //     newArr.forEach((columns) => {
  //       body += '<tr>';
  //       columns.forEach((column) => {
  //         if (column.data !== "ff_uuid") {
  //           body += `<td>${column.value}</td>`
  //         }
  //       })
  //       body += '</tr>';
  //     });

  //     headers += `</tr></thead>`
  //     body += '</tr></tbody>';
  //     $("#table").empty();
  //     $("#table").append(headers);
  //     $("#table").append(body);
  //     $('#table').DataTable({
  //       destroy: true, bLengthChange: false, bInfo: false,
  //       bPaginate: false, scrollY: "68vh", scrollX: true,
  //       scrollCollapse: true, paging: false, searching: false,
  //       fixedColumns: {
  //         leftColumns: 1
  //       }
  //     });
  //   });
  // }



  tableWithSubHeaders(dataSet, tablename) {
    var my_columns = [];
    $.each(dataSet[0], function (key, value) {
      var my_item = {};
      my_item['data'] = key;
      my_item['value'] = value;
      my_columns.push(my_item);
    });
    var sub_column = []
    $.each(my_columns[5].value, function (key, value) {
      var my_item = {};
      my_item['data'] = key;
      my_item['value'] = value;
      sub_column.push(my_item);
    });

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

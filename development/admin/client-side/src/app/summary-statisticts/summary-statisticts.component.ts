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
    this.service.getAttendanceSummary().subscribe((res: any) => {
      this.tableData = res;
      this.tableData.forEach(element => {
        if (element.total_records == null) {
          element.total_records = 0;
        }
      });
      this.tableWithSubHeaders(this.tableData, "table1");
    });
    this.service.getSemSummary().subscribe((res: any) => {
      this.tableData = res;
      this.tableData.forEach(element => {
        if (element.total_records == null) {
          element.total_records = 0;
        }
      });
      this.tableWithSubHeaders(this.tableData, "table2");
      document.getElementById('spinner').style.display = 'none';
    });
    this.tableWithSubHeaders(this.crcData, "table3");

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

  public dataSetSAR = [
    {
      "filename": "student_attendance_split_dup.csv",
      "ff_uuid": "ceb2c15a-1274-4ce2-b33e-424c9279cacc",
      "total_records": 110456,
      "blank_records": 10,
      "duplicate_records": 6,
      "records_with_null_value": {
        "district_id": 10,
        "block_id": 10,
        "cluster_id": 10,
        "school_id": 10,
        "lat": 10,
        "lng": 10
      },
      "processed_records": 110428,
      "process_start_time": "2020-07-08T17:08:25.004Z",
      "process_end_time": "2020-07-08T17:08:25.004Z",
    },
    {
      "filename": "student_attendance_split_dup.csv",
      "ff_uuid": "e6b8e0b0-7baa-4be8-861a-4d8234e03d02",
      "total_records": 110560,
      "blank_records": 50,
      "duplicate_records": 4,
      "records_with_null_value": {
        "district_id": 20,
        "block_id": 20,
        "cluster_id": 10,
        "school_id": 20,
        "lat": 20,
        "lng": 20
      },
      "processed_records": 110494,
      "process_start_time": "2020-07-08T17:34:38.208Z",
      "process_end_time": "2020-07-08T17:34:38.208Z"
    }
  ]

  public semData = [
    {
      "filename": "sem2_pipe_split.csv",
      "ff_uuid": "acb8c5dc-6ab1-4640-87a9-b623cb5a2c71",
      "total_records": 9,
      "blank_lines": 1,
      "duplicate_records": 0,
      "records_with_null_value": {
        "student_id": 0,
        "school_id": 0,
        "semester": 0,
        "grade": 0
      },
      "processed_records": 6,
      "process_start_time": "2020-14-54 13:54:34",
      "process_end_time": "2020-14-54 13:54:34"
    }
  ]

  public crcData = [
    {
      "filename": "user_location_master.csv",
      "ff_uuid": "7369e7b1-2eb8-44c0-a7e1-0cd297bf0f63",
      "total_records": 9,
      "blank_lines": 1,
      "duplicate_records": 0,
      "records_with_null_value": {
        "school_id": 0,
        "inspection_id": 0,
        "in_school_location": 7,
        "created_on": 0,
        "latitude": 0.0,
        "longitude": 0.0
      },
      "processed_records": null,
      "process_start_time": "2020-07-14 17:28:20.032",
      "process_end_time": "2020-07-14 17:28:20.032"
    }
  ]

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

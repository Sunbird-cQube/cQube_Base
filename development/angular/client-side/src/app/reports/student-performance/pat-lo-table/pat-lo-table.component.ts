import { Component, OnInit } from "@angular/core";
import * as Highcharts from "highcharts/highstock";
import HeatmapModule from "highcharts/modules/heatmap";
HeatmapModule(Highcharts);
import { AppServiceComponent } from "../../../app.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { PatReportService } from "../../../services/pat-report.service";
declare const $;

@Component({
  selector: "app-pat-lo-table",
  templateUrl: "./pat-lo-table.component.html",
  styleUrls: ["./pat-lo-table.component.css"],
})
export class PATLOTableComponent implements OnInit {
  level = "";

  // For filter implementation
  districtNames = [];
  district;
  blockNames = [];
  block;
  clusterNames = [];
  cluster;

  blockHidden = true;
  clusterHidden = true;

  years = [];
  grades = [];
  subjects = [];
  examDates = [];
  allViews = [];

  public year = "";
  public grade = "all";
  public subject = "all";
  public examDate = "all";
  public viewBy = "indicator";

  //to set hierarchy level
  skul = true;
  dist = false;
  blok = false;
  clust = false;

  // to set hierarchy values
  districtHierarchy: any;
  blockHierarchy: any;
  clusterHierarchy: any;

  data;

  // to download the excel report
  public fileName: any = ``;
  public reportData: any = [];

  public metaData: any;
  myData;
  state: string;
  months: string[];
  month: string = "";

  reportName = "periodic_assessment_test_loTable";
  managementName;
  management;
  category;

  //For pagination.....
  pageSize = 500;
  currentPage = 1;
  filteredData = []
  showPagination = false;
  validTransactions: any;
  table: any;
  updatedTable:any = [];

  constructor(
    public http: HttpClient,
    public service: PatReportService,
    public commonService: AppServiceComponent,
    public router: Router
  ) {
    service.PATHeatMapMetaData({ report: "pat" }).subscribe(
      (res) => {
        this.metaData = res["data"];
        for (let i = 0; i < this.metaData.length; i++) {
          this.years.push(this.metaData[i]["academic_year"]);
        }
        this.year = this.years[this.years.length - 1];
        let i;
        for (i = 0; i < this.metaData.length; i++) {
          if (this.metaData[i]["academic_year"] == this.year) {
            this.months = Object.keys(res["data"][i].data.months);
            this.grades = this.metaData[i].data["grades"];
            this.subjects = this.metaData[i].data["subjects"];
            this.allViews = this.metaData[i].data["viewBy"];
            break;
          }
        }
        this.month = this.months[this.months.length - 1];
        this.examDates = this.metaData[i].data["months"][`${this.month}`][
          "examDate"
        ];
        this.grades = [
          { grade: "all" },
          ...this.grades.filter((item) => item !== { grade: "all" }),
        ];
        this.subjects = [
          { subject: "all" },
          ...this.subjects.filter((item) => item !== { subject: "all" }),
        ];
        this.examDates = [
          { exam_date: "all" },
          ...this.examDates.filter((item) => item !== { exam_date: "all" }),
        ];

        this.fileName = `${this.reportName}_overall_allDistricts_${this.month}_${this.year}_${this.commonService.dateAndTime}`;

        this.commonFunc();
      },
      (err) => {
        this.metaData = [];
        this.commonService.loaderAndErr(this.metaData);
      }
    );
  }

  ngOnInit(): void {
    this.managementName = this.management = JSON.parse(localStorage.getItem('management')).id;
    this.category = JSON.parse(localStorage.getItem('category')).id;
    this.managementName = this.commonService.changeingStringCases(
      this.managementName.replace(/_/g, " ")
    );
    this.state = this.commonService.state;
    document.getElementById("homeBtn").style.display = "block";
    document.getElementById("backBtn").style.display = "none";
    this.onResize();
  }

  height = window.innerHeight;
  onResize() {
    this.height = window.innerHeight;
  }

  onChangePage(){
    document.getElementById('spinner').style.display = 'block';
    this.pageChange();
  }

  pageChange(){
    this.filteredData = this.reportData.slice(((this.currentPage - 1) * this.pageSize), ((this.currentPage - 1) * this.pageSize + this.pageSize));
    this.createTable(this.filteredData);
  }

  fetchFilters(metaData) {
    let i;
    for (i = 0; i < metaData.length; i++) {
      if (metaData[i]["academic_year"] == this.year) {
        this.months = Object.keys(this.metaData[i].data.months);
        this.grades = metaData[i].data["grades"];
        this.subjects = metaData[i].data["subjects"];
        this.allViews = metaData[i].data["viewBy"];
        break;
      }
    }
    if (!this.months.includes(this.month)) {
      this.month = this.months[this.months.length - 1];
    }
    this.examDates = metaData[i].data["months"][`${this.month}`]["examDate"];
    this.examDates = [
      { exam_date: "all" },
      ...this.examDates.filter((item) => item !== { exam_date: "all" }),
    ];

    this.grades = [
      { grade: "all" },
      ...this.grades.filter((item) => item !== { grade: "all" }),
    ];
    this.subjects = [
      { subject: "all" },
      ...this.subjects.filter((item) => item !== { subject: "all" }),
    ];
  }

  resetToInitPage() {
    this.resetTable();
    this.fileName = `${this.reportName}_overall_allDistricts_${this.month}_${this.year}_${this.commonService.dateAndTime}`;
    this.skul = true;
    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.grade = "all";
    this.examDate = "all";
    this.subject = "all";
    this.viewBy = "indicator";
    this.district = undefined;
    this.block = undefined;
    this.cluster = undefined;
    this.blockHidden = true;
    this.clusterHidden = true;
    this.year = this.years[this.years.length - 1];
    this.commonFunc();
    document.getElementById("home").style.display = "none";
  }

  commonFunc = () => {
    this.commonService.errMsg();
    this.level = "district";
    this.fetchFilters(this.metaData);
    // $(`#LOtable`).empty();
    let a = {
      year: this.year,
      month: this.month,
      grade: this.grade == "all" ? "" : this.grade,
      subject_name: this.subject == "all" ? "" : this.subject,
      exam_date: this.examDate == "all" ? "" : this.examDate,
      viewBy: this.viewBy == "indicator" ? "indicator" : this.viewBy,
      management: this.management,
      category: this.category,
    };
    this.month = a.month;
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.patLOTableDistData(a).subscribe(
      (response) => {
        this.resetTable();
        this.updatedTable = this.reportData = response["tableData"];
        var districtNames = response["districtDetails"];
        this.districtNames = districtNames.sort((a, b) =>
          a.district_name > b.district_name
            ? 1
            : b.district_name > a.district_name
            ? -1
            : 0
        );
        this.onChangePage();
        this.commonService.loaderAndErr(this.reportData);
      },
      (err) => {
        this.handleError();
      }
    );
  };

  columns =[];
  createTable(dataSet) {
    var my_columns = this.columns = this.commonService.getColumns(dataSet);
    $(document).ready(function () {
      var headers = "<thead><tr>";
      var body = "<tbody>";
      my_columns.forEach((column, i) => {
        var col = column.data.replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        headers += `<th>${col}</th>`;
      });

      let newArr = [];
      $.each(dataSet, function (a, b) {
        let temp = [];
        $.each(b, function (key, value) {
          var new_item = {};
          new_item["data"] = key;
          new_item["value"] = value;
          temp.push(new_item);
        });
        newArr.push(temp);
      });

      newArr.forEach((columns) => {
        body += "<tr>";
        columns.forEach((column) => {
          body += `<td>${column.value}</td>`;
        });
        body += "</tr>";
      });

      headers += `</tr></thead>`;
      body += "</tbody>";
      $(`#LOtable`).empty();
      $(`#LOtable`).append(headers);
      $(`#LOtable`).append(body);
      var obj =
        {
          destroy: true,
          bLengthChange: false,
          bInfo: false,
          bPaginate: false,
          scrollY: "62vh",
          scrollX: true,
          scrollCollapse: true,
          searching: false,
          paging: false, 
          fixedColumns: {
            leftColumns: 1,
          },
        }
        if(dataSet.length > 0){
          obj['order'] = [[0, "asc"]];
          obj['columnDefs'] = [{ targets: 0, type: "date-dd-mm-yyyy" }];
        }
      
      $(`#LOtable`).DataTable(obj);
      $(document).ready(function() {
        
        $('#LOtable').on( 'page.dt', function () 
        {
          $('.dataTables_scrollBody').scrollTop(0);
        });
        }, 300);
        document.getElementById('spinner').style.display = 'none';
      });
      this.showPagination = true;
  }

  selectedYear() {
    document.getElementById("home").style.display = "none";
    this.month = "";
    this.grade = "all";
    this.examDate = "all";
    this.subject = "all";
    this.fetchFilters(this.metaData);
    this.levelWiseFilter();
  }

  selectedMonth() {
    this.fileName = `${this.reportName}_${this.grade}_allDistricts_${this.month}_${this.year}_${this.commonService.dateAndTime}`;
    this.fetchFilters(this.metaData);
    this.grade = "all";
    this.examDate = "all";
    this.subject = "all";
    document.getElementById("home").style.display = "none";
    this.levelWiseFilter();
  }

  selectedGrade() {
    if (!this.month && this.month === '') {
      alert("Please select month!");
      return;
    }

    this.fileName = `${this.reportName}_${this.grade}_allDistricts_${this.month}_${this.year}_${this.commonService.dateAndTime}`;
    this.levelWiseFilter();
  }

  selectedSubject() {
    if (!this.month && this.month === '') {
      alert("Please select month!");
      return;
    }

    this.fileName = `${this.reportName}_${this.grade}_${this.subject}_allDistricts_${this.month}_${this.year}_${this.commonService.dateAndTime}`;
    this.levelWiseFilter();
  }

  selectedExamDate() {
    if (!this.month && this.month === '') {
      alert("Please select month!");
      return;
    }

    this.fileName = `${this.reportName}_${this.grade}_${this.examDate}_allDistricts_${this.month}_${this.year}_${this.commonService.dateAndTime}`;
    this.levelWiseFilter();
  }

  selectedViewBy() {
    if (!this.month && this.month === '') {
      alert("Please select month!");
      return;
    }

    this.fileName = `${this.reportName}_${this.grade}_${this.viewBy}_allDistricts_${this.month}_${this.year}_${this.commonService.dateAndTime}`;
    this.levelWiseFilter();
  }

  selectedDistrict(districtId) {
    if (!this.month && this.month === '') {
      alert("Please select month!");
      this.district = '';
      this.dist = false;
      $('#district').val('');
      return;
    }

    this.resetTable();
    this.level = "block";
    this.fileName = `${this.reportName}_${this.grade}_${this.level}s_of_district_${districtId}_${this.month}_${this.year}_${this.commonService.dateAndTime}`;
    this.block = undefined;
    this.cluster = undefined;
    this.blockHidden = false;
    this.clusterHidden = true;
    document.getElementById("home").style.display = "block";
    this.commonService.errMsg();

    let a = {
      year: this.year,
      month: this.month,
      grade: this.grade == "all" ? "" : this.grade,
      subject_name: this.subject == "all" ? "" : this.subject,
      exam_date: this.examDate == "all" ? "" : this.examDate,
      viewBy: this.viewBy == "indicator" ? "indicator" : this.viewBy,
      districtId: districtId,
      management: this.management,
      category: this.category,
    };

    this.service.patLOTableBlockData(a).subscribe(
      (response) => {
        this.updatedTable = this.reportData = response["tableData"];
        var blockNames = response["blockDetails"];
        this.blockNames = blockNames.sort((a, b) =>
          a.block_name > b.block_name ? 1 : b.block_name > a.block_name ? -1 : 0
        );

        this.onChangePage();
        var dist = this.districtNames.find((a) => a.district_id == districtId);
        this.districtHierarchy = {
          districtName: dist.district_name,
          distId: dist.district_id,
        };
        this.skul = false;
        this.dist = true;
        this.blok = false;
        this.clust = false;
        this.commonService.loaderAndErr(this.reportData);
      },
      (err) => {
        this.handleError();
      }
    );
  }

  selectedBlock(blockId) {
    if (!this.month && this.month === '') {
      alert("Please select month!");
      this.block = '';
      this.blok = false;
      $('#block').val('');
      return;
    }

    this.resetTable();
    this.level = "cluster";
    this.fileName = `${this.reportName}_${this.grade}_${this.level}s_of_block_${blockId}_${this.month}_${this.year}_${this.commonService.dateAndTime}`;
    this.cluster = undefined;
    this.blockHidden = false;
    this.clusterHidden = false;
    document.getElementById("home").style.display = "block";
    this.commonService.errMsg();

    let a = {
      year: this.year,
      month: this.month,
      grade: this.grade == "all" ? "" : this.grade,
      subject_name: this.subject == "all" ? "" : this.subject,
      exam_date: this.examDate == "all" ? "" : this.examDate,
      viewBy: this.viewBy == "indicator" ? "indicator" : this.viewBy,
      districtId: this.district,
      blockId: blockId,
      management: this.management,
      category: this.category,
    };

    this.service.patLOTableClusterData(a).subscribe(
      (response) => {
        this.updatedTable = this.reportData = response["tableData"];
        var clusterNames = response["clusterDetails"];
        this.clusterNames = clusterNames.sort((a, b) =>
          a.cluster_name > b.cluster_name
            ? 1
            : b.cluster_name > a.cluster_name
            ? -1
            : 0
        );
        this.onChangePage();
        var block = this.blockNames.find((a) => a.block_id == blockId);
        this.blockHierarchy = {
          districtName: block.district_name,
          distId: block.district_id,
          blockName: block.block_name,
          blockId: block.block_id,
        };

        this.skul = false;
        this.dist = false;
        this.blok = true;
        this.clust = false;
        this.commonService.loaderAndErr(this.reportData);
      },
      (err) => {
        this.handleError();
      }
    );
  }

  selectedCluster(clusterId) {
    if (!this.month && this.month === '') {
      alert("Please select month!");
      this.cluster = '';
      this.clust = false;
      $('#cluster').val('');
      return;
    }

    this.resetTable();
    this.level = "school";
    this.fileName = `${this.reportName}_${this.grade}_${this.level}s_of_cluster_${clusterId}_${this.month}_${this.year}_${this.commonService.dateAndTime}`;
    document.getElementById("home").style.display = "block";
    this.commonService.errMsg();

    let a = {
      year: this.year,
      month: this.month,
      grade: this.grade == "all" ? "" : this.grade,
      subject_name: this.subject == "all" ? "" : this.subject,
      exam_date: this.examDate == "all" ? "" : this.examDate,
      viewBy: this.viewBy == "indicator" ? "indicator" : this.viewBy,
      districtId: this.district,
      blockId: this.block,
      clusterId: clusterId,
      management: this.management,
      category: this.category,
    };

    this.service.patLOTableSchoolData(a).subscribe(
      (response) => {
        this.updatedTable = this.reportData = response["tableData"];
        this.onChangePage();
        var cluster = this.clusterNames.find((a) => a.cluster_id == clusterId);
        this.clusterHierarchy = {
          districtName: cluster.district_name,
          distId: cluster.district_id,
          blockName: cluster.block_name,
          blockId: cluster.block_id,
          clusterId: cluster.cluster_id,
          clusterName: cluster.cluster_name,
        };
        this.skul = false;
        this.dist = false;
        this.blok = false;
        this.clust = true;

        this.commonService.loaderAndErr(this.reportData);
      },
      (err) => {
        this.handleError();
      }
    );
  }

  //resetting table
  resetTable() {
    if ($.fn.DataTable.isDataTable("#LOtable")) {
      this.reportData = [];
      $("#LOtable").DataTable().destroy();
      $("#LOtable").empty();
    }
  }
  
  //level wise filter
  levelWiseFilter() {
    document.getElementById("initTable").style.display = "block";
    document.getElementById("home").style.display = "block";
    if (this.level == "district") {
      this.resetTable();
      this.commonFunc();
    }
    if (this.level == "block") {
      this.selectedDistrict(this.district);
    }
    if (this.level == "cluster") {
      this.selectedBlock(this.block);
    }
    if (this.level == "school") {
      this.selectedCluster(this.cluster);
    }
  }

  //error handling
  handleError() {
    $(`#LOtable`).empty();
    this.reportData = [];
    this.commonService.loaderAndErr(this.reportData);
    document.getElementById("initTable").style.display = "none";
  }

  // to download the csv report
  downloadReport() {
    var position = this.reportName.length;
    this.fileName = [this.fileName.slice(0, position), `_${this.management}`, this.fileName.slice(position)].join('');
    this.commonService.download(this.fileName, this.reportData);
  }

  updateFilter(event: any) {
    this.columns = this.commonService.getColumns(this.updatedTable);
    var val = event.target.value.toLowerCase();
    
    // filter our data
    let ref = this;
    let temp:any = [];

    if (val) {
      temp = this.updatedTable.filter(function (d: any) {
        let found = false;
  
        for (let i = 0; i < ref.columns.length; i++) {
          let value = d[ref.columns[i].data]; 
          if (typeof value === 'number') {
            value = value.toString()
          }

          if (value.toLowerCase().indexOf(val) !== -1) {
            found = true;
            break;
          }
        }
        return found;
      });
    } else {
      document.getElementById('spinner').style.display = 'block';
      temp = this.updatedTable;
    }
        
    // update the rows
    this.reportData = temp;
    this.pageChange();
  }
}

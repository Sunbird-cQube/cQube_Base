import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DataReplayService } from 'src/app/services/data-replay.service';
import { Router } from '@angular/router';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import data from '../../../assets/dataReplayConfig.json';
declare const $;

@Component({
  selector: 'app-data-replay',
  templateUrl: './data-replay.component.html',
  styleUrls: ['./data-replay.component.css']
})
export class DataReplayComponent implements OnInit {
  dataSources: any = [];
  minDate;
  dataSourceName = '';
  formObj: any = {};
  years1 = [];
  months1 = [];
  years2 = [];
  months2 = [];
  years3 = [];
  months3 = [];
  examCodes: any = [];

  selectedStdYear;
  selectedTchrYear;
  // fromDate;
  // toDate;
  summaryFromDate;
  summaryToDate;

  semesters: any = [];
  selectedSemesters = [];
  batchIds: any = [];
  selectedBatchIds;
  options = [
    { id: '', value: "Select" },
    //{ id: 'No', value: 'No' }, 
    { id: 'delete all data', value: 'Delete all data' }];

  //error messages
  monthErrMsg = "Please select months also along with year";
  stdMonthErr = '';
  tchrMonthErr = '';
  crcMonthErr = '';
  toDateErr = '';

  allSemData: any;
  academic_years: any = [];
  selected_academic_year;

  @ViewChildren(MultiSelectComponent) multiSelect: QueryList<MultiSelectComponent>;
  @ViewChild('multiSelect1') multiSelect1: MultiSelectComponent;
  @ViewChild('multiSelect2') multiSelect2: MultiSelectComponent;
  @ViewChild('multiSelect3') multiSelect3: MultiSelectComponent;

  constructor(private service: DataReplayService, public router: Router) { }
  getMonthYears1: any;
  getMonthYears2: any;
  getMonthYears3: any;
  public currTime;

  //For Retention
  daysArr = [];
  selectedDays = 90;
  retentionData = {};

  ngOnInit(): void {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
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
    this.service.getMonthYear({ report: 'crc' }).subscribe(res => {
      this.getMonthYears3 = res;
      var years = Object.keys(this.getMonthYears3);
      years.splice(0, 0, "Select Year");
      years.forEach(year => {
        this.years3.push({ value: year, selected: year == "Select Year" ? true : false })
      })
      document.getElementById('spinner').style.display = 'none';
    })

    this.service.getBatchIds().subscribe((res: any) => {
      var i = 1;
      res.forEach(element => {
        this.batchIds.push({ id: element.batch_id, name: element.batch_id });
        i++;
      });
    });

    this.service.getExamCode().subscribe((res: any) => {
      var i = 1;
      res.forEach(element => {
        this.examCodes.push({ id: element.exam_code, name: element.exam_code });
        i++;
      });
    })

    this.service.getSemesters().subscribe((res: any) => {
      this.allSemData = res;
      this.allSemData.forEach(element => {
        this.academic_years.push(element.academic_year);
      });
      this.academic_years.unshift('Select Academic Year');
    })
    // this.service.getDataSources().subscribe(res => {
    data.map(item => {
      if (item.status == true) {
        this.dataSources.push(item);
      }
    })
    this.dataSources = this.dataSources.sort((a, b) => (a.sourceName > b.sourceName) ? 1 : ((b.sourceName > a.sourceName) ? -1 : 0));
    this.createDataTable();

    var noOfDaysInCurrYear = (new Date()).getFullYear() % 4 == 0 ? 366 : 365;
    for (let i = 0; i < noOfDaysInCurrYear; i += 30) {
      this.daysArr.push(i);
    }
    this.daysArr.splice(0,1);
    this.daysArr.push(this.daysArr[this.daysArr.length - 1] + noOfDaysInCurrYear % 30);
  }

  onSelectDataSource(data) {
    this.formObj = {};
    this.dataSourceName = data;
    if (data != 'Select Data Source') {
    } else {
      this.dataSourceName = '';
    }
  }

  createDataTable() {
    $(document).ready(function () {
      $('#table').DataTable({
        destroy: true, bLengthChange: false, bInfo: false,
        bPaginate: false, scrollY: 350, scrollX: true,
        scrollCollapse: true, paging: false, searching: false,
        fixedColumns: {
          leftColumns: 1
        }
      });
    });
  }

  onSelectStdYear(value) {
    this.stdMonthErr = '';
    this.selectedStdYear = value;
    if (this.selectedStdYear != 'Select Year') {
      if (this.multiSelect1)
        this.multiSelect1.resetSelected();
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
    this.tchrMonthErr = '';
    this.selectedTchrYear = value;
    if (this.selectedTchrYear != 'Select Year') {
      if (this.multiSelect2)
        this.multiSelect2.resetSelected();
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
    if (item.length > 0) {
      this.stdMonthErr = '';
    }
  }
  shareCheckedList2(item: any[]) {
    this.selectedMonths2 = item;
    this.formObj['teacher_attendance']['months'] = this.selectedMonths2;
    if (item.length > 0) {
      this.tchrMonthErr = '';
    }
  }

  onSelectAcademicYear(data) {
    this.selected_academic_year = data;
    if (this.selected_academic_year != 'Select Academic Year') {
      var obj = {
        academic_year: this.selected_academic_year,
        semesters: []
      }
      this.formObj['semester'] = obj;
      this.allSemData.forEach(element => {
        this.semesters.push({ id: element.semester, name: "Semester " + element.semester });
      });
    }
  }

  shareCheckedList3(item: any[]) {
    this.selectedSemesters = item;
    if (this.selectedSemesters.length > 0) {
      this.formObj['semester'].semesters = this.selectedSemesters;
    } else {
      delete this.formObj['semester'];
    }
  }

  shareCheckedList4(item: any[]) {
    this.selectedBatchIds = item;
    if (this.selectedBatchIds.length > 0) {
      var obj = {
        batch_id: this.selectedBatchIds
      }
      this.formObj['diksha_tpd'] = obj;
    } else {
      delete this.formObj['diksha_tpd'];
    }
  }

  selectedExamCodes;
  shareCheckedList6(item: any[]) {
    this.selectedExamCodes = item;
    if (this.selectedExamCodes.length > 0) {
      var obj = {
        exam_code: this.selectedExamCodes
      }
      this.formObj['periodic_assessment_test'] = obj;
    } else {
      delete this.formObj['periodic_assessment_test'];
    }
  }

  selectedCRCYear;
  onSelectCRCYear(value) {
    this.crcMonthErr = '';
    this.selectedCRCYear = value;
    if (this.selectedCRCYear != 'Select Year') {
      if (this.multiSelect3)
        this.multiSelect3.resetSelected();
      this.months3 = [];
      var allMonths = this.getMonthYears3[`${this.selectedCRCYear}`];
      allMonths.forEach((element) => {
        this.months3.push({ id: element.month, name: element.month_name.trim() });
      });
      var obj = {
        year: this.selectedCRCYear,
        months: []
      }
      this.formObj['crc'] = obj;
      this.shareCheckedList5([]);
    } else {
      this.months3 = [];
    }
  }

  selectedCRCMonths = [];
  shareCheckedList5(item: any[]) {
    this.selectedCRCMonths = item;
    this.formObj['crc']['months'] = this.selectedCRCMonths;
    if (item.length > 0) {
      this.crcMonthErr = '';
    }
  }

  onSelectFromDate() {
    this.toDateErr = '';
    if (this.summaryFromDate) {
      let date = `${this.summaryFromDate.getFullYear()}-${("0" + (this.summaryFromDate.getMonth() + 1)).slice(-2)}-${("0" + (this.summaryFromDate.getDate())).slice(-2)}`;
      this.formObj['diksha_summary_rollup'] = {
        from_date: date,
        to_date: ''
      }
      this.minDate = new Date(this.summaryFromDate.getFullYear(), ((this.summaryFromDate.getMonth())), this.summaryFromDate.getDate());
    }
  }

  onSelectToDate() {
    this.toDateErr = '';
    if (this.summaryToDate) {
      let date = `${this.summaryToDate.getFullYear()}-${("0" + (this.summaryToDate.getMonth() + 1)).slice(-2)}-${("0" + (this.summaryToDate.getDate())).slice(-2)}`;
      this.formObj['diksha_summary_rollup']['to_date'] = date;
    }
  }

  onSelecUdise(value) {
    if (value != '') {
      var obj = {
        option: value
      }
      this.formObj['udise'] = obj;
    } else {
      delete this.formObj['udise'];
    }
  }

  onSelectInfrastructure(value) {
    if (value != '') {
      var obj = {
        option: value
      }
      this.formObj['infrastructure'] = obj;
    } else {
      delete this.formObj['infrastructure'];
    }
  }

  onSelectStatic(value) {
    if (value != '') {
      var obj = {
        option: value
      }
      this.formObj['static'] = obj;
    } else {
      delete this.formObj['static'];
    }
  }

  onSubmit() {
    document.getElementById('spinner').style.display = 'block';
    if (Object.keys(this.formObj).length > 0) {
      if (this.summaryFromDate && !this.summaryToDate) {
        alert("Please select toDate also along with fromDate");
        document.getElementById('spinner').style.display = 'none';
      } else if (this.selectedStdYear && this.selectedMonths1.length == 0) {
        alert(this.monthErrMsg);
        document.getElementById('spinner').style.display = 'none';
      } else if (this.selectedTchrYear && this.selectedMonths2.length == 0) {
        alert(this.monthErrMsg);
        document.getElementById('spinner').style.display = 'none';
      } else if (this.selectedCRCYear && this.selectedCRCMonths.length == 0) {
        alert(this.monthErrMsg);
        document.getElementById('spinner').style.display = 'none';
      } else if (this.selected_academic_year && this.selectedSemesters.length == 0) {
        alert("Please selecte semester along with academic year");
        document.getElementById('spinner').style.display = 'none';
      } else {
        var date = new Date();
        this.currTime = `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + (date.getDate())).slice(-2)}${("0" + (date.getHours())).slice(-2)}${("0" + (date.getMinutes())).slice(-2)}${("0" + (date.getSeconds())).slice(-2)}`;
        this.service.saveDataToS3({ formData: this.formObj, timeStamp: this.currTime }).subscribe(res => {
          this.onCancel();
          document.getElementById('spinner').style.display = 'none';
          alert(res['msg']);
        })
      }
    } else {
      alert("Please select some options");
      document.getElementById('spinner').style.display = 'none';
    }
  }
  onCancel() {
    this.formObj = {};
    document.getElementById('dataSources')['value'] = 'Select Data Source';
    this.onSelectDataSource('Select Data Source');
    this.onSelectStdYear('Select Year');
    this.onSelectTchrYear('Select Year');
    this.onSelectCRCYear('Select Year');
    this.summaryFromDate = undefined;
    this.summaryToDate = undefined;
    this.selectedStdYear = undefined;
    this.selectedTchrYear = undefined;
    this.selectedCRCYear = undefined;
    this.semesters = [];
    this.selectedMonths1 = [];
    this.selectedMonths2 = [];
    this.selectedCRCMonths = [];
    this.months1 = this.months1.map(month => {
      month.status = false;
      return month;
    });
    this.months2 = this.months2.map(month => {
      month.status = false;
      return month;
    });
    this.months3 = this.months3.map(month => {
      month.status = false;
      return month;
    });
    this.semesters = this.semesters.map(sem => {
      sem.status = false;
      return sem;
    });
    this.batchIds = this.batchIds.map(batch => {
      batch.status = false;
      return batch;
    });

    this.examCodes = this.examCodes.map(code => {
      code.status = false;
      return code;
    });

    if (this.multiSelect)
      this.multiSelect.forEach((child) => { child.resetSelected() })
  }


  onSubmitRet() {
    document.getElementById('spinner').style.display = 'block';
    var date = new Date();
    var currTime = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)}, ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)}`;
    this.retentionData = { retentionDays: this.selectedDays, retentionTime: currTime }
    this.service.saveDataToS3({ dataType: "retention", retData: this.retentionData }).subscribe(res => {
      document.getElementById('spinner').style.display = 'none';
      alert("Data retention successully initiated");
    }, err => {
      alert(err.errMsg);
      document.getElementById('spinner').style.display = 'none';
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { NifiShedularService } from '../../services/nifi-shedular.service';
declare const $;

@Component({
  selector: 'app-nifi-shedular',
  templateUrl: './nifi-shedular.component.html',
  styleUrls: ['./nifi-shedular.component.css']
})
export class NifiShedularComponent implements OnInit {
  //Bootstrap Date picker
  myDateValue = [];
  placeHolder;
  model = '';

  result: any = [];
  data: any = [];
  user_status = 1;
  err;
  msg;
  showMsg;
  timeArr = [];
  selectedTime = [];
  selectedShedule = '';
  selectMin = '';
  hoursArr = [];
  minsArr = [];
  selectedHour = [];
  selectedMinuts = [];
  selectedDuration = '';
  processorId;

  timeRange = [{ key: "daily", value: "Daily" }, { key: "weekly", value: "Weekly" }, { key: "monthly", value: "Monthly" }, { key: "yearly", value: "Yearly" }];
  selectedTimeRange = [];

  allDays = [{ key: 1, name: "Monday" }, { key: 2, name: "Tuesday" }, { key: 3, name: "Wednesday" }, { key: 4, name: "Thursday" }, { key: 5, name: "Friday" }, { key: 6, name: "Saturday" }, { key: 7, name: "Sunday" }];
  selectedDay = [];
  day;

  allMonths = [];
  selectedMonth = [];
  month;

  allDates = [];
  selectedDate = [];
  date;

  showDay = [true, true, true, true, true, true, true];
  showMonth = [];
  showDate = [];

  today = new Date();
  minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + (this.today.getDate())).slice(-2)}`;

  constructor(private service: NifiShedularService) {
    for (let i = 1; i <= 10; i++) {
      this.hoursArr.push({ hours: i });
    }
    for (let i = 0; i < 60; i++) {
      this.minsArr.push({ mins: `${("0" + (i)).slice(-2)}` });
    }
    for (let i = 1; i < 13; i++) {
      this.allMonths.push({ key: i });
      this.showMonth.push(true);
    }
    for (let i = 1; i < 29; i++) {
      this.allDates.push({ key: i });
      this.showDate.push(true);
    }
  }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "none";
    this.showTable();
    document.getElementById('homeBtn').style.display = "Block";
    //get 24 hours time
    var date, array = [];
    date = new Date();

    while (date.getMinutes() % 60 !== 0) {
      date.setMinutes(date.getMinutes() + 1);
    }
    for (var i = 0; i < 24; i++) {
      array.push({ time: ("0" + (date.getHours())).slice(-2) });
      date.setMinutes(date.getMinutes() + 60);
    }
    array.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));

    this.timeArr = array;
  }

  onSelectTimeRange(i) {
    if (this.selectedTimeRange[i] == 'daily') {
      this.showDay[i] = true;
      this.showMonth[i] = true;
      this.showDate[i] = true;
    }
    if (this.selectedTimeRange[i] == 'weekly') {
      this.showDay[i] = false;
      this.showMonth[i] = true;
      this.showDate[i] = true;
    }
    if (this.selectedTimeRange[i] == 'monthly') {
      this.showDay[i] = true;
      this.showMonth[i] = false;
      this.showDate[i] = true;
      this.placeHolder = "Select Date"
    }
    if (this.selectedTimeRange[i] == 'yearly') {
      this.showDay[i] = true;
      this.showMonth[i] = false;
      this.showDate[i] = false;
      this.placeHolder = "Select Date"
    }
  }

  onSelectDay(i) {
    this.day = this.selectedDay[i];
    this.month = undefined;
    this.date = undefined;
    this.myDateValue = [];
    console.log(this.day);
  }

  onSelectMonth(event) {
    if (event) {
      this.month = event.getDay() + 1;
      console.log(this.month);
    }
  }

  onSelectDate(event) {
    if (event) {
      this.date = event.getDay() + 1;
      this.month = event.getMonth() + 1;
      console.log(this.date, this.month);
    }
  }

  onSelectTime(i) {
    this.selectedShedule = this.selectedTime[i];
  }

  onSelectMinutes(i) {
    this.selectMin = this.selectedMinuts[i];
  }

  onSelectHour(i) {
    this.selectedDuration = this.selectedHour[i];
  }

  showTable() {
    document.getElementById('spinner').style.display = 'block';
    if (this.result.length! > 0) {
      $('#table').DataTable().destroy();
    }
    this.service.nifiGetProcessorId().subscribe(res => {
      this.processorId = res['processorId'];
      this.service.nifiGetProcessorDetails(this.processorId).subscribe(details => {
        this.result = details;
        this.data = this.result;

        $(document).ready(function () {
          $('#table').DataTable({
            destroy: true, bLengthChange: false, bInfo: false,
            bPaginate: false, scrollY: 380, scrollX: true,
            scrollCollapse: true, paging: false, searching: true,
            fixedColumns: {
              leftColumns: 1
            }
          });
        });
        document.getElementById('spinner').style.display = 'none';
      });
    })
  }

  onClickSchedule(data) {
    if (this.selectedDuration != '' && this.selectedShedule != '') {
      this.service.nifiScheduleProcessor(data.id, { state: "RUNNING", time: { day: this.day, date: this.date, month: this.month, hours: this.selectedShedule, minutes: this.selectMin }, stopTime: this.selectedDuration }).subscribe(res => {
        if (res['msg']) {
          this.msg = res['msg'];
          this.err = '';
          document.getElementById('success').style.display = "block";
          this.selectedTime = [];
          this.selectedHour = [];
          this.selectedMinuts = [];
          this.selectedShedule = '';
          this.selectMin = '';
          this.selectedDuration = '';
          setTimeout(() => {
            document.getElementById('success').style.display = "none";
          }, 2000);
        }
      }, err => {
        this.err = err.error['errMsg'];
      })
    } else if (this.selectedDuration == '' && this.selectedShedule == '') {
      this.err = "please select schedule time and stopping hours";
    } else if (this.selectedShedule == '') {
      this.err = "please select schedule time";
    } else if (this.selectedDuration == '') {
      this.err = "please select stopping hours";
    }


  }
}

import { Component, OnInit } from '@angular/core';
import { NifiShedularService } from '../../services/nifi-shedular.service';
declare const $;

@Component({
  selector: 'app-nifi-shedular',
  templateUrl: './nifi-shedular.component.html',
  styleUrls: ['./nifi-shedular.component.css']
})
export class NifiShedularComponent implements OnInit {
  result: any = [];
  data: any = [];
  user_status = 1;
  err;
  msg;
  showMsg;
  timeArr = [];
  selectedTime = [];
  selectedShedule = '';
  hoursArr = [{ hours: 1 }, { hours: 2 }, { hours: 3 }, { hours: 4 }, { hours: 5 }, { hours: 6 }, { hours: 7 }, { hours: 8 }, { hours: 9 }, { hours: 10 }];
  selectedHour = [];
  selectedDuration = '';
  processorId;
  constructor(private service: NifiShedularService) { }

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
      array.push({ time: ("0" + (date.getHours())).slice(-2) + ':' + ("0" + (date.getMinutes())).slice(-2) });
      date.setMinutes(date.getMinutes() + 60);
    }
    array.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));

    this.timeArr = array;
  }

  onSelectTime(i) {
    this.selectedShedule = this.selectedTime[i];
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
      this.service.nifiScheduleProcessor(data.id, { state: data.state, time: this.selectedShedule, stopTime: this.selectedDuration }).subscribe(res => {
        if (res['msg']) {
          this.msg = res['msg'];
          this.err = '';
          document.getElementById('success').style.display = "block";
          this.selectedTime = [];
          this.selectedHour = [];
          this.selectedShedule = '';
          this.selectedDuration = '';
          setTimeout(() => {
            document.getElementById('success').style.display = "none";
          }, 2000);
        }
      }, err => {
        this.err = err.error['errMsg'];
      })
    } else {
      this.err = "please select time and duration";
    }

  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AppServiceComponent } from '../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private service: AppServiceComponent) { }

  cardsData: any = '';
  cardsDataLength: any = [];

  ngOnInit() {
    this.loadCards();
  }

  loadCards = () => {
    this.service.dashboard().subscribe(async res => {
      this.cardsData = res;
      let obj = [
        {
          title: this.cardsData.attendance.title,
          imgTitle: 'attendance.png',
          // path: '../student-attendance',
          data: this.cardsData.attendance.data
        },
        {
          title: this.cardsData.students.title,
          imgTitle: 'students.png',
          // path: '',
          data: this.cardsData.students.data
        },
        {
          title: this.cardsData.crc.title,
          imgTitle: 'crc.png',
          // path: '../crc-report',
          data: this.cardsData.crc.data
        },
        {
          title: this.cardsData.average_inspection.title,
          imgTitle: 'avg_inspection.jpeg',
          // path: '',
          data: this.cardsData.average_inspection.data
        },
        {
          title: this.cardsData.schools.title,
          imgTitle: 'schools.png',
          // path: '',
          data: this.cardsData.schools.data
        },
        {
          title: this.cardsData.inspection_rate.title,
          imgTitle: 'inspection.jpeg',
          // path: '',
          data: this.cardsData.inspection_rate.data
        }
      ]
      this.cardsData = obj;
      this.cardsDataLength = await this.findLength(this.cardsData);

    })
  }

  findLength = (cardsData) => {
    let arr = [];
    let triple = [];
    for (let i = 1; i <= cardsData.length; i++) {
      triple.push(cardsData[i - 1]);
      if (i % 3 === 0) {
        arr.push(triple);
        triple = [];
      }
    }
    if (triple.length > 0) {
      arr.push(triple);
    }
    return (arr);
  }

}

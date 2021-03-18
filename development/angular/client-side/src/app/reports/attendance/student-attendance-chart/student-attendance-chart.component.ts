import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AppServiceComponent } from 'src/app/app.service';
import { MultiSelectComponent } from '../../../common/multi-select/multi-select.component';
import  {LineChartComponent} from '../../../common/line-chart/line-chart.component';
import {AttendanceReportService} from '../../../services/student.attendance-report.service'; 

@Component({
  selector: 'app-student-attendance-chart',
  templateUrl: './student-attendance-chart.component.html',
  styleUrls: ['./student-attendance-chart.component.css']
})
export class StudentAttendanceChartComponent implements OnInit {
  state;
  level = 'state';
  districtList:any = [];
  academicYears = ['2019-20','2020-21'];
  selectedAcademicYear = '';
  selectedDistricts = [];
  data:any = [];
  currentData = [];
  xAxisLabels = [];
  height = window.innerHeight;
  constructor(public commonService: AppServiceComponent,public service:AttendanceReportService,  private changeDetection: ChangeDetectorRef) { }

  @ViewChild(MultiSelectComponent) multiSelect: MultiSelectComponent;
  
  ngOnInit(): void {
    document.getElementById('home').style.display = 'none';
    document.getElementById('homeBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    this.state = this.commonService.state;
    this.selectedAcademicYear = this.academicYears[this.academicYears.length-1];
    this.service.getDistrictData().subscribe((res:any)=>{
      this.data = res['data'];
      this.data.map(item=>{
        this.districtList.push({id:item.districtId, name: item.districtName});
      })
    });
    this.changeDetection.detectChanges();
    this.onResize();
    this.onHomeClick();
  }

  onResize() {
    this.height = window.innerHeight;
  }

  onHomeClick(){
    this.level = 'state';
    this.currentData = [{data: [23,45,10], name: "Gujarat"}];
    this.xAxisLabels = ['January', 'March', 'October'];
    this.selectedDistricts = [];
    var districtList = this.districtList.map(district => {
      district.status = false;
      return district;
    });
    this.districtList = districtList;
    if (this.multiSelect)
      this.multiSelect.checkedList = [];
    document.getElementById('home').style.display = 'none';
  }

  shareCheckedList(list){
    this.selectedDistricts = list;
    if(this.selectedDistricts.length > 0){
      this.getCurrentData();
      document.getElementById('home').style.display = 'block';
    }else{
      this.onHomeClick();
      document.getElementById('home').style.display = 'none';
    }
  }

  getCurrentData(){
    this.level = 'district';
    this.xAxisLabels = [];
    var xLabels = [];
    this.currentData = [];
    this.selectedDistricts.map(item=>{
      this.data.map(element=>{
        var data = [];
        if(item == element.districtId){
          element.attendance.map(i=>{
            xLabels.push(i.month);
            data.push(i.attendance);
          })
          this.currentData.push({data: data, name: element.districtName});
       }
      })
    });
    this.xAxisLabels = [...new Set(xLabels)];
  }
}

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
  years = ['2018','2021'];
  selectedYear = '';
  selectedDistricts = [];
  data:any = [];
  currentData = [];
  xAxisLabels = [];
  height = window.innerHeight;
  constructor(public commonService: AppServiceComponent,public service:AttendanceReportService,  private changeDetection: ChangeDetectorRef) { }

  @ViewChild(MultiSelectComponent) multiSelect: MultiSelectComponent;
  
  ngOnInit(): void {
    document.getElementById('home').style.display = 'none';
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.state = this.commonService.state;
    this.selectedYear = this.years[this.years.length-1];
    this.changeDetection.detectChanges();
    this.xAxisLabels = ['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'];
    this.onResize();
    this.onHomeClick();

  }

  onResize() {
    this.height = window.innerHeight;
  }
  districtData = [];
  onSelectYear(){
    this.commonService.errMsg();
    this.currentColors = [];
    this.districtWithColors = [];
    this.getStateData();
    this.getDistrictData();
  }

  onHomeClick(){
    this.commonService.errMsg();
    this.selectedYear = this.years[this.years.length-1];
    this.onSelectYear();
    this.getStateData();
    this.selectedDistricts = [];
    this.currentColors = [];
    this.districtWithColors = [];
    var districtList = this.districtList.map(district => {
      district.status = false;
      return district;
    });
    this.districtList = districtList;
    if (this.multiSelect)
      this.multiSelect.checkedList = [];
    document.getElementById('home').style.display = 'none';
  }
  getStateData(){
    this.level = 'state';
    this.service.getStateData({year: this.selectedYear}).subscribe(res=>{
      this.data = res['data'];
      var data = [];
      this.currentData = [];
      this.data.map(item=>{
        item.attendance.map(i=>{
          data.push(i.attendance);
        })
        this.currentData.push({data: data, name: this.state, color: '#00FF00'});
        this.commonService.loaderAndErr(this.currentData);
      })
    },err=>{
      this.data = [];
      this.currentData = [];
      this.commonService.loaderAndErr(this.data);
    })
  }
  getDistrictData(){
    this.districtList = [];
    this.districtData = [];
    this.service.getDistrictData({year:this.selectedYear}).subscribe((res:any)=>{
      this.districtData = res['data'];
      this.districtData.map(item=>{
        this.districtList.push({id:item.districtId, name: item.districtName});
      });
      var districtList = this.districtList.map(district => {
        district.status = false;
        return district;
      });
      this.districtList = districtList;
      if (this.multiSelect)
        this.multiSelect.checkedList = [];
      this.districtList = this.districtList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    },err=>{
      this.districtData = [];
      this.commonService.loaderAndErr(this.districtData);
    })
  }

  public colors = ['#339933', '#00ffcc', '#0099ff', '#6666ff', '#99ff99', '#003399', '#666699', '#ffcc00', '#660033', '#ff3300'];
  public currentColors = [];
  public districtWithColors = [];

  shareCheckedList(list){
    this.currentColors = [];
    this.districtWithColors = [];
    var names = [];
    this.selectedDistricts = list;
    this.districtList.map((item)=>{
      this.selectedDistricts.map(i=>{
        if(i == item.id){
          names.push({id: i, name: item.name});
        }
      })
    });
    if(this.selectedDistricts.length > 0){
      var myColors = [];
      var latestColors = [];
      for(let i=0; i<this.selectedDistricts.length; i++){
          if(i <= 9){
            latestColors.push(this.colors[i]);
            this.districtWithColors.push({id: [names[i].id],name: [names[i].name], color: this.colors[i]});
            myColors = [];
          }else{
            for(let j=0; j< this.selectedDistricts.length - this.districtWithColors.length; j++){
              this.districtWithColors[j].name.push(names[10 + j].name);
              this.districtWithColors[j].id.push(names[10 + j].id);
              myColors.push(this.colors[j]);
              myColors = myColors.filter(onlyUnique);
              this.districtWithColors[j].name = this.districtWithColors[j].name.filter(onlyUnique);
              this.districtWithColors[j].id = this.districtWithColors[j].id.filter(onlyUnique);
            }
          }
        }
        this.currentColors = latestColors.concat(myColors);
      this.getCurrentData();
      document.getElementById('home').style.display = 'block';
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
    }else{
      this.onHomeClick();
      document.getElementById('home').style.display = 'none';
    }
  }

  getCurrentData(){
    document.getElementById('spinner').style.display = 'block';   
    this.currentData = [];
    this.level = 'district';
    if(this.districtData.length > 0){
    this.districtWithColors.map((item, i)=>{
      this.districtData.map(element=>{
        item.id.map(id=>{
          if(id == element.districtId){
            var data = [];
            element.attendance.map(i=>{
              data.push(i.attendance);
            })
            this.currentData.push({data: data, name: element.districtName, color: this.currentColors[i]});
         }
        })
      })
    });
  }
    setTimeout(() => {
      document.getElementById('spinner').style.display = 'none';
    }, 400);
    document.getElementById('errMsg').style.display = 'none';   
  }
}

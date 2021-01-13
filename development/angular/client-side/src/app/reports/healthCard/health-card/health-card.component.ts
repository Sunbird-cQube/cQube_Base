import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceComponent } from 'src/app/app.service';
import { HealthCardService } from 'src/app/services/health-card.service';

@Component({
  selector: 'app-health-card',
  templateUrl: './health-card.component.html',
  styleUrls: ['./health-card.component.css']
})
export class HealthCardComponent implements OnInit, AfterViewInit {
  tooltip: any = "";
  state = '';
  placeHolder = "First Choose Level From Drop-down";
  level;
  keys;
  updatedKeys: any;
  yourData: any;
  districtName: any;
  names = [];
  blocks = [];
  clusters = [];
  schools = [];
  ids = [];
  blockIds = [];
  clusterIds = [];
  schoolIds = [];
  districtObjArr = [];
  healthCardData = {};


  schoolInfra = [];
  schoolInfraKey = [];
  schoolInfraRank = [];
  schoolInfraRankKye = [];

  schoolAttendance = [];
  schoolAttendanceKeys = [];
  schoolAttendanceRank = [];
  schoolAttendanceRankKey = [];
  schoolAttendanceCategory = [];
  schoolAttendanceCategoryKey = [];

  semPerformance = [];
  semPerformanceKeys = [];
  semPerfromanceRank = [];
  semPerformanceRankKey = [];
  semPerformanceCategory = [];
  semPerformanceCategoryKey = [];

  patPerformance = [];
  patPerformanceKeys = [];
  patPerformanceRank = [];
  patPerformanceRankKey = [];
  patPerformanceCategory = [];
  patPerformanceCategoryKay = [];

  crcVisit = [];
  crcVisitKeys = [];

  UDISE = [];
  UDISEKeys = [];
  UDISERank = [];
  UDISERankKeys = [];
  UDISECategory = [];
  UDISECategoryKey = [];

  tooltipInfra = [];
  toolTipInfraKeys = [];
  tooltipStdAttendance = [];
  tooltipStdAttendanceKeys = [];
  tooltimSem = [];
  tooltipSemKeys = [];
  tooltipPat = [];
  tooltipPatKeys = [];
  tooltipCrc = [];
  tooltipCrcKeys = [];
  tooltipUDISE = [];
  tooltipUDISEKyes = [];

  allData: any;
  showAll = false;
  height;
  selectedLevelData: any;
  showLink = true;
  params: any;

  public semLength;
  public udiseLength;
  public crcLength;
  public infraLength;

  placement = 'bottom-right';

  @ViewChild('searchInput') searchInput: ElementRef;
  semPerformTooltip: any[];
  semPerformTooltipKeys: any[];

  constructor(public commonService: AppServiceComponent, public service: HealthCardService, private readonly _router: Router, private readonly _cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('myInput')['disabled'] = true;
    this.state = this.commonService.state;

    this.params = JSON.parse(sessionStorage.getItem('health-card-info'));

    if (this.params && this.params.level) {
      this.level = this.params.level;
      if (this.level == 'state') {
        document.getElementById('home').style.display = "none";
        this.stateData();
      }
    } else {
      document.getElementById('home').style.display = "none";
      this.stateData();
    }
  }

  ngAfterViewInit(): void {
    if (this.params && this.params.level) {
      if (this.params.level != 'state') {
        document.getElementById('home').style.display = "block";
        this.len = 2;
        this.value = this.params.value;
        this.searchInput.nativeElement.value = this.params.value;
        this._cd.detectChanges();
        this.selectedLevel(true);
      }
    }
    document.getElementById('spinner').style.display = 'none';
  }

  stateData() {
    document.getElementById('spinner').style.display = 'block';
    this.semLength = 2;
    this.udiseLength = -1;
    this.crcLength = 1;
    this.infraLength = -1;
    this.height = '250px';
    this.level = "state";
    document.getElementById('myInput')['disabled'] = true;
    document.getElementById('myInput')['value'] = '';
    this.placeHolder = "First Choose Level From Drop-down";
    this.service.stateData().subscribe(res => {
      this.healthCardData = res['data'];
      this.schoolInfra = ['infra_score'];
      this.schoolInfraKey = ['Infrastructure Score'];
      this.schoolInfraRank = ['district_level_rank_within_the_state'];
      this.schoolInfraRankKye = ['At State Level'];

      this.schoolAttendance = ['attendance'];
      this.schoolAttendanceKeys = ['Attendance'];
      this.schoolAttendanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
      this.schoolAttendanceCategoryKey = ['Attendance Less Than 33%', 'Attendance Between 33% to 60%', 'Attendance Between 60% to 75%', 'Attendance Above 75%'];

      this.semPerformance = ['performance'];
      this.semPerformanceKeys = ['Performance']
      this.semPerformanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
      this.semPerformanceCategoryKey = ['Performance Less Than 33%', 'Performance Between 33% to 60%', 'Performance Between 60% to 75%', 'Performance Above 75%'];

      this.patPerformance = ['school_performance'];
      this.patPerformanceKeys = ['Performance'];
      this.patPerformanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
      this.patPerformanceCategoryKay = ['Schools Less Than 33%', 'Schools Between 33% to 60%', 'Schools Between 60% to 75%', 'Schools Above 75%'];

      this.crcVisit = Object.keys(this.healthCardData['crc_visit']);
      this.crcVisitKeys = [];
      this.crcVisit.filter(key => {
        var myKey = this.stringConverter(key);
        this.crcVisitKeys.push(myKey);
      });

      this.UDISE = ['infrastructure_score'];
      this.UDISEKeys = ['Infrastructure Score'];
      this.UDISECategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
      this.UDISECategoryKey = ['Infrastructure Score Less Than 33%', 'Infrastructure Score Between 33% to 60%', 'Infrastructure Score Between 60% to 75%', 'Infrastructure Score Above 75%'];

      this.showData(this.healthCardData);
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('home').style.display = "none";
    }, err => {
      this.err = true;
      this.showAll = true;
      document.getElementById('spinner').style.display = 'none';
    });
  }

  public err = false;
  onSubmit() {
    this.err = false;
    this.showAll = false;
    this.showLink = true;
    document.getElementById('spinner').style.display = 'block';
    this.districtName = document.getElementById('myInput')['value'];
    var id;
    if (this.ids.includes(this.districtName) || this.names.includes(this.districtName)) {
      document.getElementById('warning').style.display = 'none';
    }
    if (this.districtName) {
      if (this.level == 'district') {
        this.semLength = 2;
        this.udiseLength = 4;
        this.crcLength = 1;
        this.infraLength = 3;
        this.height = '250px';
        var dist;
        if (this.districtName.match(/^\d/)) {
          id = parseInt(this.districtName);
          dist = this.districtObjArr.find(a => a.id === id);
        } else {
          dist = this.districtObjArr.find(a => a.name == this.districtName);
          if (dist) {
            id = dist.id;
          }
        }

        this.selectedLevelData = dist;
        this.service.districtWiseData({ id: id }).subscribe(res => {
          this.healthCardData = res['districtData'][0];
          this.schoolInfra = ['infra_score'];
          this.schoolInfraKey = ['Infrastructure Score'];
          this.schoolInfraRank = ['district_level_rank_within_the_state'];
          this.schoolInfraRankKye = ['At State Level'];

          this.schoolAttendance = ['attendance'];
          this.schoolAttendanceKeys = ['Attendance'];
          this.schoolAttendanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.schoolAttendanceCategoryKey = ['Attendance Less Than 33%', 'Attendance Between 33% to 60%', 'Attendance Between 60% to 75%', 'Attendance Above 75%'];

          this.semPerformance = ['performance'];
          this.semPerformanceKeys = ['Performance']
          this.semPerformanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.semPerformanceCategoryKey = ['Performance Less Than 33%', 'Performance Between 33% to 60%', 'Performance Between 60% to 75%', 'Performance Above 75%'];

          this.patPerformance = ['district_performance'];
          this.patPerformanceKeys = ['Performance'];
          this.patPerformanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.patPerformanceCategoryKay = ['Schools Less Than 33%', 'Schools Between 33% to 60%', 'Schools Between 60% to 75%', 'Schools Above 75%'];

          this.crcVisit = ['schools_0', 'schools_1_2', 'schools_3_5', 'schools_6_10', 'schools_10'];
          this.crcVisitKeys = ['Schools Visited 0 Times', 'Schools Visited 1-2 Times', 'Schools Visited 3-5 Times', 'Schools Visited 6-10 Times', 'Schools Visited more Than 10 Times'];

          this.UDISE = ['infrastructure_score'];
          this.UDISEKeys = ['Infrastructure Score'];
          this.UDISECategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.UDISECategoryKey = ['Infrastructure Score Less Than 33%', 'Infrastructure Score Between 33% to 60%', 'Infrastructure Score Between 60% to 75%', 'Infrastructure Score Above 75%'];

          this.showData(this.healthCardData);
          document.getElementById('spinner').style.display = 'none';
        }, err => {
          this.err = true;
          this.showAll = true;
          document.getElementById('spinner').style.display = 'none';
        });
      } else if (this.level == 'block') {
        this.semLength = 4;
        this.udiseLength = 5;
        this.crcLength = 3;
        this.infraLength = 5;
        this.height = '270px';
        var block;
        id;
        if (this.districtName.match(/^\d/)) {
          id = parseInt(this.districtName);
          block = this.districtObjArr.find(a => a.id == id);
        } else {
          block = this.districtObjArr.find(a => a.name == this.districtName);
          if (block) {
            id = block.id;
          }
        }

        this.selectedLevelData = block;
        this.service.blockWiseData({ id: id }).subscribe(res => {
          this.healthCardData = res['blockData'][0];
          this.schoolInfra = ['infra_score'];
          this.schoolInfraKey = ['Infrastructure Score'];
          this.schoolInfraRank = ['block_level_rank_within_the_state', 'block_level_rank_within_the_district'];
          this.schoolInfraRankKye = ['At State Level', 'At District Level'];

          this.schoolAttendance = ['attendance'];
          this.schoolAttendanceKeys = ['Attendance'];
          this.schoolAttendanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.schoolAttendanceCategoryKey = ['Attendance Less Than 33%', 'Attendance Between 33% to 60%', 'Attendance Between 60% to 75%', 'Attendance Above 75%'];

          this.semPerformance = ['performance'];
          this.semPerformanceKeys = ['Performance'];
          this.semPerformanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.semPerformanceCategoryKey = ['Performance Less Than 33%', 'Performance Between 33% to 60%', 'Performance Between 60% to 75%', 'Performance Above 75%'];

          this.patPerformance = ['block_performance'];
          this.patPerformanceKeys = ['Performance'];

          this.crcVisit = ['schools_0', 'schools_1_2', 'schools_3_5', 'schools_6_10', 'schools_10'];
          this.crcVisitKeys = ['Schools Visited 0 Times', 'Schools Visited 1-2 Times', 'Schools Visited 3-5 Times', 'Schools Visited 6-10 Times', 'Schools Visited more Than 10 Times'];

          this.UDISE = ['infrastructure_score'];
          this.UDISEKeys = ['Infrastructure Score'];
          this.UDISECategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.UDISECategoryKey = ['Infrastructure Score Less Than 33%', 'Infrastructure Score Between 33% to 60%', 'Infrastructure Score Between 60% to 75%', 'Infrastructure Score Above 75%'];

          this.showData(this.healthCardData);
          document.getElementById('spinner').style.display = 'none';
        }, err => {
          this.err = true;
          this.showAll = true;
          document.getElementById('spinner').style.display = 'none';
        });
      } else if (this.level == 'cluster') {
        this.semLength = 6;
        this.udiseLength = 6;
        this.crcLength = 5;
        this.infraLength = 7;
        this.height = '300px';
        var cluster;
        let blkId;
        if (this.districtName.match(/^\d/)) {
          cluster = this.districtObjArr.find(a => a.id == this.districtName);
          id = parseInt(this.districtName);
          blkId = cluster.blockId;
        } else {
          cluster = this.districtObjArr.find(a => a.name == this.districtName);
          if (cluster) {
            id = cluster.id;
            blkId = cluster.blockId;
          }
        }

        this.selectedLevelData = cluster;
        this.service.clusterWiseData({ id: id, blockId: blkId }).subscribe(res => {
          this.healthCardData = res['clusterData'][0];
          this.schoolInfra = ['infra_score'];
          this.schoolInfraKey = ['Infrastructure Score'];
          this.schoolInfraRank = ['cluster_level_rank_within_the_state', 'cluster_level_rank_within_the_district', 'cluster_level_rank_within_the_block'];
          this.schoolInfraRankKye = ['At State Level', 'At District Level', 'At Block Level'];

          this.schoolAttendance = ['attendance'];
          this.schoolAttendanceKeys = ['Attendance'];
          this.schoolAttendanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.schoolAttendanceCategoryKey = ['Attendance Less Than 33%', 'Attendance Between 33% to 60%', 'Attendance Between 60% to 75%', 'Attendance Above 75%'];

          this.semPerformance = ['performance'];
          this.semPerformanceKeys = ['Performance'];
          this.semPerformanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.semPerformanceCategoryKey = ['Performance Less Than 33%', 'Performance Between 33% to 60%', 'Performance Between 60% to 75%', 'Performance Above 75%'];

          this.patPerformance = ['cluster_performance'];
          this.patPerformanceKeys = ['Performance'];

          this.crcVisit = ['schools_0', 'schools_1_2', 'schools_3_5', 'schools_6_10', 'schools_10'];
          this.crcVisitKeys = ['Schools Visited 0 Times', 'Schools Visited 1-2 Times', 'Schools Visited 3-5 Times', 'Schools Visited 6-10 Times', 'Schools Visited more Than 10 Times'];

          this.UDISE = ['infrastructure_score'];
          this.UDISEKeys = ['Infrastructure Score'];
          this.UDISECategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.UDISECategoryKey = ['Infrastructure Score Less Than 33%', 'Infrastructure Score Between 33% to 60%', 'Infrastructure Score Between 60% to 75%', 'Infrastructure Score Above 75%'];

          this.showData(this.healthCardData);
          document.getElementById('spinner').style.display = 'none';
        }, err => {
          this.err = true;
          this.showAll = true;
          document.getElementById('spinner').style.display = 'none';
        });
      } else if (this.level == 'school') {
        this.semLength = 9;
        this.udiseLength = 8;
        this.crcLength = 7;
        this.infraLength = 9;
        this.height = '220px';
        var school;
        var blok;
        this.showLink = false;
        if (this.districtName.match(/^\d/)) {
          school = this.districtObjArr.find(a => a.id == this.districtName);
          id = parseInt(this.districtName);
          blok = school.blockId;
        } else {
          school = this.districtObjArr.find(a => a.name == this.districtName);
          if (school) {
            id = school.id;
            blok = school.blockId;
          }
        }
        this.service.schoolWiseData({ id: id, blockId: blok }).subscribe(res => {
          this.healthCardData = res['schoolData'][0];
          this.schoolInfra = ['infra_score'];
          this.schoolInfraKey = ['Infrastructure Score'];
          this.schoolInfraRank = ['school_level_rank_within_the_state', 'school_level_rank_within_the_district', 'school_level_rank_within_the_block', 'school_level_rank_within_the_cluster'];
          this.schoolInfraRankKye = ['At State Level', 'At District Level', 'At Block Level', 'At Cluster Level'];

          this.schoolAttendance = ['attendance'];
          this.schoolAttendanceKeys = ['Attendance'];
          this.schoolAttendanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.schoolAttendanceCategoryKey = ['Attendance Less Than 33%', 'Attendance Between 33% to 60%', 'Attendance Between 60% to 75%', 'Attendance Above 75%'];

          this.semPerformance = ['performance'];
          this.semPerformanceKeys = ['Performance'];
          this.semPerformanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.semPerformanceCategoryKey = ['Performance Less Than 33%', 'Performance Between 33% to 60%', 'Performance Between 60% to 75%', 'Performance Above 75%'];

          this.patPerformance = ['school_performance'];
          this.patPerformanceKeys = ['Performance'];

          this.crcVisit = ['schools_0', 'schools_1_2', 'schools_3_5', 'schools_6_10', 'schools_10'];
          this.crcVisitKeys = ['Schools Visited 0 Times', 'Schools Visited 1-2 Times', 'Schools Visited 3-5 Times', 'Schools Visited 6-10 Times', 'Schools Visited more Than 10 Times'];

          this.UDISE = ['infrastructure_score'];
          this.UDISEKeys = ['Infrastructure Score'];
          this.UDISECategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
          this.UDISECategoryKey = ['Infrastructure Score Less Than 33%', 'Infrastructure Score Between 33% to 60%', 'Infrastructure Score Between 60% to 75%', 'Infrastructure Score Above 75%'];

          this.showData(this.healthCardData);
          document.getElementById('spinner').style.display = 'none';
        }, err => {
          this.err = true;
          this.showAll = true;
          document.getElementById('spinner').style.display = 'none';
        });
      }
    } else {
      alert("Please enter valid id/name");
      document.getElementById('spinner').style.display = 'none';
    }

  }

  infraColor;
  stdAttendanceColor;
  semColor;
  patColor;
  crcColor;
  udiseColor;
  patPerformTooltip = [];
  patPerformTooltipKeys = [];
  infraTooltipMetrics = [];
  semPerformancePercent = ['percent_below_33', 'percent_between_33_60', 'percent_between_60_75', 'percent_above_75'];
  showData(healthCardData) {
    if (this.level != 'state') {
      this.updatedKeys = [];
      this.keys = Object.keys(healthCardData);
      let index = this.keys.indexOf('district_id');
      if (index > -1) {
        this.keys.splice(index, 1);
      }
      index = this.keys.indexOf('block_id');
      if (index > -1) {
        this.keys.splice(index, 1);
      }
      index = this.keys.indexOf('cluster_id');
      if (index > -1) {
        this.keys.splice(index, 1);
      }
      index = this.keys.indexOf('school_id');
      if (index > -1) {
        this.keys.splice(index, 1);
      }
      this.keys = this.keys.filter(key => {
        if (typeof healthCardData[`${key}`] != 'object') {
          let myKey = this.stringConverter(key);
          this.updatedKeys.push(myKey);
          return key;
        }
      });
    } else {
      this.updatedKeys = [];
      this.keys = Object.keys(healthCardData['basic_details']);
      this.keys = this.keys.filter(key => {
        let myKey = this.stringConverter(key);
        this.updatedKeys.push(myKey);
        return key;
      });
    }
    this.showAll = true;
    var myKey;
    this.tooltipInfra = [];
    this.toolTipInfraKeys = [];
    this.tooltipStdAttendance = [];
    this.tooltipStdAttendanceKeys = [];
    this.tooltimSem = [];
    this.tooltipSemKeys = [];
    this.tooltipPat = [];
    this.tooltipPatKeys = [];
    this.tooltipUDISE = [];
    this.tooltipUDISEKyes = [];
    this.tooltipCrc = [];
    this.tooltipCrcKeys = [];
    this.infraTooltipMetrics = [];
    this.semPerformTooltip = [];
    this.semPerformTooltipKeys = [];
    if (healthCardData['school_infrastructure'] && healthCardData['school_infrastructure'] != null) {
      this.tooltipInfra = Object.keys(healthCardData['school_infrastructure']);
      this.tooltipInfra = this.tooltipInfra.filter((key) => {
        return !this.schoolInfra.includes(key) && !this.schoolAttendanceCategory.includes(key) && !this.schoolInfraRank.includes(key) && key != 'areas_to_focus';
      });
      this.tooltipInfra.map(key => {
        myKey = this.stringConverter(key);
        this.toolTipInfraKeys.push(myKey);
      });

      this.infraColor = this.service.colorGredient(healthCardData['school_infrastructure']['infra_score']);
      this.toolTipInfraKeys.map(key => {
        this.infraTooltipMetrics.push(key.includes('Percent'));
      });
    }
    if (healthCardData['student_attendance'] && healthCardData['student_attendance'] != null) {
      this.tooltipStdAttendance = Object.keys(healthCardData['student_attendance']);
      this.tooltipStdAttendance = this.tooltipStdAttendance.filter((key) => {
        return !this.schoolAttendance.includes(key) && !this.schoolAttendanceCategory.includes(key) && !this.schoolInfraRank.includes(key);
      });
      this.tooltipStdAttendance.filter(key => {
        myKey = this.stringConverter(key);
        this.tooltipStdAttendanceKeys.push(myKey);
      });
      this.stdAttendanceColor = this.service.colorGredient(healthCardData['student_attendance']['attendance']);
    }
    if (healthCardData['student_semester'] && healthCardData['student_semester'] != null) {
      this.tooltimSem = Object.keys(healthCardData['student_semester']);
      this.tooltimSem = this.tooltimSem.filter((key) => {
        return !this.semPerformance.includes(key) && !this.semPerformancePercent.includes(key) && !this.schoolAttendanceCategory.includes(key) && !this.schoolInfraRank.includes(key);
      });
      this.tooltimSem.filter(key => {
        myKey = this.stringConverter(key);
        this.tooltipSemKeys.push(myKey);
      });
      if (this.level == 'state') {
        this.semPerformTooltip = Object.keys(healthCardData['student_semester']['grade_wise_performance']);
        this.semPerformTooltip.filter(key => {
          myKey = this.stringConverter(key);
          this.semPerformTooltipKeys.push(myKey);
        });
        this.tooltimSem.filter(key => {
          if (key != 'grade_wise_performance') {
            myKey = this.stringConverter(key);
            this.tooltipSemKeys.push(myKey);
          }
        });
        let i = this.tooltimSem.indexOf('grade_wise_performance');
        this.tooltimSem.splice(i, 1);
      }
      this.semColor = this.service.colorGredient(healthCardData['student_semester']['performance']);
    }
    if (healthCardData['pat_performance'] && healthCardData['pat_performance'] != null) {
      this.tooltipPat = Object.keys(healthCardData['pat_performance']);
      this.patPerformTooltip = Object.keys(healthCardData['pat_performance']['grade_wise_performance']);
      this.patPerformTooltip.filter(key => {
        myKey = this.stringConverter(key);
        this.patPerformTooltipKeys.push(myKey);
      });
      this.tooltipPat = this.tooltipPat.filter((key) => {
        return !this.patPerformance.includes(key) && !this.schoolAttendanceCategory.includes(key) && !this.schoolInfraRank.includes(key);
      });
      this.tooltipPat.filter(key => {
        if (key != 'grade_wise_performance') {
          var myKey = this.stringConverter(key);
          this.tooltipPatKeys.push(myKey);
        }
      });
      let i = this.tooltipPat.indexOf('grade_wise_performance');
      this.tooltipPat.splice(i, 1);
      if (this.level == 'state') {
        this.patColor = this.service.colorGredient(healthCardData['pat_performance'][`school_performance`]);
      } else {
        this.patColor = this.service.colorGredient(healthCardData['pat_performance'][`${this.level}_performance`]);

      }
    }
    if (healthCardData['crc_visit'] && healthCardData['crc_visit'] != null) {
      this.tooltipCrc = Object.keys(healthCardData['crc_visit']);
      if (this.level != 'state') {
        this.tooltipCrc = this.tooltipCrc.filter((key) => {
          return !this.crcVisit.includes(key);
        });
      }
      this.tooltipCrc.filter(key => {
        var myKey = this.stringConverter(key);
        this.tooltipCrcKeys.push(myKey);
      });

      this.crcColor = this.service.colorGredient1(healthCardData['crc_visit']['schools_0']);
    }
    if (healthCardData['udise'] && healthCardData['udise'] != null) {
      this.tooltipUDISE = Object.keys(healthCardData['udise']);
      this.tooltipUDISE = this.tooltipUDISE.filter((key) => {
        return !this.UDISE.includes(key) && !this.UDISECategory.includes(key) && !this.schoolInfraRank.includes(key) && key != "district_latitude" && key != "block_latitude" && key != "cluster_latitude" && key != "school_latitude" && key != "district_longitude" && key != "block_longitude" && key != "cluster_longitude" && key != "school_longitude";
      });
      this.tooltipUDISE.filter(key => {
        var myKey = this.stringConverter(key);
        this.tooltipUDISEKyes.push(myKey);
      });
      this.udiseColor = this.service.colorGredient(healthCardData['udise']['school_infrastructure']);
    }
  }

  stringConverter(key) {
    key = key.replace(
      /\w\S*/g,
      function (txt) {
        txt = txt.replace(/_/g, ' ');
        return txt.replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
          .replace(/\s/g, ' ')
          .replace(/^(.)/, function ($1) { return $1.toUpperCase(); });
      });
    key = key.replace("Id", "ID");
    key = key.replace("Nsqf", "NSQF");
    key = key.replace("Ict", "ICT");
    key = key.replace("Crc", "CRC");
    return key;
  }

  value: any;
  val;
  len;
  onChange() {
    this.val = document.getElementById('myInput')['value'];
    this.len = this.val.length;
    this.showAll = false;
    document.getElementById('warning').style.display = 'block';
    if (this.value.match(/^\d/)) {
      if (this.value.toString().length > 1) {
        document.getElementById('warning').style.display = 'none';
      }
      this.autocomplete(document.getElementById("myInput"), this.ids);
    }
    if (!this.value.match(/^\d/)) {
      if (this.value.length > 1) {
        document.getElementById('warning').style.display = 'none';
      }
      this.autocomplete(document.getElementById("myInput"), this.names);
    }
  }

  levels = [{ key: 'district', name: 'District' }, { key: 'block', name: 'Block' }, { key: 'cluster', name: 'Cluster' }, { key: 'school', name: 'School' }];
  selectedLevel(callSubmit = false) {
    document.getElementById('spinner').style.display = 'block';
    sessionStorage.removeItem('health-card-info');
    this.allData = [];
    this.ids = [];
    this.names = [];
    document.getElementById('home').style.display = "block";
    document.getElementById('warning').style.display = 'block';
    this.showAll = false;
    document.getElementById('myInput')['disabled'] = false;
    if (!callSubmit)
      this.value = '';

    if (this.level == 'district') {
      this.service.metaData(this.level).subscribe(res => {
        this.allData = res;
        this.placeHolder = "Search Districts With Name/ID";
        this.names = this.allData['districtNames'];
        this.ids = this.allData['districtIds'];
        this.districtObjArr = this.allData['districts'];
        document.getElementById('spinner').style.display = 'none';
        if (callSubmit) {
          this.onSubmit();
        }
      }, err => {
        document.getElementById('myInput')['disabled'] = true;
        this.placeHolder = "No districts name/id available";
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('warning').style.display = 'none';
      });
    }

    if (this.level == 'block') {
      this.service.metaData(this.level).subscribe(res => {
        this.allData = res;
        this.placeHolder = "Search Blocks With Name/ID";
        this.names = this.allData['blockNames'];
        this.ids = this.allData['blockIds'];
        this.districtObjArr = this.allData['blocks'];
        document.getElementById('spinner').style.display = 'none';
        if (callSubmit) {
          this.onSubmit();
        }
      }, err => {
        document.getElementById('myInput')['disabled'] = true;
        this.placeHolder = "No blocks name/id available";
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('warning').style.display = 'none';
      });
    }

    if (this.level == 'cluster') {
      this.service.metaData(this.level).subscribe(res => {
        this.allData = res;
        this.placeHolder = "Search Clusters With Name/ID";
        this.names = this.allData['clusterNames'];
        this.ids = this.allData['clusterIds'];
        this.districtObjArr = this.allData['clusters'];
        document.getElementById('spinner').style.display = 'none';
        if (callSubmit) {
          this.onSubmit();
        }
      }, err => {
        document.getElementById('myInput')['disabled'] = true;
        this.placeHolder = "No clusters name/id available";
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('warning').style.display = 'none';
      });
    }

    if (this.level == 'school') {
      this.service.metaData(this.level).subscribe(res => {
        this.allData = res;
        this.placeHolder = "Search Schools With Name/ID";
        this.names = this.allData['schoolNames'];
        this.ids = this.allData['schoolIds'];
        this.districtObjArr = this.allData['schools'];
        document.getElementById('spinner').style.display = 'none';
        if (callSubmit) {
          this.onSubmit();
        }
      }, err => {
        document.getElementById('myInput')['disabled'] = true;
        this.placeHolder = "No schools name/id available";
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('warning').style.display = 'none';
      });
    }
  }

  autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists(e);
      if (!val) { return false; }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input id='dist' type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists(e);
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      // if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      // x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }

  goToReport(route: string): void {
    sessionStorage.setItem('report-level-info', JSON.stringify({ level: this.level == 'state' ? undefined : this.level, data: this.level == 'state' ? null : this.selectedLevelData }));
    this._router.navigate([route]);
  }

}
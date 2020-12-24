import { Component, OnInit } from '@angular/core';
import { AppServiceComponent } from 'src/app/app.service';
import { HealthCardService } from 'src/app/services/health-card.service';

@Component({
  selector: 'app-health-card',
  templateUrl: './health-card.component.html',
  styleUrls: ['./health-card.component.css']
})
export class HealthCardComponent implements OnInit {
  tooltip: any = "";
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
  constructor(public commonService: AppServiceComponent, public service: HealthCardService) { }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('myInput')['disabled'] = true;
  }

  public err = false;
  onSubmit() {
    this.err = false;
    this.showAll = false;
    document.getElementById('spinner').style.display = 'block';
    this.districtName = document.getElementById('myInput')['value'];
    var id;
    if (this.level == 'district') {
      this.height = '250px';
      var dist;
      if (this.districtName.match(/^\d/)) {
        id = parseInt(this.districtName);

      } else {
        dist = this.districtObjArr.find(a => a.name == this.districtName);
        id = dist.id;
      }
      this.service.districtWiseData({ id: id }).subscribe(res => {
        this.healthCardData = res['districtData'][0];
        this.showData(this.healthCardData);
        var b = document.createElement('DIV');
        b.innerHTML = `<b>${this.healthCardData['district_id']}</b>`;
        this.tooltip = b;
        this.schoolInfra = ['infra_score'];
        this.schoolInfraKey = ['Infrastructure Score'];
        this.schoolInfraRank = ['district_level_rank_within_the_state'];
        this.schoolInfraRankKye = ['Rank (within State)'];

        this.schoolAttendance = ['attendance'];
        this.schoolAttendanceKeys = ['Attendance'];
        this.schoolAttendanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.schoolAttendanceCategoryKey = ['Schools (Less than 33%)', 'Schools (33% to 60%)', 'Schools (60% to 75%)', 'Schools (Above 75%)'];

        this.semPerformance = ['performance'];
        this.semPerformanceKeys = ['Performance']
        this.semPerformanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.semPerformanceCategoryKey = ['Schools (Less than 33%)', 'Schools (33% to 60%)', 'Schools (60% to 75%)', 'Schools (Above 75%)'];

        this.patPerformance = ['district_performance'];
        this.patPerformanceKeys = ['Performance'];
        this.patPerformanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.patPerformanceCategoryKay = ['Schools (Less than 33%)', 'Schools (33% to 60%)', 'Schools (60% to 75%)', 'Schools (Above 75%)'];

        this.crcVisit = ['schools_0', 'schools_1_2', 'schools_3_5', 'schools_6_10', 'schools_10'];
        this.crcVisitKeys = ['Visit 0 times', 'Visit 1-2 times', 'Visit 3-5 times', 'Visit 6-10 times', 'Visit more than 10 times'];

        this.UDISE = ['school_infrastructure'];
        this.UDISEKeys = ['Infrastructure Score'];
        this.UDISECategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.UDISECategoryKey = ['Infrastructure Score (Less than 33%)', 'Infrastructure Score (33% to 60%)', 'Infrastructure Score (60% to 75%)', 'Infrastructure Score (Above 75%)'];
        document.getElementById('spinner').style.display = 'none';
      }, err => {
        this.err = true;
        this.showAll = true;
        document.getElementById('spinner').style.display = 'none';
      });
    } else if (this.level == 'block') {
      this.height = '270px';
      var block;
      id;
      if (this.districtName.match(/^\d/)) {
        id = parseInt(this.districtName);
      } else {
        block = this.districtObjArr.find(a => a.name == this.districtName);
        id = block.id;
      }
      this.service.blockWiseData({ id: id }).subscribe(res => {
        this.healthCardData = res['blockData'][0];
        this.showData(this.healthCardData);
        this.schoolInfra = ['infra_score'];
        this.schoolInfraKey = ['Infrastructure Score'];
        this.schoolInfraRank = ['block_level_rank_within_the_state', 'block_level_rank_within_the_district'];
        this.schoolInfraRankKye = ['Rank (within State)', 'Rank (within District)'];

        this.schoolAttendance = ['attendance'];
        this.schoolAttendanceKeys = ['Attendance'];
        this.schoolAttendanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.schoolAttendanceCategoryKey = ['Schools (Less than 33%)', 'Schools (33% to 60%)', 'Schools (60% to 75%)', 'Schools (Above 75%)'];

        this.semPerformance = ['performance'];
        this.semPerformanceKeys = ['Performance']

        this.patPerformance = ['block_performance'];
        this.patPerformanceKeys = ['Performance'];

        this.crcVisit = ['schools_0', 'schools_1_2', 'schools_3_5', 'schools_6_10', 'schools_10'];
        this.crcVisitKeys = ['Visit 0 times', 'Visit 1-2 times', 'Visit 3-5 times', 'Visit 6-10 times', 'Visit more than 10 times'];

        this.UDISE = ['school_infrastructure'];
        this.UDISEKeys = ['Infrastructure Score'];
        this.UDISECategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.UDISECategoryKey = ['Infrastructure Score (Less than 33%)', 'Infrastructure Score (33% to 60%)', 'Infrastructure Score (60% to 75%)', 'Infrastructure Score (Above 75%)'];
        document.getElementById('spinner').style.display = 'none';
      }, err => {
        this.err = true;
        this.showAll = true;
        document.getElementById('spinner').style.display = 'none';
      });
    } else if (this.level == 'cluster') {
      this.height = '300px';
      var cluster;
      let blkId;
      if (this.districtName.match(/^\d/)) {
        cluster = this.districtObjArr.find(a => a.id == this.districtName);
        id = parseInt(this.districtName);
        blkId = cluster.blockId;
      } else {
        cluster = this.districtObjArr.find(a => a.name == this.districtName);
        id = cluster.id;
        blkId = cluster.blockId;
      }
      this.service.clusterWiseData({ id: id, blockId: blkId }).subscribe(res => {
        this.healthCardData = res['clusterData'][0];
        this.showData(this.healthCardData);
        this.schoolInfra = ['infra_score'];
        this.schoolInfraKey = ['Infrastructure Score'];
        this.schoolInfraRank = ['cluster_level_rank_within_the_state', 'cluster_level_rank_within_the_district', 'cluster_level_rank_within_the_block'];
        this.schoolInfraRankKye = ['Rank (within State)', 'Rank (within District)', 'Rank (within Block)'];

        this.schoolAttendance = ['attendance'];
        this.schoolAttendanceKeys = ['Attendance'];
        this.schoolAttendanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.schoolAttendanceCategoryKey = ['Schools (Less than 33%)', 'Schools (33% to 60%)', 'Schools (60% to 75%)', 'Schools (Above 75%)'];

        this.semPerformance = ['performance'];
        this.semPerformanceKeys = ['Performance']

        this.patPerformance = ['cluster_performance'];
        this.patPerformanceKeys = ['Performance'];

        this.crcVisit = ['schools_0', 'schools_1_2', 'schools_3_5', 'schools_6_10', 'schools_10'];
        this.crcVisitKeys = ['Visit 0 times', 'Visit 1-2 times', 'Visit 3-5 times', 'Visit 6-10 times', 'Visit more than 10 times'];

        this.UDISE = ['school_infrastructure'];
        this.UDISEKeys = ['Infrastructure Score'];
        this.UDISECategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.UDISECategoryKey = ['Infrastructure Score (Less than 33%)', 'Infrastructure Score (33% to 60%)', 'Infrastructure Score (60% to 75%)', 'Infrastructure Score (Above 75%)'];
        document.getElementById('spinner').style.display = 'none';
      }, err => {
        this.err = true;
        this.showAll = true;
        document.getElementById('spinner').style.display = 'none';
      });
    } else if (this.level == 'school') {
      this.height = '330px';
      var school;
      var blok;
      if (this.districtName.match(/^\d/)) {
        school = this.districtObjArr.find(a => a.id == this.districtName);
        id = parseInt(this.districtName);
        blok = school.blockId;
      } else {
        school = this.districtObjArr.find(a => a.name == this.districtName);
        id = school.id;
        blok = school.blockId;
      }
      this.service.schoolWiseData({ id: id, blockId: blok }).subscribe(res => {
        this.healthCardData = res['schoolData'][0];
        this.showData(this.healthCardData);
        this.schoolInfra = ['infra_score'];
        this.schoolInfraKey = ['Infrastructure Score'];
        this.schoolInfraRank = ['school_level_rank_within_the_state', 'school_level_rank_within_the_district', 'school_level_rank_within_the_block', 'school_level_rank_within_the_cluster'];
        this.schoolInfraRankKye = ['Rank (within State)', 'Rank (within District)', 'Rank (within Block)', 'Rank (within School)'];

        this.schoolAttendance = ['attendance'];
        this.schoolAttendanceKeys = ['Attendance'];
        this.schoolAttendanceCategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.schoolAttendanceCategoryKey = ['Schools (Less than 33%)', 'Schools (33% to 60%)', 'Schools (60% to 75%)', 'Schools (Above 75%)'];

        this.semPerformance = ['performance'];
        this.semPerformanceKeys = ['Performance']

        this.patPerformance = ['school_performance'];
        this.patPerformanceKeys = ['Performance'];

        this.crcVisit = ['schools_0', 'schools_1_2', 'schools_3_5', 'schools_6_10', 'schools_10'];
        this.crcVisitKeys = ['Visit 0 times', 'Visit 1-2 times', 'Visit 3-5 times', 'Visit 6-10 times', 'Visit more than 10 times'];

        this.UDISE = ['school_infrastructure'];
        this.UDISEKeys = ['Infrastructure Score'];
        this.UDISECategory = ['value_below_33', 'value_between_33_60', 'value_between_60_75', 'value_above_75'];
        this.UDISECategoryKey = ['Infrastructure Score (Less than 33%)', 'Infrastructure Score (33% to 60%)', 'Infrastructure Score (60% to 75%)', 'Infrastructure Score (Above 75%)'];
        document.getElementById('spinner').style.display = 'none';
      }, err => {
        this.err = true;
        this.showAll = true;
        document.getElementById('spinner').style.display = 'none';
      });
    }

  }

  infraColor;
  stdAttendanceColor;
  semColor;
  patColor;
  crcColor;
  udiseColor;
  showData(healthCardData) {
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
    this.showAll = true;

    if (healthCardData['school_infrastructure'] && healthCardData['school_infrastructure'] != null) {
      this.tooltipInfra = Object.keys(healthCardData['school_infrastructure']);
      this.tooltipInfra.filter(key => {
        var myKey = this.stringConverter(key);
        this.toolTipInfraKeys.push(myKey);
      });
      this.infraColor = this.service.colorGredient(healthCardData['school_infrastructure']['infra_score']);
    }
    if (healthCardData['student_attendance'] && healthCardData['student_attendance'] != null) {
      this.tooltipStdAttendance = Object.keys(healthCardData['student_attendance']);
      this.tooltipStdAttendance.filter(key => {
        var myKey = this.stringConverter(key);
        this.tooltipStdAttendanceKeys.push(myKey);
      });
      this.stdAttendanceColor = this.service.colorGredient(healthCardData['student_attendance']['attendance']);
    }
    if (healthCardData['student_semester'] && healthCardData['student_semester'] != null) {
      this.tooltimSem = Object.keys(healthCardData['student_semester']);
      this.tooltimSem.filter(key => {
        var myKey = this.stringConverter(key);
        this.tooltipSemKeys.push(myKey);
      });
      this.semColor = this.service.colorGredient(healthCardData['student_semester']['performance']);
    }
    if (healthCardData['pat_performance'] && healthCardData['pat_performance'] != null) {
      this.tooltipPat = Object.keys(healthCardData['pat_performance']);
      this.tooltipPat.filter(key => {
        // if(key != 'grade_wise_performance'){
        var myKey = this.stringConverter(key);
        this.tooltipPatKeys.push(myKey);
        // }

      });
      this.patColor = this.service.colorGredient(healthCardData['pat_performance'][`${this.level}_performance`]);
    }
    if (healthCardData['crc_visit'] && healthCardData['crc_visit'] != null) {
      this.tooltipCrc = Object.keys(healthCardData['crc_visit']);
      this.tooltipCrc.filter(key => {
        var myKey = this.stringConverter(key);
        this.tooltipCrcKeys.push(myKey);
      });
      this.crcColor = this.service.colorGredient1(healthCardData['crc_visit']['schools_0']);
    }
    if (healthCardData['udise'] && healthCardData['udise'] != null) {
      this.tooltipUDISE = Object.keys(healthCardData['udise']);
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
    return key;
  }

  value: any;
  onChange() {
    this.showAll = false;
    if (this.value.match(/^\d/)) {
      this.autocomplete(document.getElementById("myInput"), this.ids);
    }
    if (!this.value.match(/^\d/)) {
      this.autocomplete(document.getElementById("myInput"), this.names);
    }
  }

  levels = [{ key: 'district', name: 'District' }, { key: 'block', name: 'Block' }, { key: 'cluster', name: 'Cluster' }, { key: 'school', name: 'School' }];
  selectedLevel() {
    this.allData = [];
    this.ids = [];
    this.names = [];
    document.getElementById('spinner').style.display = 'block';
    this.showAll = false;
    document.getElementById('myInput')['disabled'] = false;
    document.getElementById('myInput')['value'] = '';

    if (this.level == 'district') {
      this.service.metaData(this.level).subscribe(res => {
        this.allData = res;
        this.placeHolder = "search districts with name/id";
        this.names = this.allData['districtNames'];
        this.ids = this.allData['districtIds'];
        this.districtObjArr = this.allData['districts'];
        document.getElementById('spinner').style.display = 'none';
      });
    }

    if (this.level == 'block') {
      this.service.metaData(this.level).subscribe(res => {
        this.allData = res;
        this.placeHolder = "search blocks with name/id";
        this.names = this.allData['blockNames'];
        this.ids = this.allData['blockIds'];
        this.districtObjArr = this.allData['blocks'];
        document.getElementById('spinner').style.display = 'none';
      });
    }

    if (this.level == 'cluster') {
      this.service.metaData(this.level).subscribe(res => {
        this.allData = res;
        this.placeHolder = "search clusters with name/id";
        this.names = this.allData['clusterNames'];
        this.ids = this.allData['clusterIds'];
        this.districtObjArr = this.allData['clusters'];
        document.getElementById('spinner').style.display = 'none';
      });
    }

    if (this.level == 'school') {
      this.service.metaData(this.level).subscribe(res => {
        this.allData = res;
        this.placeHolder = "search schools with name/id";
        this.names = this.allData['schoolNames'];
        this.ids = this.allData['schoolIds'];
        this.districtObjArr = this.allData['schools'];
        document.getElementById('spinner').style.display = 'none';
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
}
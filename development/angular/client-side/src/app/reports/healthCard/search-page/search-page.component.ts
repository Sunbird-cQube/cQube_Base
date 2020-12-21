import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceComponent } from 'src/app/app.service';
import { HealthCardService } from 'src/app/services/health-card.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  placeHolder = "Click one of the button";
  level;
  keys;
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
  schoolAttendance = [];
  semPerformance = [];
  patPerformance = [];
  crcVisit = [];
  teacherAttendance = [];
  allData: any;
  showAll = false;

  constructor(public commonService: AppServiceComponent, public service: HealthCardService, public router: Router) { }

  ngOnInit(): void {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('myInput')['disabled'] = true;
    document.getElementById('spinner').style.display = 'block';
    this.service.metaData().subscribe(res => {
      this.allData = res;
      document.getElementById('spinner').style.display = 'none';
    });
  }

  onSubmit() {
    // this.districtName = document.getElementById('myInput')['value'];
    // if (this.level == 'district') {
    //   var dist;
    //   if (this.districtName.match(/^\d/)) {
    //     this.districtName = parseInt(this.districtName);
    //     this.service.districtWiseData({ id: this.districtName }).subscribe(res => {
    //       this.healthCardData = res['districtData'][0];
    //       this.showData(this.healthCardData);
    //     });
    //   } else {
    //     dist = this.districtObjArr.find(a => a.name == this.districtName);
    //     this.service.districtWiseData({ id: dist.id }).subscribe(res => {
    //       this.healthCardData = res['districtData'][0];
    //       this.showData(this.healthCardData);
    //     });
    //   }
    // } else if (this.level == 'block') {
    //   var block;
    //   if (this.districtName.match(/^\d/)) {
    //     this.districtName = parseInt(this.districtName);
    //     this.service.blockWiseData({ id: this.districtName }).subscribe(res => {
    //       this.healthCardData = res['blockData'][0];
    //       this.showData(this.healthCardData);
    //     });
    //   } else {
    //     block = this.districtObjArr.find(a => a.name == this.districtName);
    //     this.service.blockWiseData({ id: block.id }).subscribe(res => {
    //       this.healthCardData = res['blockData'][0];
    //       this.showData(this.healthCardData);
    //     });
    //   }
    // } else if (this.level == 'cluster') {
    //   var cluster;
    //   if (this.districtName.match(/^\d/)) {
    //     cluster = this.districtObjArr.find(a => a.id == this.districtName);
    //     this.districtName = parseInt(this.districtName);
    //     this.service.clusterWiseData({ id: cluster.id, blockId: cluster.blockId }).subscribe(res => {
    //       this.healthCardData = res['clusterData'][0];
    //       this.showData(this.healthCardData);
    //     });
    //   } else {
    //     cluster = this.districtObjArr.find(a => a.name == this.districtName);
    //     this.service.clusterWiseData({ id: cluster.id, blockId: cluster.blockId }).subscribe(res => {
    //       this.healthCardData = res['clusterData'][0];
    //       this.showData(this.healthCardData);
    //     });
    //   }
    // } else if (this.level == 'school') {
    //   var school;
    //   if (this.districtName.match(/^\d/)) {
    //     school = this.districtObjArr.find(a => a.name == this.districtName);
    //     this.districtName = parseInt(this.districtName);
    //     this.service.schoolWiseData({ id: this.districtName, blockId: school.blockId }).subscribe(res => {
    //       this.healthCardData = res['schoolData'][0];
    //       this.showData(this.healthCardData);
    //     });
    //   } else {
    //     school = this.districtObjArr.find(a => a.name == this.districtName);
    //     this.service.schoolWiseData({ id: school.id, blockId: school.blockId }).subscribe(res => {
    //       this.healthCardData = res['schoolData'][0];
    //       this.showData(this.healthCardData);
    //     });
    //   }
    // }
    // this.router.navigate([`/healthCard/${id}`])
  }

  districtClick() {
    this.level = 'district';
    this.showAll = false;
    document.getElementById('myInput')['disabled'] = false;
    document.getElementById('myInput')['value'] = '';
    this.placeHolder = "search districts with name/id";
    this.names = this.allData['districtNames'];
    this.ids = this.allData['districtIds'];
    this.districtObjArr = this.allData['districts'];
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
  blockClick() {
    this.level = 'block';
    this.showAll = false;
    document.getElementById('myInput')['disabled'] = false;
    document.getElementById('myInput')['value'] = '';
    this.placeHolder = "search blocks with name/id";
    this.names = this.allData['blockNames'];
    this.ids = this.allData['blockIds'];
    this.districtObjArr = this.allData['blocks'];
  }
  clusterClick() {
    this.level = 'cluster';
    this.showAll = false;
    document.getElementById('myInput')['disabled'] = false;
    document.getElementById('myInput')['value'] = '';
    this.placeHolder = "search clusters with name/id";
    this.names = this.allData['clusterNames'];
    this.ids = this.allData['clusterIds'];
    this.districtObjArr = this.allData['clusters'];
  }
  schoolClick() {
    this.level = 'school';
    this.showAll = false;
    document.getElementById('myInput')['disabled'] = false;
    document.getElementById('myInput')['value'] = '';
    this.placeHolder = "search schools with name/id";
    this.names = this.allData['schoolNames'];
    this.ids = this.allData['schoolIds'];
    this.districtObjArr = this.allData['schools'];
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

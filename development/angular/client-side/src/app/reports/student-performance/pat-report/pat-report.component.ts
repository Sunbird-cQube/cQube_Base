import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PatReportService } from "../../../services/pat-report.service";
import { Router } from "@angular/router";
import * as L from "leaflet";
import * as R from "leaflet-responsive-popup";
import { AppServiceComponent, globalMap } from "../../../app.service";
declare const $;

@Component({
  selector: "app-pat-report",
  templateUrl: "./pat-report.component.html",
  styleUrls: ["./pat-report.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PATReportComponent implements OnInit {
  public title: string = "";
  public titleName: string = "";
  public colors: any;
  public setColor: any;

  // to assign the count of below values to show in the UI footer
  public studentCount: any;
  public schoolCount: any;
  public studentAttended: any;
  public dateRange: any = "";

  // to hide and show the hierarchy details
  public skul: boolean = true;
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;

  // to hide the blocks and cluster dropdowns
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;
  subjectHidden: boolean = true;

  // to set the hierarchy names
  public districtHierarchy: any = "";
  public blockHierarchy: any = "";
  public clusterHierarchy: any = "";

  // leaflet layer dependencies
  public layerMarkers = new L.layerGroup();
  public markersList = new L.FeatureGroup();

  // assigning the data to each of these to show in dropdowns and maps
  // for dropdowns
  public data: any;
  public markers: any = [];
  // for maps
  public districtMarkers: any = [];
  public blockMarkers: any = [];
  public clusterMarkers: any = [];
  public schoolMarkers: any = [];

  public allDistricts: any = [];
  public allBlocks: any = [];
  public allClusters: any = [];

  // to show and hide the dropdowns based on the selection of buttons
  public stateLevel: any = 0; // 0 for buttons and 1 for dropdowns

  // to download the excel report
  public fileName: any;
  public reportData: any = [];

  // variables
  public districtId: any = "";
  public blockId: any = "";
  public clusterId: any = "";

  public myData;

  public myDistData: any;
  public myBlockData: any = [];
  public myClusterData: any = [];
  public mySchoolData: any = [];
  public level = "District";

  allGrades = [];
  allSubjects = [];
  grade;
  subject;

  distFilter = [];
  blockFilter = [];
  clusterFilter = [];
  reportName = "periodic_assessment_test";

  public getMonthYear: any;
  public years: any = [];
  public year;
  public months: any = [];
  public month;
  yearMonth = true;

  timeRange = [
    { key: "all", value: "Overall" },
    { key: "last_30_days", value: "Last 30 Days" },
    { key: "last_7_days", value: "Last 7 Days" },
    { key: "select_month", value: "Year and Month" },
  ];
  period = "all";
  state: string;
  // initial center position for the map
  public lat: any;
  public lng: any;
  month_year: { month: any; year: any };
  timePeriod: { period: any };

  management;
  category;
  managementName;
  public allMonths: any = ['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'];

  constructor(
    public http: HttpClient,
    public service: PatReportService,
    public commonService: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
    private readonly _router: Router
  ) { }

  selected = "absolute";

  getColor(data) {
    this.selected = data;
    this.levelWiseFilter();
  }

  width = window.innerWidth;
  heigth = window.innerHeight;
  onResize() {
    this.width = window.innerWidth;
    this.heigth = window.innerHeight;
  }


  ngOnInit() {
    this.commonService.errMsg();
    this.state = this.commonService.state;
    this.commonService.latitude = this.lat = this.commonService.mapCenterLatlng.lat;
    this.commonService.longitude = this.lng = this.commonService.mapCenterLatlng.lng;
    this.changeDetection.detectChanges();
    this.commonService.initMap("patMap", [[this.lat, this.lng]]);
    document.getElementById("homeBtn").style.display = "block";
    document.getElementById("backBtn").style.display = "none";
    let params = JSON.parse(sessionStorage.getItem("report-level-info"));

    this.skul = true;
    this.period = "all";
    this.managementName = this.management = JSON.parse(localStorage.getItem('management')).id;
    this.category = JSON.parse(localStorage.getItem('category')).id;
    this.managementName = this.commonService.changeingStringCases(
      this.managementName.replace(/_/g, " ")
    );
    this.service.getMonthYear().subscribe((res) => {
      this.getMonthYear = res;
      this.getMonthYear.map((item) => {
        this.years.push(item["academic_year"]);
      });
      this.year = this.years[this.years.length - 1];

      this.months = [];
      var months = [];
      this.getMonthYear.map((item) => {
        if (item["academic_year"] == this.year) {
          months = item["month"];
        }
      });
      months.map(a => {
        this.months.push(a.trim());
      });
      this.months.sort((a, b) => {
        return this.allMonths.indexOf(a) - this.allMonths.indexOf(b);
      });
      this.month = this.months[this.months.length - 1];
      if (this.month) {
        this.month_year = {
          month: null,
          year: null,
        };
      }

      if (params) {
        if (params.timePeriod == "overall") {
          params.timePeriod = "all";
        }
        this.period = params.timePeriod;
      }

      if (params && params.level) {
        let data = params.data;
        if (params.level === "district") {
          this.districtHierarchy = {
            distId: data.id,
          };

          this.districtId = data.id;
          this.getDistricts(params.level);
        } else if (params.level === "block") {
          this.districtHierarchy = {
            distId: data.districtId,
          };

          this.blockHierarchy = {
            distId: data.districtId,
            blockId: data.id,
          };

          this.districtId = data.districtId;
          this.blockId = data.id;
          this.getDistricts(params.level);
          this.getBlocks(data.districtId, data.id);
        } else if (params.level === "cluster") {
          this.districtHierarchy = {
            distId: data.districtId,
          };

          this.blockHierarchy = {
            distId: data.districtId,
            blockId: data.blockId,
          };

          this.clusterHierarchy = {
            distId: data.districtId,
            blockId: data.blockId,
            clusterId: data.id,
          };

          this.districtId = data.blockHierarchy;
          this.blockId = data.blockId;
          this.clusterId = data.id;
          this.getDistricts(params.level);
          this.getBlocks(data.districtId);
          this.getClusters(data.districtId, data.blockId, data.id);
        }
      } else {
        this.levelWiseFilter();
      }
    }, err => {
      this.getMonthYear = [];
      this.commonService.loaderAndErr(this.getMonthYear);
    });
  }

  getDistricts(level): void {
    this.service
      .PATDistWiseData({
        ...{ grade: this.grade, subject: this.subject, period: this.period, report: "pat" },
        ...this.month_year,
        ...{ management: this.management, category: this.category },
      })
      .subscribe(
        (res) => {
          this.data = res["data"];
          this.districtMarkers = this.allDistricts = this.data;
          if (!this.districtMarkers[0]["Subjects"]) {
            this.distFilter = this.districtMarkers;
          }

          if (level === "district") {
            this.ondistLinkClick(this.districtId);
          }
          this.allDistricts.sort((a, b) =>
            a.Details.district_name > b.Details.district_name
              ? 1
              : b.Details.district_name > a.Details.district_name
                ? -1
                : 0
          );
          this.changeDetection.detectChanges();
        },
        (err) => {
          this.errorHandling();
        }
      );
  }

  getBlocks(distId, blockId?: any): void {
    this.service
      .PATBlocksPerDistData(distId, {
        ...{ period: this.period, report: "pat" },
        ...this.month_year,
        ...{ management: this.management, category: this.category },
      })
      .subscribe(
        (res) => {
          this.data = res["data"];
          this.blockMarkers = this.data;
          this.allBlocks = this.data.sort((a, b) =>
            a.Details.block_name > b.Details.block_name
              ? 1 : b.Details.block_name > a.Details.block_name ? -1 : 0
          );
          this.changeDetection.detectChanges();
          if (!this.blockMarkers[0]["Subjects"]) {
            this.blockFilter = this.blockMarkers;
          }

          if (blockId) this.onblockLinkClick(blockId);
        },
        (err) => {
          this.errorHandling();
        }
      );
  }

  getClusters(distId, blockId, clusterId): void {
    this.service
      .PATClustersPerBlockData(distId, blockId, {
        ...{ period: this.period, report: "pat" },
        ...this.month_year,
        ...{ management: this.management, category: this.category },
      })
      .subscribe(
        (res) => {
          this.data = res["data"];
          this.clusterMarkers = this.allClusters = this.data;

          if (!this.clusterMarkers[0]["Subjects"]) {
            this.clusterFilter = this.clusterMarkers;
          }

          this.onclusterLinkClick(clusterId);
        },
        (err) => {
          this.errorHandling();
        }
      );
  }

  showYearMonth() {
    this.grade = undefined;
    this.subject = undefined;
    this.subjectHidden = true;
    document.getElementById("home").style.display = "block";
    this.yearMonth = false;
    this.month = this.months[this.months.length - 1];
    this.month_year = {
      month: this.month.trim(),
      year: this.year,
    };
    this.levelWiseFilter();
  }

  getMonth(event) {
    this.month_year = {
      month: this.month.trim(),
      year: this.year,
    };
    this.grade = undefined;
    this.levelWiseFilter();
  }

  getYear() {
    this.months = [];
    this.month = undefined;
    this.getMonthYear.map((item) => {
      if (item["academic_year"] == this.year) {
        this.months = item["month"];
      }
    });
  }

  onPeriodSelect() {
    this.grade = undefined;
    this.subject = undefined;
    this.subjectHidden = true;
    if (this.period != "overall") {
      document.getElementById("home").style.display = "block";
    } else {
      document.getElementById("home").style.display = "none";
    }
    this.yearMonth = true;
    this.month_year = {
      month: null,
      year: null,
    };
    this.levelWiseFilter();
  }

  onGradeSelect(data) {
    this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade}_${this.subject ? this.subject : ""
      }_all${this.level}_${this.commonService.dateAndTime}`;
    this.grade = data;
    this.subjectHidden = false;
    this.subject = "";
    this.levelWiseFilter();
  }
  onSubjectSelect(data) {
    this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade}_${this.subject}_all${this.level}_${this.commonService.dateAndTime}`;
    this.subject = data;
    this.levelWiseFilter();
  }

  levelWiseFilter() {
    if (this.level == "District") {
      this.districtWise();
    }
    if (this.level == "Block") {
      this.blockWise();
    }
    if (this.level == "Cluster") {
      this.clusterWise();
    }
    if (this.level == "School") {
      this.schoolWise();
    }

    if (this.level == "blockPerDistrict") {
      this.onDistrictSelect(this.districtId);
    }
    if (this.level == "clusterPerBlock") {
      this.onBlockSelect(this.blockId);
    }
    if (this.level == "schoolPerCluster") {
      this.onClusterSelect(this.clusterId);
    }
  }

  linkClick() {
    document.getElementById("home").style.display = "none";
    this.yearMonth = true;
    this.grade = undefined;
    this.subject = undefined;
    this.subjectHidden = true;
    this.period = "all";
    this.level = "District";
    this.month_year = {
      month: null,
      year: null,
    };
    this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade ? this.grade : "allGrades"
      }_${this.subject ? this.subject : ""}_allDistricts_${this.commonService.dateAndTime
      }`;
    this.levelWiseFilter();
    this.changeDetection.detectChanges();
  }

  // to load all the districts for state data on the map
  districtWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.commonService.latitude = this.lat = this.commonService.mapCenterLatlng.lat;
      this.commonService.longitude = this.lng = this.commonService.mapCenterLatlng.lng;
      this.layerMarkers.clearLayers();
      this.districtId = undefined;
      if (this.level != "District") {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.reportData = [];
      this.commonService.errMsg();
      this.level = "District";
      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade ? this.grade : "allGrades"
        }_${this.subject ? this.subject : ""}_allDistricts_${this.commonService.dateAndTime
        }`;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;
      this.service
        .gradeMetaData({
          ...{ period: this.period, report: "pat" },
          ...this.month_year,
        })
        .subscribe(
          (res) => {
            if (res["data"]["district"]) {
              this.allGrades = res["data"]["district"];
            }
            this.allGrades.sort((a, b) =>
              a.grade > b.grade ? 1 : b.grade > a.grade ? -1 : 0
            );

            if (this.myData) {
              this.myData.unsubscribe();
            }
            this.myData = this.service
              .PATDistWiseData({
                ...{
                  ...{ grade: this.grade, subject: this.subject, period: this.period, report: "pat" },
                  ...this.month_year,
                  ...{ management: this.management, category: this.category },
                },
                ...this.month_year,
                ...{ management: this.management, category: this.category },
              })
              .subscribe(
                (res) => {
                  this.myDistData = res;
                  this.data = res["data"];
                  if (this.grade) {
                    this.allSubjects = res['subjects'];
                  }
                  // to show only in dropdowns
                  this.districtMarkers = this.allDistricts = this.data;
                  if (!this.districtMarkers[0]["Subjects"]) {
                    this.distFilter = this.districtMarkers;
                  }
                  // options to set for markers in the map
                  let options = {
                    fillOpacity: 1,
                    strokeWeight: 0.01,
                    mapZoom: this.commonService.zoomLevel,
                    centerLat: this.lat,
                    centerLng: this.lng,
                    level: "District",
                  };

                  this.commonService.restrictZoom(globalMap);
                  globalMap.setMaxBounds([
                    [options.centerLat - 4.5, options.centerLng - 6],
                    [options.centerLat + 3.5, options.centerLng + 6],
                  ]);
                  this.changeDetection.detectChanges();
                  this.genericFun(this.myDistData, options, this.fileName);
                  this.commonService.onResize(this.level);
                  this.allDistricts.sort((a, b) =>
                    a.Details["district_name"] > b.Details["district_name"]
                      ? 1
                      : b.Details["district_name"] > a.Details["district_name"]
                        ? -1
                        : 0
                  );
                  this.changeDetection.detectChanges();
                },
                (err) => {
                  this.allDistricts = [];
                  this.errorHandling();
                }
              );
          },
          (error) => {
            this.errorHandling();
          }
        );

      // adding the markers to the map layers
      globalMap.addLayer(this.layerMarkers);
      document.getElementById("home").style.display = "none";
    } catch (e) {
      console.log(e);
    }
  }

  blockClick() {
    if (this.grade) {
      this.grade = undefined;
      this.subject = undefined;
      this.subjectHidden = true;
      this.blockWise();
    } else {
      this.blockWise();
    }
  }
  // to load all the blocks for state data on the map
  blockWise() {
    if (this.period === "select_month" && !this.month || this.month === '') {
      alert("Please select month!");
      return;
    }

    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.commonService.latitude = this.lat = this.commonService.mapCenterLatlng.lat;
      this.commonService.longitude = this.lng = this.commonService.mapCenterLatlng.lng;
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      if (this.level != "Block") {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.allGrades = [];
      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.level = "Block";
      this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade ? this.grade : "allGrades"
        }_${this.subject ? this.subject : ""}_allBlocks_${this.commonService.dateAndTime
        }`;

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      this.service
        .gradeMetaData({
          ...{ period: this.period, report: "pat" },
          ...this.month_year,
          ...{ management: this.management, category: this.category },
        })
        .subscribe(
          (res) => {
            if (res["data"]["block"]) {
              this.allGrades = res["data"]["block"];
            }
            this.allGrades.sort((a, b) =>
              a.grade > b.grade ? 1 : b.grade > a.grade ? -1 : 0
            );

            // api call to get the all clusters data
            if (this.myData) {
              this.myData.unsubscribe();
            }
            this.myData = this.service
              .PATBlockWiseData({
                ...{ grade: this.grade, subject: this.subject, period: this.period, report: "pat" },
                ...this.month_year,
                ...{ management: this.management, category: this.category },
              })
              .subscribe(
                (res) => {
                  this.myBlockData = res["data"];
                  this.data = res["data"];
                  if (this.grade) {
                    this.allSubjects = res['subjects'];
                  }
                  let options = {
                    mapZoom: this.commonService.zoomLevel,
                    centerLat: this.lat,
                    centerLng: this.lng,
                    level: "Block",
                  };

                  if (this.data.length > 0) {
                    let result = this.data;
                    this.blockMarkers = result;
                    if (!this.blockMarkers[0]["Subjects"]) {
                      this.blockFilter = this.blockMarkers;
                    }
                    this.schoolCount = 0;
                    if (this.grade && this.subject) {
                      let filterData = this.blockMarkers.filter((obj) => {
                        return Object.keys(obj.Subjects).includes(this.subject);
                      });
                      this.blockFilter = filterData;
                    }

                    if (this.selected != "absolute") {
                      this.colors = this.generateRelativeColors(this.blockMarkers);
                    }
                    for (let i = 0; i < this.blockMarkers.length; i++) {
                      if (this.period != 'all') {
                        if (this.grade && !this.subject) {
                          this.blockMarkers[i].Details['total_students'] = this.blockMarkers[i].Subjects['Grade Performance']['total_students'];
                          this.blockMarkers[i].Details['students_attended'] = this.blockMarkers[i].Subjects['Grade Performance']['students_attended'];
                          this.blockMarkers[i].Details['total_schools'] = this.blockMarkers[i].Subjects['Grade Performance']['total_schools'];
                        }
                        if (this.grade && this.subject) {
                          if (this.blockMarkers[i].Subjects[`${this.subject}`]) {
                            this.blockMarkers[i].Details['total_students'] = this.blockMarkers[i].Subjects[`${this.subject}`]['total_students'];
                            this.blockMarkers[i].Details['students_attended'] = this.blockMarkers[i].Subjects[`${this.subject}`]['students_attended'];
                            this.blockMarkers[i].Details['total_schools'] = this.blockMarkers[i].Subjects[`${this.subject}`]['total_schools'];
                          } else {
                            let index = this.blockMarkers.indexOf(this.blockMarkers[i]);
                            this.blockMarkers.splice(index, 1);
                          }
                        }
                        if (this.grade) {
                          this.blockMarkers[i].Subjects['Grade Performance'] = this.blockMarkers[i].Subjects['Grade Performance']['percentage']
                          this.allSubjects.map(sub => {
                            if (this.blockMarkers[i].Subjects[`${sub}`])
                              this.blockMarkers[i].Subjects[`${sub}`] = this.blockMarkers[i].Subjects[`${sub}`]['percentage']
                          })
                        } else if (!this.grade && !this.subject) {
                          this.allGrades.map(grade => {
                            var myGrade = grade.grade;
                            if (this.blockMarkers[i]['Grade Wise Performance'][`${myGrade}`])
                              this.blockMarkers[i]['Grade Wise Performance'][`${myGrade}`] = this.blockMarkers[i]['Grade Wise Performance'][`${myGrade}`]['percentage'];
                          })
                        }
                      }
                      var color;
                      if (!this.grade && !this.subject) {
                        color = this.commonService.color(
                          this.blockMarkers[i].Details,
                          "Performance"
                        );
                      } else if (this.grade && !this.subject) {
                        color = this.commonService.color(
                          this.blockMarkers[i].Subjects,
                          "Grade Performance"
                        );
                      } else if (this.grade && this.subject) {
                        color = this.commonService.color(
                          this.blockMarkers[i].Subjects,
                          this.subject
                        );
                      }

                      var markerIcon = this.attachColorsToMarkers(this.blockMarkers[i], color, this.colors, 0.01, 1, options.level);
                      this.generateToolTip(
                        this.blockMarkers[i],
                        options.level,
                        markerIcon,
                        "latitude",
                        "longitude"
                      );
                      this.getDownloadableData(
                        this.blockMarkers[i],
                        options.level
                      );
                    }

                    this.commonService.restrictZoom(globalMap);
                    globalMap.setMaxBounds([
                      [options.centerLat - 4.5, options.centerLng - 6],
                      [options.centerLat + 3.5, options.centerLng + 6],
                    ]);
                    this.changeDetection.detectChanges();
                    this.commonService.onResize(this.level);

                    //schoolCount
                    this.schoolCount = res['footer'] ? res['footer'].total_schools : null;
                    if (this.schoolCount != null) {
                      this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    }
                    this.studentCount = res['footer'] ? res['footer'].total_students : null;
                    if (this.studentCount != null) {
                      this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    }
                    this.studentAttended = res['footer'] ? res['footer'].students_attended : null;
                    if (this.studentAttended != null) {
                      this.studentAttended = (this.studentAttended).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    }

                    this.commonService.loaderAndErr(this.data);
                    this.changeDetection.detectChanges();
                  }
                },
                (err) => {
                  this.errorHandling();
                }
              );
          },
          (error) => {
            this.errorHandling();
          }
        );
      globalMap.addLayer(this.layerMarkers);
      document.getElementById("home").style.display = "block";
    } catch (e) {
      console.log(e);
    }
  }

  clusterClick() {
    if (this.grade) {
      this.grade = undefined;
      this.subject = undefined;
      this.subjectHidden = true;
      this.clusterWise();
    } else {
      this.clusterWise();
    }
  }
  // to load all the clusters for state data on the map
  clusterWise() {
    if (this.period === "select_month" && !this.month || this.month === '') {
      alert("Please select month!");
      return;
    }

    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.commonService.latitude = this.lat = this.commonService.mapCenterLatlng.lat;
      this.commonService.longitude = this.lng = this.commonService.mapCenterLatlng.lng;
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      if (this.level != "Cluster") {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.allGrades = [];
      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.clusterId = undefined;
      this.level = "Cluster";
      this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade ? this.grade : "allGrades"
        }_${this.subject ? this.subject : ""}_allClusters_${this.commonService.dateAndTime
        }`;

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      this.service
        .gradeMetaData({
          ...{ period: this.period, report: "pat" },
          ...this.month_year,
          ...{ management: this.management, category: this.category },
        })
        .subscribe(
          (res) => {
            if (res["data"]["cluster"]) {
              this.allGrades = res["data"]["cluster"];
            }
            this.allGrades.sort((a, b) =>
              a.grade > b.grade ? 1 : b.grade > a.grade ? -1 : 0
            );

            // api call to get the all clusters data
            if (this.myData) {
              this.myData.unsubscribe();
            }
            this.myData = this.service
              .PATClusterWiseData({
                ...{ grade: this.grade, subject: this.subject, period: this.period, report: "pat" },
                ...this.month_year,
                ...{ management: this.management, category: this.category },
              })
              .subscribe(
                (res) => {
                  this.data = res["data"];
                  if (this.grade) {
                    this.allSubjects = res['subjects'];
                  }
                  let options = {
                    mapZoom: this.commonService.zoomLevel,
                    centerLat: this.lat,
                    centerLng: this.lng,
                    level: "Cluster",
                  };

                  if (this.data.length > 0) {
                    let result = this.data;
                    this.clusterMarkers = [];
                    this.clusterMarkers = result;
                    if (!this.clusterMarkers[0]["Subjects"]) {
                      this.clusterFilter = this.clusterMarkers;
                    }
                    this.schoolCount = 0;
                    if (this.grade && this.subject) {
                      let filterData = this.clusterMarkers.filter((obj) => {
                        return Object.keys(obj.Subjects).includes(this.subject);
                      });
                      this.clusterMarkers = filterData;
                    }
                    if (this.selected != "absolute") {
                      this.colors = this.generateRelativeColors(this.clusterMarkers)
                    }

                    for (let i = 0; i < this.clusterMarkers.length; i++) {
                      if (this.period != 'all') {
                        if (this.grade && !this.subject) {
                          this.clusterMarkers[i].Details['total_students'] = this.clusterMarkers[i].Subjects['Grade Performance']['total_students'];
                          this.clusterMarkers[i].Details['students_attended'] = this.clusterMarkers[i].Subjects['Grade Performance']['students_attended'];
                          this.clusterMarkers[i].Details['total_schools'] = this.clusterMarkers[i].Subjects['Grade Performance']['total_schools'];
                        }
                        if (this.grade && this.subject) {
                          if (this.clusterMarkers[i].Subjects[`${this.subject}`]) {
                            this.clusterMarkers[i].Details['total_students'] = this.clusterMarkers[i].Subjects[`${this.subject}`]['total_students'];
                            this.clusterMarkers[i].Details['students_attended'] = this.clusterMarkers[i].Subjects[`${this.subject}`]['students_attended'];
                            this.clusterMarkers[i].Details['total_schools'] = this.clusterMarkers[i].Subjects[`${this.subject}`]['total_schools'];
                          } else {
                            let index = this.clusterMarkers.indexOf(this.clusterMarkers[i]);
                            this.clusterMarkers.splice(index, 1);
                          }
                        }
                        if (this.grade) {
                          this.clusterMarkers[i].Subjects['Grade Performance'] = this.clusterMarkers[i].Subjects['Grade Performance']['percentage']
                          this.allSubjects.map(sub => {
                            if (this.clusterMarkers[i].Subjects[`${sub}`])
                              this.clusterMarkers[i].Subjects[`${sub}`] = this.clusterMarkers[i].Subjects[`${sub}`]['percentage']
                          })
                        } else if (!this.grade && !this.subject) {
                          this.allGrades.map(grade => {
                            var myGrade = grade.grade;
                            if (this.clusterMarkers[i]['Grade Wise Performance'][`${myGrade}`])
                              this.clusterMarkers[i]['Grade Wise Performance'][`${myGrade}`] = this.clusterMarkers[i]['Grade Wise Performance'][`${myGrade}`]['percentage'];
                          })
                        }
                      }
                      var color;
                      if (!this.grade && !this.subject) {
                        color = this.commonService.color(
                          this.clusterMarkers[i].Details,
                          "Performance"
                        );
                      } else if (this.grade && !this.subject) {
                        color = this.commonService.color(
                          this.clusterMarkers[i].Subjects,
                          "Grade Performance"
                        );
                      } else if (this.grade && this.subject) {
                        color = this.commonService.color(
                          this.clusterMarkers[i].Subjects,
                          this.subject
                        );
                      }
                      var markerIcon = this.attachColorsToMarkers(this.clusterMarkers[i], color, this.colors, 0.01, 0.5, options.level);
                      this.generateToolTip(
                        this.clusterMarkers[i],
                        options.level,
                        markerIcon,
                        "latitude",
                        "longitude"
                      );
                      this.getDownloadableData(
                        this.clusterMarkers[i],
                        options.level
                      );
                    }

                    //schoolCount
                    this.schoolCount = res['footer'] ? res['footer'].total_schools : null;
                    if (this.schoolCount != null) {
                      this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    }
                    this.studentCount = res['footer'] ? res['footer'].total_students : null;
                    if (this.studentCount != null) {
                      this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    }
                    this.studentAttended = res['footer'] ? res['footer'].students_attended : null;
                    if (this.studentAttended != null) {
                      this.studentAttended = (this.studentAttended).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    }

                    this.commonService.restrictZoom(globalMap);
                    globalMap.setMaxBounds([
                      [options.centerLat - 4.5, options.centerLng - 6],
                      [options.centerLat + 3.5, options.centerLng + 6],
                    ]);
                    this.changeDetection.detectChanges();
                    this.commonService.onResize(this.level);

                    this.commonService.loaderAndErr(this.data);
                    this.changeDetection.detectChanges();
                  }
                },
                (err) => {
                  this.errorHandling();
                }
              );
          },
          (error) => {
            this.errorHandling();
          }
        );
      globalMap.addLayer(this.layerMarkers);
      document.getElementById("home").style.display = "block";
    } catch (e) {
      console.log(e);
    }
  }

  schoolClick() {
    if (this.grade) {
      this.grade = undefined;
      this.subject = undefined;
      this.subjectHidden = true;
      this.schoolWise();
    } else {
      this.schoolWise();
    }
  }
  // to load all the schools for state data on the map
  schoolWise() {
    if (this.period === "select_month" && !this.month || this.month === '') {
      alert("Please select month!");
      return;
    }

    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.commonService.latitude = this.lat = this.commonService.mapCenterLatlng.lat;
      this.commonService.longitude = this.lng = this.commonService.mapCenterLatlng.lng;
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      if (this.level != "School") {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.allGrades = [];
      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.clusterId = undefined;
      this.level = "School";
      this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade ? this.grade : "allGrades"
        }_${this.subject ? this.subject : ""}_allSchools_${this.commonService.dateAndTime
        }`;

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      this.service
        .gradeMetaData({
          ...{ period: this.period, report: "pat" },
          ...this.month_year,
          ...{ management: this.management, category: this.category },
        })
        .subscribe(
          (res) => {
            if (res["data"]["school"]) {
              this.allGrades = res["data"]["school"];
            }
            this.allGrades.sort((a, b) =>
              a.grade > b.grade ? 1 : b.grade > a.grade ? -1 : 0
            );

            // api call to get the all schools data
            if (this.myData) {
              this.myData.unsubscribe();
            }
            this.myData = this.service
              .PATSchoolWiseData({
                ...{ grade: this.grade, subject: this.subject, period: this.period, report: "pat" },
                ...this.month_year,
                ...{ management: this.management, category: this.category },
              })
              .subscribe(
                (res) => {
                  this.data = res["data"];
                  if (this.grade) {
                    this.allSubjects = res['subjects'];
                  }
                  let options = {
                    mapZoom: this.commonService.zoomLevel,
                    centerLat: this.lat,
                    centerLng: this.lng,
                    level: "School",
                  };

                  this.schoolMarkers = [];
                  if (this.data.length > 0) {
                    let result = this.data;
                    this.schoolCount = 0;
                    this.schoolMarkers = result;
                    if (this.grade && this.subject) {
                      let filterData = this.schoolMarkers.filter((obj) => {
                        return Object.keys(obj.Subjects).includes(this.subject);
                      });
                      this.schoolMarkers = filterData;
                    }

                    if (this.selected != "absolute") {
                      this.colors = this.generateRelativeColors(this.schoolMarkers)
                    }

                    for (let i = 0; i < this.schoolMarkers.length; i++) {
                      if (this.period != 'all') {
                        if (this.grade && !this.subject) {
                          this.schoolMarkers[i].Details['total_students'] = this.schoolMarkers[i].Subjects['Grade Performance']['total_students'];
                          this.schoolMarkers[i].Details['students_attended'] = this.schoolMarkers[i].Subjects['Grade Performance']['students_attended'];
                          this.schoolMarkers[i].Details['total_schools'] = this.schoolMarkers[i].Subjects['Grade Performance']['total_schools'];
                        }
                        if (this.grade && this.subject) {
                          if (this.schoolMarkers[i].Subjects[`${this.subject}`]) {
                            this.schoolMarkers[i].Details['total_students'] = this.schoolMarkers[i].Subjects[`${this.subject}`]['total_students'];
                            this.schoolMarkers[i].Details['students_attended'] = this.schoolMarkers[i].Subjects[`${this.subject}`]['students_attended'];
                            this.schoolMarkers[i].Details['total_schools'] = this.schoolMarkers[i].Subjects[`${this.subject}`]['total_schools'];
                          }
                          else {
                            let index = this.schoolMarkers.indexOf(this.blockMarkers[i]);
                            this.schoolMarkers.splice(index, 1);
                          }
                        }
                        if (this.grade) {
                          this.schoolMarkers[i].Subjects['Grade Performance'] = this.schoolMarkers[i].Subjects['Grade Performance']['percentage']
                          this.allSubjects.map(sub => {
                            if (this.schoolMarkers[i].Subjects[`${sub}`])
                              this.schoolMarkers[i].Subjects[`${sub}`] = this.schoolMarkers[i].Subjects[`${sub}`]['percentage']
                          })
                        } else if (!this.grade && !this.subject) {
                          this.allGrades.map(grade => {
                            var myGrade = grade.grade;
                            if (this.schoolMarkers[i]['Grade Wise Performance'][`${myGrade}`])
                              this.schoolMarkers[i]['Grade Wise Performance'][`${myGrade}`] = this.schoolMarkers[i]['Grade Wise Performance'][`${myGrade}`]['percentage'];
                          })
                        }
                      }
                      var color;
                      if (!this.grade && !this.subject) {
                        color = this.commonService.color(
                          this.schoolMarkers[i].Details,
                          "Performance"
                        );
                      } else if (this.grade && !this.subject) {
                        color = this.commonService.color(
                          this.schoolMarkers[i].Subjects,
                          "Grade Performance"
                        );
                      } else if (this.grade && this.subject) {
                        color = this.commonService.color(
                          this.schoolMarkers[i].Subjects,
                          this.subject
                        );
                      }
                      var markerIcon = this.attachColorsToMarkers(this.schoolMarkers[i], color, this.colors, 0, 0.3, options.level);
                      this.generateToolTip(
                        this.schoolMarkers[i],
                        options.level,
                        markerIcon,
                        "latitude",
                        "longitude"
                      );
                      this.getDownloadableData(
                        this.schoolMarkers[i],
                        options.level
                      );
                    }

                    globalMap.doubleClickZoom.enable();
                    globalMap.scrollWheelZoom.enable();
                    globalMap.setMaxBounds([
                      [options.centerLat - 4.5, options.centerLng - 6],
                      [options.centerLat + 3.5, options.centerLng + 6],
                    ]);
                    this.changeDetection.detectChanges();
                    this.commonService.onResize(this.level);

                    //schoolCount
                    this.schoolCount = res['footer'] ? res['footer'].total_schools : null;
                    if (this.schoolCount != null) {
                      this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    }
                    this.studentCount = res['footer'] ? res['footer'].total_students : null;
                    if (this.studentCount != null) {
                      this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    }
                    this.studentAttended = res['footer'] ? res['footer'].students_attended : null;
                    if (this.studentAttended != null) {
                      this.studentAttended = (this.studentAttended).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    }

                    this.commonService.loaderAndErr(this.data);
                    this.changeDetection.detectChanges();
                  }
                },
                (err) => {
                  this.errorHandling();
                }
              );
          },
          (error) => {
            this.errorHandling();
          }
        );

      globalMap.addLayer(this.layerMarkers);
      document.getElementById("home").style.display = "block";
    } catch (e) {
      console.log(e);
    }
  }

  ondistLinkClick(districtId) {
    if (this.grade) {
      this.grade = undefined;
      this.subject = undefined;
      this.subjectHidden = true;
      this.onDistrictSelect(districtId);
    } else {
      this.onDistrictSelect(districtId);
    }
  }
  // to load all the blocks for selected district for state data on the map
  onDistrictSelect(districtId) {
    if (this.period === "select_month" && !this.month || this.month === '') {
      alert("Please select month!");
      this.dist = false;
      this.districtId = '';
      $('#choose_dist').val('');
      return;
    }

    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    if (this.level != "blockPerDistrict") {
      this.subjectHidden = true;
      this.grade = undefined;
      this.subject = undefined;
    }
    this.blockId = undefined;
    this.reportData = [];
    this.level = "blockPerDistrict";
    this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade ? this.grade : "allGrades"
      }_${this.subject ? this.subject : ""}_blocks_of_district_${districtId}_${this.commonService.dateAndTime}`;

    this.data = this.allBlocks = [];
    this.allClusters = [];
    // api call to get the blockwise data for selected district
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service
      .PATBlocksPerDistData(districtId, {
        ...{ period: this.period, report: "pat", grade: this.grade, subject: this.subject },
        ...this.month_year,
        ...{ management: this.management, category: this.category },
      })
      .subscribe(
        (res) => {
          this.data = res["data"];
          this.allGrades = res['grades'];
          this.allBlocks = this.blockMarkers = this.data;
          if (this.grade)
            this.allSubjects = res['subjects'];

          if (!this.blockMarkers[0]["Subjects"]) {
            this.blockFilter = this.blockMarkers;
          }
          // set hierarchy values
          this.districtHierarchy = {
            distId: this.data[0].Details.district_id,
            districtName: this.data[0].Details.district_name,
          };

          // to show and hide the dropdowns
          this.blockHidden = false;
          this.clusterHidden = true;

          this.districtId = districtId;

          // these are for showing the hierarchy names based on selection
          this.skul = false;
          this.dist = true;
          this.blok = false;
          this.clust = false;

          // options to set for markers in the map
          let options = {
            fillOpacity: 1,
            strokeWeight: 0.01,
            mapZoom: this.commonService.zoomLevel + 1,
            centerLat: this.data[0].Details.latitude,
            centerLng: this.data[0].Details.longitude,
            level: "blockPerDistrict",
          };
          this.commonService.latitude = this.lat = options.centerLat;
          this.commonService.longitude = this.lng = options.centerLng;

          this.commonService.restrictZoom(globalMap);
          globalMap.setMaxBounds([
            [options.centerLat - 1.5, options.centerLng - 3],
            [options.centerLat + 1.5, options.centerLng + 2],
          ]);
          this.changeDetection.detectChanges();

          this.genericFun(res, options, this.fileName);
          this.commonService.onResize(this.level);
        },
        (err) => {
          this.errorHandling();
          document.getElementById("spinner").style.display = "none";
        }
      );
    globalMap.addLayer(this.layerMarkers);
    document.getElementById("home").style.display = "block";
  }

  onblockLinkClick(blockId) {
    if (this.grade) {
      this.grade = undefined;
      this.subject = undefined;
      this.subjectHidden = true;
      this.onBlockSelect(blockId);
    } else {
      this.onBlockSelect(blockId);
    }
  }
  // to load all the clusters for selected block for state data on the map
  onBlockSelect(blockId) {
    if (this.period === "select_month" && !this.month || this.month === '') {
      alert("Please select month!");
      this.blok = false;
      this.blockId = '';
      $('#choose_block').val('');
      return;
    }

    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    if (this.level != "clusterPerBlock") {
      this.subjectHidden = true;
      this.grade = undefined;
      this.subject = undefined;
    }
    this.clusterId = undefined;
    this.reportData = [];
    this.level = "clusterPerBlock";
    this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade ? this.grade : "allGrades"
      }_${this.subject ? this.subject : ""}_clusters_of_block_${blockId}_${this.commonService.dateAndTime
      }`;
    this.data = this.allClusters = [];
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service
      .PATClustersPerBlockData(this.districtHierarchy.distId, blockId, {
        ...{ period: this.period, report: "pat", grade: this.grade, subject: this.subject },
        ...this.month_year,
        ...{ management: this.management, category: this.category },
      })
      .subscribe(
        (res) => {
          this.data = res["data"];
          this.allGrades = res['grades'];
          this.allClusters = this.clusterMarkers = this.data;
          if (this.grade)
            this.allSubjects = res['subjects'];

          if (!this.clusterMarkers[0]["Subjects"]) {
            this.clusterFilter = this.clusterMarkers;
          }
          var myBlocks = [];
          this.blockMarkers.forEach((element) => {
            if (element.Details.district_id === this.districtHierarchy.distId) {
              myBlocks.push(element);
            }
          });
          this.allBlocks = this.blockMarkers = myBlocks;
          this.allBlocks.sort((a, b) =>
            a.Details.block_name > b.Details.block_name
              ? 1
              : b.Details.block_name > a.Details.block_name
                ? -1
                : 0
          );
          // set hierarchy values
          this.blockHierarchy = {
            distId: this.data[0].Details.district_id,
            districtName: this.data[0].Details.district_name,
            blockId: this.data[0].Details.block_id,
            blockName: this.data[0].Details.block_name,
          };

          // to show and hide the dropdowns
          this.blockHidden = false;
          this.clusterHidden = false;

          this.districtId = this.data[0].Details.district_id;
          this.blockId = blockId;

          // these are for showing the hierarchy names based on selection
          this.skul = false;
          this.dist = false;
          this.blok = true;
          this.clust = false;

          // options to set for markers in the map
          let options = {
            fillOpacity: 1,
            strokeWeight: 0.01,
            mapZoom: this.commonService.zoomLevel + 3,
            centerLat: this.data[0].Details.latitude,
            centerLng: this.data[0].Details.longitude,
            level: "clusterPerBlock",
          };
          this.commonService.latitude = this.lat = options.centerLat;
          this.commonService.longitude = this.lng = options.centerLng;

          this.commonService.restrictZoom(globalMap);
          globalMap.setMaxBounds([
            [options.centerLat - 1.5, options.centerLng - 3],
            [options.centerLat + 1.5, options.centerLng + 2],
          ]);
          this.changeDetection.detectChanges();

          this.genericFun(res, options, this.fileName);
          this.commonService.onResize(this.level);
          // sort the clusterName alphabetically
          this.allClusters.sort((a, b) =>
            a.Details.cluster_name > b.Details.cluster_name
              ? 1
              : -1
          );
          this.changeDetection.detectChanges();
        },
        (err) => {
          this.errorHandling();
        }
      );
    globalMap.addLayer(this.layerMarkers);
    document.getElementById("home").style.display = "block";
  }

  onclusterLinkClick(clusterId) {
    if (this.grade) {
      this.grade = undefined;
      this.subject = undefined;
      this.subjectHidden = true;
      this.onClusterSelect(clusterId);
    } else {
      this.onClusterSelect(clusterId);
    }
  }
  // to load all the schools for selected cluster for state data on the map
  onClusterSelect(clusterId) {
    if (this.period === "select_month" && !this.month || this.month === '') {
      alert("Please select month!");
      this.clust = false;
      this.clusterId = '';
      $('#choose_cluster').val('');
      return;
    }
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    this.level = "schoolPerCluster";
    if (this.level != "schoolPerCluster") {
      this.subjectHidden = true;
      this.grade = undefined;
      this.subject = undefined;
    }
    // api call to get the schoolwise data for selected district, block, cluster
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service
      .PATBlockWiseData({
        ...{ grade: this.grade, subject: this.subject, period: this.period, report: "pat" },
        ...this.month_year,
        ...{ management: this.management, category: this.category },
      })
      .subscribe(
        (result: any) => {
          this.myData = this.service
            .PATSchoolssPerClusterData(
              this.blockHierarchy.distId,
              this.blockHierarchy.blockId,
              clusterId,
              {
                ...{ period: this.period, report: "pat", grade: this.grade, subject: this.subject },
                ...this.month_year,
                ...{ management: this.management, category: this.category },
              }
            )
            .subscribe(
              (res) => {
                this.data = res["data"];
                this.allGrades = res['grades'];
                if (this.grade)
                  this.allSubjects = res['subjects'];

                this.schoolMarkers = this.data;
                var myBlocks = [];
                this.blockMarkers.forEach((element) => {
                  if (
                    element.Details.district_id === this.blockHierarchy.distId
                  ) {
                    myBlocks.push(element);
                  }
                });
                this.allBlocks = this.blockMarkers = myBlocks;
                this.allBlocks.sort((a, b) =>
                  a.Details.block_name > b.Details.block_name
                    ? 1
                    : b.Details.block_name > a.Details.block_name
                      ? -1
                      : 0
                );

                var myCluster = [];
                this.clusterMarkers.forEach((element) => {
                  if (
                    element.Details.block_id === this.blockHierarchy.blockId
                  ) {
                    myCluster.push(element);
                  }
                });
                this.allClusters = this.clusterMarkers = myCluster;
                this.allClusters.sort((a, b) =>
                  a.Details.cluster_name > b.Details.cluster_name
                    ? 1
                    : b.Details.cluster_name > a.Details.cluster_name
                      ? -1
                      : 0
                );

                // set hierarchy values
                this.clusterHierarchy = {
                  distId: this.data[0].Details.district_id,
                  districtName: this.data[0].Details.district_name,
                  blockId: this.data[0].Details.block_id,
                  blockName: this.data[0].Details.block_name,
                  clusterId: Number(this.data[0].Details.cluster_id),
                  clusterName: this.data[0].Details.cluster_name,
                };

                this.blockHidden = false;
                this.clusterHidden = false;

                this.districtHierarchy = {
                  distId: this.data[0].Details.district_id,
                };

                this.districtId = this.data[0].Details.district_id;
                this.blockId = this.data[0].Details.block_id;
                this.clusterId = clusterId;

                // these are for showing the hierarchy names based on selection
                this.skul = false;
                this.dist = false;
                this.blok = false;
                this.clust = true;

                // options to set for markers in the map
                let options = {
                  fillOpacity: 1,
                  strokeWeight: 0.01,
                  mapZoom: this.commonService.zoomLevel + 5,
                  centerLat: this.data[0].Details.latitude,
                  centerLng: this.data[0].Details.longitude,
                  level: "schoolPerCluster",
                };
                this.commonService.latitude = this.lat = options.centerLat;
                this.commonService.longitude = this.lng = options.centerLng;

                this.level = options.level;
                this.fileName = `${this.reportName}_${this.period != 'select_month' ? this.period : this.month_year.year + '_' + this.month_year.month}_${this.grade ? this.grade : "allGrades"
                  }_${this.subject ? this.subject : ""}_schools_of_cluster_${clusterId}_${this.commonService.dateAndTime}`;

                globalMap.doubleClickZoom.enable();
                globalMap.scrollWheelZoom.enable();
                globalMap.setMaxBounds([
                  [options.centerLat - 1.5, options.centerLng - 3],
                  [options.centerLat + 1.5, options.centerLng + 2],
                ]);
                this.changeDetection.detectChanges();

                this.genericFun(res, options, this.fileName);
                this.commonService.onResize(this.level);
              },
              (err) => {
                this.errorHandling();
              }
            );
        },
        (err) => {
          this.errorHandling();
        }
      );
    globalMap.addLayer(this.layerMarkers);
    document.getElementById("home").style.display = "block";
  }

  // common function for all the data to show in the map
  genericFun(data, options, fileName) {
    this.reportData = [];
    this.schoolCount = 0;
    var myData = data["data"];
    var color;
    var colors = [];
    this.allSubjects.sort();
    if (myData.length > 0) {
      this.markers = myData;
      if (this.grade && this.subject) {
        var filtererSubData = this.markers.filter(item => {
          return item.Subjects[`${this.subject}`];
        })
        this.markers = filtererSubData;
      }
      for (let i = 0; i < this.markers.length; i++) {
        if (this.period != 'all') {
          if (this.grade && !this.subject) {
            this.markers[i].Details['total_students'] = this.markers[i].Subjects['Grade Performance']['total_students'];
            this.markers[i].Details['students_attended'] = this.markers[i].Subjects['Grade Performance']['students_attended'];
            this.markers[i].Details['total_schools'] = this.markers[i].Subjects['Grade Performance']['total_schools'];
          }
          if (this.grade && this.subject) {
            if (this.markers[i].Subjects[`${this.subject}`]) {
              this.markers[i].Details['total_students'] = this.markers[i].Subjects[`${this.subject}`]['total_students'];
              this.markers[i].Details['students_attended'] = this.markers[i].Subjects[`${this.subject}`]['students_attended'];
              this.markers[i].Details['total_schools'] = this.markers[i].Subjects[`${this.subject}`]['total_schools'];
            } else {
              let index = this.markers.indexOf(this.markers[i]);
              this.markers.splice(index, 1);
            }
          }
          if (this.grade) {
            if (this.level != 'block' && this.level != 'cluster' && this.level != 'school') {
              this.markers[i].Subjects['Grade Performance'] = this.markers[i].Subjects['Grade Performance']['percentage']
              this.allSubjects.map(sub => {
                if (this.markers[i].Subjects[`${sub}`])
                  this.markers[i].Subjects[`${sub}`] = this.markers[i].Subjects[`${sub}`]['percentage']
              })
            } else {
              this.markers[i].Subjects['Grade Performance'] = this.markers[i].Subjects['Grade Performance']['percentage']
              this.allSubjects.map(sub => {
                if (this.markers[i].Subjects[`${sub}`])
                  this.markers[i].Subjects[`${sub}`] = this.markers[i].Subjects[`${sub}`]['percentage']
              })
            }
          } else if (!this.grade && !this.subject) {
            this.allGrades.map(grade => {
              var myGrade = grade.grade;
              if (this.markers[i]['Grade Wise Performance'][`${myGrade}`])
                this.markers[i]['Grade Wise Performance'][`${myGrade}`] = this.markers[i]['Grade Wise Performance'][`${myGrade}`]['percentage'];
            })
          }
        }
        if (!this.grade && !this.subject) {
          color = this.commonService.color(
            this.markers[i].Details,
            "Performance"
          );
        } else if (this.grade && !this.subject) {
          color = this.commonService.color(
            this.markers[i].Subjects,
            "Grade Performance"
          );
        } else if (this.grade && this.subject) {
          color = this.commonService.color(
            this.markers[i].Subjects,
            `${this.subject}`
          );
        }
        colors.push(color);
      }

      if (this.selected != "absolute") {
        this.colors = this.generateRelativeColors(this.markers)
      }

      // attach values to markers
      for (let i = 0; i < this.markers.length; i++) {
        var markerIcon = this.attachColorsToMarkers(this.markers[i], colors[i], this.colors, options.strokeWeight, 1, options.level);
        // data to show on the tooltip for the desired levels
        this.generateToolTip(
          this.markers[i],
          options.level,
          markerIcon,
          "latitude",
          "longitude"
        );

        // to download the report
        this.fileName = fileName;
        this.getDownloadableData(this.markers[i], options.level);
      }
      this.commonService.loaderAndErr(this.data);

      //schoolCount
      this.schoolCount = data['footer'] ? data['footer'].total_schools : null;
      if (this.schoolCount != null) {
        this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      }
      this.studentCount = data['footer'] ? data['footer'].total_students : null;
      if (this.studentCount != null) {
        this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      }
      this.studentAttended = data['footer'] ? data['footer'].students_attended : null;
      if (this.studentAttended != null) {
        this.studentAttended = (this.studentAttended).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      }
      this.changeDetection.detectChanges();
    }
  }

  //Generate relative colors.......
  generateRelativeColors(markers) {
    var colors = this.commonService.getRelativeColors(markers, {
      value: this.grade
        ? markers[0].Subjects
          ? "Grade Performance"
          : this.grade
        : this.grade && this.subject
          ? this.subject
          : "Performance",
      selected: this.grade
        ? "G"
        : this.grade && this.subject
          ? "GS"
          : "all",
      report: "reports",
    });
    return colors;
  }

  //Attach colors to markers.........
  attachColorsToMarkers(marker, color, colors, strock, border, level) {
    var icon = this.commonService.initMarkers1(
      marker.Details.latitude,
      marker.Details.longitude,
      this.selected == "absolute"
        ? color
        : this.commonService.relativeColorGredient(
          marker,
          {
            value: this.grade
              ? marker.Subjects
                ? "Grade Performance"
                : this.grade
              : this.grade && this.subject
                ? this.subject
                : "Performance",
            selected: this.grade
              ? "G"
              : this.grade && this.subject
                ? "GS"
                : "all",
            report: "reports",
          },
          this.colors
        ),
      strock,
      border,
      level
    );
    return icon;
  }

  generateToolTip(markers, level, markerIcon, lat, lng) {
    this.popups(markerIcon, markers, level);
    let colorText = `style='color:blue !important;'`;
    var details = {};
    var orgObject = {};
    var data1 = {};
    var data2 = {};
    var data3 = {}
    // student_count, total_schools

    Object.keys(markers.Details).forEach((key) => {
      if (key !== lat) {
        details[key] = markers.Details[key];
      }
    });
    if (this.period == 'all') {
      Object.keys(details).forEach((key) => {
        if (key !== "total_students") {
          data1[key] = details[key];
        }
      });
      Object.keys(data1).forEach((key) => {
        if (key !== "total_schools") {
          data2[key] = data1[key];
        }
      });
      Object.keys(data2).forEach((key) => {
        if (key !== "students_attended") {
          data3[key] = data2[key];
        }
      });
    } else {
      data3 = details;
    }
    Object.keys(data3).forEach((key) => {
      if (key !== lng) {
        orgObject[key] = data3[key];
      }
    });
    if (this.period != 'all') {
      if (level != "School" || level != "schoolPerCluster") {
        if (orgObject["total_schools"] != null) {
          orgObject["total_schools"] = orgObject["total_schools"]
            .toString()
            .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        }
      }
      if (orgObject["total_students"] != null) {
        orgObject["total_students"] = orgObject["total_students"]
          .toString()
          .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      }
      if (orgObject["students_attended"] != null) {
        orgObject["students_attended"] = orgObject["students_attended"]
          .toString()
          .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      }
    }
    var yourData1;
    if (this.grade) {
      yourData1 = this.commonService
        .getInfoFrom(
          orgObject,
          "Performance",
          level,
          "patReport",
          "",
          colorText
        )
        .join(" <br>");
    } else {
      yourData1 = this.commonService
        .getInfoFrom(
          orgObject,
          "Performance",
          level,
          "patReport",
          "Performance",
          colorText
        )
        .join(" <br>");
    }
    var yourData;
    var ordered;
    var mylevel;
    if (this.period != 'all') {
      if (level == "District" || level == 'Block' || level == 'Cluster' || level == 'School') {
        mylevel = level;
      }
    } else {
      if (level == "District") {
        mylevel = level;
      }
    }
    if (level == "blockPerDistrict") {
      mylevel = level;
    } else if (level == "clusterPerBlock") {
      mylevel = level;
    } else if (level == "schoolPerCluster") {
      mylevel = level;
    }

    if (level == mylevel) {
      if (this.grade && !this.subject) {
        yourData = this.commonService
          .getInfoFrom(
            markers.Subjects,
            "Performance",
            level,
            "patReport",
            "Grade Performance",
            colorText
          )
          .join(" <br>");
      } else if (this.grade && this.subject) {
        yourData = this.commonService
          .getInfoFrom(
            markers.Subjects,
            "Performance",
            level,
            "patReport",
            this.subject,
            colorText
          )
          .join(" <br>");
      } else {
        ordered = {};
        Object.keys(markers["Grade Wise Performance"])
          .sort()
          .forEach(function (key) {
            ordered[key] = markers["Grade Wise Performance"][key];
          });
        yourData = this.commonService
          .getInfoFrom(
            ordered,
            "Performance",
            level,
            "patReport",
            "",
            colorText
          )
          .join(" <br>");
      }
    } else {
      if (this.grade && !this.subject) {
        ordered = {};
        Object.keys(markers["Subjects"])
          .sort()
          .forEach(function (key) {
            ordered[key] = markers["Subjects"][key];
          });
        yourData = this.commonService
          .getInfoFrom(
            ordered,
            "Performance",
            level,
            "patReport",
            "Grade Performance",
            colorText
          )
          .join(" <br>");
      } else if (this.grade && this.subject) {
        ordered = {};
        Object.keys(markers["Subjects"])
          .sort()
          .forEach(function (key) {
            ordered[key] = markers["Subjects"][key];
          });
        yourData = this.commonService
          .getInfoFrom(
            ordered,
            "Performance",
            level,
            "patReport",
            this.subject,
            colorText
          )
          .join(" <br>");
      } else {
        ordered = {};
        Object.keys(markers["Grade Wise Performance"])
          .sort()
          .forEach(function (key) {
            ordered[key] = markers["Grade Wise Performance"][key];
          });
        yourData = this.commonService
          .getInfoFrom(
            ordered,
            "Performance",
            level,
            "patReport",
            "",
            colorText
          )
          .join(" <br>");
      }
    }
    const popup = R.responsivePopup({
      hasTip: false,
      autoPan: false,
      offset: [15, 20],
    }).setContent(
      "<b><u>Details</u></b>" +
      "<br>" +
      yourData1 +
      "<br><br><b><u>Periodic Exam Score (%)</u></b>" +
      "<br>" +
      yourData
    );
    markerIcon.addTo(globalMap).bindPopup(popup);
  }

  popups(markerIcon, markers, level) {
    for (var i = 0; i < this.markers.length; i++) {
      markerIcon.on("mouseover", function (e) {
        this.openPopup();
      });
      markerIcon.on("mouseout", function (e) {
        this.closePopup();
      });

      this.layerMarkers.addLayer(markerIcon);
      if (level === "schoolPerCluster" || level === "School") {
        markerIcon.on("click", this.onClickSchool, this);
      } else {
        markerIcon.on("click", this.onClick_Marker, this);
      }
      markerIcon.myJsonData = markers;
    }
  }
  onClickSchool(event) { }

  //Showing tooltips on markers on mouse hover...
  onMouseOver(m, infowindow) {
    m.lastOpen = infowindow;
    m.lastOpen.open();
  }

  //Hide tooltips on markers on mouse hover...
  hideInfo(m) {
    if (m.lastOpen != null) {
      m.lastOpen.close();
    }
  }

  // drilldown/ click functionality on markers
  onClick_Marker(event) {
    var data = event.target.myJsonData.Details;
    if (data.district_id && !data.block_id && !data.cluster_id) {
      this.stateLevel = 1;
      this.onDistrictSelect(data.district_id);
    }
    if (data.district_id && data.block_id && !data.cluster_id) {
      this.stateLevel = 1;
      this.districtHierarchy = {
        distId: data.district_id,
      };
      this.onBlockSelect(data.block_id);
    }
    if (data.district_id && data.block_id && data.cluster_id) {
      this.stateLevel = 1;
      this.blockHierarchy = {
        distId: data.district_id,
        blockId: data.block_id,
      };
      this.onClusterSelect(data.cluster_id);
    }
  }

  // to download the csv report
  downloadReport() {
    var position = this.reportName.length;
    this.fileName = [this.fileName.slice(0, position), `_${this.management}`, this.fileName.slice(position)].join('');
    this.commonService.download(this.fileName, this.reportData);
  }

  // getting data to download........
  getDownloadableData(markers, level) {
    if (markers["Grade Wise Performance"]) {
      if (markers["Grade Wise Performance"]["Grade 3"] == undefined) {
        markers["Grade Wise Performance"]["Grade 3"] = "";
      }
      if (markers["Grade Wise Performance"]["Grade 4"] == undefined) {
        markers["Grade Wise Performance"]["Grade 4"] = "";
      }
      if (markers["Grade Wise Performance"]["Grade 5"] == undefined) {
        markers["Grade Wise Performance"]["Grade 5"] = "";
      }
      if (markers["Grade Wise Performance"]["Grade 6"] == undefined) {
        markers["Grade Wise Performance"]["Grade 6"] = "";
      }
      if (markers["Grade Wise Performance"]["Grade 7"] == undefined) {
        markers["Grade Wise Performance"]["Grade 7"] = "";
      }
      if (markers["Grade Wise Performance"]["Grade 8"] == undefined) {
        markers["Grade Wise Performance"]["Grade 8"] = "";
      }
    }
    var details = {};
    var orgObject = {};
    var data1 = {};
    var data2 = {};
    Object.keys(markers.Details).forEach((key) => {
      if (key !== "latitude") {
        details[key] = markers.Details[key];
      }
    });
    // Object.keys(details).forEach((key) => {
    //   if (key !== "students_count") {
    //     data1[key] = details[key];
    //   }
    // });
    // Object.keys(data1).forEach((key) => {
    //   if (key !== "total_schools") {
    //     data2[key] = data1[key];
    //   }
    // });
    Object.keys(details).forEach((key) => {
      var str = key.charAt(0).toUpperCase() + key.substr(1).toLowerCase();
      if (key !== "longitude") {
        orgObject[`${str}`] = details[key];
      }
    });
    var ordered = {};
    var mylevel;
    if (level == "District") {
      mylevel = level;
    } else if (level == "Block") {
      mylevel = level;
    } else if (level == "Cluster") {
      mylevel = level;
    } else if (level == "School") {
      mylevel = level;
    }
    if (level != mylevel) {
      if (this.grade && !this.subject) {
        ordered = markers.Grades[`${this.grade}`];
      } else if (this.grade && this.subject) {
        ordered = {
          [`${this.subject}` + "_score"]: markers.Grades[`${this.grade}`][
            `${this.subject}`
          ],
        };
      } else {
        Object.keys(markers["Grade Wise Performance"])
          .sort()
          .forEach(function (key) {
            ordered[key] = markers["Grade Wise Performance"][key];
          });
      }
    } else {
      if (this.grade && !this.subject) {
        ordered = markers.Subjects;
      } else if (this.grade && this.subject) {
        ordered = {
          [`${this.subject}` + "_score"]: markers.Subjects[`${this.subject}`],
        };
      } else {
        Object.keys(markers["Grade Wise Performance"])
          .sort()
          .forEach(function (key) {
            ordered[key] = markers["Grade Wise Performance"][key];
          });
      }
    }

    var myobj = Object.assign(orgObject, ordered);
    this.reportData.push(myobj);
  }

  errorHandling() {
    this.schoolCount = undefined;
    this.studentAttended = undefined;
    this.studentCount = undefined;
    this.changeDetection.detectChanges();
    this.data = [];
    this.commonService.loaderAndErr(this.data);
  }

  goToHealthCard(): void {
    let data: any = {};

    if (this.dist) {
      data.level = "district";
      data.value = this.districtHierarchy.distId;
    } else if (this.blok) {
      data.level = "block";
      data.value = this.blockHierarchy.blockId;
    } else if (this.clust) {
      data.level = "cluster";
      data.value = this.clusterHierarchy.clusterId;
    } else {
      data.level = "state";
      data.value = null;
    }

    data["timePeriod"] = this.period == "all" ? "overall" : this.period;

    sessionStorage.setItem("health-card-info", JSON.stringify(data));
    this._router.navigate(["/progressCard"]);
  }

  public legendColors: any = [
    "#a50026",
    "#d73027",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#d9ef8b",
    "#a6d96a",
    "#66bd63",
    "#1a9850",
    "#006837",
  ];
  public values = [
    "0-10",
    "11-20",
    "21-30",
    "31-40",
    "41-50",
    "51-60",
    "61-70",
    "71-80",
    "81-90",
    "91-100",
  ];
}

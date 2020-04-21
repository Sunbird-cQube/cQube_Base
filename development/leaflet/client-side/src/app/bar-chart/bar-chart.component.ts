import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import {Chart} from 'chart.js';
import { ChartType } from 'chart.js';
import { SingleDataSet, Label, Color } from 'ng2-charts';
 

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements OnInit {
  public title: string = '';
  public titleName: string = '';
  public districts: any = [];
  public blocks: any = [];
  public cluster: any = [];
  public schools: any = [];
  public districtsIds: any = [];
  public blocksIds: any = [];
  public clusterIds: any = [];
  public schoolsIds: any = [];
  public districtsNames: any = [];
  public blocksNames: any = [];
  public clusterNames: any = [];
  public schoolsNames: any = [];
  public stylesFile = "../assets/mapStyles.json";
  public id: any = '';
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;
  public myDistrict: any;
  public myBlock: any;
  public myCluster: any;
  public colors: any;
  public studentCount: any;
  public schoolCount: any;
  public dateRange: any = '';
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;
  public skul: boolean = false;
   

  public styles: any = [];
  public labelOptions: any = {};

  public mylatlngData: any = [];

  // data: Data[];    
  // url = 'http://localhost:3000/api/crc';  
  label = [];  
  value = [];  
  barchart : Chart; 


  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router, private changeDetection: ChangeDetectorRef) { }

  async ngOnInit() {
     this.districtWise();
  }


  loaderAndErr() {
    if(this.barchart !== null) {
      document.getElementById('spinner').style.display = 'none';
    } else {
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('errMsg').style.color = 'red';
      document.getElementById('errMsg').style.display = 'block';
      document.getElementById('errMsg').innerHTML = 'No data found';
    }
  }

  errMsg() {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
  }
   
  // polarAreaLegend = true;
  // polarAreaChartType: ChartType = “bar”;
  districtWise() { 

    if(this.barchart != null){
      this.barchart.destroy();
       }
    this.blockHidden = true;
    this.clusterHidden = true;
    this.errMsg();
    this.title = "District wise CRC report for State";
    this.titleName = "Gujarat"
    this.districtsNames = [];
     
    this.service.crc_all_districts().subscribe(res => {
      this.mylatlngData = res;
      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
      this.colors = colors;
       
      for (var i = 0; i < this.mylatlngData.length; i++) {
        this.districtsIds.push(this.mylatlngData['districtId']);
        this.districtsNames.push({ id: this.mylatlngData[i]['districtId'], name: this.mylatlngData[i]['districtName'] }); 
      }
      
      this.districtsNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.service.crcData().subscribe((result: any) => {
        this.label = [];
        this.value = [];
        result.forEach(x => {   
         this.label.push(x["visits"]);
         this.value.push(x["schoolsCount"]);
         });
      // console.log(this.label)
      // console.log(this.value)
         this
         this.barchart=(new Chart('bar1', { 
         type: 'bar',
         data: {
          labels: this.label,
          datasets: [
            {
              label: 'No. of schools',
              data: this.value,
              backgroundColor: '#2b8cbe',
               borderColor: '#2b8cbe',
               hoverBackgroundColor: 'rgba(230, 236, 235, 0.75)',
               hoverBorderColor: 'rgba(230, 236, 235, 0.75)', 
               fill: true
            }
          ]
        },
        options: {
         tooltips: {
           displayColors:false,
           callbacks: {
             title: () => null,
               label: function(tooltipItem) {
                return  ["Number of visits : "  + tooltipItem.xLabel , "Number of Schools : " + tooltipItem.yLabel];
               }
           }
       },
          responsive: true,
          scales: {
            xAxes: [{
             ticks:{
               fontColor: "black",
               beginAtZero: true
             },
             gridLines: {
               zeroLineColor: "transparent"
             },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF VISITS',
                fontStyle: 'bold',
                fontFamily: 'Ariel',
                fontColor: "black"
              }
            }],
            yAxes: [{
              ticks:{
                
                fontColor : 'black',
                beginAtZero: true
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF SCHOOLS',
                fontStyle: 'bold',
                fontFamily: 'Ariel',
                fontColor: "black"
              }
            },
            ],
          },
          title: {
            display: true,
            text: "DISTRICT WISE CRC REPORT",
            fontFamily: 'Ariel',
            fontSize: 20
          },
          legend: {
            display: false,
            position: 'top',
          },
          animation: {
            animateScale: true,
            animateRotate: true

          }
        },
     })
    );
      this.loaderAndErr();
      this.changeDetection.markForCheck();
   })
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'none';
    })
  }

    myDistData(data) { 
      this.barchart.destroy();
      this.title = "Block wise CRC report for District";
      this.titleName = data.name;
      this.blockHidden = false;
      this.clusterHidden = true;
      this.errMsg();

      this.service.crc_all_blocks(data.id).subscribe(res => {   
        this.dist = false;
        this.blok = true;
        this.clust = false;
        this.skul = false;
        this.mylatlngData = res;
        this.blocksNames = [];
       
        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;
        for (var i = 0; i < this.mylatlngData.length; i++) {
          this.blocksIds.push(this.mylatlngData[i]['blockId']);
          this.blocksNames.push({ id:this.mylatlngData[i]['blockId'], name: this.mylatlngData[i]['blockName'], distid: data.id });
        }
        
        this.blocksNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.changeDetection.markForCheck();
      
        this.service.crcData_block(data.id).subscribe((result: any) => {
          console.log(result)
          this.label = [];
          this.value = [];
          result.forEach(x => {
            this.label.push(x["visits"]);
            this.value.push(x["schoolsCount"]);
          });
          this
          this.barchart=(new Chart('bar1', {
            type: 'bar',
            data: {
              labels: this.label,
              datasets: [
                {
                  label: 'No. of schools',
                  data: this.value,
                  backgroundColor: '#2b8cbe',
                  borderColor: '#2b8cbe',
                  hoverBackgroundColor: 'rgba(230, 236, 235, 0.75)',
                  hoverBorderColor: 'rgba(230, 236, 235, 0.75)',
                  fill: true
                }
              ]
            },
            options: {
            tooltips: {
              displayColors:false,
              callbacks: {
                title: () => null,
                  label: function(tooltipItem) {
                  return  ["Number of visits : "  + tooltipItem.xLabel , "Number of Schools : " + tooltipItem.yLabel];
                  }
               }
             },
            responsive: true,
            scales: {
            xAxes: [{
              ticks:{
                fontColor: "black",
                beginAtZero: true
              },
              gridLines: {
                zeroLineColor: "transparent"
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF VISITS',
                fontStyle: 'bold',
                fontFamily: 'Ariel'
              }
            }],
            yAxes: [{
              ticks:{ 
                fontColor : 'black',
                beginAtZero: true
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF SCHOOLS',
                fontStyle: 'bold',
                fontFamily: 'Ariel'
                }
              },
            ],
            },
            title: {
              display: true,
              text: "BLOCK WISE CRC REPORT",
              fontFamily: 'Ariel',
              fontSize: 20
            },
            legend: {
              display: false,
              position: 'top',
            },
            animation: {
              animateScale: true,
              animateRotate: true

            }

          },
        })
        );
      })
  
      this.loaderAndErr();
       
     })
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';  
    }
  
    myBlockData(data) {
      this.barchart.destroy(); 
      this.title = "Cluster wise CRC report for Block";
      this.titleName = data.name;
      this.clusterHidden = false;
      this.blockHidden = false; 
      this.errMsg();
      this.service.crc_all_clusters(data.distid,data.id).subscribe(res => {
        this.dist = false;
        this.blok = false;
        this.clust = true;
        this.skul = false;

        this.mylatlngData = res;
        this.clusterNames = [];

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;
        for (var i = 0; i < this.mylatlngData.length; i++) {
          this.clusterIds.push(this.mylatlngData[i]['clusterId']);
          this.clusterNames.push({ id: this.mylatlngData[i]['clusterId'], name: this.mylatlngData[i]['clusterName'],blockid : data.id, distid :data.distid });
        }
        console.log(data.distid)
        this.service.crcData_cluster(data.distid,data.id).subscribe((result: any) => {
          this.label = [];
          this.value = [];
          result.forEach(x => {
            this.label.push(x["visits"]);
              this.value.push(x["schoolsCount"]);
          });
          this
        this.barchart=(new Chart('bar1', {
          type: 'bar',
          data: {
            labels: this.label,
            datasets: [
              {
                label: 'No. of schools',
                data: this.value,
                backgroundColor: '#2b8cbe',
                borderColor: '#2b8cbe',
                hoverBackgroundColor: 'rgba(230, 236, 235, 0.75)',
                hoverBorderColor: 'rgba(230, 236, 235, 0.75)',
                  
                fill: true
              }
            ]
          },
          options: {
            tooltips: {
              displayColors:false,
              callbacks: {
                title: () => null,
                  label: function(tooltipItem) {
                  return  ["Number of visits : "  + tooltipItem.xLabel , "Number of Schools : " + tooltipItem.yLabel];
                  }
              }
          },
            responsive: true,
            scales: {
              xAxes: [{
                ticks:{
                  fontColor: "black",
                  beginAtZero: true
                },
                gridLines: {
                  zeroLineColor: "transparent"
                },
                display: true,

                scaleLabel: {
                  display: true,
                  labelString: 'NUMBER OF VISITS',
                  fontStyle: 'bold',
                  fontFamily: 'Ariel'
                }
                
              }],
              yAxes: [{
                ticks:{
                  
                  fontColor : 'black',
                  beginAtZero: true
                },
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'NUMBER OF SCHOOLS',
                  fontStyle: 'bold',
                  fontFamily: 'Ariel'
                }
              },
              ],
            },
            title: {
              display: true,
              text: "CLUSTER WISE CRC REPORT",
              fontFamily: 'Ariel',
              fontSize: 20
            },
            legend: {
              display: false,
              position: 'top',
            },
            animation: {
              animateScale: true,
              animateRotate: true

            }

          },

        })
        );
     })
      this.clusterNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.loaderAndErr();
      this.changeDetection.markForCheck();
      })
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';  
      }

    myClusterData(data) {
      this.barchart.destroy();  
      this.title = "School wise CRC report for Cluster";
      this.titleName = data.name;
      this.errMsg();
      this.service.schoolsPerCluster(data.id).subscribe(res => {
        this.dist = false;
        this.blok = false;
        this.clust = false;
        this.skul = true;
        this.mylatlngData = res;
        this.clusterIds = [];

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1) 
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;
        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
        } 
        this.service.crcData_school( data.distid,data.blockid,data.id).subscribe((result: any) => {
          this.label = [];
          this.value = [];
          result.forEach(x => {
            this.label.push(x["visits"]);
            this.value.push(x["schoolsCount"]);
          });
        console.log(this.label)
        this
        this.barchart=(new Chart('bar1', {
        type: 'bar',
        data: {
          labels: this.label,
          datasets: [
            {
              label: 'No. of schools',
              data: this.value,
              backgroundColor: '#2b8cbe',
               borderColor: '#2b8cbe',
               hoverBackgroundColor: 'rgba(230, 236, 235, 0.75)',
               hoverBorderColor: 'rgba(230, 236, 235, 0.75)',
                
               fill: true
            }
          ]
        },
        options: {
          tooltips: {
            displayColors:false,
            callbacks: {
              title: () => null,
                label: function(tooltipItem) {
                 return  ["Number of visits : "  + tooltipItem.xLabel , "Number of Schools : " + tooltipItem.yLabel];
                }
            }
        },
          responsive: true,
          scales: {
            xAxes: [{
              ticks:{
                fontColor: "black",
                beginAtZero: true
              },
              gridLines: {
                zeroLineColor: "transparent"
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF VISITS',
                fontStyle: 'bold',
                fontFamily: 'Ariel'
              }
            }],
            yAxes: [{
              ticks:{
                stepSize : 1,
                fontColor : 'black',
                beginAtZero: true
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF SCHOOLS',
                fontStyle: 'bold',
                fontFamily: 'Ariel'
              }
            },
            ],
          },
          title: {
            display: true,
            text: "SCHOOLS WISE CRC REPORT",
            fontFamily: 'Ariel',
            fontSize: 20
            
          },
          legend: {
            display: false,
            position: 'top',
          },
          animation: {
            animateScale: true,
            animateRotate: true
  
          }
  
        },
  
      })
      );
    })
    this.loaderAndErr();
    this.changeDetection.markForCheck();
    })
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'block';   
    }

    createChart(res){
      this.label = [];
      this.value = [];
      res.forEach(x => {   
        this.label.push(x["visits"]);
        this.value.push(x["schoolsCount"]);
      });
      // console.log(this.label)
      // console.log(this.value)
      this
      this.barchart=(new Chart('bar1', { 
        type: 'bar',
        data: {
          labels: this.label,
          datasets: [
            {
              label: 'No. of schools',
              data: this.value,
              backgroundColor: '#2b8cbe',
               borderColor: '#2b8cbe',
               hoverBackgroundColor: 'rgba(230, 236, 235, 0.75)',
               hoverBorderColor: 'rgba(230, 236, 235, 0.75)', 
               fill: true
            }
          ]
        },
        options: {
         tooltips: {
           displayColors:false,
           callbacks: {
             title: () => null,
               label: function(tooltipItem) {
                return  ["Number of visits : "  + tooltipItem.xLabel , "Number of Schools : " + tooltipItem.yLabel];
               }
           }
       },
          responsive: true,
          scales: {
            xAxes: [{
             ticks:{
               fontColor: "black",
               beginAtZero: true
             },
             gridLines: {
               zeroLineColor: "transparent"
             },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF VISITS',
                fontStyle: 'bold',
                fontFamily: 'Ariel',
                fontColor: "black"
              }
            }],
            yAxes: [{
              ticks:{
                
                fontColor : 'black',
                beginAtZero: true
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF SCHOOLS',
                fontStyle: 'bold',
                fontFamily: 'Ariel',
                fontColor: "black"
              }
            },
            ],
          },
          title: {
            display: true,
            text: "DISTRICT WISE CRC REPORT",
            fontFamily: 'Ariel',
            fontSize: 20
          },
          legend: {
            display: false,
            position: 'top',
          },
          animation: {
            animateScale: true,
            animateRotate: true

          }
       },
   })
      
);
      this.loaderAndErr();
      this.changeDetection.markForCheck();

    }
  
    // blockWise() {

       
    //   this.barchart.destroy();
    //   this.blockHidden = true;
    // this.clusterHidden = true;
    // this.errMsg();
    //  this.title = "Block wise CRC report for State";
    //  this.titleName = "Gujarat"
      
 
    // //  this.service.block_wise_data().subscribe(res => {
    // //   this.mylatlngData = res;
    // //   this.dist = false;
    // //   this.blok = false;
    // //   this.clust = false;
    // //   this.skul = true;
    // //    var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
    // //    let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
    // //    this.colors = colors;
    // //    for (var i = 0; i < sorted.length; i++) {
    // //      this.blocksIds.push(sorted[i]['x_axis']);
    // //      this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['district_name'] });
          
    // //    }
        
    //  this.service.block_wise_crc().subscribe((result: any) => {
    //    this.label = [];
    //    this.value = [];
    //    result.forEach(x => {
    //      this.label.push(x["visits_frequency"]);
    //      this.value.push(x["blocks"]);
    //    });
        
    //    console.log(this.label)
    //    console.log(this.value)
    //    this
    //    this.barchart=(new Chart('bar1', {
          
    //      type: 'bar',
    //      data: {
    //        labels:this.label,
    //        datasets: [
    //          {
    //            label: '',
    //            data: this.value,
    //            backgroundColor:  '#2b8cbe',
    //             borderColor: '#2b8cbe',
    //             hoverBackgroundColor: 'rgba(230, 236, 235, 0.75)',
    //             hoverBorderColor: 'rgba(230, 236, 235, 0.75)',
                   
    //             fill: true
    //          }
    //        ]
    //      },
    //      options: {
    //       tooltips: {
    //         displayColors:false,
    //         callbacks: {
    //           title: () => null,
    //             label: function(tooltipItem) {
    //              return  ["Number of visits : "  + tooltipItem.xLabel , "Number of Blocks : " + tooltipItem.yLabel];
    //             }
    //         }
    //     },
          
    //        responsive: true,
    //        scales: {
             
    //          xAxes: [{
    //           ticks:{
    //             fontColor: "black",
    //             beginAtZero: true
    //           },
    //           gridLines: {
    //             zeroLineColor: "transparent"
    //           },
    //            display: true,
    //            scaleLabel: {
    //              display: true,
    //              labelString: 'NUMBER OF VISITS',
    //              fontStyle: 'bold',
    //              fontFamily: 'Ariel',
    //              fontColor: "black"
    //            }
    //          }],
    //          yAxes: [{
    //            ticks:{
    //              fontColor : 'black',
    //             //  stepSize: 1, 
    //              beginAtZero: true
    //            },
    //            display: true,
    //            scaleLabel: {
    //              display: true,
    //              labelString: 'NUMBER OF BLOCKS',
    //              fontStyle: 'bold',
    //              fontFamily: 'Ariel',
    //              fontColor: "black"
    //            }
    //          },
    //          ],
    //        },
    //        title: {
    //          display: true,
    //          text: "BLOCK WISE CRC REPORT",
    //          fontFamily: 'Ariel',
    //          fontSize: 20
    //        },
    //        legend: {
    //          display: false,
    //          position: 'top',
    //        },
    //        animation: {
    //          animateScale: true,
    //          animateRotate: true
 
    //        }
 
    //      },
        
    //    })
       
    //    );
    //    this.loaderAndErr();
    //  })   
    // //  })
    //  var element1: any = document.getElementsByClassName('btn-secondary');
    //  element1[0].style.display = 'Block';
    //  }
 
    //  clusterWise() {

      
    //   this.barchart.destroy();
    //   this.blockHidden = true;
    // this.clusterHidden = true;
    // this.errMsg();
    //  this.title = "Cluster wise CRC report for State";
    //  this.titleName = "Gujarat"
     
    // //  this.service.cluster_wise_data().subscribe(res => {
    // //   this.mylatlngData = res;
    // //   this.dist = false;
    // //   this.blok = false;
    // //   this.clust = false;
    // //   this.skul = true;
    // //    var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
    // //    let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
    // //    this.colors = colors;
    // //    for (var i = 0; i < sorted.length; i++) {
    // //      this.clusterIds.push(sorted[i]['x_axis']);
    // //      this.clusterNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['district_name'] });
          
    // //    }
        
    //  this.service.cluster_wise_crc().subscribe((result: any) => {
    //    this.label = [];
    //    this.value = [];
    //    result.forEach(x => {
    //      this.label.push(x["visits_frequency"]);
    //      this.value.push(x["clusters"]);
    //    });
        
    //    console.log(this.label)
    //    console.log(this.value)
    //    this
    //    this.barchart=(new Chart('bar1', {
          
    //      type: 'bar',
    //      data: {
    //        labels: this.label,
    //        datasets: [
    //          {
    //            label: ' ',
    //            data: this.value,
    //            backgroundColor: '#2b8cbe',
    //             borderColor: '#2b8cbe',
    //             hoverBackgroundColor: 'rgba(230, 236, 235, 0.75)',
    //             hoverBorderColor: 'rgba(230, 236, 235, 0.75)',
                   
    //             fill: true
    //          }
    //        ]
    //      },
    //      options: {
    //       tooltips: {
    //         displayColors:false,
    //         callbacks: {
    //           title: () => null,
    //             label: function(tooltipItem) {
    //              return  ["Number of visits : "  + tooltipItem.xLabel , "Number of Clusters : " + tooltipItem.yLabel];
    //             }
    //         }
    //     },
    //        responsive: true,
    //        scales: {
    //          xAxes: [{
    //           ticks:{
    //             fontColor: "black",
    //             beginAtZero: true
    //           },
    //           gridLines: {
    //             zeroLineColor: "transparent"
    //           },
    //            display: true,
    //            scaleLabel: {
    //              display: true,
    //              labelString: 'NUMBER OF VISITS',
    //              fontStyle: 'bold',
    //              fontFamily: 'Ariel',
    //              fontColor: "black"
    //            }
    //          }],
    //          yAxes: [{
    //            ticks:{
    //              fontColor : 'black',
    //              beginAtZero: true
    //            },
    //            display: true,
    //            scaleLabel: {
    //              display: true,
    //              labelString: 'NUMBER OF CLUSTERS',
    //              fontStyle: 'bold',
    //              fontFamily: 'Ariel',
    //              fontColor: "black"
    //            }
    //          },
    //          ],
    //        },
    //        title: {
    //          display: true,
    //          text: "CLUSTER WISE CRC REPORT",
    //          fontFamily: 'Ariel',
    //          fontSize: 20
    //        },
    //        legend: {
    //          display: false,
    //          position: 'top',
    //        },
    //        animation: {
    //          animateScale: true,
    //          animateRotate: true
 
    //        },
          
    //      },
        
    //    })
       
    //    );
    //    this.loaderAndErr();
    //  })   
    // //  })
    //  var element1: any = document.getElementsByClassName('btn-secondary');
    //  element1[0].style.display = 'Block';
    //  this.cluster = [];
   
    //  }
 
    //  schoolWise() {

       
    //   this.barchart.destroy();
    //   this.blockHidden = true;
    // this.clusterHidden = true;
    // this.errMsg();
    //  this.title = "School wise CRC report for State";
    //  this.titleName = "Gujarat"
    //  this.districtsNames = [];
 
    // //  this.service.school_wise_data().subscribe(res => {
    // //   this.mylatlngData = res;
    // //   this.dist = false;
    // //   this.blok = false;
    // //   this.clust = false;
    // //   this.skul = true;
    // //    var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
    // //    let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
    // //    this.colors = colors;
    // //    for (var i = 0; i < sorted.length; i++) {
    // //      this.schoolsIds.push(sorted[i]['x_axis']);
    // //      this.schoolsNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['district_name'] });
          
    // //    }
        
    //  this.service.school_wise_crc().subscribe((result: any) => {
    //    this.label = [];
    //    this.value = [];
    //    result.forEach(x => {
    //      this.label.push(x["visits_frequency"]);
    //      this.value.push(x["schools"]);
    //    });
        
    //    console.log(this.label)
    //    console.log(this.value)
    //    this
    //    this.barchart=(new Chart('bar1', {
          
    //      type: 'bar',
    //      data: {
    //        labels: this.label,
    //        datasets: [
    //          {
    //            label: 'No. of schools',
    //            data: this.value,
    //            backgroundColor: '#2b8cbe',
    //             borderColor: '#2b8cbe',
    //             hoverBackgroundColor: 'rgba(230, 236, 235, 0.75)',
    //             hoverBorderColor: 'rgba(230, 236, 235, 0.75)',
                   
    //             fill: true
    //          }
    //        ]
    //      },
    //      options: {
    //       tooltips: {
    //         displayColors:false,
    //         callbacks: {
    //           title: () => null,
    //             label: function(tooltipItem) {
    //              return  ["Number of visits : "  + tooltipItem.xLabel , "Number of Schools : " + tooltipItem.yLabel];
    //             }
    //         }
    //     },
    //        responsive: true,
    //        scales: {
    //          xAxes: [{
    //           ticks:{
    //             fontColor: "black",
    //             beginAtZero: true
    //           },
    //           gridLines: {
    //             zeroLineColor: "transparent"
    //           },
    //            display: true,
    //            scaleLabel: {
    //              display: true,
    //              labelString: 'NUMBER OF VISITS',
    //              fontStyle: 'bold',
    //              fontFamily: 'Ariel',
    //              fontColor: "black"
    //            }
    //          }],
    //          yAxes: [{
    //            ticks:{
    //              fontColor : 'black',
    //              beginAtZero: true
    //            },
    //            display: true,
    //            scaleLabel: {
    //              display: true,
    //              labelString: 'NUMBER OF SCHOOLS',
    //              fontStyle: 'bold',
    //              fontFamily: 'Ariel',
    //              fontColor: "black"
    //            }
    //          },
    //          ],
    //        },
    //        title: {
    //          display: true,
    //          text: "SCHOOL WISE CRC REPORT",
    //          fontFamily: 'Ariel',
    //          fontSize: 20
    //        },
    //        legend: {
    //          display: false,
    //          position: 'top',
    //        },
    //        animation: {
    //          animateScale: true,
    //          animateRotate: true
 
    //        }
 
    //      },
        
    //    })
       
    //    );
    //    this.loaderAndErr();
    //  })   
    // //  })
    //  var element1: any = document.getElementsByClassName('btn-secondary');
    //  element1[0].style.display = 'Block';
    //  this.cluster = [];
   
    //  }
 
    
    
    


  
  // clickedMarker(label) {
  //   if (this.districtsIds.includes(label.id)) {
  //     globalMap.removeLayer(this.markersList);
  //     this.layerMarkers.clearLayers();
  //     this.markers = [];
  //     this.errMsg();
  //     this.studentCount = 0;
  //     this.schoolCount = 0;
  //     this.title = "Block wise attendance report for District";
  //     this.titleName = label.name;

  //     this.service.blockPerDist(label.id).subscribe(res => {
  //       this.blockHidden = true;
  //       this.clusterHidden = true;
  //       this.dist = false;
  //       this.blok = true;
  //       this.clust = false;
  //       this.skul = false;

  //       this.mylatlngData = res;

  //       this.lat = Number(label.lat);
  //       this.lng = Number(label.lng);
  //       this.blocksNames = [];

  //       var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
  //       let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
  //       this.colors = colors;
  //       for (var i = 0; i < sorted.length; i++) {
  //         this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
  //         this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
  //         this.blocksIds.push(sorted[i]['x_axis']);
  //         this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
  //         this.markers.push(
  //           {
  //             id: sorted[i]['x_axis'],
  //             name: sorted[i]['block_name'],
  //             dist: sorted[i]['distName'],
  //             label: sorted[i]['x_value'],
  //             lat: sorted[i]['y_value'],
  //             lng: sorted[i]['z_value'],
  //             stdCount: (sorted[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //             schCount: (sorted[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //             blok: this.blok,
  //           });
  //         var markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
  //           radius: 4,
  //           color: this.colors[i],
  //           fillColor: this.colors[i],
  //           fillOpacity: 1,
  //           strokeWeight: 0.01
  //         })

  //         markerIcon.addTo(globalMap).bindPopup(
  //           "<b>Attendance : </b>" + "&nbsp;" + this.markers[i].label + " %" +
  //           "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
  //           "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].name +
  //           "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
  //           "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
  //         );
  //         markerIcon.on('mouseover', function (e) {
  //           this.openPopup();
  //         });
  //         markerIcon.on('mouseout', function (e) {
  //           this.closePopup();
  //         });

  //         this.layerMarkers.addLayer(markerIcon);
  //         markerIcon.on('click', this.onClick_Marker, this)
  //         markerIcon.myJsonData = this.markers[i];
  //       }
  //       globalMap.setView(new L.LatLng(this.lat, this.lng), 8.3);
  //       this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //       this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //       this.loaderAndErr();
  //       this.changeDetection.markForCheck();
  //     })
  //     var element1: any = document.getElementsByClassName('btn-secondary');
  //     element1[0].style.display = 'block';
  //     this.blok = false;
  //     globalMap.addLayer(this.layerMarkers);
  //   }

  //   if (this.blocksIds.includes(label.id)) {
  //     globalMap.removeLayer(this.markersList);
  //     this.layerMarkers.clearLayers();
  //     this.markers = [];
  //     this.errMsg();

  //     this.studentCount = 0;
  //     this.schoolCount = 0;
  //     this.title = "Cluster wise attendance report for Block";
  //     this.titleName = label.name;
  //     this.service.clusterPerBlock(label.id).subscribe(res => {
  //       this.clusterHidden = true;
  //       this.blockHidden = true;
  //       this.dist = false;
  //       this.blok = false;
  //       this.clust = true;
  //       this.skul = false;

  //       this.mylatlngData = res;
  //       ;
  //       this.lat = Number(label.lat);
  //       this.lng = Number(label.lng);
  //       this.clusterNames = [];

  //       var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
  //       let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
  //       this.colors = colors;

  //       for (var i = 0; i < sorted.length; i++) {
  //         this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
  //         this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
  //         this.clusterIds.push(sorted[i]['x_axis']);
  //         this.clusterNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['crc_name'] });
  //         this.markers.push(
  //           {
  //             id: sorted[i]['x_axis'],
  //             name: sorted[i]['crc_name'],
  //             // name: sorted[i][''],
  //             dist: sorted[i]['distName'],
  //             block: sorted[i]['blockName'],
  //             label: sorted[i]['x_value'],
  //             lat: sorted[i]['y_value'],
  //             lng: sorted[i]['z_value'],
  //             stdCount: (sorted[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //             schCount: (sorted[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //             clust: this.clust,
  //             blok: this.blok,

  //           });
  //         var markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
  //           radius: 2.5,
  //           color: this.colors[i],
  //           fillColor: this.colors[i],
  //           fillOpacity: 1,
  //           strokeWeight: 0.01
  //         })

  //         markerIcon.addTo(globalMap).bindPopup(
  //           "<b>Attendance : </b>" + "&nbsp;" + this.markers[i].label + " %" +
  //           "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
  //           "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
  //           "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].name +
  //           "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
  //           "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
  //         );

  //         markerIcon.on('mouseover', function (e) {
  //           this.openPopup();
  //         });
  //         markerIcon.on('mouseout', function (e) {
  //           this.closePopup();
  //         });

  //         this.layerMarkers.addLayer(markerIcon);
  //         markerIcon.on('click', this.onClick_Marker, this)
  //         markerIcon.myJsonData = this.markers[i];
  //       };
  //       globalMap.setView(new L.LatLng(this.lat, this.lng), 10);
  //       this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //       this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //       this.loaderAndErr();
  //       this.changeDetection.markForCheck();
  //     });
  //     globalMap.addLayer(this.layerMarkers);
  //     var element1: any = document.getElementsByClassName('btn-secondary');
  //     element1[0].style.display = 'block';
  //     this.clust = false;
  //     this.blok = true;
  //   }

  //   if (this.clusterIds.includes(label.id)) {
  //     globalMap.removeLayer(this.markersList);
  //     this.layerMarkers.clearLayers();
  //     this.markers = [];
  //     this.errMsg();
  //     this.blockHidden = true;
  //     this.clusterHidden = true;
  //     this.studentCount = 0;
  //     this.schoolCount = 0;
  //     this.title = "School wise attendance report for Cluster";
  //     this.titleName = label.name;
  //     this.service.schoolsPerCluster(label.id).subscribe(res => {
  //       this.dist = false;
  //       this.blok = false;
  //       this.clust = false;
  //       this.skul = true;

  //       this.mylatlngData = res;
  //       ;
  //       this.lat = Number(label.lat);
  //       this.lng = Number(label.lng);

  //       this.clusterIds = [];

  //       var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
  //       let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
  //       this.colors = colors;

  //       for (var i = 0; i < sorted.length; i++) {
  //         this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
  //         this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
  //         this.markers.push(
  //           {
  //             id: sorted[i]['x_axis'],
  //             name: sorted[i]['schoolName'],
  //             block: sorted[i]['blockName'],
  //             dist: sorted[i]['distName'],
  //             cluster: sorted[i]['crc'].toUpperCase(),
  //             label: sorted[i]['x_value'],
  //             lat: sorted[i]['y_value'],
  //             lng: sorted[i]['z_value'],
  //             stdCount: (sorted[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //             skul: this.skul,
  //             blok: this.blok,

  //           });
  //         var markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
  //           radius: 1.5,
  //           color: this.colors[i],
  //           fillColor: this.colors[i],
  //           fillOpacity: 1,
  //           strokeWeight: 0.01
  //         })

  //         markerIcon.addTo(globalMap).bindPopup(
  //           "<b>Attendance : </b>" + "&nbsp;" + this.markers[i].label + " %" +
  //           "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
  //           "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
  //           "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].cluster +
  //           "<br><b>School: </b>" + "&nbsp;" + this.markers[i].name +
  //           "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
  //         );

  //         markerIcon.on('mouseover', function (e) {
  //           this.openPopup();
  //         });
  //         markerIcon.on('mouseout', function (e) {
  //           this.closePopup();
  //         });

  //         this.layerMarkers.addLayer(markerIcon);
  //         // markerIcon.on('click', this.onClick_Marker, this);
  //         markerIcon.myJsonData = this.markers[i];
  //       };
  //       globalMap.setView(new L.LatLng(this.lat, this.lng), 12);
  //       this.schoolCount = (this.markers.length).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //       this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //       this.loaderAndErr();
  //       this.changeDetection.markForCheck();
  //     });
  //     globalMap.addLayer(this.layerMarkers);
  //     var element1: any = document.getElementsByClassName('btn-secondary');
  //     element1[0].style.display = 'block';
  //     this.skul = false;
  //     this.blok = true;
  //   }
  // };

  // //Showing tooltips on markers on mouse hover...
  // onMouseOver(m, infowindow) {
  //   m.lastOpen = infowindow;
  //   m.lastOpen.open();
  // }

  // //Hide tooltips on markers on mouse hover...
  // hideInfo(m) {
  //   if (m.lastOpen != null) {
  //     m.lastOpen.close();
  //   }
  // }


  // logout() {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('dist');
  //   this.router.navigate(['/']);
  // }

  // onClick_Marker(event) {
  //   var marker = event.target;
  //   console.log(marker.myJsonData);
  //   this.clickedMarker(marker.myJsonData);
  // }


  // myDistData(data) {
  //   globalMap.removeLayer(this.markersList);
  //   this.layerMarkers.clearLayers();
  //   this.markers = [];
  //   this.errMsg();
  //   this.studentCount = 0;
  //   this.schoolCount = 0;
  //   this.title = "Block wise attendance report for District";
  //   this.titleName = data.name;

  //   this.service.blockPerDist(data.id).subscribe(res => {
  //     this.blockHidden = false;
  //     this.clusterHidden = true;
  //     this.dist = false;
  //     this.blok = true;
  //     this.clust = false;
  //     this.skul = false;

  //     this.mylatlngData = res;

  //     this.lat = Number(this.mylatlngData[0]['y_value']);
  //     this.lng = Number(this.mylatlngData[0]['z_value']);
  //     this.blocksNames = [];

  //     var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
  //     let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
  //     this.colors = colors;
  //     for (var i = 0; i < sorted.length; i++) {
  //       this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
  //       this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
  //       this.blocksIds.push(sorted[i]['x_axis']);
  //       this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
  //       this.markers.push(
  //         {
  //           id: sorted[i]['x_axis'],
  //           name: sorted[i]['block_name'],
  //           dist: sorted[i]['distName'],
  //           label: sorted[i]['x_value'],
  //           lat: sorted[i]['y_value'],
  //           lng: sorted[i]['z_value'],
  //           stdCount: (sorted[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //           schCount: (sorted[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //           blok: this.blok,
  //         });
  //       var markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
  //         radius: 3.5,
  //         color: this.colors[i],
  //         fillColor: this.colors[i],
  //         fillOpacity: 1,
  //         strokeWeight: 0.01
  //       })

  //       markerIcon.addTo(globalMap).bindPopup(
  //         "<b>Attendance : </b>" + "&nbsp;" + this.markers[i].label + " %" +
  //         "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
  //         "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].name +
  //         "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
  //         "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
  //       );
  //       markerIcon.on('mouseover', function (e) {
  //         this.openPopup();
  //       });
  //       markerIcon.on('mouseout', function (e) {
  //         this.closePopup();
  //       });

  //       this.layerMarkers.addLayer(markerIcon);
  //       markerIcon.on('click', this.onClick_Marker, this)
  //       markerIcon.myJsonData = this.markers[i];
  //     }
  //     globalMap.setView(new L.LatLng(this.lat, this.lng), 8.3);
  //     this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //     this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //     this.loaderAndErr();
  //     this.changeDetection.markForCheck();
  //   })
  //   var element1: any = document.getElementsByClassName('btn-secondary');
  //   element1[0].style.display = 'block';
  //   this.blok = false;
  //   globalMap.addLayer(this.layerMarkers);
  // }

  // myBlockData(data) {
  //   globalMap.removeLayer(this.markersList);
  //   this.layerMarkers.clearLayers();
  //   this.markers = [];
  //   this.errMsg();

  //   this.studentCount = 0;
  //   this.schoolCount = 0;
  //   this.title = "Cluster wise attendance report for Block";
  //   this.titleName = data.name;
  //   this.service.clusterPerBlock(data.id).subscribe(res => {
  //     this.clusterHidden = false;
  //     this.blockHidden = false;
  //     this.dist = false;
  //     this.blok = false;
  //     this.clust = true;
  //     this.skul = false;

  //     this.mylatlngData = res;
  //     ;
  //     this.lat = Number(this.mylatlngData[5]['y_value']);
  //     this.lng = Number(this.mylatlngData[5]['z_value']);
  //     this.clusterNames = [];

  //     var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
  //     let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
  //     this.colors = colors;

  //     for (var i = 0; i < sorted.length; i++) {
  //       this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
  //       this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
  //       this.clusterIds.push(sorted[i]['x_axis']);
  //       this.clusterNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['crc_name'] });
  //       this.markers.push(
  //         {
  //           id: sorted[i]['x_axis'],
  //           name: sorted[i]['crc_name'],
  //           // name: sorted[i][''],
  //           dist: sorted[i]['distName'],
  //           block: sorted[i]['blockName'],
  //           label: sorted[i]['x_value'],
  //           lat: sorted[i]['y_value'],
  //           lng: sorted[i]['z_value'],
  //           stdCount: (sorted[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //           schCount: (sorted[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //           clust: this.clust,
  //           blok: this.blok,

  //         });
  //       var markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
  //         radius: 3,
  //         color: this.colors[i],
  //         fillColor: this.colors[i],
  //         fillOpacity: 1,
  //         strokeWeight: 0.01
  //       })
  //       markerIcon.addTo(globalMap).bindPopup(
  //         "<b>Attendance : </b>" + "&nbsp;" + this.markers[i].label + " %" +
  //         "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
  //         "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
  //         "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].name +
  //         "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
  //         "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
  //       );

  //       markerIcon.on('mouseover', function (e) {
  //         this.openPopup();
  //       });
  //       markerIcon.on('mouseout', function (e) {
  //         this.closePopup();
  //       });

  //       this.layerMarkers.addLayer(markerIcon);
  //       markerIcon.on('click', this.onClick_Marker, this)
  //       markerIcon.myJsonData = this.markers[i];
  //     };
  //     globalMap.setView(new L.LatLng(this.lat, this.lng), 10);
  //     this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //     this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //     this.loaderAndErr();
  //     this.changeDetection.markForCheck();
  //   });
  //   globalMap.addLayer(this.layerMarkers);
  //   var element1: any = document.getElementsByClassName('btn-secondary');
  //   element1[0].style.display = 'block';
  //   this.clust = false;
  //   this.blok = true;
  // }

  // myClusterData(data) {
  //   globalMap.removeLayer(this.markersList);
  //   this.layerMarkers.clearLayers();
  //   this.markers = [];
  //   this.errMsg();

  //   this.studentCount = 0;
  //   this.schoolCount = 0;
  //   this.title = "School wise attendance report for Cluster";
  //   this.titleName = data.name;
  //   this.service.schoolsPerCluster(data.id).subscribe(res => {
  //     this.dist = false;
  //     this.blok = false;
  //     this.clust = false;
  //     this.skul = true;

  //     this.mylatlngData = res;
  //     ;
  //     this.lat = Number(this.mylatlngData[5]['y_value']);
  //     this.lng = Number(this.mylatlngData[5]['z_value']);

  //     this.clusterIds = [];

  //     var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
  //     let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
  //     this.colors = colors;

  //     for (var i = 0; i < sorted.length; i++) {
  //       this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
  //       this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
  //       this.markers.push(
  //         {
  //           id: sorted[i]['x_axis'],
  //           name: sorted[i]['schoolName'],
  //           block: sorted[i]['blockName'],
  //           dist: sorted[i]['distName'],
  //           cluster: sorted[i]['crc'].toUpperCase(),
  //           label: sorted[i]['x_value'],
  //           lat: sorted[i]['y_value'],
  //           lng: sorted[i]['z_value'],
  //           stdCount: (sorted[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
  //           skul: this.skul,
  //           blok: this.blok,

  //         });
  //       var markerIcon = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
  //         radius: 2,
  //         color: this.colors[i],
  //         fillColor: this.colors[i],
  //         fillOpacity: 1,
  //         strokeWeight: 0.01
  //       })
  //       markerIcon.addTo(globalMap).bindPopup(
  //         "<b>Attendance : </b>" + "&nbsp;" + this.markers[i].label + " %" +
  //         "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
  //         "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
  //         "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].cluster +
  //         "<br><b>School: </b>" + "&nbsp;" + this.markers[i].name +
  //         "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
  //       );

  //       markerIcon.on('mouseover', function (e) {
  //         this.openPopup();
  //       });
  //       markerIcon.on('mouseout', function (e) {
  //         this.closePopup();
  //       });

  //       this.layerMarkers.addLayer(markerIcon);
  //       markerIcon.myJsonData = this.markers[i];
  //     };
  //     globalMap.setView(new L.LatLng(this.lat, this.lng), 12);
  //     this.schoolCount = (this.markers.length).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //     this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  //     this.loaderAndErr();
  //     this.changeDetection.markForCheck();
  //   });
  //   globalMap.addLayer(this.layerMarkers);
  //   var element1: any = document.getElementsByClassName('btn-secondary');
  //   element1[0].style.display = 'block';
  //   this.skul = false;
  //   this.blok = true;
  // }

  color() {
    // Converts a #ffffff hex string into an [r,g,b] array
    function hex2rgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null;
    }

    // Inverse of the above
    function rgb2hex(rgb) {
      return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }

    // Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
    // Taken from the awesome ROT.js roguelike dev library at
    // https://github.com/ondras/rot.js
    function _interpolateRgb(color1, color2, factor) {
      if (arguments.length < 3) { factor = 0.5; }

      let result = color1.slice();

      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      }
      return result;
    }

    function generateGradient(color1, color2, total, interpolation) {
      const colorStart = typeof color1 === 'string' ? hex2rgb(color1) : color1;
      const colorEnd = typeof color2 === 'string' ? hex2rgb(color2) : color2;

      // will the gradient be via RGB or HSL
      switch (interpolation) {
        case 'rgb':
          return colorsToGradientRgb(colorStart, colorEnd, total);
        // case 'hsl':
        //   return colorsToGradientHsl(colorStart, colorEnd, total);
        default:
          return false;
      }
    }

    function colorsToGradientRgb(startColor, endColor, steps) {
      // returns array of hex values for color, since rgb would be an array of arrays and not strings, easier to handle hex strings
      let arrReturnColors = [];
      let interimColorRGB;
      let interimColorHex;
      const totalColors = steps;
      const factorStep = 1 / (totalColors - 1);

      for (let idx = 0; idx < totalColors; idx++) {
        interimColorRGB = _interpolateRgb(startColor, endColor, factorStep * idx);
        interimColorHex = rgb2hex(interimColorRGB);
        arrReturnColors.push(interimColorHex);
      }
      return arrReturnColors;
    }
    return {
      generateGradient
    };
  }

}

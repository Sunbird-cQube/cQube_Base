import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { Observable, of } from "rxjs";

@Component({
  selector: 'app-allLogs',
  templateUrl: './allLogs.component.html',
  styleUrls: ['./allLogs.component.css']
})
export class AllLogsComponent implements OnInit {
  public nodeLogs;
  node_show_download: boolean = false;
  fileName = '';
  constructor(private router: Router, private service: AppService) { }

  ngOnInit() {

  }

  showNodeLog() {
    this.service.nodeLogs(this.node_show_download).subscribe(res => {
      this.nodeLogs = res;
    })
  }

  downloadNodeLog() {
    this.service.nodeLogs(!this.node_show_download).subscribe(res => {
      this.fileName = "nodeLogs"
      this.dyanmicDownloadByHtmlTag({
        fileName: this.fileName,
        text: res.toString()
      });
    })
  }

  showAngularLog() {
    this.service.angularLogs(this.node_show_download).subscribe(res => {
      this.nodeLogs = res;
    })
  }

  downloadAngularLog() {
    this.service.angularLogs(!this.node_show_download).subscribe(res => {
      this.fileName = "AngularLogs"
      this.dyanmicDownloadByHtmlTag({
        fileName: this.fileName,
        text: res.toString()
      });
    })
  }

  showNiFiLog() {
    this.service.nifiLogs(this.node_show_download).subscribe(res => {
      this.nodeLogs = res;
    })
  }

  downloadNiFiLog() {
    this.service.nifiLogs(!this.node_show_download).subscribe(res => {
      this.fileName = "NiFiLogs"
      this.dyanmicDownloadByHtmlTag({
        fileName: this.fileName,
        text: res.toString()
      });
    })
  }

  //for download txt file

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

}

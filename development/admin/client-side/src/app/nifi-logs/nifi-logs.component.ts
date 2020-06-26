import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-nifi-logs',
  templateUrl: './nifi-logs.component.html',
  styleUrls: ['./nifi-logs.component.css']
})
export class NifiLogsComponent implements OnInit {
  public logs;
  fileName = '';
  constructor(private router: Router, private service: AppService) { }

  ngOnInit() {
    this.service.nifiLogs(false).subscribe(res => {
      this.logs = res;
    })
  }

  downloadNifiLog() {
    this.service.nifiLogs(true).subscribe(res => {
      this.fileName = "nifiLogs"
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-allLogs',
  templateUrl: './allLogs.component.html',
  styleUrls: ['./allLogs.component.css']
})
export class AllLogsComponent implements OnInit {
  public nodeLogs;
  allLogsType: any = [];
  logTypeName;
  allLogs: any = [];
  logName;
  title;
  logHide = true;
  logPath;
  show_download: boolean = false;
  fileName = '';
  filePath;
  fileHidden = true;
  logData;
  errMsg;
  fileSize;
  showErr = true;
  constructor(private router: Router, private service: LogsService) {
    this.showErr = false;
  }

  ngOnInit() {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('spinner').style.display = 'block';
    this.logTypeName = '';
    this.service.getLogMenu().subscribe((res: any) => {
      res.forEach(element => {
        this.allLogsType.push({ name: element.name })
      });
      setTimeout(() => {
        document.getElementById('spinner').style.display = 'none';
      }, 300);
    })
    document.getElementById('homeBtn').style.display = "Block";
  }

  listLogs(type) {
    document.getElementById('spinner').style.display = 'Block';
    this.title = '';
    this.logName = '';
    this.allLogs = [];
    this.logHide = false;
    this.fileHidden = true;
    this.service.getLogMenu().subscribe((res: any) => {
      res.forEach(element => {
        if (element.name == type) {
          element.children.forEach(item => {
            this.allLogs.push({ name: item.name, key: item.key });
          });
        }
      });
      setTimeout(() => {
        document.getElementById('spinner').style.display = 'none';
      }, 300);
    })
  }

  getLogPath(type) {
    document.getElementById('spinner').style.display = 'block';
    this.fileHidden = false;
    this.service.showLogs(type).subscribe(res => {
      this.title = res['title'];
      this.logPath = res['path'];
      this.showLog(this.logPath);
      setTimeout(() => {
        document.getElementById('spinner').style.display = 'none';
      }, 300);
    })
  }

  showLog(path) {
    document.getElementById('spinner').style.display = 'block';
    this.filePath = path;
    this.logData = "";
    this.service.getLogData({ path: path, download: this.show_download }).subscribe(res => {
      if (res['errMsg']) {
        this.errMsg = res['errMsg'];
        this.showErr = true;
      } else {
        this.logData = res['data'];
        this.fileSize = (res['fileSize'] + "B").replace(/\s/g, '');
        this.showErr = false;
      }
      setTimeout(() => {
        document.getElementById('spinner').style.display = 'none';
      }, 300);
    })
  }


  downloadLogs() {
    document.getElementById('spinner').style.display = 'block';
    this.service.getLogData({ path: this.filePath, download: !this.show_download }).subscribe(res => {
      this.fileName = this.filePath.split('/');
      this.fileName = this.fileName[4];
      this.dyanmicDownloadByHtmlTag({
        fileName: this.fileName,
        text: res.toString()
      });
      document.getElementById('spinner').style.display = 'none';
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

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private service: AppService) { }
  email: any;
  role: any;
  showSubmenu1: any = false;
  showsideMenu: boolean = false;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showLogs: boolean = true;

  navItems: any = [
    {
      name: 'All Logs',
      children: []
    },
  ];

  logNames: any = [];

  ngOnInit() {
    this.email = localStorage.getItem('email');
    this.role = localStorage.getItem('role');
    if (this.role == 1) {
      this.showsideMenu = false;
      this.showLogs = true;
    }
    this.service.getLogMenu().subscribe((res: any) => {
      this.navItems[0].children = res;
      this.navItems[0].children.forEach(element => {
        element.children.forEach(item => {
          item['route'] = "all-logs";
        });
      });
    })
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }
  email: any;
  role: any;
  showSubmenu1: any = false;
  showsideMenu: boolean = false;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
    
  ngOnInit() {
    this.email = localStorage.getItem('email');
    this.role = localStorage.getItem('role');
    if (this.role == 1) {
      this.showsideMenu = false;
    }
    if (this.role == 3) {
      this.showsideMenu = false;
    }
    if (this.role == 5) {
      this.showsideMenu = true;
    }

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

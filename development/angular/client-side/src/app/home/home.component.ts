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
  showSubmenu: any;
  showSubmenu1: any;
  showsideMenu: boolean = false;
  showCreateUser: boolean = false;
  ngOnInit() {
    this.email = localStorage.getItem('email');

    this.role = localStorage.getItem('role');
    if (this.role == 1) {
      this.showsideMenu = false;
      this.showCreateUser = true;
    }
    if (this.role == 3) {
      this.showsideMenu = false;
      this.showCreateUser = false;
    }
    if (this.role == 5) {
      this.showsideMenu = true;
      this.showCreateUser = false;
    }

  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }


}

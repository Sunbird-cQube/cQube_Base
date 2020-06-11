import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  data: boolean;
  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.data = (localStorage.getItem('token') == null && window.location.href !== "http://localhost:4200/#/user-view");
    if (this.data) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }

  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.data = (localStorage.getItem('token') == null && window.location.href !== "http://localhost:4200/#/user-view");
    if (!this.data) {
      this.router.navigate(['/login']);
      return false;

    } else {
      return true;
    }
  }
}

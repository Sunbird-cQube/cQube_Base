import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  data: boolean;
  constructor(private router: Router) { }
  public role = localStorage.getItem('roleName');
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // this.data = (localStorage.getItem('token') == null && window.location.href !== "http://localhost:4200/#/user-view");
    // let expectedRoleArray = next.data.roles[0];
    // console.log(expectedRoleArray);

    if (this.data) {
      // this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }

  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // this.data = (localStorage.getItem('token') == null && window.location.href !== "http://localhost:4200/#/user-view");
    if (!this.data) {
      // this.router.navigate(['/login']);
      return false;

    } else {
      return true;
    }
  }
}

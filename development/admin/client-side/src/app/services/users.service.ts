import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { KeycloakSecurityService } from './../keycloak-security.service';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public baseUrl = environment.apiEndpoint;
  constructor(public http: HttpClient, public keyCloakService: KeycloakSecurityService, private service: AppService) { }

  //User management...........
  addUser(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/addUser`, data);
  }

  changePassword(data, id) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/changePassword/${id}`, { cnfpass: data });
  }

  allUsers() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers`, {});
  }

  getCreatedUser(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/addUser/getAllUsers`, data);
  }


  getRoles() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/addUser/roles`);
  }

  addRole(id, role) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/addUser/setRoles`, { userId: id, role: role });

  }

  changeStatus(id, updaterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers/changeStatus/${id}`, { updaterId: updaterId });
  }

  deleteUser(id) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers/deleteUser/${id}`, {});
  }
  editUser(id, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers/editUser/${id}`, { data: data });
  }

  getCurrentUser(id) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers/getUser/${id}`, {});
  }

  getToken(username) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/addUser/getToken`, { username });
  }
}

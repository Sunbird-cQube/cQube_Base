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
    return this.http.post(`${this.baseUrl}/addUser`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  changePassword(data, id) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/changePassword/${id}`, { cnfpass: data }, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  allUsers() {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  getCreatedUser(data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/addUser/getAllUsers`, data, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }


  getRoles() {
    this.service.logoutOnTokenExpire();
    return this.http.get(`${this.baseUrl}/addUser/roles`, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  addRole(id, role) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/addUser/setRoles`, { userId: id, role: role }, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });

  }

  changeStatus(id, updaterId) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers/changeStatus/${id}`, { updaterId: updaterId }, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  deleteUser(id) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers/deleteUser/${id}`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }
  editUser(id, data) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers/editUser/${id}`, { data: data }, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }

  getCurrentUser(id) {
    this.service.logoutOnTokenExpire();
    return this.http.post(`${this.baseUrl}/allUsers/getUser/${id}`, {}, {
      'headers': { 'token': "Bearer " + localStorage.getItem('token') }
    });
  }
}

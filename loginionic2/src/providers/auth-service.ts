import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
 
export class User {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  groups: Array<any>;
  friends: Array<any>;
  pending_friends: Array<any>;
 
  constructor(id: string, name: string, email: string, birthdate: string, groups: Array<any>, friends: Array<any>, pending_friends: Array<any>) {
    this.id = id,
    this.name = name;
    this.email = email;
    this.birthdate = birthdate;
    this.groups = groups;
    this.friends = friends;
    this.pending_friends = pending_friends;
  }
}
 
@Injectable()
export class AuthService {
  currentUser: User;
  apiUrl = this.appSettings.getApiUrl();
  success = true;

  constructor(public http: Http, public appSettings: AppSettings){

  }
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      credentials.email = credentials.email.toLowerCase();
      return this.http.post(this.apiUrl + 'authenticate', {'email':credentials.email,'password':credentials.password});
    }
  }
 
  public register(credentials) {
    if (credentials.name === null || credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      credentials.email = credentials.email.toLowerCase();
      return this.http.post(this.apiUrl + 'signup', {'name':credentials.name, 'email':credentials.email ,'password':credentials.password, 'birthdate':credentials.birthdate});
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }

  public getCurrentUser(){
    return this.currentUser;
  }

  public getUpdatedProfile(){
      let params = new URLSearchParams();
      params.append('_User', this.currentUser.id);

      let options = new RequestOptions({
          search: params
      });

      return this.http.get(this.appSettings.getApiUrl() + "userInfo", options);
    }

 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}

import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
 
export class User {
  name: string;
  email: string;
 
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
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
      return this.http.post(this.apiUrl + 'authenticate', {'email':credentials.email,'password':credentials.password});
    }
  }
 
  public register(credentials) {
    if (credentials.name === null || credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return this.http.post(this.apiUrl + 'signup', {'name':credentials.name, 'email':credentials.email ,'password':credentials.password});
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}

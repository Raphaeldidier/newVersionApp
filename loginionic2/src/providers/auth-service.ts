import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { TokenAuth } from './token-auth';
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

  constructor(public http: Http, public appSettings: AppSettings, public tokenAuth : TokenAuth){

  }
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
      	let that = this;
      	this.http.post(this.apiUrl + 'authenticate', {'name':credentials.email,'password':credentials.password}).subscribe(function(result) {
    			let body = result.json();
    			console.log(body);
    		 	if (body.success) {
	          that.tokenAuth.storeUserCredentials(body.token);
	          that.tokenAuth.loadUserCredentials();
	      		return Observable.create(observer => {
			        observer.next(true);
			        observer.complete();
			      });
		          // resolve(result.data.msg);
	       	} 
	       	else {
		          // reject(result.data.msg);
	          console.log("didn't work");
	        }}, 
		      error => {
	      			return Observable.throw("We are not able to find your account for now, please wait ...");
		      });

      	//Check if same
        let access = (credentials.password === "pass" && credentials.email === "email");
        this.currentUser = new User('Raphael', 'raphael.didier@outlook.fr');
        observer.next(access);
        observer.complete();
      });
    }
  }
 
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
    	//Post 
    	this.http.post(this.apiUrl + 'signup', {'name':credentials.email,'password':credentials.password})
    			.subscribe(data => {
			      return Observable.create(observer => {
			        observer.next(true);
			        observer.complete();
			      });
	        }, error => {
      			return Observable.throw("We are not able to create your account for now, please wait ...");
	        });
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

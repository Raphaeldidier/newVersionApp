import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { AppSettings } from './app-settings';
import { AuthService } from './auth-service';

const CONFIG = {
  rootPath: 'http://localhost:8080/images/',
}; 

@Injectable()
export class RequestService {

  currentUser: any;
 
  constructor(public http: Http, public appSettings: AppSettings, public auth: AuthService) {
    //get the User 
    this.currentUser = this.auth.getUserInfo();
  }

  	public getImageSource(directory, category, subCategory){
  		//Check if we set the category + sub
  		return (category.length!=0 && subCategory.length!=0) ?
  			CONFIG.rootPath+directory+"/"+category+"/"+subCategory+".jpg":
  			CONFIG.rootPath+directory+"/default.jpg"; 
  	}

  	public getEventFromMap(latNE, lngNE, latSW, lngSW){
  		
  		let params = new URLSearchParams();
  		params.append('latNE', latNE.toString());
  		params.append('lngNE', lngNE.toString());
  		params.append('latSW', latSW.toString());
  		params.append('lngSW', lngSW.toString());

	    let options = new RequestOptions({
      		search: params
    	});

  		return this.http.get(this.appSettings.getApiUrl() + "mapEvents", options);
  	}

    public createNewGroup(name, color){
      return this.http.post(this.appSettings.getApiUrl() + "createGroup", {
        _User: this.currentUser.id,
        name: name,
        color: color
      });
    }

    public deleteGroup(groupId){
      return this.http.post(this.appSettings.getApiUrl() + "deleteGroup", {
        _groupId: groupId
      });
    }

    public addUserToGroup(groupId, userName){
      return this.http.post(this.appSettings.getApiUrl() + "addUserToGroup", {
        _groupId: groupId,
        userName: userName
      });
    }

  	public getRootPath() {
   		return CONFIG.rootPath;
  	}
}
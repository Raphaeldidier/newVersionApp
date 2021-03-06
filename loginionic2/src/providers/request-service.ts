import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { AppSettings } from './app-settings';
import { AuthService } from './auth-service';

// const CONFIG = {
//   rootPath: 'http://localhost:8080/images/',
// }; 

const CONFIG = {
  rootPath: 'https://venews-app.herokuapp.com/images/',
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

    public updateGroup(group_id, name, color){
      return this.http.post(this.appSettings.getApiUrl() + "updateGroup", {
        _groupId: group_id,
        name: name,
        color: color
      });
    }

    public deleteGroup(groupId){
      return this.http.post(this.appSettings.getApiUrl() + "deleteGroup", {
        _groupId: groupId
      });
    }

    public addUsersToGroup(groupId, users){
      return this.http.post(this.appSettings.getApiUrl() + "addUsersToGroup", {
        _groupId: groupId,
        users: users
      });
    }

    public addUserToFriendsList(email){
      return this.http.post(this.appSettings.getApiUrl() + "addUserToFriendsList", {
        _User: this.currentUser.id,
        email: email
      });    
    }

   public sendInvitePending(email){
      return this.http.post(this.appSettings.getApiUrl() + "sendInvitePending", {
        _User: this.currentUser.id,
        email: email
      });    
    }


    public acceptFriendById(friend_id){
      return this.http.post(this.appSettings.getApiUrl() + "acceptFriendById", {
        _User: this.currentUser.id,
        friend_id: friend_id
      });  
    }

    public declineFriendById(friend_id){
      return this.http.post(this.appSettings.getApiUrl() + "declineFriendById", {
        _User: this.currentUser.id,
        friend_id: friend_id
      });  
    }

    public delUserFromGroup(groupId, creatorId, userId){
      return this.http.post(this.appSettings.getApiUrl() + "delUserFromGroup", {
        _groupId: groupId,
        _creatorId: creatorId,
        _userId: userId
      });
    }

    public deleteFriend(friend_id){
      return this.http.post(this.appSettings.getApiUrl() + "deleteFriendFromList", {
        _User: this.currentUser.id,
        friend_id: friend_id
      });
    }

    public getMyEvents(userId){
      let params = new URLSearchParams();
      params.append('id', userId.toString());

      let options = new RequestOptions({
          search: params
      });

      return this.http.get(this.appSettings.getApiUrl() + "myEvents", options);
    }

    public getRegisteredEvents(userId){
      let params = new URLSearchParams();
      params.append('id', userId.toString());

      let options = new RequestOptions({
          search: params
      });
      return this.http.get(this.appSettings.getApiUrl() + "registeredEvents", options);
    }


    public registerUserToEvent(eventId){
      return this.http.post(this.appSettings.getApiUrl() + "registerUserToEvent", {
        _User: this.currentUser.id,
        event_id: eventId
      });
    }

    public unregisterUserToEvent(eventId){
      return this.http.post(this.appSettings.getApiUrl() + "unregisterUserToEvent", {
        _User: this.currentUser.id,
        event_id: eventId
      });
    }

  	public getRootPath() {
   		return CONFIG.rootPath;
  	}
}
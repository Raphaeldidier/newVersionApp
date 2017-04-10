import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RequestService } from '../../providers/request-service';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-add-user-group-modal',
  templateUrl: 'add-user-group-modal.html'
})
export class AddUserGroupModalPage {

	friends: any;
	initFriends: any;
	loading: any;
	searchedWord: any = "";
	group: any;
	searchedTerm

 	constructor(public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, 
 		public loadingCtrl: LoadingController, public alertCtrl: AlertController, public reqServ: RequestService,
 		public auth: AuthService) {

 		this.group = this.navParams.get("group");
 		let currentUser = this.auth.getCurrentUser();
 		this.initFriends = currentUser.friends;
 		this.friends = this.initFriends;
 	}

  	public searchKey(){
		//get the value
		this.friends = this.initFriends;
		let searchedTerm = this.searchedWord;
		this.cdr.detectChanges();

	    // if the value is an empty string don't filter the items
	    if (searchedTerm.trim() == '') {
	        return;
	    }

		this.friends = this.friends.filter((friend) => {
			return friend.name.toLowerCase().indexOf(searchedTerm.toLowerCase()) > -1;
		});
	}

	deleteUser(user){
		this.showLoading();
		this.reqServ.delUserFromGroup(this.group._id, this.group.creator, user._id).subscribe(res => {
			if(res.json().success){
		  		this.group.users = this.group.users.filter((userElem) => {
		  			return user != userElem;
		  		});
				this.loading.dismiss();
		  	}
		  	else this.showPopup("Error", "User could not be deleted, Please try later");
		}, error => {
			this.showPopup("Error", "User could not be deleted, Please try later");
			this.loading.dismiss();			
		});
	}

	addUserToGroup(user){
		console.log("Adding "+user + " in "+ this.group);
	}

	public clearFriends(){
		this.friends = this.initFriends;
	}

	public showPopup(title, text){
	  	let alert = this.alertCtrl.create({
	      title: title,
	      subTitle: text,
	      buttons: [{ text: 'OK' }]
	    });
	    alert.present();
  	}

  	showLoading() {
	    this.loading = this.loadingCtrl.create({
	      content: 'Please wait...'
	    });
	    this.loading.present();
    }
}

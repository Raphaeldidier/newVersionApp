import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RequestService } from '../../providers/request-service'
import { CreateGroupModalPage } from '../../pages/create-group-modal/create-group-modal';
import { PendingInvitesModalPage } from '../../pages/pending-invites-modal/pending-invites-modal';
import { AddUserModalPage } from '../../pages/add-user-modal/add-user-modal';
import { ManageGroupPage } from '../../pages/manage-group/manage-group';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage { 

  	loading: Loading;
  	currentUser: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, 
  		public reqServ: RequestService, public auth: AuthService, private loadingCtrl: LoadingController, 
  		public alertCtrl: AlertController) {

  		this.currentUser = this.auth.getCurrentUser();
  	}


  	manageGroup(group){
  		console.log(group);
  		this.navCtrl.push(ManageGroupPage, { "group": group });
  	}


  	deleteGroup(group){
		this.showLoading();
  		this.reqServ.deleteGroup(group._id).subscribe(res => {
  			if(res.json().success){
		  		this.currentUser.groups = this.currentUser.groups.filter((groupElem) => {
		  			return group != groupElem;
		  		});
				this.loading.dismiss();
		  	}
		  	else this.showPopup("Error", "Couldn't delete groups, Please try later");
  		}, err => {
		  	this.showPopup("Error", "Couldn't delete groups, Please try later");
  		});
  	}

  	createGroup() {
  		let groupCreateModal = this.modalCtrl.create(CreateGroupModalPage);
	   	groupCreateModal.onDidDismiss(data => {
	   		if(data.success){	
				this.showLoading();
	     		console.log(data);
		     	this.reqServ.createNewGroup(data.name, data.color).subscribe(res => {

					let jsonRes = res.json();
					if (jsonRes.success) {
						this.currentUser.groups.push(jsonRes.group);
						this.loading.dismiss();

					} else {
						this.showPopup("Error", "Group could not be created, Please try later");
						this.loading.dismiss();
					}
				}, error => {
					this.showPopup("Error", "Group could not be created, Please try later");
					this.loading.dismiss();
				});
	     	}
	   });
	   groupCreateModal.present();
	}

	addUser(){
		let addUserModal = this.modalCtrl.create(AddUserModalPage);
	   	addUserModal.onDidDismiss(data => {
	   		if(data.success){	
				this.showLoading();
		     	this.reqServ.sendInvitePending(data.email).subscribe(res => {

					let jsonRes = res.json();
					if (jsonRes.success) {
						this.showPopup("Success", jsonRes.msg);
					} else {
						this.showPopup("Error", jsonRes.msg);
					}
					this.loading.dismiss();
				}, error => {
					this.showPopup("Error", "User could not be added, Please try later");
					this.loading.dismiss();
				});
	     	}
	   });
	   addUserModal.present();
	}

	public openPendingFriends(){
	    let pendingFriendsModal = this.modalCtrl.create(PendingInvitesModalPage,
	    	{ pending_friends: this.currentUser.pending_friends });

     	pendingFriendsModal.onDidDismiss(data => {
     		data.addedFriends.forEach((friend) => {
     			// this.friend.push(friend);
     		})
     		// this.currentUser = this.auth.getUpdatedProfile();
     		this.setUserFriendsAndInfo();
		});
	    pendingFriendsModal.present();
	}

	doRefresh(refresher) {
		// this.currentUser = this.auth.getUpdatedProfile();
 		this.setUserFriendsAndInfo();
		setTimeout(() => {
			refresher.complete();
		}, 2000);
	} 

	public setUserFriendsAndInfo(){
		this.auth.getUpdatedProfile().subscribe(res => {
          let jsonRes = res.json();
          if (jsonRes.success) {
            this.currentUser.groups = jsonRes.user.groups;
            this.currentUser.friends = jsonRes.user.friends;
            this.currentUser.pending_friends = jsonRes.user.pending_friends;
          }
        }, err => {
          // ?
      });
	}

 	public showPopup(title, text){
	  	let alert = this.alertCtrl.create({
	      title: title,
	      subTitle: text,
	      buttons: [
	           { text: 'OK'}
           ]
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

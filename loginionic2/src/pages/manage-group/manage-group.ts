import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { RequestService } from '../../providers/request-service';
import { AddUserGroupModalPage } from '../../pages/add-user-group-modal/add-user-group-modal';

@Component({
  selector: 'page-manage-group',
  templateUrl: 'manage-group.html'
})
export class ManageGroupPage {

  	loading: Loading;
	group: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public reqServ: RequestService, 
		public modalCtrl: ModalController, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {

		this.group = this.navParams.get("group");
	}

	addUser(){
		let addUserGroupModal = this.modalCtrl.create(AddUserGroupModalPage, { group: this.group });
	   	addUserGroupModal.onDidDismiss(data => {
	   		if(data.success){	
				this.showLoading();
		     	this.reqServ.addUsersToGroup(this.group._id, data.usersToAdd).subscribe(res => {

					let jsonRes = res.json();
					if (jsonRes.success) {
						jsonRes.users.forEach((user) => {
							this.group.users.push(user);
						});
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
	   addUserGroupModal.present();
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

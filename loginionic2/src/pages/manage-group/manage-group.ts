import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { RequestService } from '../../providers/request-service'
import { AddUserModalPage } from '../../pages/add-user-modal/add-user-modal'

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
		console.log(this.group);
	}

	addUser(){
		let addUserModal = this.modalCtrl.create(AddUserModalPage);
	   	addUserModal.onDidDismiss(data => {
	   		if(data.success){	
				this.showLoading();
		     	this.reqServ.addUserToGroup(this.group._id, data.email).subscribe(res => {

					let jsonRes = res.json();
					if (jsonRes.success) {
						this.group.users.push(jsonRes.user);
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

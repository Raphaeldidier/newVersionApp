import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { RequestService } from '../../providers/request-service'
import { AddUserModalPage } from '../../pages/add-user-modal'

@Component({
  selector: 'page-manage-group',
  templateUrl: 'manage-group.html'
})
export class ManageGroupPage {

	group: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public reqServ: RequestService, public modalCtrl: ModalController) {
		this.group = this.navParams.get("group");
		console.log(this.group);
	}

	addUser(){
		let addUserModal = this.modalCtrl.create(AddUserModalPage);
	   	addUserModal.onDidDismiss(data => {
	   		if(data.success){	
				this.showLoading();
	     		console.log(data);
		     	this.reqServ.addUserToGroup(this.group._id, data.name).subscribe(res => {

					let jsonRes = res.json();
					if (jsonRes.success) {
						this.group.users.push(jsonRes.user);
						this.loading.dismiss();

					} else {
						this.showPopup("Error", "User could not be added, Please try later");
					}
				}, error => {
					this.showPopup("Error", "User could not be added, Please try later");
				});
	     	}
	   });
	   addUserModal.present();
	}

	deleteUser(user){

	}
}

import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RequestService } from '../../providers/request-service'
import { CreateGroupModalPage } from '../../pages/create-group-modal/create-group-modal';
import { ManageGroupPage } from '../../pages/manage-group/manage-group';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage { 

	groups: any;
  	loading: Loading;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, 
  		public reqServ: RequestService, public auth: AuthService, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  		this.groups = this.auth.getUserGroups();
  	}

  	addUser(item){
  		console.log("added");
  		console.log(item);
  	}


  	manageGroup(group){
  		console.log(group);
  		this.navCtrl.push(ManageGroupPage, { "group": group });
  	}


  	deleteGroup(group){
		this.showLoading();
  		this.reqServ.deleteGroup(group._id).subscribe(res => {
  			if(res.json().success){
		  		this.groups = this.groups.filter((groupElem) => {
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
						this.groups.push(jsonRes.group);
						this.loading.dismiss();

					} else {
						this.showPopup("Error", "Group could not be created, Please try later");
					}
				}, error => {
					this.showPopup("Error", "Group could not be created, Please try later");
				});
	     	}
	   });
	   groupCreateModal.present();
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

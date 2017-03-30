import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { CreateGroupModalPage } from '../../pages/create-group-modal/create-group-modal';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage { 

	groups: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, public modalCtrl: ModalController) {
  		this.groups = this.auth.getUserGroups();
  	}

  	addUser(item){
  		console.log("added");
  		console.log(item);
  	}


  	manageGroup(group){
  		console.log("managed");
  		console.log(group);
  	}


  	deleteGroup(group){
	  	this.groups = this.groups.filter((groupElem) => {
	  		return group != groupElem;
	  	});
  	}

  	createGroup() {
  		let groupCreateModal = this.modalCtrl.create(CreateGroupModalPage);
	   groupCreateModal.onDidDismiss(data => {
	     console.log(data);
	   });
	   groupCreateModal.present();
	}
}

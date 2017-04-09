import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { RequestService } from '../../providers/request-service'


@Component({
  selector: 'page-pending-invites-modal',
  templateUrl: 'pending-invites-modal.html'
})
export class PendingInvitesModalPage {

	pending_friends: any = [];
	added_friends: any = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
		public rqst: RequestService, public alertCtrl: AlertController) {
		this.pending_friends = navParams.get('pending_friends');
		console.log(this.pending_friends);
	}

	acceptFriend(friend){

		this.rqst.acceptFriendById(friend._id).subscribe(res => {
  			if(res.json().success){

  				this.showPopup("Success", friend.name +" has been added to your friends list!");

				let index = this.pending_friends.indexOf(friend);
				this.pending_friends.splice(index, 1);
			
				this.added_friends.push(friend);
  			}
  		}, err => {
  			this.showPopup("Error", "Couldn't accept this user, Please try later");
  		});

	}

	declinefriend(friend){

	}

	closeModal() {
		let data = { 'addedFriends': this.added_friends };
		this.viewCtrl.dismiss(data);
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
}

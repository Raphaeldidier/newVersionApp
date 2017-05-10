import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { RequestService } from '../../providers/request-service';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html'
})
export class EventDetailsPage {

	card: any;	
	test= false;
	isRegistered: boolean;
	isCreator: boolean;

	constructor(public navCtrl: NavController, public navParams: NavParams, public reqServ: RequestService, public alertCtrl: AlertController,
		public auth: AuthService) {

		this.card = this.navParams.get("card");

 		let currentUser = this.auth.getCurrentUser();

 		this.isCreator = currentUser.id == this.card.creatorId;

		//check if the user is in the event
		let eventUsers = this.card.users;
		this.isRegistered = eventUsers.indexOf(currentUser.id) >= 0;
	}

	registerToEvent(){
		this.reqServ.registerUserToEvent(this.card.id).subscribe(res => {
			let response = res.json();
			if(response.success){
				this.isRegistered = true;
		  	}
		  	else this.showPopup("Error", response.msg);
			}, error => {
				this.showPopup("Error", "Problem occured");
		});
	}

	unregisterToEvent(){
		console.log(this.card);
		this.reqServ.unregisterUserToEvent(this.card.id).subscribe(res => {
			let response = res.json();
			if(response.success){
				this.isRegistered = false;
		  	}
		  	else this.showPopup("Error", response.msg);
			}, error => {
				this.showPopup("Error", "Problem occured");
		});
	}

	public showPopup(title, text){
	  	let alert = this.alertCtrl.create({
	      title: title,
	      subTitle: text,
	      buttons: [{ text: 'OK' }]
	    });
	    alert.present();
  	}
}

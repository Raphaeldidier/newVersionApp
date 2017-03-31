import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-add-user-modal',
  templateUrl: 'add-user-modal.html'
})
export class AddUserModalPage {

	email: any = "";

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController) {}

  	dismissModal(){
		this.viewCtrl.dismiss({});
	}

	addUser(){
		if(this.email == ""){
			let alert = this.alertCtrl.create({
			    title: 'Email missing!',
			    subTitle: "Make sure you insert your friend's email",
			    buttons: ['Ok']
		  	});
		  	alert.present();
		}
	  	else
			this.viewCtrl.dismiss({ email: this.email });
	}
}

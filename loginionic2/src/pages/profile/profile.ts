import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

	currentUser: any;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.currentUser = this.navParams.get("user");
		console.log(this.currentUser);
	}

	modifProfile(){
		console.log("modify Profile");
	}

	calculateAge(birthday) { 
		let birthdayDate = new Date(birthday);
	    let ageDifMs = Date.now() - birthdayDate.getTime();
	    let ageDate = new Date(ageDifMs); 
	    return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

}

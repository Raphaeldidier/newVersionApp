import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {

	name:'';
	email:'';
	user: any;

	// Image to get
    profilePicture: any = "http://rs1217.pbsrc.com/albums/dd395/dhanz_ztya/Avatar_Foto_Profil_Facebook_Unik_1.jpg~c200"

	constructor(public navCtrl: NavController, public navParams: NavParams, public authService : AuthService) {
		this.user = authService.currentUser;
	}

 	

}

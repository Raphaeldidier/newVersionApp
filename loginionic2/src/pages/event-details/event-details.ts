import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html'
})
export class EventDetailsPage {

	card: any;	
	test= false;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.card = this.navParams.get("card");
	}

	ionViewDidLoad() {
	}

}

import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { RequestService } from '../../providers/request-service'
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html'
})
export class MyEventsPage {

	loading: Loading;
	toggleVal: any = "created";
	createdEvents: any = [];
	registeredEvents: any = [];
	currentUser: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public auth: AuthService, 
  		public reqServ: RequestService, private loadingCtrl: LoadingController, public alertCtrl: AlertController,
  		public cdr: ChangeDetectorRef ) {

		this.currentUser = this.auth.getUserInfo();
		this.requestCreated();
	}

	requestCreated(){

		this.reqServ.getMyEvents(this.currentUser.id).subscribe(res => {
  			if(res.json().success){
		  		this.createdEvents = res.json().events;
				
				this.createdEvents.forEach((event, k) => {
					console.log(event.category+" "+event.subCategory)
		  			this.createdEvents[k].source = this.reqServ.getImageSource("categories", event.category, event.subCategory);
		  			this.createdEvents[k].creator = this.currentUser.name;
		  		});
				this.cdr.detectChanges();
		  	}
		  	else this.showPopup("Error", "Couldn't get your events, Please try later");
  		}, err => {
		  	this.showPopup("Error", "Couldn't get your events, Please try later");
  		});
	}

	requestRegistered(){

		this.reqServ.getRegisteredEvents(this.currentUser.id).subscribe(res => {
  			if(res.json().success){
		  		this.registeredEvents = res.json().events;
				
				this.registeredEvents.forEach((event, k) => {
					console.log(event.category+" "+event.subCategory)
		  			this.registeredEvents[k].source = this.reqServ.getImageSource("categories", event.category, event.subCategory);
		  			this.registeredEvents[k].creator = this.registeredEvents[k].creator[0].name;
		  		});
				this.cdr.detectChanges();
		  	}
		  	else this.showPopup("Error", "Couldn't get your events, Please try later");
  		}, err => {
		  	this.showPopup("Error", "Couldn't get your events, Please try later");
  		});
	}

	segmentChanged(event){
		console.log(this.registeredEvents);
		if(event.value == "registered"){
			this.createdEvents = [];
			this.requestRegistered();
		}
		else{
			this.registeredEvents = [];
			this.requestCreated();
		}
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

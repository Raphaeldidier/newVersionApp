import { Component, ChangeDetectorRef } from '@angular/core';
import { Nav, AlertController, LoadingController, Loading } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { CreateEventPage } from '../create-event/create-event';
import { EventDetailsPage } from '../../pages/event-details/event-details';
import { PositionService } from '../../providers/position-service';
import { RequestService } from '../../providers/request-service';
import { AppSettings } from '../../providers/app-settings';
import { Http } from '@angular/http';

@Component({
	selector: 'page-list',
	templateUrl: 'list.html'
})
export class ListPage {

	loading: Loading;
	searchedWord: any = "";
	events: any;
 	apiUrl = this.appSettings.getApiUrl();
	cards: Array<any> = [];
	initCards: Array<any> = [];
	test = true;

	constructor(public datepipe: DatePipe, public nav: Nav, public cdr: ChangeDetectorRef, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
		public http: Http, public appSettings: AppSettings, public positionService: PositionService, public requestService: RequestService) {
		
	}

	ngAfterViewInit() {
		this.events = this.getEvents();
  	}
 

	public getDaysDiff(date){

		let todayDate = new Date();
		let formatedDate = new Date(date);
		let diffHours = (formatedDate.getTime() - todayDate.getTime())/(60*60*1000);
		return  (diffHours >= 24) ? Math.round(diffHours/24)+"d" : (diffHours>=1) ? Math.round(diffHours)+"h" : "< 1h";
	}

	searchByKeyword(){
		//Looking for event by name or city
		console.log("Searching for : "+this.searchedWord);
	}

	public getEvents(){

    	// this.showLoading();

		this.http.get(this.apiUrl + "events").subscribe(res => {

			let jsonRes = res.json();
		    // this.loading.dismiss();
			if (jsonRes.success) {
				console.log(jsonRes.events);
				jsonRes.events.forEach((event) => {
				this.initCards.push({
					"name": event.name,
					"address": event.address,
					"date": event.date,
					"creator":event.creator[0].name,
					"daysLeft": this.getDaysDiff(event.date),
					"spotsMax": event.spotsMax,
					"spotsLeft": event.spotsLeft,
					"city": event.city,
					"distance": this.positionService.getDistanceFromPosInKm(event.lat, event.lng),
					"source": this.requestService.getImageSource("categories", event.category, event.subCategory),
					});
				});
				this.cards = this.initCards;
	    		this.cdr.detectChanges();
			}
			else
				this.showPopup("Error", "Events could not be found, Please try later");

		}, err => {
			this.showPopup("Error", "Events could not be found, Please try later");
		})
	}

	public showPopup(title, text){
	  	let alert = this.alertCtrl.create({
	      title: title,
	      subTitle: text,
	      buttons: [{ text: 'OK' }]
	    });
	    alert.present();
  	}

  	showLoading() {
	    this.loading = this.loadingCtrl.create({
	      content: 'Please wait...'
	    });
	    this.loading.present();
    }

	public createEvent(){
		//Event creation page
		this.nav.push(CreateEventPage);
	}

	doRefresh(refresher) {
		this.clearCards();

	    setTimeout(() => {
	      refresher.complete();
	    }, 1000);
	}

	public clearCards(){
		this.initCards = [];
		this.cards = this.initCards;
		this.getEvents();
	}

	public searchKey(){
		//get the value
		this.cards = this.initCards;
		let searchedTerm = this.searchedWord;
		this.cdr.detectChanges();

	    // if the value is an empty string don't filter the items
	    if (searchedTerm.trim() == '') {
	        return;
	    }

		this.cards = this.cards.filter((card) => {
			return card.name.toLowerCase().indexOf(searchedTerm.toLowerCase()) > -1 || card.city.toLowerCase().indexOf(searchedTerm.toLowerCase()) > -1 ;
		});
	}

	public eventDetails(card){
		console.log("gere");
	    // this.nav.push(EventDetailsPage, {"card" : card});
  	}
}
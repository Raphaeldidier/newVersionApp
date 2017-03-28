import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { CreateEventPage } from '../create-event/create-event';

@Component({
	selector: 'page-list',
	templateUrl: 'list.html'
})
export class ListPage {

	searchedEvent: any = "";
	cards: any;

	constructor(public datepipe: DatePipe, public nav: Nav) {

		let todayDate = new Date();

		let someDay = new Date('2017-03-25 18:00:00');

		let diffHours = (someDay.getTime() - todayDate.getTime())/(60*60*1000);

		let daysDiff = (diffHours >= 24) ? Math.round(diffHours/24)+"d" : Math.round(diffHours)+"h";

		console.log(diffHours);

		this.cards = [
			{
				"name": "FirstOne",
				"address": "5 via del Ponte, 94230 Cachan",
				"date": new Date(),
				"creator":"Julien",
				"daysLeft": daysDiff,
				"takenNumberPlaces":3,
				"totalNumberPlaces":10,
				"freeNumberPlaces":10-3,
				"distance":"42km",
				"source":"assets/img/bandeaux/pelouse.jpg",
			},
			{
				"name": "SecondOne",
				"address": "8 via dela not Ponto, 94230 Shangailandzu",
				"date": new Date(),
				"creator":"ISF",
				"daysLeft":"3d",
				"takenNumberPlaces":5,
				"totalNumberPlaces":6,
				"freeNumberPlaces":6-5,
				"distance":"400m",
				"source":"assets/img/bandeaux/nightclub.jpg",
			},
			{
				"name": "ThirdOne",
				"address": "8 via dela not Ponto, 94230 Shangailandzu",
				"date": new Date(),
				"creator":"ISF",
				"daysLeft":"3d",
				"takenNumberPlaces":2,
				"totalNumberPlaces":15,
				"freeNumberPlaces":15-2,
				"distance":"400m",
				"source":"assets/img/bandeaux/culture.jpg",
			}
		];
	}

	searchByKeyword(){
		//Looking for event by name or city
		console.log("Searching for : "+this.searchedEvent);
	}

	public createEvent(){
		//Event creation page
		this.nav.push(CreateEventPage);
	}
}
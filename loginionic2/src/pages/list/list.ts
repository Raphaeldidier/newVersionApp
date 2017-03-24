import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'page-list',
	templateUrl: 'list.html'
})
export class ListPage {

	cards : any;

	constructor(public datepipe: DatePipe) {

		let todayDate = new Date();

		let someDay = new Date('2017-03-24 18:00:00');

		let diffHours = (someDay.getTime() - todayDate.getTime())/(60*60*1000);

		let daysDiff = (diffHours >= 24) ? Math.round(diffHours/24)+"d" : Math.round(diffHours)+"h";

		console.log(diffHours);

		this.cards = [
			{
				"name": "FirstOne",
				"address": "5 via del Ponte, 94230 Cachan",
				// "date": "Tu 15th March / 5pm",
				"date": new Date(),
				"creator":"Julien",
				"daysLeft": daysDiff,
				"takenNumberPlaces":3,
				"totalNumberPlaces":10,
				"freeNumberPlaces":10-3
			},
			{
				"name": "SecondOne",
				"address": "8 via dela not Ponto, 94230 Shangailandzu",
				"date": new Date(),
				"creator":"ISF",
				"daysLeft":"3d",
				"takenNumberPlaces":3,
				"totalNumberPlaces":10,
				"freeNumberPlaces":10-3
			}
		];
	}
}

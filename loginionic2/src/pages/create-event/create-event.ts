import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html'
})
export class CreateEventPage {
  loading: Loading;
  createEventVal = { languages:"" };

  constructor(public navCtrl: NavController) {}

  public createEvent(){

  }
}

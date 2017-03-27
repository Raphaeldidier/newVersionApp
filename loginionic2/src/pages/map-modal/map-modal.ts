import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { HomePage } from '../home/home'
import { Geolocation } from 'ionic-native';

declare var google; 

@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html'
})
export class MapModalPage {

	@ViewChild('map') mapElement: ElementRef;
  	map: any;
  	
	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {	
    	this.loadMap();
	}

	public closeModal(){
		this.viewCtrl.dismiss();
	}

	public loadMap(){
 
    Geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 14,
        zoomMax: 17,
        minZoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });
 
  }
}

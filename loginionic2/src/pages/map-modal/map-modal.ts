import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Loading } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Http } from '@angular/http';

declare var google; 

@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html'
})
export class MapModalPage {

  loading: Loading;
  marker: any;
	@ViewChild('map') mapElement: ElementRef;
	map: any;
  lat: any;
  lng: any;
  	
	constructor(public http: Http, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private loadingCtrl: LoadingController) {	
    	this.loadMap();
	}

	public closeModal(){

    let lngLat = this.marker.getPosition();
    this.lat = lngLat.lat();
    this.lng = lngLat.lng();
    this.http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+this.lat+","+this.lng+"&sensor=true").subscribe((res)=>{
      if(res.status==200){
        let addressInfo = (res.json()).results[0].formatted_address;
        let data = { 'address': addressInfo, 'lng': this.lng, 'lat': this.lat };
        this.viewCtrl.dismiss(data);
      }
    }, (err) => {
      console.log(err);
    });
	}

	public loadMap(){
 
    this.showLoading();

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

      setTimeout(() => {
        this.loading.dismiss();
      });

      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter(),
        draggable: true
      });

    }, (err) => {
      console.log(err);
      setTimeout(() => {
        this.loading.dismiss();
      });
    });
 
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
}
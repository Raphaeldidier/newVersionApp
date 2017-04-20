import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Http } from '@angular/http';

declare var google; 

@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html'
})
export class MapModalPage {

	loading: Loading;
	searchedAddress: any = '';
	marker: any;
	@ViewChild('map') mapElement: ElementRef;
	map: any;
	lat: any;
	lng: any;
  	
	constructor(public http: Http, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
		private loadingCtrl: LoadingController, public alertCtrl: AlertController) {	
    	this.loadMap();

	}

  public closeModal(){
    this.viewCtrl.dismiss({});
  }

	public validateModal(){

	    let lngLat = this.marker.getPosition();
	    this.lat = lngLat.lat();
	    this.lng = lngLat.lng();
	    this.http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+this.lat+","+this.lng+"&sensor=true").subscribe((res)=>{
	      if(res.status==200){
	        let addressResult = (res.json()).results[0];
          let addressCompo = addressResult.address_components;
          let city = "";
          addressCompo.forEach((infoAdd) => {
            infoAdd.types.forEach((type) => {
              if(type == "locality") city = infoAdd.short_name;
            })
          });
          let addressInfo = addressResult.formatted_address;
	        let data = { 'address': addressInfo, 'city': city, 'lng': this.lng, 'lat': this.lat };

          //Alert popUp
          let alert = this.alertCtrl.create({
          title: "Right address ?",
          subTitle: addressInfo,
          buttons: [
            {
              text: 'No'
            },{
              text: 'Yes',
              handler: val => {
                this.viewCtrl.dismiss(data);
              }
            }]
          });
          alert.present();

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
        zoom: 13,
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

      let marker = this.marker;

      this.map.addListener('click', function(e){
        marker.setPosition(e.latLng);
      });

    }, (err) => {
      console.log(err);
      setTimeout(() => {
        this.loading.dismiss();
      });
    });
 
  }

  public placeMarkerAndPanTo(latLng, map) {
    console.log(this.marker);
    this.marker.setPosition(latLng);
    // var marker = new google.maps.Marker({
    //   position: latLng,
    //   map: map
    // });
    // map.panTo(latLng);
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  searchByKeyword(){
  	this.marker.setMap(null);
    console.log(this.searchedAddress);

  	this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+(this.searchedAddress).replace(/ /g, ",") ).subscribe((res)=>{
      if(res.status==200){
        if((res.json()).results[0]){
          let location = (res.json()).results[0].geometry.location;
          this.map.panTo(location);
          this.marker.setPosition(location);
          this.marker.setAnimation(google.maps.Animation.DROP);
          this.marker.setMap(this.map);
        }
        else{
          this.marker.setAnimation(google.maps.Animation.DROP);
          this.marker.setMap(this.map);
          console.log("No addresses found!");
        }
      }
    }, (err) => {
      console.log(err);
    });
  }
}

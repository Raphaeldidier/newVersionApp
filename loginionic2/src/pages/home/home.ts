import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { Geolocation } from 'ionic-native';
import { Http } from '@angular/http';

declare var google; 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  searchedAddress: any = '';
  loading: Loading;
  username = 'Raphaël DIDIER';
  email = '';
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  latLng: any;
  constructor(private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, public http: Http) {
    // let info = this.auth.getUserInfo();
    // this.username = info.name;
    // this.email = info.email;
  }

  ionViewDidLoad(){

    this.loadMap();
  }

  public loadMap(){
 
    this.showLoading();

    Geolocation.getCurrentPosition().then((position) => {
 
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: this.latLng,
        zoom: 13,
        zoomMax: 17,
        minZoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('dragend', this.makeQuery);

      this.map.addListener('zoom_changed', this.makeQuery);

      //setIcon
      var icon = {
        url: "assets/img/blue_dot.png", // url
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };

      //Set First Marker
       var posMarker = new google.maps.Marker({
        position: this.latLng,
        icon: icon,
        size: 5,
        map: this.map
      });

      posMarker.setMap(this.map);

      setTimeout(() => {
        this.loading.dismiss();
      }, 1000);

    }, (err) => {
      console.log(err);
    });
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
        this.nav.setRoot(LoginPage)
    });
  }

  public recenterMap(location){
    if(location)
      this.map.panTo(location);
    else
      this.map.panTo(this.latLng);
    this.makeQuery();

  }

  public makeQuery(){
    console.log("Query");
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  searchByKeyword(){
    this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+(this.searchedAddress).replace(/ /g, ",") ).subscribe((res)=>{
      if(res.status==200){
        if((res.json()).results[0])
        {
          let location = (res.json()).results[0].geometry.location;
          this.recenterMap(location);
        }
        else
          console.log("No addresses found!");
      }
    }, (err) => {
      console.log(err);
    });
  }
}
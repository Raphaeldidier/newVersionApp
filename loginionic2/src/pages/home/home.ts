import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { Geolocation } from 'ionic-native';

declare var google; 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  username = '';
  email = '';
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  latLng: any;
  constructor(private nav: NavController, private auth: AuthService) {
    // let info = this.auth.getUserInfo();
    // this.username = info.name;
    // this.email = info.email;
  }

  ionViewDidLoad(){

    this.loadMap();
  }

  loadMap(){
 
    Geolocation.getCurrentPosition().then((position) => {
 
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: this.latLng,
        zoom: 14,
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

    }, (err) => {
      console.log(err);
    });
 
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
        this.nav.setRoot(LoginPage)
    });
  }

  public recenterMap(){

    this.makeQuery();
    this.map.setCenter(this.latLng);

  }

  public makeQuery(){
    console.log("Query");
  }
}
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
  myInput: any = '';

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
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
    }, (err) => {
      console.log(err);
    });
 
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
        this.nav.setRoot(LoginPage)
    });
  }

  searchByKeyword(){
    console.log(this.myInput)
  }
}
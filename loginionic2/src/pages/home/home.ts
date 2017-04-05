import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, Loading, PopoverController, MenuController, Slides, Scroll } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { PositionService } from '../../providers/position-service';
import { RequestService } from '../../providers/request-service';
import { CustomPopOverComponent } from "../../components/custom-pop-over/custom-pop-over"
import { LoginPage } from '../login/login';
import { Geolocation } from 'ionic-native';
import { Http } from '@angular/http';
import { DIRECTION_VERTICAL } from "ionic-angular/gestures/hammer";
import { Gesture } from 'ionic-angular/gestures/gesture'

declare var google; 
declare var Hammer: any

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
  @ViewChild(Slides) slides: Slides;
    @ViewChild(Scroll) scroll: Scroll;
  map: any;
  eventsArray: Array<any> = [];
  markerArray: Array<any> = []; 
  bottomStyle: any = 0;
  topStyle: any = "none";
  scrollEnable: boolean = false;
  heightStyle: any = "100px";
  canGoDown: any = true;

  constructor(private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, public http: Http, 
    public popoverCtrl: PopoverController, public positionService: PositionService, public requestService: RequestService, private menu: MenuController) {
  
  }

  ionViewDidEnter() {

    //Set the vertical swipe of the bar
    let swipeElement = document.getElementById("swipeElement")
    let swipeGesture = new Gesture(swipeElement, {
      recognizers: [
        [Hammer.Swipe, {direction: Hammer.DIRECTION_VERTICAL}]
      ]
    });
    swipeGesture.listen();
    swipeGesture.on('swipeup', e => {
       this.heightStyle = "400px";
       this.scrollEnable = true;
    })
    swipeGesture.on('swipedown', e => {
       this.scrollEnable = false;
       this.heightStyle = "100px";
    })

    let swipeElementDiv = document.getElementById("swipeElementDiv")
    let swipeGestureDiv = new Gesture(swipeElementDiv, {
      recognizers: [
        [Hammer.Swipe, {direction: Hammer.DIRECTION_VERTICAL}]
      ]
    });
    swipeGestureDiv.listen();
    swipeGesture.on('swipeup', e => {
       this.scrollEnable = true;
       this.heightStyle = "400px";
    })
    swipeGestureDiv.on('swipedown', e => {
      if(this.canGoDown){
        this.scrollEnable = false;
        this.heightStyle = "100px";
      }
    })

    this.scroll.addScrollEventListener((event) => {
      if(event.target.scrollTop < 10)
        this.canGoDown = true;
      else
        this.canGoDown = false;
    });
  }

  ionViewDidLoad(){

    this.loadMap();

  }

  public loadMap(){
 
    this.showLoading();

    Geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      this.positionService.setPosition(latLng);
  
      let mapOptions = {
        center: latLng,
        zoom: 13,
        zoomMax: 17,
        minZoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        parent:this, //adding parent to access home page class inside google maps events
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('dragend', function(){
        this.parent.makeQuery(this.parent);
      });

      this.map.addListener('zoom_changed', function(){
        this.parent.makeQuery(this.parent);
      });

      //setIcon
      var icon = {
        url: "assets/img/blue_dot.png", // url
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };

      //Set First Marker
       var posMarker = new google.maps.Marker({
        position: latLng,
        icon: icon,
        size: 5,
        map: this.map
      });

      posMarker.setMap(this.map);

      setTimeout(() => {
        this.loading.dismiss();
        this.makeQuery(this);
      }, 2000);

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
      this.map.panTo(this.positionService.getPosition());
    this.makeQuery(this);

  }

  public makeQuery(that){

    // that.slides.update();

    let latNE = this.map.getBounds().getNorthEast().lat();
    let lngNE = this.map.getBounds().getNorthEast().lng();
    let latSW = this.map.getBounds().getSouthWest().lat();
    let lngSW = this.map.getBounds().getSouthWest().lng();

    // that.markerArray.forEach(elem => {
    //   elem.setMap(null);
    // });
    that.markerArray = [];
      

    that.requestService.getEventFromMap(latNE, lngNE, latSW, lngSW).subscribe(res => {

      let jsonRes = res.json();
      if (jsonRes.success) {
        console.log(jsonRes.events);
        that.eventsArray = [];
        jsonRes.events.forEach((event, index) => {
          // Setting markers for each event
          let marker = new google.maps.Marker({
              map: this.map,
              icon: {
                url: "assets/img/orange_dot.png",
                scaledSize: new google.maps.Size(50, 50)
              },
              // animation: google.maps.Animation.DROP,
              position: { lat: event.lat, lng: event.lng },
              draggable: false
            });
            that.markerArray.push(marker);
            that.eventsArray.push({event: event, addInfo: {avatarSource: this.requestService.getImageSource("avatars", event.category, event.subCategory)}});
            //for the slider
            marker.addListener('click', function() {
              let indexMarker = that.markerArray.indexOf(marker);
              that.slides.slideTo(indexMarker, 500);
            });
        });
      }
    }, err => {

    });
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

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(CustomPopOverComponent, {});

    popover.present({
      ev: ev
    });
  }
}
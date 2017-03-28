import { Component } from '@angular/core';
import { AppSettings } from '../../providers/app-settings';
import { AuthService } from '../../providers/auth-service';
import { MapModalPage } from '../../pages/map-modal/map-modal';
import { HomePage } from '../../pages/home/home';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController, Loading, ModalController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
  providers: [HomePage]
})
export class CreateEventPage {
  card: any;
  loading: Loading;
  currentUser : any;
  globalCategories: any;
  disableSubCategory: any;
  optionsListCat: Array<{ value: number, text: string }> = [];
  optionsListSubCat: Array<{ value: number, text: string }> = [];
  apiUrl = this.appSettings.getApiUrl();
  createEventVal = { languages: "", category: "", subCategory: "", priceNumber:0, date: new Date().toISOString(), 
  	time: new Date().toISOString(), address:"", lat: "", lng: "", currency:'', valid:false, name:"", spots:0};

  constructor(public navCtrl: NavController, public appSettings: AppSettings, public http: Http, public alertCtrl: AlertController, 
  	private loadingCtrl: LoadingController, public modalCtrl: ModalController, public homePage: HomePage, public auth: AuthService) {

    //get the User 
    this.currentUser = this.auth.getUserInfo();

  	//Custom card
  	this.setCustomCard();

  	//we disable the subCategory
    this.disableSubCategory = true;

    //Fetch the categories
    this.showLoading();
  	this.http.get(this.apiUrl + "categories").subscribe(res => {

      let jsonRes = res.json();
      if (jsonRes.success) {
      	//Parse them and add them in the Select
      	this.globalCategories = jsonRes.categories;
      	for(var i in jsonRes.categories)
  			  this.optionsListCat.push({ value: Number(i), text: jsonRes.categories[i].name });
      	
		    this.loading.dismiss();
      
      } else {
        this.showPopup("Error", "Categories could not be found, Please try later", false);
      }
    },
    error => {
      this.showPopup("Error", "Categories could not be found, Please try later", false);
    });
  }

  public showPopup(title, text, success){
  	let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
           { text: 'OK',
              handler: data => {
              if(success)
                this.navCtrl.popToRoot();
            }}]
    });
    alert.present();
  }

  public setCustomCard(){
  	
  	//Set the default values and fetch the images
  	let source = (this.createEventVal.category && this.createEventVal.subCategory) ?
  			"http://localhost:8080/images/"+this.createEventVal.category+"/"+this.createEventVal.subCategory+".jpg":
  			"http://localhost:8080/images/default.jpg"; 
  	let spotsLeft = (this.createEventVal.spots == 0)?1:this.createEventVal.spots;
  	let nameEvent = (this.createEventVal.name=="")?"Name of the event":this.createEventVal.name;
  	let addressEvent = (this.createEventVal.address=="")?"Address of the event":this.createEventVal.address;

  	this.card = {
  		source: source,
  		name: nameEvent,
  		address: addressEvent,
  		creator: this.currentUser.name,
  		date: this.createEventVal.date,
  		time: this.createEventVal.time,
  		totalNumberPlaces: spotsLeft,
  		daysLeft: "?d",
  		distance: "?km"
  	};
  }

  public createEvent(){
    console.log("creatingEvent");
    this.http.post(this.apiUrl + 'createEvent', this.formalizeEvent())
    .subscribe(res => {
      let jsonRes = res.json();
      if (jsonRes.success) {
        //Message
        this.showPopup("Success", "Event created!", true);
      }
    },
    error => {
      console.log(error);
    });
  }

  public changeCategory(){
  	this.createEventVal.subCategory = "";
  	this.optionsListSubCat = [];
  	for(var i in this.globalCategories[this.createEventVal.category].subCategories)
		this.optionsListSubCat.push({ value: Number(i), text: this.globalCategories[this.createEventVal.category].subCategories[i].name });
  	
  	//Other
	this.optionsListSubCat.push({ value: Number(i)+1, text: "Other" });

	//Enable the subCategory select
	this.disableSubCategory = false;
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

	public presentMapModal() {
    console.log("Before");
		let MapModal = this.modalCtrl.create(MapModalPage);
		MapModal.onDidDismiss(data => {
      console.log("After");
			this.createEventVal.address = data.address;
			this.createEventVal.lat = data.lat;
			this.createEventVal.lng = data.lng;
	    this.setCustomCard();
		});
		MapModal.present();
	}

  public formalizeEvent(){
    return {
      "_creator": this.currentUser.id,
      "name": this.createEventVal.name,
      "languages": this.createEventVal.languages,
      "category": Number(this.createEventVal.category),
      "subCategory": Number(this.createEventVal.subCategory),
      "priceNumber": this.createEventVal.priceNumber,
      "priceCurrency": this.createEventVal.currency,
      "date": this.createEventVal.date,
      "time": this.createEventVal.time,
      "address": this.createEventVal.address,
      "lat": this.createEventVal.lat,
      "lng": this.createEventVal.lng,
      "spotsMax": this.createEventVal.spots,
      "spotsLeft": this.createEventVal.spots,
    }
  }
}
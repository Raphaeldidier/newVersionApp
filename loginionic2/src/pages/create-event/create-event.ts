import { Component } from '@angular/core';
import { AppSettings } from '../../providers/app-settings';
import { MapModalPage } from '../../pages/map-modal/map-modal';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController, Loading, ModalController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html'
})
export class CreateEventPage {
  card: any;
  loading: Loading;
  globalCategories: any;
  disableSubCategory: any;
  optionsListCat: Array<{ value: number, text: string }> = [];
  optionsListSubCat: Array<{ value: number, text: string }> = [];
  apiUrl = this.appSettings.getApiUrl();
  createEventVal = { languages: "", category: "", subCategory: "", priceNumber:0, date: new Date().toISOString(), 
  	time: new Date().toISOString(), address:"", lat: "", lng: "", valid:false, name:""};

  constructor(public navCtrl: NavController, public appSettings: AppSettings, public http: Http, public alertCtrl: AlertController, 
  	private loadingCtrl: LoadingController, public modalCtrl: ModalController) {
  	
  	//Custom card
  	this.setCustomCard();

  	//we disable the subCategory
    this.disableSubCategory = true;

    //Fetch the categories
    this.showLoading();
  	this.http.get(this.apiUrl + "/categories").subscribe(res => {

      let jsonRes = res.json();
      if (jsonRes.success) {
      	//Parse them and add them in the Select
      	this.globalCategories = jsonRes.categories;
      	for(var i in jsonRes.categories){
  			this.optionsListCat.push({ value: Number(i), text: jsonRes.categories[i].name });
      	}
		 setTimeout(() => {
			  this.loading.dismiss();
		  });
      } else {
        this.showPopup("Error", "Categories could not be found, Please try later");
      }
    },
    error => {
      this.showPopup("Error", "Categories could not be found, Please try later");
    });
  }

  public showPopup(title, text){
  	let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
       {
         text: 'OK'
       }
     ]
    });
    alert.present();
  }

  public setCustomCard(){
  	console.log(this.createEventVal.name);
  	this.card = {
  		// source: "assets/img/bandeaux/pelouse.jpg",
  		name: this.createEventVal.name,
  		// address: this.createEventVal.address,
  		// creator: "Raphael"
  	};
  }

  public createEvent(){

  }

  public changeCategory(){
  	this.createEventVal.subCategory = "";
  	this.optionsListSubCat = [];
  	for(var i in this.globalCategories[this.createEventVal.category].subCategories)
		this.optionsListSubCat.push({ value: Number(i), text: this.globalCategories[this.createEventVal.category].subCategories[i].name });
  	
  	//Other
	this.optionsListSubCat.push({ value: Number(i+1), text: "Other" });

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
		let MapModal = this.modalCtrl.create(MapModalPage);
		MapModal.onDidDismiss(data => {
			this.createEventVal.address = data.address;
			this.createEventVal.lat = data.lat;
			this.createEventVal.lng = data.lng;
		});
		MapModal.present();
	}
}
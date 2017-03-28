import { Component } from '@angular/core';
import { AppSettings } from '../../providers/app-settings';
import { Http } from '@angular/http';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'custom-pop-over',
  templateUrl: 'custom-pop-over.html'
})
export class CustomPopOverComponent {

  apiUrl = this.appSettings.getApiUrl();
  optionsListCat: Array<{ value: number, text: string }> = [];
  text: string;
  filters = { categories: "" };

  constructor(public appSettings: AppSettings, public http: Http, public viewCtrl: ViewController) {

    this.http.get(this.apiUrl + "categories").subscribe(res => {

      let jsonRes = res.json();
      console.log(jsonRes);
      if (jsonRes.success) {
        //Parse them and add them in the Select
        for(var i in jsonRes.categories){
          this.optionsListCat.push({ value: Number(i), text: jsonRes.categories[i].name });
        }
      
      } else {
        console.log("Error");
      }
    },
    error => {
      console.log(error);
    });
  }

  public triggerFilter(){
    console.log(this.filters);
     // this.viewCtrl.dismiss();
  }

  public closeFilter(){
     this.viewCtrl.dismiss();
  }
}

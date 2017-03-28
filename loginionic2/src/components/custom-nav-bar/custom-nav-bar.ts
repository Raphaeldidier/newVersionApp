import { Component } from '@angular/core';
import { HomePage } from '../../pages/home/home';
import { Http } from '@angular/http';

@Component({
  selector: 'custom-nav-bar',
  templateUrl: 'custom-nav-bar.html',
  providers: [HomePage]
})
export class CustomNavBarComponent {

  searchedAddress: any = '';

  constructor(public homePage: HomePage, public http: Http) {
  }

  searchByKeyword(){
  	this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+(this.searchedAddress).replace(/ /g, ",") ).subscribe((res)=>{
      if(res.status==200){
        let location = (res.json()).results[0].geometry.location;
        this.homePage.recenterMap(location);
      }
    }, (err) => {
      console.log(err);
    });
  }
}

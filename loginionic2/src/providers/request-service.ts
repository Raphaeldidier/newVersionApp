import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { AppSettings } from './app-settings';

const CONFIG = {
  rootPath: 'http://localhost:8080/images/',
}; 

@Injectable()
export class RequestService {
 
  constructor(public http: Http, public appSettings: AppSettings) {
  }

  	public getImageSource(category, subCategory){
  		//Check if we set the category + sub
  		return (category.length!=0 && subCategory.length!=0) ?
			CONFIG.rootPath+category+"/"+subCategory+".jpg":
			CONFIG.rootPath+"default.jpg"; 
  	}

  	public getEventFromMap(latNE, lngNE, latSW, lngSW){
  		
  		let params = new URLSearchParams();
  		params.append('latNE', latNE.toString());
  		params.append('lngNE', lngNE.toString());
  		params.append('latSW', latSW.toString());
  		params.append('lngSW', lngSW.toString());

	    let options = new RequestOptions({
      		search: params
    	});

	      // return this.http.request(new Request(options));

  		return this.http.get(this.appSettings.getApiUrl() + "mapEvents", options);
  	}

  	public getRootPath() {
   		return CONFIG.rootPath;
  	}
}
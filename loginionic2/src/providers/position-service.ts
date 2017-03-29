import { Injectable } from '@angular/core';
  
@Injectable()
export class PositionService {
 
	latLng: any;

	constructor() {

	}

	public setPosition(latLng){
		this.latLng = latLng;
	}

	public getPosition(){
		return this.latLng;
	}

	public getDistanceFromPosInKm(lat1,lon1) {

		let latLng = this.latLng;
		let lat2 = latLng.lat();
		let lon2 = latLng.lng();

		let R = 6371; // Radius of the earth in km
		let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
		let dLon = this.deg2rad(lon2-lon1); 
		let a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
			Math.sin(dLon/2) * Math.sin(dLon/2)
			; 
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		let d = R * c; // Distance in km
		
		if(d>=2)
			return Math.round(d)+" km";
		if(d>1)
			return Math.round(d*10)/10 +" km";
		else
			return Math.round(d*10)*100 + " m";
	}

	public deg2rad(deg) {
  		return deg * (Math.PI/180)
	}
  
}
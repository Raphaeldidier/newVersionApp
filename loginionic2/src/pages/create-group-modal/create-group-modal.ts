import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-create-group-modal',
  templateUrl: 'create-group-modal.html'
})
export class CreateGroupModalPage {

	selected = "";
	name = "";

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
	 public alertCtrl: AlertController) {
		let group = navParams.get('group');
		if(group != null){
			this.selected = group.color;
			this.name = group.name;
		}
	}

	dismissModal(){
		this.viewCtrl.dismiss({});
	}

	createGroup(){
		if(this.name == ""){
			let alert = this.alertCtrl.create({
			    title: 'Name missing!',
			    subTitle: "Make sure you insert your group's name",
			    buttons: ['Ok']
		  	});
		  	alert.present();
		}
		else{
			if(this.selected == ""){
				let alert = this.alertCtrl.create({
				    title: 'Color missing!',
				    subTitle: "Make sure you insert your group's color",
				    buttons: ['Ok']
			  	});
			  	alert.present();
		  	}
		  	else
				this.viewCtrl.dismiss({ success:true, name: this.name, color: this.selected });
		}
	}

	changeColor(color){
		console.log(color);
		this.selected = color;
	}
}


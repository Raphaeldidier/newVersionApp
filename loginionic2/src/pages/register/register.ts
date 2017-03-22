import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
 
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = {
    name: '', 
    email: '', 
    password: '', 
    birthdate: '1995-03-20'
  };
 
  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController) {}
 
  public register() {
    this.auth.register(this.registerCredentials).subscribe(res => {
      let jsonRes = res.json();
      if (jsonRes.success) {
        this.createSuccess = true;
        this.showPopup("Success", jsonRes.msg);
      } else {
        this.showPopup("Error", jsonRes.msg);
      }
    },
    error => {
      this.showPopup("Error", error);
    });
  }
 
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
       {
         text: 'OK',
         handler: data => {
           if (this.createSuccess) {
             this.nav.popToRoot();
           }
         }
       }
     ]
    });
    alert.present();
  }
}
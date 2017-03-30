import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService, User} from '../../providers/auth-service';
import { TokenAuth } from '../../providers/token-auth';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

declare const facebookConnectPlugin: any;
 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;
  FB_APP_ID: number = 1845335775720420;
  registerCredentials = {email: 'raphael@raphael.com', password: 'Raphael'};
 
  constructor(private nav: NavController, private auth: AuthService, public platform: Platform, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public tokenAuth: TokenAuth) {
  }
 
  public createAccount() {
    this.nav.push(RegisterPage);
  }
 
  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(res => {
      let jsonRes = res.json();
      console.log(jsonRes);
      if (jsonRes.success) {
        this.auth.currentUser = new User(jsonRes.user._id, jsonRes.user.name, jsonRes.user.email, jsonRes.user.email, jsonRes.user.groups);

        setTimeout(() => {
          this.loading.dismiss();
          this.nav.setRoot(TabsPage);
        });
      } else {
        this.showError(jsonRes.msg);
      }
    },
    error => {
      this.showError(error);
    });
  }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
 
  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  fbLogin(){

    this.platform.ready().then(() => {

        console.log('Connecting to Fb');

        facebookConnectPlugin.login(["email"], function(result) {
            let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: JSON.stringify(result),
            buttons: ['OK']
            });
            alert.present(prompt);
        }, function(error){
            let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: error,
            buttons: ['OK']
          });
          alert.present(prompt);
        })
       
     })

    } 
}
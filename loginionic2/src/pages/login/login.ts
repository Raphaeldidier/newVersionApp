import { Component } from '@angular/core';
import { Facebook } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService, User} from '../../providers/auth-service';
import { TokenAuth } from '../../providers/token-auth';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;
  FB_APP_ID: number = 1845335775720420;
  registerCredentials = {name:'', email: '', password: ''};
 
  constructor(private nav: NavController, private auth: AuthService, public platform: Platform, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public tokenAuth: TokenAuth) {
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
  }
 
  public createAccount() {
    this.nav.push(RegisterPage);
  }
 
  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(res => {
      let jsonRes = res.json();
      if (jsonRes.success) {
        this.auth.currentUser = new User(jsonRes.user.name, jsonRes.user.email);
        //Todo TOKENS
        // this.tokenAuth.storeUserCredentials(body.token);
        // this.tokenAuth.loadUserCredentials();

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
      Facebook.login(["email"]).then((result) => {
        let alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: JSON.stringify(result),
        buttons: ['OK']
        });
        alert.present(prompt);
      }, error =>{
          let alert = this.alertCtrl.create({
          title: 'Fail',
          subTitle: error,
          buttons: ['OK']
        });
        alert.present(prompt);
      })
    })

    // Facebook.login(['email'], function(response){
    //     let alert = this.alertCtrl.create({
    //     title: 'Success',
    //     subTitle: JSON.stringify(response.authResponse),
    //     buttons: ['OK']
    //   });
    //   alert.present(prompt);
    // }, function (error){
    //   let alert = this.alertCtrl.create({
    //   title: 'Fail',
    //   subTitle: error,
    //   buttons: ['OK']
    // });
    // alert.present(prompt);
    // })

    // console.log("facebook");

    // let permissions = new Array();
    // //the permissions your facebook app needs from the user
    // permissions = ["public_profile"];


    // Facebook.login(permissions)
    // .then(function(response){
    //   let userId = response.authResponse.userID;
    //   let params = new Array();

    //   //Getting name and gender properties
    //   Facebook.api("/me?fields=name,gender", params)
    //   .then(function(user) {
    //     user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
    //     //now we have the users info, let's save it in the NativeStorage
    //     NativeStorage.setItem('user',
    //     {
    //       name: user.name,
    //       gender: user.gender,
    //       picture: user.picture
    //     })
    //     .then(function(){
    //       this.nav.setRoot(TabsPage);
    //     }, function (error) {
    //       console.log(error);
    //     })
    //   })
    // }, function(error){
    //   console.log(error);
    // });
  }
}
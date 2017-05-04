import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading,
 AlertController } from 'ionic-angular';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { AuthService } from '../../providers/auth-service';
// import { Camera, CameraOptions } from '@ionic-native/camera';
// import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File, FilePath } from 'ionic-native';
 
declare var cordova: any;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  // providers: [Transfer,Camera]
})
export class RegisterPage {
  createSuccess = false;
  loading:any;

  registerCredentials = {
    name: '', 
    email: '', 
    password: '', 
    birthdate: '1995-03-20'
  };

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, 
    public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform,
    public loadingCtrl: LoadingController, 
    // public http: Http, private transfer: Transfer,private camera: Camera
    ) {

  }
 
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

  // upload()
  //   {
      
  //      let options = {

  //          quality: 100
  //           };


  //     this.camera.getPicture(options).then((imageData) => {
  //      // imageData is either a base64 encoded string or a file URI
  //      // If it's base64:

  //    const fileTransfer: TransferObject = this.transfer.create();

  //     let options1: FileUploadOptions = {
  //        fileKey: 'file',
  //        fileName: 'name.jpg',
  //        headers: {}
      
  //     }

  //   fileTransfer.upload(imageData, 'https://venews-app.herokuapp.com/api/v1/upload', options1)
  //    .then((data) => {
  //      // success
  //      alert("success");
  //    }, (err) => {
  //      // error
  //      alert("error"+JSON.stringify(err));
  //    });


  //   });
  // }




 
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
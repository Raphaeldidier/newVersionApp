import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading,
 AlertController } from 'ionic-angular';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { AuthService } from '../../providers/auth-service';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
 
declare var cordova: any;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  createSuccess = false;
  loading:any;
  imageChosen: any = 0;
  lastImage: any;
  imagePath: any;
  imageNewPath: any;

  registerCredentials = {
    name: '', 
    email: '', 
    password: '', 
    birthdate: '1995-03-20'
  };

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, 
    public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform,
    public loadingCtrl: LoadingController, public http: Http) {

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

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }


  uploadPhoto() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
 
    let filename = this.imagePath.split('/').pop();
    let options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpg",
      params: { 'test':'test' }
    };

     // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
 
    const fileTransfer = new Transfer();
  
    fileTransfer.upload(targetPath, 'https://venews-app.herokuapp.com/api/v1/upload',
      options).then((entry) => {
        this.imagePath = '';
        this.imageChosen = 0;
        loader.dismiss();
      }, (err) => {
        alert(JSON.stringify(err));
      });
  }
 
  chooseImage() {
 
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Picture Source',
      buttons: [
        {
          text: 'Gallery',
          icon: 'albums',
          handler: () => {
            this.actionHandler(1, Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.actionHandler(2, Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }
 
 
  actionHandler(selection: any, sourceType) {
    var options: any;
 
    if (selection == 1) {
      options = {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };
    } else {
      options = {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };
    }

    Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        FilePath.resolveNativePath(imagePath)
        .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      alert('Error while selecting image.');
    });
  }

  createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
   
  // Copy the image to a local folder
  copyFileToLocalDir(namePath, currentName, newFileName) {
    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      alert(newFileName);
      this.lastImage = newFileName;
    }, error => {
      alert('Error while storing file.');
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
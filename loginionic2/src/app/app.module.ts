import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ListPage } from '../pages/list/list';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../providers/auth-service';
import { AppSettings } from './../providers/app-settings';
import { TokenAuth } from './../providers/token-auth';
import { Facebook } from '@ionic-native/facebook';
import { DatePipe } from '@angular/common';
import { CustomNavBarComponent } from './../components/custom-nav-bar/custom-nav-bar';
 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ListPage,
    TabsPage,
    CustomNavBarComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ListPage,
    TabsPage
  ],
  providers: [AuthService, AppSettings, TokenAuth, Facebook, DatePipe]
})
export class AppModule {}
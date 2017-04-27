import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ListPage } from '../pages/list/list';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';
import { CreateEventPage } from '../pages/create-event/create-event';
import { ProfilePage } from '../pages/profile/profile';
import { GroupsPage } from '../pages/groups/groups';
import { MapModalPage } from '../pages/map-modal/map-modal';
import { MyEventsPage } from '../pages/my-events/my-events';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { CreateGroupModalPage } from '../pages/create-group-modal/create-group-modal';
import { ManageGroupPage } from '../pages/manage-group/manage-group';
import { AddUserModalPage } from '../pages/add-user-modal/add-user-modal';
import { AddUserGroupModalPage } from '../pages/add-user-group-modal/add-user-group-modal';
import { PendingInvitesModalPage } from '../pages/pending-invites-modal/pending-invites-modal';
import { AuthService } from '../providers/auth-service';
import { AppSettings } from './../providers/app-settings';
import { PositionService } from './../providers/position-service';
import { RequestService } from './../providers/request-service';
import { TokenAuth } from './../providers/token-auth';
import { Facebook } from '@ionic-native/facebook';
import { DatePipe } from '@angular/common';
import { CustomPopOverComponent } from './../components/custom-pop-over/custom-pop-over';
import { CustomCardComponent } from './../components/custom-card/custom-card';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ListPage,
    TabsPage,
    SettingsPage,
    ProfilePage,
    CreateEventPage,
    MapModalPage,
    GroupsPage,
    MyEventsPage,
    CreateGroupModalPage,
    ManageGroupPage,
    AddUserModalPage,
    AddUserGroupModalPage,
    PendingInvitesModalPage,
    EventDetailsPage,
    CustomPopOverComponent,
    CustomCardComponent
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
    TabsPage,
    SettingsPage,
    ProfilePage,
    CreateEventPage,
    MapModalPage,
    GroupsPage,
    MyEventsPage,
    CreateGroupModalPage,
    ManageGroupPage,
    AddUserModalPage,
    AddUserGroupModalPage,
    PendingInvitesModalPage,
    EventDetailsPage,
    CustomPopOverComponent,
    CustomCardComponent
  ],
  providers: [AuthService, AppSettings, TokenAuth, PositionService, RequestService, Facebook, DatePipe]
})
export class AppModule {}
import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ListPage } from '../list/list';
import { SettingsPage } from '../settings/settings';
import { GroupsPage } from '../groups/groups';
import { MyEventsPage } from '../my-events/my-events';
 
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
 
  groupsPage: any = GroupsPage;
  myEventsPage: any = MyEventsPage;
  mapPage: any = HomePage;
  listPage: any = ListPage;
  settingsPage: any = SettingsPage;
 
  constructor(){
 
  }
 
}
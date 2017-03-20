import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
 
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
 
  tab1Root: any = HomePage;
  tab2Root: any = ProfilePage;
 
  constructor(){
 
  }
 
}
import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ListPage } from '../list/list';
 
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
 
  tab1Root: any = HomePage;
  tab2Root: any = ListPage;
 
  constructor(){
 
  }
 
}
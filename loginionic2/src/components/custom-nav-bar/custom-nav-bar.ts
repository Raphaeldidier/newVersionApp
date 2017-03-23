import { Component } from '@angular/core';

@Component({
  selector: 'custom-nav-bar',
  templateUrl: 'custom-nav-bar.html'
})
export class CustomNavBarComponent {

  myInput: any = '';

  constructor() {
  }

  searchByKeyword(){
    console.log(this.myInput)
  }
}

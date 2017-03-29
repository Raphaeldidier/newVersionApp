import { Component, Input } from '@angular/core';


@Component({
  selector: 'custom-card',
  templateUrl: 'custom-card.html'
})
export class CustomCardComponent {

  @Input('card') cardToUse;
  card: String;

  constructor() {
    this.card = "";
  }

  ngAfterViewInit(){
    this.card = this.cardToUse;

  }
}

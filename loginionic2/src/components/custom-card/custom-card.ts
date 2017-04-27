import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Nav } from 'ionic-angular';


@Component({
  selector: 'custom-card',
  templateUrl: 'custom-card.html'
})
export class CustomCardComponent {

  @Input('card') cardToUse;
  @Output() clicked = new EventEmitter();

  card: String;

  constructor(private nav: Nav) {
    this.card = "";
  }

  ngAfterViewInit(){
    this.card = this.cardToUse;
    setInterval(() => {
      this.clicked.emit()
    }, 3000);
  }
}

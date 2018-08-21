import { OnInit, Output, EventEmitter } from '@angular/core';

export abstract class RepresentedOnMapComponent implements OnInit {

  @Output() removePoint: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}

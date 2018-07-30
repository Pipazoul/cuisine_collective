import { Component, OnInit, ViewChild } from '@angular/core';
import { CarouselComponent } from '../../carousel/carousel.component';

@Component({
  selector: 'app-add-element',
  templateUrl: './add-element.component.html',
  styleUrls: ['./add-element.component.css']
})
export class AddElementComponent implements OnInit {

  @ViewChild('carousel') public carousel: CarouselComponent;

  constructor() { }

  ngOnInit() {
  }

  public showCreateEvent() {
    this.carousel.goTo(1);
  }

}

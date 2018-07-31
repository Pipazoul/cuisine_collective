import { Component, OnInit, ViewChild } from '@angular/core';
import { CarouselComponent } from '../../carousel/carousel.component';
import { EventClass } from '../../../domain/event.class';

@Component({
  selector: 'app-add-element',
  templateUrl: './add-element.component.html',
  styleUrls: ['./add-element.component.css']
})
export class AddElementComponent implements OnInit {

  @ViewChild('carousel') public carousel: CarouselComponent;
  public sidenavTitle: string = 'Ajouter un élément sur la carte';
  public event: EventClass = new EventClass();

  constructor() { }

  ngOnInit() {
  }

  public showCreateEvent() {
    this.sidenavTitle = 'Créer un évènement';
    this.carousel.goTo(1);
  }

}

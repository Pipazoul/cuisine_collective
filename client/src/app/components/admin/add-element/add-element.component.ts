import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Components
import { CarouselComponent } from '../../carousel/carousel.component';

// Classes
import { EventClass } from '../../../domain/event.class';
import { ContributorClass } from '../../../domain/contributor.class';

@Component({
  selector: 'app-add-element',
  templateUrl: './add-element.component.html',
  styleUrls: ['./add-element.component.css']
})
export class AddElementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  /*public showCreateEvent() {
    this.showContributor = false;
    this.carousel.next();
  }

  public showCreateContributor() {
    this.showEvent = false;
    this.sidenavTitle = ;
    this.carousel.next();
  }*/
}

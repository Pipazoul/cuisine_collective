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

  @ViewChild('carousel') public carousel: CarouselComponent;
  public sidenavTitle: string = 'Ajouter un élément sur la carte';
  public event: EventClass = new EventClass();
  public contributor: ContributorClass = new ContributorClass();
  public showEvent: boolean = true;
  public showContributor: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public showCreateEvent() {
    this.showContributor = false;
    this.sidenavTitle = 'Créer un évènement';
    this.carousel.next();
  }

  public showCreateContributor() {
    this.showEvent = false;
    this.sidenavTitle = 'Créer un contributeur';
    this.carousel.next();
  }

  public endCarousel() {
    this.router.navigate(['/admin']);
  }
}

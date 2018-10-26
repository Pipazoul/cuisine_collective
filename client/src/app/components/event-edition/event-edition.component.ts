import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EventClass } from '../../domain/event.class';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { forkJoin } from 'rxjs';
import { ContributorClass } from '../../domain/contributor.class';
import { RepresentedOnMapComponent } from '../base/represented-on-map/represented-on-map.component';

@Component({
  selector: 'app-event-edition',
  templateUrl: './event-edition.component.html',
  styleUrls: ['./event-edition.component.css']
})
export class EventEditionComponent extends RepresentedOnMapComponent  implements OnInit {

  public event: EventClass;
  public saved: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {
    super();
    if (!this.route.snapshot.params['id']) {
      this.event = new EventClass();
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params['id']) {
        return;
      }
      this.loadEventAndContributors(params['id']);
    });
  }

  private loadEventAndContributors(eventId: number) {
    forkJoin(
      this.eventService.getById(eventId),
      this.eventService.getContributorsAssistants(eventId),
      this.eventService.getContributorsFood(eventId),
      this.eventService.getContributorsLocation(eventId),
      this.eventService.getContributorsPeople(eventId),
      this.eventService.getContributorsSkills(eventId),
    ).subscribe(([event, assistants, food, location, people, skills]: [EventClass, ContributorClass[], ContributorClass[], ContributorClass[], ContributorClass[], ContributorClass[]]) => {
      event.contributorsAssistants = assistants;
      event.contributorsFood = food;
      event.contributorsLocation = location;
      event.contributorsPeople = people;
      event.contributorsSkills = skills;
      this.event = event;
    });
  }

  public endCarousel(event: EventClass) {
    this.eventService.eventPublishStatusChanged.next(event);
    this.router.navigate(['/admin']);
    this.saved = true;
  }

  deleteEvent(eventId) {
    this.eventService.delete(eventId).subscribe(res => {
      this.removePoint.emit({type: EventClass, id: eventId});
      this.router.navigate(['/admin']);
    }, err => {
      console.error(err);
    })
  }

}

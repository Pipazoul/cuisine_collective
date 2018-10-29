import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventClass } from '../../domain/event.class';
import { AuthenticationService } from '../../services/authentication.service';
import { RepresentedOnMapComponent } from '../base/represented-on-map/represented-on-map.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends RepresentedOnMapComponent  implements OnInit {

  event: EventClass;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    public authService: AuthenticationService) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventService.getById(params['id']).subscribe(event => {
        this.event = event;
      })
    });
  }

  deleteEvent(eventId) {
    this.eventService.delete(eventId).subscribe(res => {
      this.removePoint.emit({type: EventClass, id: eventId});
      this.router.navigate(['/admin']);
    })
  }

  modifyEvent(eventId) {
    this.router.navigate(['admin', 'events', eventId, 'edit']);
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-location-type',
  templateUrl: './event-location-type.component.html',
  styleUrls: ['./event-location-type.component.css']
})
export class EventLocationTypeComponent extends AbstractEventModifier implements OnInit {

  constructor(@Inject(EventService) eventService: EventService) {
    super(eventService);
  }

  ngOnInit() {
  }

  public saveLocation() {
    this.saveEvent(this.event);
  }

}

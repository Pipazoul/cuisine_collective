import { Component, OnInit, Input, EventEmitter, Output, Inject } from '@angular/core';
import { EventClass } from '../../../domain/event.class';
import { EventService } from '../../../services/event.service';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';

@Component({
  selector: 'app-event-planning',
  templateUrl: './event-planning.component.html',
  styleUrls: ['./event-planning.component.css']
})
export class EventPlanningComponent extends AbstractEventModifier implements OnInit {

  public readonly minDate: Date = new Date();

  constructor(@Inject(EventService) eventService: EventService) {
    super(eventService);
  }

  ngOnInit() {
  }

  public savePlanning() {
    this.saveEvent(this.event);
  }

}

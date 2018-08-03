import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { OccurenceType } from '../../../enum/occurence-type.enum';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-event-planning',
  templateUrl: './event-planning.component.html',
  styleUrls: ['./event-planning.component.css']
})
export class EventPlanningComponent extends AbstractEventModifier implements OnInit, OnChanges {

  public readonly OccurenceType = OccurenceType;
  public readonly minDate: Date = new Date();
  public eventPlanningForm: FormGroup;

  constructor(@Inject(EventService) eventService: EventService) {
    super(eventService);
  }

  ngOnInit() {
    this.initForm();
  }
  
  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    this.eventPlanningForm = new FormGroup({
      'dateStart': new FormControl(this.event.dateStart),
      'dateEnd': new FormControl(this.event.dateEnd),
      'occurenceType': new FormControl(this.event.occurenceType)
    });
  }

  public submitForm(value, goBack: boolean = false) {
    Object.assign(this.event, value);
    this.saveEvent(this.event, goBack);
  }

}

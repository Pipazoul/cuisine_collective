import { Component, OnInit, Inject } from '@angular/core';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { EventService } from '../../../services/event.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-event-missing',
  templateUrl: './event-missing.component.html',
  styleUrls: ['./event-missing.component.css']
})
export class EventMissingComponent extends AbstractEventModifier implements OnInit {

  public eventMissingForm: FormGroup;

  constructor(@Inject(EventService) eventService: EventService) {
    super(eventService);
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.eventMissingForm = new FormGroup({
      'partnerInformations': new FormControl(this.event.partnerInformations),
      'missingLocation': new FormControl(this.event.missingLocation),
      'missingFood': new FormControl(this.event.missingFood),
      'missingSkills': new FormControl(this.event.missingSkills),
      'missingPeople': new FormControl(this.event.missingPeople),
      'missingAssistants': new FormControl(this.event.missingAssistants)
    });
  }

  public submitForm(value) {
    Object.assign(this.event, value);
    this.saveEvent(this.event);
  }

}

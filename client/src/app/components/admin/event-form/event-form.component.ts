import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomRegExp } from '../../../util/CustomRegExp';
import { EventService } from '../../../services/event.service';
import { EventClass } from '../../../domain/event.class';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent extends AbstractEventModifier implements OnInit {

  public eventForm: FormGroup;

  constructor(@Inject(EventService) eventService: EventService) {
    super(eventService);
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.eventForm = new FormGroup({
      'name': new FormControl(this.event.name, Validators.required),
      'description': new FormControl(this.event.description),
      'participantsAmount': new FormControl(this.event.participantsAmount, [Validators.min(1), Validators.max(1000)]),
      'datetime': new FormControl(this.event.datetime),
      'planner': new FormControl(this.event.planner),
      'referent': new FormControl(this.event.referent),
      'email': new FormControl(this.event.email, Validators.email),
      'phone': new FormControl(this.event.phone, Validators.pattern(CustomRegExp.PHONE)),
      'url': new FormControl(this.event.url, Validators.pattern(CustomRegExp.URL)),
    });
  }

  public submitForm(value) {
    this.saveEvent(new EventClass(value));
  }

}

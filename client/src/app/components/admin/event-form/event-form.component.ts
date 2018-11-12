import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomRegExp } from '../../../util/CustomRegExp';
import { EventService } from '../../../services/event.service';
import { EventClass } from '../../../domain/event.class';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent extends AbstractEventModifier implements OnInit, OnChanges {

  public eventForm: FormGroup;

  constructor(@Inject(EventService) eventService: EventService,
    @Inject(AuthenticationService) authenticationService: AuthenticationService,
    @Inject(NotificationsService) notificationsService: NotificationsService) {
    super(eventService, authenticationService, notificationsService);
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    this.eventForm = new FormGroup({
      'name': new FormControl(this.event.name, Validators.required),
      'description': new FormControl(this.event.description),
      'participantsAmount': new FormControl(this.event.participantsAmount, [Validators.min(1), Validators.max(1000)]),
      'inscription': new FormControl(this.event.inscription),
      'timeSlot': new FormControl(this.event.timeSlot),
      'planner': new FormControl(this.event.planner),
      'referent': new FormControl(this.event.referent),
      'email': new FormControl(this.event.email, Validators.email),
      'phone': new FormControl(this.event.phone),
      'url': new FormControl(this.event.url, Validators.pattern(CustomRegExp.URL)),
    });
  }

  public submitForm(value) {
    Object.assign(this.event, value);
    this.saveEvent(this.event).subscribe();
  }

}

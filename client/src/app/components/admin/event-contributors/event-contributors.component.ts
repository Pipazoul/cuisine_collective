import { Component, OnInit, Inject } from '@angular/core';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { EventService } from '../../../services/event.service';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-contributors',
  templateUrl: './event-contributors.component.html',
  styleUrls: ['./event-contributors.component.css']
})
export class EventContributorsComponent extends AbstractEventModifier implements OnInit {

  public eventContributorsForm: FormGroup;

  constructor(@Inject(EventService) eventService: EventService) {
    super(eventService);
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.eventContributorsForm = new FormGroup({
      'contributors': new FormArray(this.event.contributors.map(c => new FormControl(c, Validators.required)))
    });
  }

  public submitForm(value) {
    // TODO
  }

}

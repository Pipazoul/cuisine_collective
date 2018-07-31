import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomRegExp } from '../../../util/CustomRegExp';
import { EventService } from '../../../services/event.service';
import { EventClass } from '../../../domain/event.class';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {

  @Input() public event: EventClass;
  public eventForm: FormGroup;

  constructor(private eventService: EventService) { }

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
    if (!this.event.id) {
      this.eventService.create(new EventClass(value)).subscribe(
        (event) => Object.assign(this.event, event)
      );
    } else {
      this.eventService.update(new EventClass(value)).subscribe(
        (event) => Object.assign(this.event, event)
      )
    }
  }

}

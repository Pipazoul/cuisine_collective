import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomRegExp } from '../../../util/CustomRegExp';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {

  public eventForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.eventForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'description': new FormControl(''),
      'participantsAmount': new FormControl('', [Validators.min(1), Validators.max(1000)]),
      'datetime': new FormControl(''),
      'planner': new FormControl(''),
      'referent': new FormControl(''),
      'email': new FormControl('', Validators.email),
      'phone': new FormControl('', Validators.pattern(CustomRegExp.PHONE)),
      'url': new FormControl('', Validators.pattern(CustomRegExp.URL)),
    });
  }

}

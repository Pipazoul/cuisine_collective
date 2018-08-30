import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { OccurenceType } from '../../../enum/occurence-type.enum';
import { FormGroup, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'app-event-planning',
  templateUrl: './event-planning.component.html',
  styleUrls: ['./event-planning.component.css']
})
export class EventPlanningComponent extends AbstractEventModifier implements OnInit, OnChanges {

  public readonly OccurenceType = OccurenceType;
  public readonly minDate: Date = new Date();
  public oneDateForm: FormGroup;
  public serveralDatesForm: FormGroup;
  public dateRangeForm: FormGroup;
  public submitForm: Function;

  constructor(@Inject(EventService) eventService: EventService) {
    super(eventService);
  }

  ngOnInit() {
    this.initForms();
  }

  ngOnChanges() {
    this.initForms();
  }

  private initForms() {
    this.oneDateForm = new FormGroup({
      'dateStart': new FormControl(this.event.dateStart),
      'dateEnd': new FormControl(this.event.dateEnd),
      'weekDays': new FormControl({}),
      'radioGroup': new FormControl(),
      'occurenceType': new FormControl(this.event.occurenceType)
    });

    this.dateRangeForm = new FormGroup({
      'dateStart': new FormControl(this.event.dateStart),
      'dateEnd': new FormControl(this.event.dateEnd)
    });

    this.oneDateForm.disable();
    this.dateRangeForm.disable();
  }

  /*public submitForm(goBack: boolean = false) {
    Object.assign(this.event, value);
    this.saveEvent(this.event, goBack);
  }*/

  selectionTypeChanged(event: MatRadioChange) {
    if (event.value === 1) {
      this.oneDateForm.enable();
      //this.serveralDatesForm.disable();
      this.dateRangeForm.disable();
      this.submitForm = (goBack: boolean = false) => {
        Object.assign(this.event, {
          startDate: this.oneDateForm.value.startDate,
          endDate: this.oneDateForm.value.endDate,
          monday: this.oneDateForm.value.weekDays['MONDAY'],
          tuesday: this.oneDateForm.value.weekDays['TUESDAY'],
          wednesday: this.oneDateForm.value.weekDays['WEDNESDAY'],
          thursday: this.oneDateForm.value.weekDays['THURSDAY'],
          friday: this.oneDateForm.value.weekDays['FRIDAY'],
          saturday: this.oneDateForm.value.weekDays['SATURDAY'],
          sunday: this.oneDateForm.value.weekDays['SUNDAY'],
        });
        this.saveEvent(this.event, goBack);
      }
    }
    else if (event.value === 2) {
      this.oneDateForm.disable();
      //this.serveralDatesForm.enable();
      this.dateRangeForm.disable();
    }
    else if (event.value === 3) {
      this.oneDateForm.disable();
      //this.serveralDatesForm.disable();
      this.dateRangeForm.enable();
    }
  }

}

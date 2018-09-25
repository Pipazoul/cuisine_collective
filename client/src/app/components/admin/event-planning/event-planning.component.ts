import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { OccurenceType } from '../../../enum/occurence-type.enum';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatRadioChange, MatDatepickerInputEvent } from '@angular/material';
import { WeekDays } from '../../../enum/week-days';
import * as _ from 'lodash';

@Component({
  selector: 'app-event-planning',
  templateUrl: './event-planning.component.html',
  styleUrls: ['./event-planning.component.css']
})
export class EventPlanningComponent extends AbstractEventModifier implements OnInit, OnChanges {

  public readonly OccurenceType = OccurenceType;
  public readonly minDate: Date = new Date();
  public oneDateForm: FormGroup;
  public severalDatesForm: FormGroup;
  public dateRangeForm: FormGroup;
  public currentForm: FormGroup;
  public submitForm: Function;
  public oneDateFormSelected: boolean = false;
  public dateRangeFormSelected: boolean = false;
  public severalDatesFormSelected: boolean = false;

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
      'dateStart': new FormControl(this.event.dateStart, Validators.required),
      'dateEnd': new FormControl(this.event.dateEnd, this.checkIfOtherControlHasValue('radioGroup', 2)),
      'weekDays': new FormControl({
        [WeekDays.MONDAY]: !!this.event.monday,
        [WeekDays.TUESDAY]: !!this.event.tuesday,
        [WeekDays.WEDNESDAY]: !!this.event.wednesday,
        [WeekDays.THURSDAY]: !!this.event.thursday,
        [WeekDays.FRIDAY]: !!this.event.friday,
        [WeekDays.SATURDAY]: !!this.event.saturday,
        [WeekDays.SUNDAY]: !!this.event.sunday
      }),
      'radioGroup': new FormControl(this.event.dateEnd ? 2 : 1)
    });

    this.dateRangeForm = new FormGroup({
      'dateStart': new FormControl(this.event.dateStart, Validators.required),
      'dateEnd': new FormControl(this.event.dateEnd, Validators.required)
    });

    this.severalDatesForm = new FormGroup({
      'dates': new FormArray((this.event.dates && this.event.dates.length) ? this.event.dates.map(x => new FormControl(x)) : [])
    });

    // Choose right initial form and enable it
    if (this.event.dates) {
      this.activateSeveralDatesForm();
    } else if (this.event.dateStart && this.event.dateEnd) {
      this.activateDateRangeForm();
    } else {
      this.activateOneDateForm();
    }
  }

  private checkIfOtherControlHasValue(otherControlName: string, value: any) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOther(control: FormControl) {
      if (!control.parent) {
        return null;
      }
      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        // Get the other control from the parent
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error('checkIfOtherControlHasValue(): other control is not found in parent group');
        }
        // If other control change, we must compute again the validity
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }
      if (!otherControl) {
        return null;
      }
      return (otherControl.value !== value || thisControl.value) ? null : { matchOther: true };
    }
  }

  selectionTypeChanged(event: MatRadioChange) {
    this.activateForm(event.value);
  }

  activateForm(index: number) {
    if (index === 1) {
      this.activateOneDateForm();
    }
    else if (index === 2) {
      this.activateSeveralDatesForm();
    }
    else if (index === 3) {
      this.activateDateRangeForm();
    }
  }

  activateOneDateForm() {
    this.oneDateFormSelected = true;
    this.dateRangeFormSelected = false;
    this.severalDatesFormSelected = false;
    this.oneDateForm.enable();
    this.severalDatesForm.disable();
    this.dateRangeForm.disable();
    this.currentForm = this.oneDateForm;
    this.submitForm = (goBack: boolean = false) => {
      if (this.oneDateForm.valid) {
        Object.assign(this.event, {
          dates: null,
          dateStart: this.oneDateForm.value.dateStart,
          dateEnd: this.oneDateForm.value.dateEnd,
          monday: !!this.oneDateForm.value.weekDays[WeekDays.MONDAY],
          tuesday: !!this.oneDateForm.value.weekDays[WeekDays.TUESDAY],
          wednesday: !!this.oneDateForm.value.weekDays[WeekDays.WEDNESDAY],
          thursday: !!this.oneDateForm.value.weekDays[WeekDays.THURSDAY],
          friday: !!this.oneDateForm.value.weekDays[WeekDays.FRIDAY],
          saturday: !!this.oneDateForm.value.weekDays[WeekDays.SATURDAY],
          sunday: !!this.oneDateForm.value.weekDays[WeekDays.SUNDAY],
          occurenceType: OccurenceType.RECURRENT,
        });
        this.saveEvent(this.event, goBack);
      }
    };
  }

  activateSeveralDatesForm() {
    this.oneDateFormSelected = false;
    this.dateRangeFormSelected = false;
    this.severalDatesFormSelected = true;
    this.oneDateForm.disable();
    this.severalDatesForm.enable();
    this.dateRangeForm.disable();
    this.currentForm = this.severalDatesForm;
    this.submitForm = (goBack: boolean = false) => {
      if (this.severalDatesForm.valid) {
        Object.assign(this.event, {
          dates: (<FormArray>this.severalDatesForm.get('dates')).controls.map(x => x.value),
          dateStart: (<FormArray>this.severalDatesForm.get('dates')).controls[0].value,
          dateEnd: (<FormArray>this.severalDatesForm.get('dates')).controls[(<FormArray>this.severalDatesForm.get('dates')).controls.length - 1].value,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
          occurenceType: OccurenceType.RECURRENT,
        });
        this.saveEvent(this.event, goBack);
      }
    };
  }

  activateDateRangeForm() {
    this.oneDateFormSelected = false;
    this.dateRangeFormSelected = true;
    this.severalDatesFormSelected = false;
    this.oneDateForm.disable();
    this.severalDatesForm.disable();
    this.dateRangeForm.enable();
    this.currentForm = this.dateRangeForm;
    this.submitForm = (goBack: boolean = false) => {
      if (this.dateRangeForm.valid) {
        Object.assign(this.event, {
          dates: null,
          dateStart: this.dateRangeForm.value.dateStart,
          dateEnd: this.dateRangeForm.value.dateEnd,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
          occurenceType: OccurenceType.NONE,
        });
        this.saveEvent(this.event, goBack);
      }
    };
  }

  removeDate(event) {
    _.remove((<FormArray>this.severalDatesForm.get('dates')).controls, { value: event.value });
  }

  addDate(event: MatDatepickerInputEvent<Date>) {
    if (!(<FormArray>this.severalDatesForm.get('dates')).length
      || !(<FormArray>this.severalDatesForm.get('dates')).controls.some(x => x.value.getTime() === event.value.getTime()))
      (<FormArray>this.severalDatesForm.get('dates')).controls.push(new FormControl(event.value));
    event.target.value = null;
    (<FormArray>this.severalDatesForm.get('dates')).controls = _.sortBy((<FormArray>this.severalDatesForm.get('dates')).controls, 'value');
  }
}

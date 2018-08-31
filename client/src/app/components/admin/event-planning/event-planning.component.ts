import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { OccurenceType } from '../../../enum/occurence-type.enum';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
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
  public currentForm: FormGroup;
  public submitForm: Function;
  public oneDateFormSelected: boolean;
  public dateRangeFormSelected: boolean;

  constructor(@Inject(EventService) eventService: EventService) {
    super(eventService);
  }

  ngOnInit() {
    this.initForms();
    this.guessWhichFormToActivate();
  }

  ngOnChanges() {
    this.initForms();
  }

  guessWhichFormToActivate() {
    if (!(this.event.monday && this.event.tuesday && this.event.wednesday && this.event.thursday && this.event.friday && this.event.saturday && this.event.sunday)) {
      this.activateForm(1);
    }
    else if (this.event.dateEnd && this.event.dateStart) {
      this.activateForm(3);
    }
  }

  private initForms() {
    this.oneDateForm = new FormGroup({
      'dateStart': new FormControl(this.event.dateStart, Validators.required),
      'dateEnd': new FormControl(this.event.dateEnd, this.checkIfOtherControlHasValue('radioGroup', 2)),
      'weekDays': new FormControl({
        MONDAY: this.event.monday,
        TUESDAY: this.event.tuesday,
        WEDNESDAY: this.event.wednesday,
        THURSDAY: this.event.thursday,
        FRIDAY: this.event.friday,
        SATURDAY: this.event.saturday,
        SUNDAY: this.event.sunday
      }),
      'radioGroup': new FormControl(this.event.dateEnd ? 2 : 1)
    });

    this.dateRangeForm = new FormGroup({
      'dateStart': new FormControl(this.event.dateStart),
      'dateEnd': new FormControl(this.event.dateEnd)
    });

    this.oneDateForm.disable();
    this.dateRangeForm.disable();
  }

  private checkIfOtherControlHasValue(otherControlName: string, value: any) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOther(control: FormControl) {
      debugger;
      if (!control.parent) {
        return null;
      }
      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        // Get the other control from the parent
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
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

  /*public submitForm(goBack: boolean = false) {
    Object.assign(this.event, value);
    this.saveEvent(this.event, goBack);
  }*/

  selectionTypeChanged(event: MatRadioChange) {
    this.activateForm(event.value);
  }

  activateForm(index: number) {
    if (index === 1) {
      this.activateOneDateForm();
    }
    else if (index === 2) {
      
    }
    else if (index === 3) {
      this.activateDateRangeForm();
    }
  }

  activateOneDateForm() {
    this.oneDateFormSelected = true;
    this.dateRangeFormSelected = false;
    this.oneDateForm.enable();
    //this.serveralDatesForm.disable();
    this.dateRangeForm.disable();
    this.currentForm = this.oneDateForm;
    this.submitForm = (goBack: boolean = false) => {
      if (this.oneDateForm.valid) {
        Object.assign(this.event, {
          dateStart: this.oneDateForm.value.dateStart,
          dateEnd: this.oneDateForm.value.dateEnd,
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
  }

  activateSeveralDatesForm() {
    this.oneDateFormSelected = false;
    this.dateRangeFormSelected = false;
    this.oneDateForm.disable();
    //this.serveralDatesForm.enable();
    this.dateRangeForm.disable();
  }

  activateDateRangeForm() {
    this.oneDateFormSelected = false;
    this.dateRangeFormSelected = true;
    this.oneDateForm.disable();
    //this.serveralDatesForm.disable();
    this.dateRangeForm.enable();
    this.currentForm = this.dateRangeForm;
  }
}

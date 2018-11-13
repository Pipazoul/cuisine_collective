import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WeekDays } from '../../../enum/week-days';

@Component({
  selector: 'app-week-day-selector',
  templateUrl: './week-day-selector.component.html',
  styleUrls: ['./week-day-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WeekDaySelectorComponent),
      multi: true
    }
  ]
})
export class WeekDaySelectorComponent implements OnInit, ControlValueAccessor {

  disabled: boolean;
  value: object;
  valueChanged: Function;
  touched: Function;
  WeekDays = WeekDays;

  constructor() { }

  ngOnInit() {
  }

  toggleDay(day) {
    if (!this.disabled) {
      this.value[day] = !this.value[day];
      this.valueChanged(this.value);
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.valueChanged = fn;
  }
  registerOnTouched(fn: any): void {
    this.touched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

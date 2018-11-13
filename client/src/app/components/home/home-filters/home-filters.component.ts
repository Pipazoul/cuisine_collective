import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EventFilters } from '../../../services/event.service';
import { ContributorFilters } from '../../../services/contributor.service';
import { FormGroup, FormControl } from '@angular/forms';
import { filter, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-home-filters',
  templateUrl: './home-filters.component.html',
  styleUrls: ['./home-filters.component.css']
})
export class HomeFiltersComponent implements OnInit {

  @Output() private filterEvents: EventEmitter<EventFilters> = new EventEmitter();
  @Output() private filterContributors: EventEmitter<ContributorFilters> = new EventEmitter();
  public homeFiltersForm: FormGroup;

  public readonly today = new Date();

  // Assistants' filters
  public assistantsToggle: boolean = false;

  constructor() { }

  ngOnInit() {
    this.homeFiltersForm = new FormGroup({
      'searchString': new FormControl(),
      'startDate': new FormControl(),
      'endDate': new FormControl(),
      'eat': new FormControl(),
      'cook': new FormControl(),
      // 'public': new FormControl(),
      'regular': new FormControl()
    });
    this.homeFiltersForm.valueChanges.pipe(debounceTime(500)).subscribe((value) => this.filterEvents.emit(value));
  }

  applyContributorsFilters() {
    this.filterContributors.emit({
      assistants: this.assistantsToggle,
    });
  }
}

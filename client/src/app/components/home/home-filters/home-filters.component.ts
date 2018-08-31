import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EventFilters } from '../../../services/event.service';
import { ContributorFilters } from '../../../services/contributor.service';

@Component({
  selector: 'app-home-filters',
  templateUrl: './home-filters.component.html',
  styleUrls: ['./home-filters.component.css']
})
export class HomeFiltersComponent implements OnInit {

  @Output() filterEvents: EventEmitter<EventFilters> = new EventEmitter();
  @Output() filterContributors: EventEmitter<ContributorFilters> = new EventEmitter();

  // Event's filters
  public readonly today = new Date();
  public startDate: Date;
  public endDate: Date;
  public eatToggle: boolean = false;
  public cookToggle: boolean = false;
  /* public publicToggle: boolean = false; */
  public regularToggle: boolean = false;

  // Assistants' filters
  public assistantsToggle: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  applyEventsFilters() {
    this.filterEvents.emit({
      eat: this.eatToggle,
      cook: this.cookToggle,
      /* public: this.publicToggle, */
      regular: this.regularToggle,
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  applyContributorsFilters() {
    this.filterContributors.emit({
      assistants: this.assistantsToggle,
    });
  }

}

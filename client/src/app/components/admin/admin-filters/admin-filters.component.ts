import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-filters',
  templateUrl: './admin-filters.component.html',
  styleUrls: ['./admin-filters.component.css']
})
export class AdminFiltersComponent implements OnInit {

  @Output() filterEvents: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterContributors: EventEmitter<any> = new EventEmitter<any>();
  public startDate: Date;
  public endDate: Date;
  public eatToggle: boolean = false;
  public cookToggle: boolean = false;
  public publicToggle: boolean = false;
  public regularToggle: boolean = false;

  // Contributor's filters
  public locationProvided: boolean = false;
  public foodProvided: boolean = false;
  public skillsProvided: boolean = false;
  public peopleProvided: boolean = false;
  public assistantsProvided: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onSlideToggleClick() {
    this.applyEventFilters();
  }

  onCalendarClose() {
    this.applyEventFilters();
  }

  applyEventFilters() {
    this.filterEvents.emit({
      eat: this.eatToggle,
      cook: this.cookToggle,
      public: this.publicToggle,
      regular: this.regularToggle,
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  applyContributorsFilters() {
    this.filterContributors.emit({
      location: this.locationProvided,
      food: this.foodProvided,
      skills: this.skillsProvided,
      people: this.peopleProvided,
      assistants: this.assistantsProvided,
    });
  }
}

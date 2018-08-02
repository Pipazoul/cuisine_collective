import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-filters',
  templateUrl: './admin-filters.component.html',
  styleUrls: ['./admin-filters.component.css']
})
export class AdminFiltersComponent implements OnInit {

  @Output() filterEvents: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterContributors: EventEmitter<any> = new EventEmitter<any>();

  // Event's filters
  public startDate: Date;
  public endDate: Date;
  public eatToggle: boolean = false;
  public cookToggle: boolean = false;
  public publicToggle: boolean = false;
  public regularToggle: boolean = false;
  public missingLocation: boolean = false;
  public missingFood: boolean = false;
  public missingSkills: boolean = false;
  public missingPeople: boolean = false;
  public missingAssistants: boolean = false;

  // Contributor's filters
  public location: boolean = false;
  public food: boolean = false;
  public skills: boolean = false;
  public people: boolean = false;
  public assistants: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onSlideToggleClick() {
    this.applyEventsFilters();
  }

  onCalendarClose() {
    this.applyEventsFilters();
  }

  applyEventsFilters() {
    this.filterEvents.emit({
      eat: this.eatToggle,
      cook: this.cookToggle,
      public: this.publicToggle,
      regular: this.regularToggle,
      startDate: this.startDate,
      endDate: this.endDate,
      missingLocation: this.missingLocation,
      missingFood: this.missingFood,
      missingSkills: this.missingSkills,
      missingPeople: this.missingPeople,
      missingAssistants: this.missingAssistants,
    });
  }

  applyContributorsFilters() {
    this.filterContributors.emit({
      location: this.location,
      food: this.food,
      skills: this.skills,
      people: this.people,
      assistants: this.assistants,
    });
  }
}

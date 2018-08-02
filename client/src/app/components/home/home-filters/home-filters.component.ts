import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home-filters',
  templateUrl: './home-filters.component.html',
  styleUrls: ['./home-filters.component.css']
})
export class HomeFiltersComponent implements OnInit {

  @Output() filterEvents: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterContributors: EventEmitter<any> = new EventEmitter<any>();
  public startDate: Date;
  public endDate: Date;
  public eatToggle: boolean = false;
  public cookToggle: boolean = false;
  public publicToggle: boolean = false;
  public regularToggle: boolean = false;

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

}

import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EventFilters } from '../../../services/event.service';
import { ContributorFilters } from '../../../services/contributor.service';
import { Subscription } from 'rxjs';
import { HeaderTabService } from 'src/app/services/header-tab.service';
import { TabSelectionType } from 'src/app/enum/tab-selection-type.enum';

@Component({
  selector: 'app-admin-filters',
  templateUrl: './admin-filters.component.html',
  styleUrls: ['./admin-filters.component.css']
})
export class AdminFiltersComponent implements OnInit, OnDestroy {

  @Output() private filterEvents: EventEmitter<EventFilters> = new EventEmitter();
  @Output() private filterContributors: EventEmitter<ContributorFilters> = new EventEmitter();

  public readonly today = new Date();

  // Event's filters
  public eventMine: boolean = false;
  public eventOthers: boolean = false;
  public startDate: Date;
  public endDate: Date;
  public eatToggle: boolean = false;
  public cookToggle: boolean = false;
  /* public publicToggle: boolean = false; */
  public regularToggle: boolean = false;
  public missingLocation: boolean = false;
  public missingFood: boolean = false;
  public missingSkills: boolean = false;
  public missingPeople: boolean = false;
  public missingAssistants: boolean = false;
  public published: boolean = false;
  public unpublished: boolean = false;

  // Contributor's filters
  public contribMine: boolean = false;
  public contribOthers: boolean = false;
  public location: boolean = false;
  public food: boolean = false;
  public skills: boolean = false;
  public people: boolean = false;
  public assistants: boolean = false;

  private onHeaderTabChanged: Subscription;

  constructor(private headerTabService: HeaderTabService) {
  }

  ngOnInit() {
    this.onHeaderTabChanged = this.headerTabService.onTypeChanged((type) => {
      if (!type) {
        return;
      }
      if (type === TabSelectionType.CONTRIBUTORS) {
        this.applyContributorsFilters();
      } else if (type === TabSelectionType.EVENTS) {
        this.applyEventsFilters();
      }
    });
  }

  ngOnDestroy() {
    this.onHeaderTabChanged.unsubscribe();
  }

  public applyEventsFilters() {
    this.filterEvents.emit({
      mine: this.eventMine,
      others: this.eventOthers,
      eat: this.eatToggle,
      cook: this.cookToggle,
      /* public: this.publicToggle, */
      regular: this.regularToggle,
      startDate: this.startDate,
      endDate: this.endDate,
      missingLocation: this.missingLocation,
      missingFood: this.missingFood,
      missingSkills: this.missingSkills,
      missingPeople: this.missingPeople,
      missingAssistants: this.missingAssistants,
      published: this.published,
      unpublished: this.unpublished,
    });
  }

  public applyContributorsFilters() {
    this.filterContributors.emit({
      mine: this.contribMine,
      others: this.contribOthers,
      location: this.location,
      food: this.food,
      skills: this.skills,
      people: this.people,
      assistants: this.assistants,
    });
  }

  public get isTypeEvents(): boolean {
    return this.headerTabService.isTypeEvents();
  }

  public get isTypeContributors(): boolean {
    return this.headerTabService.isTypeContributors();
  }
}

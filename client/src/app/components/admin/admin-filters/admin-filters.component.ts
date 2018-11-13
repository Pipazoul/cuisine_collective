import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EventFilters } from '../../../services/event.service';
import { ContributorFilters } from '../../../services/contributor.service';
import { Subscription } from 'rxjs';
import { HeaderTabService } from 'src/app/services/header-tab.service';
import { TabSelectionType } from 'src/app/enum/tab-selection-type.enum';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-admin-filters',
  templateUrl: './admin-filters.component.html',
  styleUrls: ['./admin-filters.component.css']
})
export class AdminFiltersComponent implements OnInit, OnDestroy {

  public readonly today = new Date();

  @Output() public filterEvents: EventEmitter<EventFilters> = new EventEmitter();
  @Output() public filterContributors: EventEmitter<ContributorFilters> = new EventEmitter();
  public eventFiltersForm: FormGroup;
  public contributorFiltersForm: FormGroup;

  private onHeaderTabChanged: Subscription;

  constructor(private headerTabService: HeaderTabService) {
  }

  ngOnInit() {
    this.initEventFiltersForm();
    this.initContributorFiltersForms();
    this.onHeaderTabChanged = this.headerTabService.onTypeChanged((type) => {
      if (!type) {
        return;
      }
      if (type === TabSelectionType.CONTRIBUTORS) {
        this.filterContributors.emit(this.contributorFiltersForm.value);
      } else if (type === TabSelectionType.EVENTS) {
        this.filterEvents.emit(this.eventFiltersForm.value);
      }
    });
  }

  ngOnDestroy() {
    this.onHeaderTabChanged.unsubscribe();
  }

  private initEventFiltersForm() {
    this.eventFiltersForm = new FormGroup({
      searchString: new FormControl(),
      mine: new FormControl(),
      others: new FormControl(),
      eat: new FormControl(),
      cook: new FormControl(),
      // public: new FormControl(),
      regular: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      missingLocation: new FormControl(),
      missingFood: new FormControl(),
      missingSkills: new FormControl(),
      missingPeople: new FormControl(),
      missingAssistants: new FormControl(),
      published: new FormControl(),
      unpublished: new FormControl(),
    });
    this.eventFiltersForm.valueChanges.pipe(debounceTime(500)).subscribe((value) => this.filterEvents.emit(value));
  }

  private initContributorFiltersForms() {
    this.contributorFiltersForm = new FormGroup({
      searchString: new FormControl(),
      mine: new FormControl(),
      others: new FormControl(),
      location: new FormControl(),
      food: new FormControl(),
      skills: new FormControl(),
      people: new FormControl(),
      assistants: new FormControl(),
    });
    this.contributorFiltersForm.valueChanges.pipe(debounceTime(500)).subscribe((value) => this.filterContributors.emit(value));
  }

  public get isTypeEvents(): boolean {
    return this.headerTabService.isTypeEvents();
  }

  public get isTypeContributors(): boolean {
    return this.headerTabService.isTypeContributors();
  }
}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { filter, switchMap, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';

// Classes
import { LocationClass } from '../../../domain/location.class';
import { LocationService } from '../../../services/location.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  private static readonly RESULTS_LIMIT = 5;

  @Output() public goTo: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

  public locationForm: FormGroup;
  public isLoading: boolean = false;
  public coordinates: [number, number];
  public results: LocationClass[] = [];

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    // location control with value changes listener
    let locationCtrl = new FormControl();
    locationCtrl.valueChanges.pipe(
      filter(data => {
        this.results.length = 0;
        return _.isString(data) && (data.trim().length ? true : false) && (this.isLoading = true)
      }),
      debounceTime(500),
      // Using switchMap to prevent displaying data returned if another request is in progress
      switchMap(data => this.locationService.search(data, SearchBarComponent.RESULTS_LIMIT)))
      .subscribe(data => {
        this.isLoading = false;
        this.results = data.features;
      });
    this.locationForm = new FormGroup({ 'location': locationCtrl });
  }

  /**
   * When user select a result among the list
   * @param event Clicked result
   */
  selectAddress(event: MatAutocompleteSelectedEvent) {
    this.results.length = 0;
    const location: LocationClass = event.option.value;
    this.locationForm.controls.location.setValue(location.properties.label);
    this.goTo.emit(location.geometry.coordinates);
  }

  /**
   * Locate user
   */
  locateUser() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(position => {
        this.goTo.emit([position.coords.longitude, position.coords.latitude]);
      }, error => {
        console.error(error);
      });
    };
  }
}
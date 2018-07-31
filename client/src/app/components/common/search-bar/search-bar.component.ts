import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { filter, switchMap, debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

// Classes
import { LocationClass } from '../../../domain/location.class';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  private static readonly LOCATION_API_URL = 'https://api-adresse.data.gouv.fr/search/';
  private static readonly QUERY_PARAMETER = 'q';
  private static readonly LIMIT_PARAMETER = 'limit';
  private static readonly RESULTS_LIMIT = 5;

  @Output() public goTo: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

  public locationForm: FormGroup;
  public isLoading: boolean = false;
  public coordinates: [number, number];
  public results: LocationClass[] = [];

  constructor(private httpClient: HttpClient) { }

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
      switchMap(data => this.searchLocation(data)))
      .subscribe(data => {
        this.isLoading = false;
        this.results = data['features'];
      });
    this.locationForm = new FormGroup({ 'location': locationCtrl });
  }

  /**
   * Search locations from typed text
   */
  searchLocation(data) {
    return this.httpClient.get(SearchBarComponent.LOCATION_API_URL + '?'
      + SearchBarComponent.QUERY_PARAMETER + '=' + data
      + '&' + SearchBarComponent.LIMIT_PARAMETER + '=' + SearchBarComponent.RESULTS_LIMIT);
  }

  /**
   * When user select a result among the list
   * @param event Clicked result
   */
  selectAddress(event) {
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
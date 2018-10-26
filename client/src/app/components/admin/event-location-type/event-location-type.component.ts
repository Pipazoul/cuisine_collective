import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { EventService } from '../../../services/event.service';
import { LocationClass } from '../../../domain/location.class';
import { FormGroup, FormControl } from '@angular/forms';
import { filter, debounceTime, switchMap } from 'rxjs/operators';
import { LocationService } from '../../../services/location.service';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-event-location-type',
  templateUrl: './event-location-type.component.html',
  styleUrls: ['./event-location-type.component.css']
})
export class EventLocationTypeComponent extends AbstractEventModifier implements OnInit, OnChanges {

  private static readonly RESULTS_LIMIT = 5;

  public eventLocationForm: FormGroup;
  public locationsFound: LocationClass[] = [];
  public isLoading: boolean = false;

  constructor(@Inject(EventService) eventService: EventService,
    private locationService: LocationService) {
    super(eventService);
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    const locationCtrl = new FormControl(_.join(_.without([
      this.event.locationHousenumber,
      this.event.locationStreet,
      this.event.locationHousenumber && this.event.locationStreet ? this.event.locationPostcode : null,
      this.event.locationCity
    ], null), ' '));
    locationCtrl.valueChanges.pipe(
      filter(data => {
        this.locationsFound.length = 0;
        return _.isString(data) && (data.trim().length ? true : false) && (this.isLoading = true)
      }),
      debounceTime(500),
      // Using switchMap to prevent displaying data returned if another request is in progress
      switchMap(data => this.locationService.search(data, EventLocationTypeComponent.RESULTS_LIMIT)))
      .subscribe(data => {
        this.isLoading = false;
        this.locationsFound = data.features;
      });

    this.eventLocationForm = new FormGroup({
      'locationLabel': new FormControl(this.event.locationLabel),
      'location': locationCtrl,
      'informations': new FormControl(this.event.informations),
      'eat': new FormControl(this.event.eat),
      'cook': new FormControl(this.event.cook)
      //'public': new FormControl(this.event.public)
    });
  }

  /**
   * When user select a result among the list
   * 
   * @param event Clicked result
   */
  public onLocationSelected(event: MatAutocompleteSelectedEvent) {
    const location: LocationClass = event.option.value;
    this.eventLocationForm.get('location').setValue(location.properties.label);
    const transformedLocation = ol.proj.fromLonLat(location.geometry.coordinates, 'EPSG:3857');
    Object.assign(this.event, {
      longitude: Math.round(transformedLocation[0]),
      latitude: Math.round(transformedLocation[1]),
      locationCity: location.properties.city,
      locationCitycode: location.properties.citycode,
      locationHousenumber: location.properties.housenumber,
      locationName: location.properties.label,
      locationPostcode: location.properties.postcode,
      locationStreet: location.properties.street ? location.properties.street : location.properties.name
    });
  }

  public submitForm(value, goBack: boolean = false) {
    Object.assign(this.event, value);
    this.saveEvent(this.event, goBack).subscribe((event) => this.eventService.eventLocationChanged.next(event));
  }

}

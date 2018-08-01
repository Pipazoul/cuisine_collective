import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restangular } from 'ngx-restangular';
import { map } from 'rxjs/operators';

import { UrlSettings } from '../config/url.settings';

import { EventClass } from '../domain/event.class';

@Injectable()
export class EventService {

  constructor(private restangular: Restangular) {
  }

  /**
   * Create an event
   * 
   * @param event
   */
  create(event: EventClass): Observable<EventClass> {
    return this.restangular.all(UrlSettings.eventModel).post(event).pipe(map(res => new EventClass(res)));
  }

  /**
   * Update an event
   * 
   * @param event 
   */
  update(event: EventClass): Observable<EventClass> {
    return this.restangular.one(UrlSettings.eventModel, event.id).patch(event).pipe(map(res => new EventClass(res)));
  }

  /**
   * Get all events
   */
  getAll(): Observable<EventClass[]> {
    return this.restangular.all(UrlSettings.eventModel).getList().pipe(map((res: Array<any>) => res.map(event => new EventClass(event))));
  }

  /**
   * Get an event by its id
   * @param id event's id
   */
  getById(id: number): Observable<EventClass> {
    return this.restangular.one(UrlSettings.eventModel, id).get().pipe(map(event => new EventClass(event)));
  }
}

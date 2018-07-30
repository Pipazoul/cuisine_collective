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

  create(event: EventClass): Observable<EventClass> {
      return this.restangular.all(UrlSettings.eventModel).post(event).pipe(map(res => new EventClass(res)));
  }
}

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
   * @param filters 
   */
  getAll(filters?: EventFilters): Observable<EventClass[]> {
    let params = {
      filter: {
        where: {
          and: [{
            eat: filters && filters.eat ? filters.eat : undefined
          }, {
            cook: filters && filters.cook ? filters.cook : undefined
          }, {
            public: filters && filters.public ? filters.public : undefined
          }, {
            missingLocation: filters && filters.missingLocation ? true : undefined
          }, {
            missingFood: filters && filters.missingFood ? true : undefined
          }, {
            missingSkills: filters && filters.missingSkills ? true : undefined
          }, {
            missingPeople: filters && filters.missingPeople ? true : undefined
          }, {
            missingAssistants: filters && filters.missingAssistants ? true : undefined
          }, {
            dateEnd: undefined
          }, {
            or: [{
              publish: filters && filters.published ? true : undefined
            }, {
              publish: filters && filters.unpublished ? false : undefined
            }]
          }, {
            occurenceType: filters && filters.regular ? { gt: 0 } : undefined
          }]
        }
      }
    };

    if (filters && filters.startDate) {
      params.filter.where.and.push({
        dateEnd: { gt: new Date(filters.startDate) }
      });
    }

    if (filters && filters.endDate) {
      params.filter.where.and.push({
        dateEnd: { lt: new Date(filters.endDate) }
      });
    }

    return this.restangular.all(UrlSettings.eventModel).getList(params).pipe(map((res: Array<any>) => res.map(event => new EventClass(event))));
  }

  /**
   * Get an event by its id
   * @param id event's id
   */
  getById(id: number): Observable<EventClass> {
    return this.restangular.one(UrlSettings.eventModel, id).get().pipe(map(event => new EventClass(event)));
  }

  /**
   * Link a contributor location to the event
   * 
   * @param eventId 
   * @param contributorId 
   */
  setContributors(eventId: number, contributorsIds: ContributorsIds) {
    return this.restangular.one(UrlSettings.eventModel, eventId).all(UrlSettings.eventContributors).customPUT(contributorsIds);
  }
}

export interface ContributorsIds {
  contributorsLocation: number[];
  contributorsFood: number[];
  contributorsSkills: number[];
  contributorsPeople: number[];
  contributorsAssistants: number[]
}

export interface EventFilters {
  eat?: boolean;
  cook?: boolean;
  public?: boolean;
  missingLocation?: boolean;
  missingFood?: boolean;
  missingSkills?: boolean;
  missingPeople?: boolean;
  missingAssistants?: boolean;
  published?: boolean;
  unpublished?: boolean;
  regular?: boolean;
  startDate?: Date;
  endDate?: Date;
}

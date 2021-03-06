import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Restangular } from 'ngx-restangular';
import { map, tap } from 'rxjs/operators';

import { UrlSettings } from '../config/url.settings';

import { EventClass } from '../domain/event.class';
import { AuthenticationService } from './authentication.service';
import { ContributorClass } from '../domain/contributor.class';

@Injectable()
export class EventService {

  public eventLocationChanged = new BehaviorSubject<EventClass>(null);
  public eventPublishStatusChanged = new BehaviorSubject<EventClass>(null);
  public eventDeleted = new BehaviorSubject<number>(null);

  constructor(
    private restangular: Restangular,
    private authenticateService: AuthenticationService) {
  }

  /**
   * Get an event by its id
   * @param id event's id
   */
  getById(id: number): Observable<EventClass> {
    return this.restangular.one(UrlSettings.eventModel, id).get().pipe(map(event => new EventClass(event)));
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
   * Delete an event
   * 
   * @param eventId 
   */
  delete(eventId: number): Observable<any> {
    return this.restangular.one(UrlSettings.eventModel, eventId).remove().pipe(tap(() => this.eventDeleted.next(eventId)));
  }

  /**
   * Get all events
   * @param filters 
   */
  getAll(filters?: EventFilters): Observable<EventClass[]> {
    let params = {
      filter: {
        where: {
          and: []
        }
      }
    };

    params.filter.where.and.push({
        eat: filters && filters.eat ? filters.eat : undefined
      }, {
        cook: filters && filters.cook ? filters.cook : undefined
      }, /* {
      public: filters && filters.public ? filters.public : undefined
    },  */{
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
          publish: (filters && filters.published) || !this.authenticateService.isConnected ? true : undefined
        }, {
          publish: filters && filters.unpublished ? false : undefined
        }]
      }, {
        occurenceType: filters && filters.regular ? { gt: 0 } : undefined
      }, {
        or: [{
          name: filters && filters.searchString ? { ilike: '%' + filters.searchString + '%' } : undefined
        }, {
          description: filters && filters.searchString ? { ilike: '%' + filters.searchString + '%' } : undefined
        }]
      });

    if (filters && filters.startDate) {
      params.filter.where.and.push({
        or: [{
          dateEnd: { gt: new Date(filters.startDate) }
        }, {
          dateEnd: null
        }]
      });
    }

    if (filters && filters.endDate) {
      params.filter.where.and.push({
        dateEnd: { neq: null }
      }, {
          dateEnd: { lte: new Date(filters.endDate) }
        });
    }

    return this.restangular.all(UrlSettings.eventModel).getList(params).pipe(map((res: Array<any>) => res.map(event => new EventClass(event))));
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

  /**
   * Get all contributors assistants linked to this event
   * 
   * @param eventId 
   */
  getContributorsAssistants(eventId: number): Observable<ContributorClass[]> {
    return this.restangular.one(UrlSettings.eventModel, eventId).all(UrlSettings.eventContributorsAssistants)
      .getList().pipe(map((res: Array<any>) => res.map(c => new ContributorClass(c))));
  }

  /**
   * Get all contributors food linked to this event
   * 
   * @param eventId 
   */
  getContributorsFood(eventId: number): Observable<ContributorClass[]> {
    return this.restangular.one(UrlSettings.eventModel, eventId).all(UrlSettings.eventContributorsFood)
      .getList().pipe(map((res: Array<any>) => res.map(c => new ContributorClass(c))));
  }

  /**
   * Get all contributors location linked to this event
   * 
   * @param eventId 
   */
  getContributorsLocation(eventId: number): Observable<ContributorClass[]> {
    return this.restangular.one(UrlSettings.eventModel, eventId).all(UrlSettings.eventContributorsLocation)
      .getList().pipe(map((res: Array<any>) => res.map(c => new ContributorClass(c))));
  }

  /**
   * Get all contributors people linked to this event
   * 
   * @param eventId 
   */
  getContributorsPeople(eventId: number): Observable<ContributorClass[]> {
    return this.restangular.one(UrlSettings.eventModel, eventId).all(UrlSettings.eventContributorsPeople)
      .getList().pipe(map((res: Array<any>) => res.map(c => new ContributorClass(c))));
  }

  /**
   * Get all contributors skills linked to this event
   * 
   * @param eventId 
   */
  getContributorsSkills(eventId: number): Observable<ContributorClass[]> {
    return this.restangular.one(UrlSettings.eventModel, eventId).all(UrlSettings.eventContributorsSkills)
      .getList().pipe(map((res: Array<any>) => res.map(c => new ContributorClass(c))));
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
  /* public?: boolean; */
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
  searchString?: string;
}

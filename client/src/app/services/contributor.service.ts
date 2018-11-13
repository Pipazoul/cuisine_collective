import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Restangular } from 'ngx-restangular';
import { map, tap } from 'rxjs/operators';

import { UrlSettings } from '../config/url.settings';

import { AuthenticationService } from './authentication.service';
import { ContributorClass } from '../domain/contributor.class';

@Injectable()
export class ContributorService {

  public contributorLocationChanged = new BehaviorSubject<ContributorClass>(null);
  public contributorDeleted = new BehaviorSubject<number>(null);

  constructor(private restangular: Restangular,
    private authenticateService: AuthenticationService) {
  }

  /**
   * Create a contributor
   * 
   * @param contributor
   */
  create(contributor: ContributorClass): Observable<ContributorClass> {
    return this.restangular.all(UrlSettings.contributorModel).post(contributor).pipe(map(res => new ContributorClass(res)));
  }

  /**
   * Update a contributor
   * 
   * @param contributor 
   */
  update(contributor: ContributorClass): Observable<ContributorClass> {
    return this.restangular.one(UrlSettings.contributorModel, contributor.id).patch(contributor).pipe(map(res => new ContributorClass(res)));
  }

  /**
   * Delete a contributor
   * 
   * @param contributorId 
   */
  delete(contributorId: number): Observable<any> {
    return this.restangular.one(UrlSettings.contributorModel, contributorId).remove().pipe(tap(() => this.contributorDeleted.next(contributorId)));
  }

  /**
   * Get all contributors
   */
  getAll(filters?: ContributorFilters): Observable<ContributorClass[]> {
    var params = {
      filter: {
        where: {
          and: [{
            or: [{
              userId: filters && filters.mine && this.authenticateService.isConnected ? this.authenticateService.user.id : undefined
            }, {
              userId: filters && filters.others && this.authenticateService.isConnected ? { neq: this.authenticateService.user.id } : undefined
            }],
          }, {
            location: filters && filters.location ? filters.location : undefined
          }, {
            food: filters && filters.food ? filters.food : undefined
          }, {
            skills: filters && filters.skills ? filters.skills : undefined
          }, {
            people: filters && filters.people ? filters.people : undefined
          }, {
            assistants: filters && filters.assistants ? filters.assistants : undefined
          }, {
            assistants: !this.authenticateService.isConnected ? true : undefined
          }, {
            assistants: !this.authenticateService.isConnected ? (filters && filters.assistants ? filters.assistants : false) : undefined
          }, {
            or: [{
              title: filters && filters.searchString ? { ilike: '%' + filters.searchString + '%' } : undefined
            }, {
              name: filters && filters.searchString ? { ilike: '%' + filters.searchString + '%' } : undefined
            }, {
              description: filters && filters.searchString ? { ilike: '%' + filters.searchString + '%' } : undefined
            }]
          }]
        }
      }
    };

    return this.restangular.all(UrlSettings.contributorModel).getList(params).pipe(map((res: Array<any>) => res.map(contributor => new ContributorClass(contributor))));
  }

  /**
   * Get all guides
   */
  getAssistants(): Observable<ContributorClass[]> {
    return this.restangular.all(UrlSettings.contributorModel).getList({ filter: { where: { assistants: true } } })
      .pipe(map((res: Array<any>) => res.map(contributor => new ContributorClass(contributor))));
  }

  /**
   * Get a contributor by its id
   * @param id contributor's id
   */
  getById(id: number): Observable<ContributorClass> {
    return this.restangular.one(UrlSettings.contributorModel, id).get().pipe(map(contributor => new ContributorClass(contributor)));
  }
}

export interface ContributorFilters {
  mine?: boolean;
  others?: boolean;
  location?: boolean;
  food?: boolean;
  skills?: boolean;
  people?: boolean;
  assistants?: boolean;
  searchString?: string;
}

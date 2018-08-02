import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restangular } from 'ngx-restangular';
import { map } from 'rxjs/operators';

import { UrlSettings } from '../config/url.settings';

import { ContributorClass } from '../domain/contributor.class';

@Injectable()
export class ContributorService {

  constructor(private restangular: Restangular) {
  }

  /**
   * Create an contributor
   * 
   * @param contributor
   */
  create(contributor: ContributorClass): Observable<ContributorClass> {
    return this.restangular.all(UrlSettings.contributorModel).post(contributor).pipe(map(res => new ContributorClass(res)));
  }

  /**
   * Update an contributor
   * 
   * @param contributor 
   */
  update(contributor: ContributorClass): Observable<ContributorClass> {
    return this.restangular.one(UrlSettings.contributorModel, contributor.id).patch(contributor).pipe(map(res => new ContributorClass(res)));
  }

  /**
   * Get all contributors
   */
  getAll(filters?: ContributorFilters): Observable<ContributorClass[]> {
    var params = {
      filter: {
        where: {
          and: [{
            location: filters && filters.location ? filters.location : undefined
          }, {
            food: filters && filters.food ? filters.food : undefined
          }, {
            skills: filters && filters.skills ? filters.skills : undefined
          }, {
            people: filters && filters.people ? filters.people : undefined
          }, {
            assistants: filters && filters.assistants ? filters.assistants : undefined
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
    return this.restangular.all(UrlSettings.contributorModel).getList({filter: {where:{assistants:true}}})
    .pipe(map((res: Array<any>) => res.map(contributor => new ContributorClass(contributor))));
  }
}

export interface ContributorFilters {
  location?: boolean;
  food?: boolean;
  skills?: boolean;
  people?: boolean;
  assistants?: boolean;
}

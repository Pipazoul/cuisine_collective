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
  getAll(): Observable<ContributorClass[]> {
    return this.restangular.all(UrlSettings.contributorModel).getList().pipe(map((res: Array<any>) => res.map(contributor => new ContributorClass(contributor))));
  }
}

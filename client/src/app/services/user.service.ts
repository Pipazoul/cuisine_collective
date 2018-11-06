import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restangular } from 'ngx-restangular';
import { map } from 'rxjs/operators';

import { UrlSettings } from '../config/url.settings';

import { UserClass } from '../domain/user.class';
import { RoleClass } from '../domain/role.class';

@Injectable()
export class UserService {

  constructor(private restangular: Restangular) {
  }

  /**
   * Retrieve user by Id
   *
   * @param userId
   */
  getById(userId: number): Observable<UserClass> {
    return this.restangular.one(UrlSettings.userModel, userId).get().pipe(map(res => new UserClass(res)));
  }

  /**
   * Get user's roles
   * 
   * @param userId
   */
  getRoles(userId: number): Observable<RoleClass[]> {
    return this.restangular.one(UrlSettings.userModel, userId).all(UrlSettings.userRoles).getList().pipe(
      map((res: any[]) => res.map(item => new RoleClass(item))));
  }

  /**
   * Get all users in database
   */
  getAll(): Observable<UserClass[]> {
    return this.restangular.all(UrlSettings.userModel).getList().pipe(map((res: any[]) => res.map(item => new UserClass(item))));
  }

  /**
   * Create a user
   * 
   * @param user 
   */
  create(user: UserClass): Observable<UserClass> {
    return this.restangular.all(UrlSettings.userModel).post(user).pipe(map(res => new UserClass(res)));
  }

  /**
   * Create a user
   * 
   * @param user 
   */
  update(user: UserClass): Observable<UserClass> {
    return this.restangular.one(UrlSettings.userModel, user.id).patch(user).pipe(map(res => new UserClass(res)));
  }

  /**
   * Remove a user
   * 
   * @param userId 
   */
  deleteById(userId: number): Observable<void> {
    return this.restangular.one(UrlSettings.userModel, userId).remove();
  }
}

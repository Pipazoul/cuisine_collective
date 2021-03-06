import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';
import { Restangular } from 'ngx-restangular';
import * as _ from 'lodash';

import { UrlSettings } from '../config/url.settings';

import { UserClass } from '../domain/user.class';

import { UserService } from './user.service';
import { RoleClass } from '../domain/role.class';

@Injectable()
export class AuthenticationService {

  public static readonly HOME: string[] = ['/home'];
  public static readonly ADMIN_HOME: string[] = ['/admin'];

  private static readonly ACCESS_TOKEN = 'access_token';
  private static readonly REGISTERED_USER = 'registered_user';
  private static readonly REGISTERED_ROLES = 'roles';

  public readonly connectionStatusChanged = new BehaviorSubject<boolean>(null);

  constructor(private restangular: Restangular,
    private userService: UserService) { }

  /**
   * Are we connected or not ?
   */
  public get isConnected(): boolean {
    return !!localStorage.getItem(AuthenticationService.ACCESS_TOKEN);
  }

  /**
   * Authenticated user's ID
   */
  public get user(): UserClass {
    return localStorage.getItem(AuthenticationService.REGISTERED_USER) ? JSON.parse(localStorage.getItem(AuthenticationService.REGISTERED_USER)) : null;
  }

  /**
   * Is authenticated user an admin ?
   */
  public get isAdmin(): boolean {
    return localStorage.getItem(AuthenticationService.REGISTERED_ROLES) ? !!_.find(JSON.parse(localStorage.getItem(AuthenticationService.REGISTERED_ROLES)), {name: RoleClass.ROLES.ADMIN}) : false;
  }

  /**
   * Returns user's home that's differ from the authenticated state (logged in or not) and from the role (ie admin or not)
   */
  public get homePage(): string[] {
    return !this.isConnected ? AuthenticationService.HOME : AuthenticationService.ADMIN_HOME;
  }

  /**
   * To know if there's a connected user or not
   */
  public computeIsLoggedIn(): Promise<boolean> {
    let obs: Promise<boolean>;
    const user = this.user;
    if (user) {
      // There's a session stored in localStorage. Let see if the corresponding token is OK with the server
      obs = this.restangular.one(UrlSettings.userModel, user.id).all(UrlSettings.userAccessTokens).getList().toPromise()
        .catch(() => {
          console.error('Invalid client token');
          this.resetSession();
        });
    } else {
      this.resetSession();
      console.error('Client token is missing');
      obs = new Promise(resolve => {
        resolve(false);
      });
    }
    return obs;
  }

  /**
   * Signin with credentials, and store token & connected user in local storage
   *
   * @param email
   * @param password
   */
  public signin(email: string, password: string): Observable<LoopbackToken> {
    // First, log in
    return this.restangular.all(UrlSettings.userModel).customPOST({ email, password }, UrlSettings.userLogin).pipe(
      tap((token: LoopbackToken) => {
        // Store token in local storage
        localStorage.setItem(AuthenticationService.ACCESS_TOKEN, JSON.stringify(token));
        // Set Restangular header's configuration with new autorization key
        this.restangular.configuration.defaultHeaders = { 'Authorization': token['id'] };
      }),
      mergeMap((token: LoopbackToken) =>
        forkJoin(
          this.userService.getById(token.userId),
          this.userService.getRoles(token.userId)
        ).pipe(
          map(([user, roles]) => {
            localStorage.setItem(AuthenticationService.REGISTERED_USER, JSON.stringify(user));
            localStorage.setItem(AuthenticationService.REGISTERED_ROLES, JSON.stringify(roles));
            this.connectionStatusChanged.next(true);
            return token;
          })
        )
      )
    );
  }

  /**
   * Signout from application
   */
  public signout(): Observable<any> {
    return this.restangular.all(UrlSettings.userModel).customPOST({}, UrlSettings.userLogout).pipe(
      tap(() => {
        this.resetSession();
        // Say we are disconnected
        this.connectionStatusChanged.next(false);
      })
    );
  }

  /**
   * Reset session's variables :
   * - Clear access_token in local storage
   * - Clear Restangular default headers
   * - Set connected var to false
   */
  private resetSession() {
    // Clear local storage
    localStorage.removeItem(AuthenticationService.ACCESS_TOKEN);
    localStorage.removeItem(AuthenticationService.REGISTERED_USER);
    localStorage.removeItem(AuthenticationService.REGISTERED_ROLES);
    // Clear Restangular header's configuration
    this.restangular.configuration.defaultHeaders = {};
  }
}
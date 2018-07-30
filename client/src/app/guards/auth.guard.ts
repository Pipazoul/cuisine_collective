import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

/**
 * Guard to assert that we are logged in. Otherwise redirect to home
 */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
    private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authenticationService.isConnected) {
      return true;
    }
    this.router.navigate(this.authenticationService.homePage);
    return false;
  }
}

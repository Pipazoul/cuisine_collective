import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

/**
 * Guard to assert that we are not logged in. Otherwise redirect to main page
 */
@Injectable()
export class UnauthGuard implements CanActivate {

    constructor(private authenticationService: AuthenticationService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authenticationService.isConnected) {
            return true;
        }
        this.router.navigate(this.authenticationService.homePage);
        return false;
    }
}

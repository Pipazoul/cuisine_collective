import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

import { UserClass } from '../domain/user.class';
import { Observable } from 'rxjs';

/**
 * Get the user, identified by his ID.
 * 
 * User's ID is retrieve from URL
 */
@Injectable()
export class UserResolver implements Resolve<UserClass> {

    constructor(private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot) {
        var userId = +route.paramMap.get('userId');
        if (!userId) {
            throw new Error('Undefined user ID in resolver');
        }
        return this.userService.getById(userId);
    }

}
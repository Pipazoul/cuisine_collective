import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { UserService } from 'src/app/services/user.service';

import { UserClass } from 'src/app/domain/user.class';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;
  private user: UserClass;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) {
    this.user = this.route.snapshot.data['user'] || new UserClass();
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      'username': new FormControl(this.user.username, Validators.required),
      'email': new FormControl(this.user.email, [Validators.required, Validators.email]),
      'password': new FormControl(null, this.user.id ? null : Validators.required)
    });
  }

  public submitForm(value) {
    Object.assign(this.user, value);
    if (this.user.id) {
      this.userService.update(this.user).subscribe(
        () => this.router.navigate(['/admin', 'users']),
        (err) => this.handleError(err));
    } else {
      this.userService.create(this.user).subscribe(
        () => this.router.navigate(['/admin', 'users']),
        (err) => this.handleError(err));
    }
  }

  private handleError(err) {
    if (err.error.error.statusCode === 422 && err.error.error.details && err.error.error.details.codes && err.error.error.details.codes.email && _.includes(err.error.error.details.codes.email, 'uniqueness')) {
      this.userForm.get('email').setErrors({ 'emailAlreadyExists': true });
    } else {
      // TODO message ?
      console.error(err);
    }
  }

}

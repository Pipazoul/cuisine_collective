import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { UserService } from 'src/app/services/user.service';

import { UserClass } from 'src/app/domain/user.class';
import { CustomValidators } from 'src/app/util/CustomValidators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Output() private userCreated: EventEmitter<UserClass> = new EventEmitter();
  public userForm: FormGroup;
  private user: UserClass;

  constructor(private route: ActivatedRoute,
    private userService: UserService) {
    this.user = new UserClass();
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      'email': new FormControl(this.user.email, [Validators.required, Validators.email])
    });
  }

  public submitForm(value) {
    this.user.email = value.email;
    this.user.password = UserClass.DEFAULT_PASSWORD;
    this.userService.create(this.user).subscribe(
      (user) => this.userCreated.emit(Object.assign(this.user, user)),
      (err) => this.handleError(err));
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

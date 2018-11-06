import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserClass } from 'src/app/domain/user.class';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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
      'password': new FormControl(null, Validators.required)
    });
  }

  public submitForm(value) {
    Object.assign(this.user, value);
    if (this.user.id) {

    } else {
      this.userService.create(this.user).subscribe(() => this.router.navigate(['/admin', 'users']));
    }
  }

}

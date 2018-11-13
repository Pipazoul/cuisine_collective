import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// Services
import { AuthenticationService } from '../../../services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserClass } from 'src/app/domain/user.class';

@Component({
  selector: 'app-popup-signin',
  templateUrl: './popup-signin.component.html',
  styleUrls: ['./popup-signin.component.css']
})
export class PopupSigninComponent implements OnInit {

  public loginForm: FormGroup;
  public showError: boolean = false;
  public showCreateAccount: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<PopupSigninComponent, LoopbackToken>,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl()
    });
  }

  public signin(credentials: Credentials) {
    this.authenticationService.signin(credentials.email, UserClass.DEFAULT_PASSWORD).subscribe(
      (res) => {
        this.showError = false;
        this.dialogRef.close(res);
      }, (err) => {
        console.error(err);
        this.showError = true;
      }
    );
  }

  public createAccount() {
    this.showCreateAccount = true;
  }

  public onUserCreated(user: UserClass) {
    this.authenticationService.signin(user.email, user.password).subscribe((res) => this.dialogRef.close(res));
  }

  public close() {
    this.dialogRef.close();
  }

}

interface Credentials {
  email: string;
}

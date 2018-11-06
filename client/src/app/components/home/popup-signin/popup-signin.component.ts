import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// Services
import { AuthenticationService } from '../../../services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-popup-signin',
  templateUrl: './popup-signin.component.html',
  styleUrls: ['./popup-signin.component.css']
})
export class PopupSigninComponent implements OnInit {

  public loginForm: FormGroup;
  public showError: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<PopupSigninComponent, LoopbackToken>,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required)
    });
  }

  public signin(credentials: Credentials) {
    this.authenticationService.signin(credentials.email, credentials.password).subscribe(
      (res) => {
        this.showError = false;
        this.dialogRef.close(res);
      }, (err) => {
        console.error(err);
        this.showError = true;
      }
    );
  }

  public close() {
    this.dialogRef.close();
  }

}

interface Credentials {
  email: string;
  password: string;
}

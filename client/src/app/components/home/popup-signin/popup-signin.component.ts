import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// Services
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-popup-signin',
  templateUrl: './popup-signin.component.html',
  styleUrls: ['./popup-signin.component.css']
})
export class PopupSigninComponent implements OnInit {

  public showError: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<PopupSigninComponent>,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  signin(code) {
    this.authenticationService.signin('admin@admin.com', code).subscribe(
      (res) => {
        this.showError = false;
        this.dialogRef.close(res);
      }, (err) => {
        console.error(err);
        this.showError = true;
      }
    );
  }

  close() {
    this.dialogRef.close();
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

// Components
import { PopupSigninComponent } from '../home/popup-signin/popup-signin.component';

// Services
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  signinDialog: MatDialogRef<PopupSigninComponent, any>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  /**
   * Open the signin popup dialog
   */
  openSigninDialog(): void {
    this.signinDialog = this.dialog.open(PopupSigninComponent, {
      width: '550px',
      panelClass: "dialog"
    })

    this.signinDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.router.navigate(this.authenticationService.homePage);
      }
    });
  }

}

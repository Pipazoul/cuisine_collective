import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-popup-signin',
  templateUrl: './popup-signin.component.html',
  styleUrls: ['./popup-signin.component.css']
})
export class PopupSigninComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PopupSigninComponent>) { }

  ngOnInit() {
  }

}

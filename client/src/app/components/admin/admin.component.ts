import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public opened: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public openSidenav() {
    this.opened = true;
  }

}

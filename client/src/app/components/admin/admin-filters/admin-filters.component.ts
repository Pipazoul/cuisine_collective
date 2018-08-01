import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-filters',
  templateUrl: './admin-filters.component.html',
  styleUrls: ['./admin-filters.component.css']
})
export class AdminFiltersComponent implements OnInit {

  public eatToggle: boolean = false;
  public cookToggle: boolean = false;
  public publicToggle: boolean = false;
  public regularToggle: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onSlideToggleClick() {
    console.log(this.eatToggle);
    console.log(this.cookToggle);
    console.log(this.publicToggle);
    console.log(this.regularToggle);
  }
}

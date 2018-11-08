import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HeaderTabService } from 'src/app/services/header-tab.service';
import { TabSelectionType } from 'src/app/enum/tab-selection-type.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-tab',
  templateUrl: './header-tab.component.html',
  styleUrls: ['./header-tab.component.css']
})
export class HeaderTabComponent implements OnInit {

  constructor(private router: Router,
    private headerTabService: HeaderTabService) {

  }

  ngOnInit() {
  }

  public selectEvents() {
    if (!this.headerTabService.isTypeEvents()) {
      this.router.navigate(['/admin']);
      this.headerTabService.setCurrentType(TabSelectionType.EVENTS);
    }
  }

  public selectContributors() {
    if (!this.headerTabService.isTypeContributors()) {
      this.router.navigate(['/admin']);
      this.headerTabService.setCurrentType(TabSelectionType.CONTRIBUTORS);
    }
  }

  public get isTypeEvents(): boolean {
    return this.headerTabService.isTypeEvents();
  }

  public get isTypeContributors(): boolean {
    return this.headerTabService.isTypeContributors();
  }

}

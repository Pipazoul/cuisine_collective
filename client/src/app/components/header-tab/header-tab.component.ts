import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HeaderTabService, TabSelectionType } from 'src/app/services/header-tab.service';

@Component({
  selector: 'app-header-tab',
  templateUrl: './header-tab.component.html',
  styleUrls: ['./header-tab.component.css']
})
export class HeaderTabComponent implements OnInit {

  public readonly TabSelectionType = TabSelectionType;

  public selectionType: TabSelectionType = TabSelectionType.EVENTS;

  constructor(private headerTabService: HeaderTabService) {

  }

  ngOnInit() {
  }

  public selectEvents() {
    if (this.selectionType !== TabSelectionType.EVENTS) {
      this.headerTabService.typeChanged.next(this.selectionType = TabSelectionType.EVENTS);
    }
  }

  public selectContributors() {
    if (this.selectionType !== TabSelectionType.CONTRIBUTORS) {
      this.headerTabService.typeChanged.next(this.selectionType = TabSelectionType.CONTRIBUTORS);
    }
  }

}

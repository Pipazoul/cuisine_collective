import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-tab',
  templateUrl: './header-tab.component.html',
  styleUrls: ['./header-tab.component.css']
})
export class HeaderTabComponent implements OnInit {

  public readonly TabSelectionType = TabSelectionType;

  @Output() public tabChanged: EventEmitter<TabSelectionType> = new EventEmitter();
  public selectionType: TabSelectionType = TabSelectionType.EVENTS;

  constructor() { }

  ngOnInit() {
  }

  public selectEvents() {
    if (this.selectionType !== TabSelectionType.EVENTS) {
      this.tabChanged.emit(this.selectionType = TabSelectionType.EVENTS);
    }
  }

  public selectContributors() {
    if (this.selectionType !== TabSelectionType.CONTRIBUTORS) {
      this.tabChanged.emit(this.selectionType = TabSelectionType.CONTRIBUTORS);
    }
  }

}

export enum TabSelectionType {
  EVENTS = 1,
  CONTRIBUTORS = 2
}

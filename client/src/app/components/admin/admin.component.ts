import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabSelectionType } from 'src/app/enum/tab-selection-type.enum';
import { HeaderTabService } from 'src/app/services/header-tab.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public readonly TabSelectionType = TabSelectionType;

  public selectedType: TabSelectionType = HeaderTabService.DEFAULT_TYPE;
  private onHeaderTabChanged: Subscription;

  constructor(private headerTabService: HeaderTabService) {
  }

  ngOnInit() {
    this.onHeaderTabChanged = this.headerTabService.typeChanged.subscribe((res) => res && (this.selectedType = res));
  }

  ngOnDestroy() {
    this.onHeaderTabChanged.unsubscribe();
  }

}

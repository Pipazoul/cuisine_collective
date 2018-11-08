import { Component } from '@angular/core';
import { HeaderTabService } from 'src/app/services/header-tab.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private headerTabService: HeaderTabService) {
  }

  public get isTypeEvents(): boolean {
    return this.headerTabService.isTypeEvents();
  }

  public get isTypeContributors(): boolean {
    return this.headerTabService.isTypeContributors();
  }

}

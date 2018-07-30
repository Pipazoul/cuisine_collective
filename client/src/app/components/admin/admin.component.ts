import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';

import { ComponentInjectorService } from '../../services/component-injector.service';

import { AddElementComponent } from './add-element/add-element.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @ViewChild('dynamic', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  public opened: boolean = false;

  constructor(private componentInjectorService: ComponentInjectorService) {
  }

  ngOnInit() {
  }

  public openSidenavAddElement() {
    if (!this.viewContainerRef.length) {
      this.componentInjectorService.addComponent(this.viewContainerRef, AddElementComponent);
    }
    this.opened = true;
  }

}

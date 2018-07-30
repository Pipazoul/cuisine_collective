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
  public sidenavTitle: string;
  public sidenavColor: string;

  constructor(private componentInjectorService: ComponentInjectorService) {
  }

  ngOnInit() {
  }

  public openSidenavAddElement() {
    if (!this.viewContainerRef.length) {
      this.componentInjectorService.addComponent(this.viewContainerRef, AddElementComponent);
      this.sidenavTitle = 'Ajouter un élément sur la carte';
      this.sidenavColor = 'background-red';
    }
    this.opened = true;
  }

  public closeSidenav() {
    this.opened = false;
    this.viewContainerRef.clear();
  }

}

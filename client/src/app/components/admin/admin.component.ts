import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ComponentInjectorService } from '../../services/component-injector.service';
import { EventFormComponent } from './event-form/event-form.component';

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
    this.componentInjectorService.setRootViewContainerRef(this.viewContainerRef);
  }

  public openSidenavAddEvent() {
    this.componentInjectorService.addComponent(EventFormComponent);
    this.opened = true;
  }

}

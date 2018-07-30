import { Component, ViewChild, ElementRef, AfterViewInit, ViewContainerRef, OnInit } from '@angular/core';
import * as ol from 'openlayers';
import { ComponentInjectorService } from './services/component-injector.service';
import { AddElementComponent } from './components/admin/add-element/add-element.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  // Map
  @ViewChild('map') mapElement: ElementRef;
  title = 'client';
  initialCoordinates: [number, number] = [538262.3872128094, 5740786.2887582248];
  initialZoom: number = 11;
  map: ol.Map;
  markerSource = new ol.source.Vector();

  // Sidenav
  @ViewChild('dynamic', { read: ViewContainerRef }) private viewContainerRef: ViewContainerRef;
  public showSidenav: boolean = false;
  public sidenavTitle: string;
  public sidenavColor: string;

  constructor(private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private componentInjectorService: ComponentInjectorService) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(res => {
      if (res.addElement === 'true') {
        this.openSidenavAddElement();
      }
      if (!res.addElement || res.addElement !== 'true') {
        this.closeSidenav();
      }
    });
  }

  ngAfterViewInit(): void {
    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: this.markerSource,
        }),
      ],
      target: this.mapElement.nativeElement,
      controls: ol.control.defaults({
        attribution: false,
        zoom: false,
        rotate: false
      }),
      interactions: ol.interaction.defaults({ doubleClickZoom: false }),
      view: new ol.View({
        center: this.initialCoordinates,
        zoom: this.initialZoom
      })
    });
    var iconFeatures = [];

    var iconFeature = new ol.Feature({
      geometry: new ol.geom.Point([538262.3872128094, 5740786.2887582248]),
      name: 'Null Island',
      population: 4000,
      rainfall: 500
    });

    iconFeature.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          color: '#8959A8',
          crossOrigin: 'anonymous',
          src: 'assets/pin.png',
          anchor: [0.5, 1]
        }))
    }));
    this.markerSource.addFeature(iconFeature);
  }

  public openSidenavAddElement() {
    if (!this.authenticationService.isConnected) {
      return;
    }
    if (!this.viewContainerRef.length) {
      this.componentInjectorService.addComponent(this.viewContainerRef, AddElementComponent);
      this.sidenavTitle = 'Ajouter un élément sur la carte';
      this.sidenavColor = 'background-red';
    }
    this.showSidenav = true;
  }

  public closeSidenav() {
    this.showSidenav = false;
    this.viewContainerRef.clear();
  }
}

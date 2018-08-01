import { Component, ViewChild, ElementRef, AfterViewInit, ViewContainerRef, OnInit } from '@angular/core';
import * as ol from 'openlayers';
import { ComponentInjectorService } from './services/component-injector.service';
import { AddElementComponent } from './components/admin/add-element/add-element.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { EventService } from './services/event.service';
import { EventClass } from './domain/event.class';
import { ContributorClass } from './domain/contributor.class';
import { zip } from 'rxjs';
import { ContributorService } from './services/contributor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  eventColor = '#6CCACC';
  contributorColor = '#F9A755';
  selectedEventColor = '#FF5555';

  events: EventClass[];
  contributors: ContributorClass[];

  @ViewChild('map') mapElement: ElementRef;
  title = 'client';
  initialCoordinates: [number, number] = [538262.3872128094, 5740786.2887582248];
  initialZoom: number = 11;
  searchZoom: number = 16;
  map: ol.Map;
  get eventsMarkerSource() {
    return new ol.source.Vector({
      features: this.events.map((event) =>
        new ol.Feature({
          geometry: new ol.geom.Point([event.longitude, event.latitude]),
          id: event.id
        })
      )
    });
  }
  get contributorsMarkerSource() {
    return new ol.source.Vector({
      features: this.contributors.map((contributor) =>
        new ol.Feature({
          geometry: new ol.geom.Point([contributor.longitude, contributor.latitude]),
          id: contributor.id
        })
      )
    });
  }
  selectInteraction = new ol.interaction.Select({ multi: false, style: this.selectedEventStyle, hitTolerance: 10 });
  // Sidenav
  @ViewChild('dynamic', { read: ViewContainerRef }) private viewContainerRef: ViewContainerRef;
  public showSidenav: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private componentInjectorService: ComponentInjectorService,
    private router: Router,
    private eventService: EventService,
    private contributorService: ContributorService
  ) { }

  ngOnInit() {
  }

  get eventStyle() {
    return new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        color: this.eventColor,
        src: 'assets/pin.png',
        anchor: [0.5, 1]
      }))
    });
  }

  get contributorStyle() {
    return new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        color: this.contributorColor,
        src: 'assets/pin.png',
        anchor: [0.5, 1]
      }))
    });
  }

  get selectedEventStyle() {
    return new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        color: this.selectedEventColor,
        src: 'assets/pin.png',
        anchor: [0.5, 1]
      }))
    });
  }

  /**
   * Center the map on the given coordinates
   * @param coordinates coordinates
   */
  goTo(coordinates) {
    this.map.set('view', new ol.View({
      center: ol.proj.fromLonLat(coordinates, 'EPSG:3857'),
      zoom: this.searchZoom
    }));
  }

  ngAfterViewInit(): void {
    this.initializeData().subscribe(pair => {
      this.events = pair[0];
      this.contributors = pair[1];
      this.initializeMap();
    })
  }

  initializeData() {
    return zip(this.eventService.getAll(), this.contributorService.getAll());
  }

  initializeMap() {
    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: this.eventsMarkerSource,
          style: this.eventStyle
        }),
        new ol.layer.Vector({
          source: this.contributorsMarkerSource,
          style: this.contributorStyle
        }),
      ],
      target: this.mapElement.nativeElement,
      controls: ol.control.defaults({
        attribution: false,
        zoom: false,
        rotate: false
      }),
      interactions:
        ol.interaction.defaults({ doubleClickZoom: false }).extend([
          this.selectInteraction
        ]),
      view: new ol.View({
        center: this.initialCoordinates,
        zoom: this.initialZoom
      })
    });

    this.selectInteraction.on('select', (e: ol.interaction.Select.Event) => {
      debugger;
      if (e.selected && e.target.getFeatures().item(0)) {
        this.router.navigate(['events', e.target.getFeatures().item(0).getProperties().id]);
      }
      else {
        this.router.navigate(['home']);
      }
    });

    /*var mousePosition = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(10),
      projection: 'EPSG:3857',
      target: document.getElementById('myposition'),
      undefinedHTML: '&nbsp;'
    });

    this.map.addControl(mousePosition);*/
  }

  public closeSidenav() {
    this.showSidenav = false;
    this.viewContainerRef.clear();
  }

  onPrimaryRouterActivate(event) {
    this.showSidenav = true;
  }

  onPrimaryRouterDeactivate(event) {
    this.showSidenav = false;
  }
}

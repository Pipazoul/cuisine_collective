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
  eventColor = '#6CCACC';
  toBeAccompaniedEventColor = '#F9A755';
  selectedEventColor = '#FF5555';

  mockEvents: { id: number, type: number, coordinates: [number, number] }[] = [
    {
      id: 1,
      type: 1,
      coordinates: [532262.3872128094, 5740786.2887582248]
    },
    {
      id: 2,
      type: 2,
      coordinates: [534356.3872128094, 5740897.2887582248]
    },
    {
      id: 3,
      type: 1,
      coordinates: [530892.3872128094, 5749564.2887582248]
    },
    {
      id: 4,
      type: 1,
      coordinates: [536187.3872128094, 5745493.2887582248]
    },
    {
      id: 5,
      type: 1,
      coordinates: [535684.3872128094, 5740543.2887582248]
    },
    {
      id: 6,
      type: 2,
      coordinates: [537892.3872128094, 5748927.2887582248]
    },
    {
      id: 7,
      type: 1,
      coordinates: [539298.3872128094, 5745938.2887582248]
    },
    {
      id: 8,
      type: 1,
      coordinates: [538390.3872128094, 5748935.2887582248]
    }
  ]

  @ViewChild('map') mapElement: ElementRef;
  title = 'client';
  initialCoordinates: [number, number] = [538262.3872128094, 5740786.2887582248];
  initialZoom: number = 11;
  map: ol.Map;
  eventsMarkerSource = new ol.source.Vector({
    features: this.mockEvents.filter(x => x.type === 1).map((event) =>
      new ol.Feature({
        geometry: new ol.geom.Point(event.coordinates),
        type: event.type,
        id: event.id
      })
    )
  });
  toBeAccompaniedEventsMarkerSource = new ol.source.Vector({
    features: this.mockEvents.filter(x => x.type === 2).map((event) =>
      new ol.Feature({
        geometry: new ol.geom.Point(event.coordinates),
        type: event.type,
        id: event.id
      })
    )
  });
  selectInteraction = new ol.interaction.Select({ multi: false, style: this.selectedEventStyle, hitTolerance: 10 });
  // Sidenav
  @ViewChild('dynamic', { read: ViewContainerRef }) private viewContainerRef: ViewContainerRef;
  public showSidenav: boolean = false;
  public sidenavTitle: string;
  public sidenavColor: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private componentInjectorService: ComponentInjectorService,
    private router: Router
  ) {

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

  get eventStyle() {
    return new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        color: this.eventColor,
        src: 'assets/pin.png',
        anchor: [0.5, 1]
      }))
    });
  }

  get toBeAccompaniedEventStyle() {
    return new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        color: this.toBeAccompaniedEventColor,
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

  ngAfterViewInit(): void {
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
          source: this.toBeAccompaniedEventsMarkerSource,
          style: this.toBeAccompaniedEventStyle
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
      console.log(e.target.getFeatures());
      if (e.selected && e.target.getFeatures().item(0)) {
        this.router.navigate(['events', e.target.getFeatures().item(0).getProperties().id]);
      }
    });
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

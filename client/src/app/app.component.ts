import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import { Router, NavigationEnd, ActivatedRoute, UrlSegmentGroup } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { EventService } from './services/event.service';
import { EventClass } from './domain/event.class';
import { ContributorClass } from './domain/contributor.class';
import { zip } from 'rxjs';
import { ContributorService } from './services/contributor.service';
import { filter } from 'rxjs/operators';
import { ArrayUtils } from './util/ArrayUtils';
import { EventEditionComponent } from './components/event-edition/event-edition.component';
import { ContributorEditionComponent } from './components/contributor-edition/contributor-edition.component';
import { RepresentedOnMapComponent } from './components/base/represented-on-map/represented-on-map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  eventColor = '#6CCACC';
  contributorColor = '#0D70CD';
  selectedColor = '#FF5555';

  events: EventClass[];
  contributors: ContributorClass[];

  @ViewChild('map') mapElement: ElementRef;
  title = 'client';
  initialCoordinates: [number, number] = [538262.3872128094, 5740786.2887582248];
  initialZoom: number = 13;
  searchZoom: number = 16;
  map: ol.Map;

  public showSidenav: boolean = false;
  publishedEventsFeatures: ol.Feature[];
  notPublishedEventsFeatures: ol.Feature[];
  contributorsFeatures: ol.Feature[];
  publishedEventsMarkerSource: ol.source.Vector;
  notPublishedEventsMarkerSource: ol.source.Vector;
  contributorsMarkerSource: ol.source.Vector;
  publishedEventsLayer: ol.layer.Vector;
  notPublishedEventsLayer: ol.layer.Vector;
  contributorsLayer: ol.layer.Vector;
  selectInteraction: ol.interaction.Select;
  currentRouteWithNoSelection: ActivatedRoute;
  _publishedEventStyle: ol.style.Style;
  _notPublishedEventStyle: ol.style.Style;
  _contributorStyle: ol.style.Style;
  _selectedLocationPinStyle: ol.style.Style;
  _selectedEditLocationPinStyle: ol.style.Style;


  constructor(
    private router: Router,
    private eventService: EventService,
    private contributorService: ContributorService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authenticationService.connectionStatusChanged.subscribe((connected) => {
      if (connected === true || connected === false) {
        this.eventService.getAll().subscribe(events => this.redrawEvents(events));
      }
      if (connected === true) {
        this.contributorService.getAll().subscribe(contributors => this.redrawContributors(contributors));
      } else if (connected === false) {
        this.contributorService.getAssistants().subscribe(contributors => this.redrawContributors(contributors));
      }
    });

    //Eagerly load styles to avoid rendering bugs when selecting a feature for the first time
    this.publishedEventStyle;
    this.notPublishedEventStyle;
    this.contributorStyle;
    this.selectedLocationPinStyle;
    this.selectedEditLocationPinStyle;
  }

  get publishedEventStyle() {
    if (!this._publishedEventStyle) {
      let canvas = this.addWhiteOutlineToMarker('assets/location_on.svg', this.eventColor);

      this._publishedEventStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          img: canvas,
          imgSize: canvas ? [canvas.width, canvas.height] : undefined,
          anchor: [0.5, 1]
        }))
      });
    }
    return this._publishedEventStyle;
  }

  get notPublishedEventStyle() {
    if (!this._notPublishedEventStyle) {
      let canvas = this.addWhiteOutlineToMarker('assets/edit_location.svg', this.eventColor);

      this._notPublishedEventStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          img: canvas,
          imgSize: canvas ? [canvas.width, canvas.height] : undefined,
          anchor: [0.5, 1]
        }))
      });
    }
    return this._notPublishedEventStyle;
  }

  get contributorStyle() {
    if (!this._contributorStyle) {
      let canvas = this.addWhiteOutlineToMarker('assets/location_on.svg', this.contributorColor);

      this._contributorStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          img: canvas,
          imgSize: canvas ? [canvas.width, canvas.height] : undefined,
          anchor: [0.5, 1]
        }))
      });
    }
    return this._contributorStyle;
  }

  get selectedLocationPinStyle() {
    if (!this._selectedLocationPinStyle) {
      let canvas = this.addWhiteOutlineToMarker('assets/location_on.svg', this.selectedColor);

      this._selectedLocationPinStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          img: canvas,
          imgSize: canvas ? [canvas.width, canvas.height] : undefined,
          anchor: [0.5, 1]
        }))
      });
    }
    return this._selectedLocationPinStyle;
  }

  get selectedEditLocationPinStyle() {
    if (!this._selectedEditLocationPinStyle) {
      let canvas = this.addWhiteOutlineToMarker('assets/edit_location.svg', this.selectedColor);

      this._selectedEditLocationPinStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          img: canvas,
          imgSize: canvas ? [canvas.width, canvas.height] : undefined,
          anchor: [0.5, 1]
        }))
      });
    }
    return this._selectedEditLocationPinStyle;
  }

  /**
   * Adds a white outline to a given marker with a given color
   * 
   * @param src URL of the marker SVG file
   * @param color Color of the marker
   * @returns The canvas to render
   */
  addWhiteOutlineToMarker(src: string, color: string): HTMLCanvasElement {
    //Initialize canvas
    var canvas = document.createElement('canvas');
    canvas.height = 80;
    canvas.width = 80;
    var ctx = canvas.getContext('2d');

    //Initialize images
    var markerImage = new Image();
    var backgroundImage = new Image();

    //Load marker image
    var xhr = new XMLHttpRequest();
    xhr.open("GET", src);
    xhr.send();
    xhr.onload = () => {
      var svg = xhr.responseXML.documentElement;
      svg.getElementsByTagName('path')[0].setAttribute('fill', color);
      markerImage.src = 'data:image/svg+xml;base64,' + btoa(svg.outerHTML);
    };

    //Load background image
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", 'assets/marker_background.svg');
    xhr2.send();
    xhr2.onload = () => {
      var svg = xhr2.responseXML.documentElement;
      backgroundImage.src = 'data:image/svg+xml;base64,' + btoa(svg.outerHTML);
    };

    //Wrap markerImage.onload into a Promise
    var markerImageLoaded = new Promise((resolve, reject) => {
      markerImage.onload = () => {
        resolve();
      };
    });

    //Wrap backgroundImage.onload into a Promise
    var backgroundImageLoaded = new Promise((resolve, reject) => {
      backgroundImage.onload = () => {
        resolve();
      };
    });

    //Draw canvas
    Promise.all([markerImageLoaded, backgroundImageLoaded]).then(() => {
      ctx.drawImage(backgroundImage, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      //x offset: (88 - 72) / 2
      //y offset: (88 - 72) * 0.38 because the center of the circle is approximately at 38% height from the top
      ctx.drawImage(markerImage, 8, 6);
    });
    return canvas;
  }

  get routingUrls() {
    const admin = 'admin';
    const events = 'events';
    const contributors = 'contributors';
    const root = '';

    const routes = {
      events: this.authenticationService.isConnected ? [admin, events] : [events],
      contributors: this.authenticationService.isConnected ? [admin, contributors] : [contributors],
      root: this.authenticationService.isConnected ? [admin, root] : [root]
    }
    return routes;
  }

  /**
   * Center the map on the given coordinates
   * @param coordinates coordinates
   */
  goTo(coordinates: [number, number]) {
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

      //Select the right marker when URL is "/events/:id" or "/contributors/:id"
      const currentUrl = this.router.parseUrl(this.router.url).root.children.primary
      this.selectCurrentMarker(currentUrl);
      this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(res => {
        const currentUrl = this.router.parseUrl((<NavigationEnd>res).urlAfterRedirects).root.children.primary;
        this.selectCurrentMarker(currentUrl);

      });
    });
  }

  selectCurrentMarker(currentUrl: UrlSegmentGroup) {
    if (!currentUrl) return;

    this.selectInteraction.getFeatures().clear();

    let pathToCompare;
    let next;
    if (this.authenticationService.isConnected) {
      pathToCompare = currentUrl.segments.map(x => x.path).slice(0, 2);
      next = currentUrl.segments[2];
    }
    else {
      pathToCompare = currentUrl.segments.map(x => x.path).slice(0, 1);
      next = currentUrl.segments[1];
    }

    if (ArrayUtils.compareSortedArrays(pathToCompare, this.routingUrls.events) && !isNaN(+next)) {
      let featureToSelect = this.publishedEventsFeatures.find(x => x.get('object').id === +next) || this.notPublishedEventsFeatures.find(x => x.get('object').id === +next);
      this.selectInteraction.getFeatures().push(featureToSelect);
    }
    else if (ArrayUtils.compareSortedArrays(pathToCompare, this.routingUrls.contributors) && !isNaN(+next)) {
      this.selectInteraction.getFeatures().push(this.contributorsFeatures.find(x => x.get('object').id === +next));
    }
  }

  unloadFilteredEventOrContributor() {
    const currentUrl = this.router.parseUrl(this.router.url).root.children.primary;
    if (currentUrl) {

      this.selectInteraction.getFeatures().clear();

      let pathToCompare;
      let next;

      if (this.authenticationService.isConnected) {
        pathToCompare = currentUrl.segments.map(x => x.path).slice(0, 2);
        next = currentUrl.segments[2];
      }
      else {
        pathToCompare = currentUrl.segments.map(x => x.path).slice(0, 1);
        next = currentUrl.segments[1];
      }

      if (ArrayUtils.compareSortedArrays(pathToCompare, this.routingUrls.events) && !isNaN(+next)) {
        if (this.events.find(x => x.id === +next)) {
          this.router.navigate(this.routingUrls.root);
        }
      }
      else if (ArrayUtils.compareSortedArrays(pathToCompare, this.routingUrls.contributors) && !isNaN(+next)) {
        if (this.contributors.find(x => x.id === +next)) {
          this.router.navigate(this.routingUrls.root);
        }
      }
    }
  }

  initializeData() {
    return zip(this.eventService.getAll(), this.contributorService.getAll());
  }

  initializeMap() {
    this.publishedEventsFeatures = this.events.filter(x => x.publish).map((event) =>
      new ol.Feature({
        geometry: new ol.geom.Point([event.longitude, event.latitude]),
        object: event
      })
    );

    this.publishedEventsMarkerSource = new ol.source.Vector({
      features: this.publishedEventsFeatures
    });

    this.notPublishedEventsFeatures = this.events.filter(x => !x.publish).map((event) =>
      new ol.Feature({
        geometry: new ol.geom.Point([event.longitude, event.latitude]),
        object: event,
      })
    );

    this.notPublishedEventsMarkerSource = new ol.source.Vector({
      features: this.notPublishedEventsFeatures
    });

    this.contributorsFeatures = this.contributors.map((contributor) =>
      new ol.Feature({
        geometry: new ol.geom.Point([contributor.longitude, contributor.latitude]),
        object: contributor
      })
    );

    this.contributorsMarkerSource = new ol.source.Vector({
      features: this.contributorsFeatures
    });

    this.publishedEventsLayer = new ol.layer.Vector({
      source: this.publishedEventsMarkerSource,
      style: this.publishedEventStyle,
    });

    this.notPublishedEventsLayer = new ol.layer.Vector({
      source: this.notPublishedEventsMarkerSource,
      style: this.notPublishedEventStyle,
    });

    this.contributorsLayer = new ol.layer.Vector({
      source: this.contributorsMarkerSource,
      style: this.contributorStyle,
    });

    this.selectInteraction = new ol.interaction.Select(
      {
        multi: false,
        style: (feature: (ol.Feature | ol.render.Feature), resolution: number) => {
          if (feature.getProperties().object instanceof EventClass && !feature.getProperties().object.publish) {
            return this.selectedEditLocationPinStyle;
          }
          return this.selectedLocationPinStyle;
        },
        hitTolerance: 10
      }
    );

    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        this.publishedEventsLayer,
        this.notPublishedEventsLayer,
        this.contributorsLayer,
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
      if (e.selected && e.target.getFeatures().item(0)) {
        if (e.target.getFeatures().item(0).get('object') instanceof EventClass) {
          this.router.navigate([...this.routingUrls.events, e.target.getFeatures().item(0).getProperties().object.id]);
        }
        else if (e.target.getFeatures().item(0).get('object') instanceof ContributorClass) {
          this.router.navigate([...this.routingUrls.contributors, e.target.getFeatures().item(0).getProperties().object.id]);
        }
      }
      else {
        this.router.navigate(this.routingUrls.root);
      }
    });

    // change mouse cursor when over marker
    this.map.on('pointermove', (e) => {
      var pixel = this.map.getEventPixel(e['originalEvent']);
      var mapDiv = (this.map.getTarget() as Element)

      this.map.hasFeatureAtPixel(pixel) ? mapDiv.classList.add("clickable") : mapDiv.classList.remove("clickable");
    });
  }

  onPrimaryRouterActivate(elementRef) {
    this.showSidenav = true;

    // Event filter of the sidenav
    if (elementRef instanceof RepresentedOnMapComponent) {
      elementRef.removePoint.subscribe(params => {
        if (params.type === EventClass) {
          _.each(this.publishedEventsLayer.getSource().getFeatures(), feature => {
            if (feature.get('object').id === params.id) {
              this.publishedEventsLayer.getSource().removeFeature(feature);
            }
          });
          _.each(this.notPublishedEventsLayer.getSource().getFeatures(), feature => {
            if (feature.get('object').id === params.id) {
              this.notPublishedEventsLayer.getSource().removeFeature(feature);
            }
          });
        } else if (params.type === ContributorClass) {
          _.each(this.contributorsLayer.getSource().getFeatures(), feature => {
            if (feature.get('object').id === params.id) {
              this.contributorsLayer.getSource().removeFeature(feature);
            }
          });
        }
      }, err => {
        console.error(err);
      });
    }
  }

  onPrimaryRouterDeactivate(component) {
    if (component instanceof EventEditionComponent && component.saved) {
      const event = this.events.find(x => x.id === component.event.id);
      const index = this.events.indexOf(event);
      if (event) {
        this.events.splice(index, 1, component.event)
      }
      else {
        this.events.push(component.event);
      }

      this.redrawEvents(this.events);
    }

    if (component instanceof ContributorEditionComponent && component.saved) {
      const contributor = this.contributors.find(x => x.id === component.contributor.id);
      const index = this.contributors.indexOf(contributor);
      if (contributor) {
        this.contributors.splice(index, 1, component.contributor)
      }
      else {
        this.contributors.push(component.contributor);
      }

      this.redrawContributors(this.contributors);
    }

    this.showSidenav = false;
  }

  /**
   * Subscribe to router outlet's child component's event
   * @param elementRef sidenav
   */
  onActivate(elementRef) {
    // Event filter of the filters menu
    elementRef.filterEvents.subscribe(filters => {
      this.eventService.getAll(filters).subscribe(events => {
        this.unloadFilteredEventOrContributor();
        this.redrawEvents(events);
      });
    }, err => {
      console.error(err);
    });
    elementRef.filterContributors.subscribe(filters => {
      this.contributorService.getAll(filters).subscribe(contributors => {
        this.unloadFilteredEventOrContributor();
        this.redrawContributors(contributors);
      });
    }, err => {
      console.error(err);
    });
  }

  /**
   * Remove all events from layer then add the new ones
   * @param events list of new events to draw
   */
  redrawEvents(events) {
    // Removing all previous features of publishedEventsLayer
    _.each(this.publishedEventsLayer.getSource().getFeatures(), feature => {
      this.publishedEventsLayer.getSource().removeFeature(feature);
    });

    // Removing all previous features of notPublishedEventsLayer
    _.each(this.notPublishedEventsLayer.getSource().getFeatures(), feature => {
      this.notPublishedEventsLayer.getSource().removeFeature(feature);
    });

    // Adding all new features (events) of publishedEventsLayer
    events.filter(x => x.publish).map((event) =>
      this.publishedEventsLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point([event.longitude, event.latitude]),
        object: event,
      }))
    );

    // Adding all new features (events) of notPublishedEventsLayer
    events.filter(x => !x.publish).map((event) =>
      this.notPublishedEventsLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point([event.longitude, event.latitude]),
        object: event,
      }))
    );
  }

  /**
   * Remove all contributors from layer then add the new ones
   * @param contributors list of new contributors to draw
   */
  redrawContributors(contributors) {
    // Removing all previous features of eventLayer
    _.each(this.contributorsLayer.getSource().getFeatures(), feature => {
      this.contributorsLayer.getSource().removeFeature(feature);
    });

    // Adding all new features (contributors) of eventLayer
    contributors.map((contributor) =>
      this.contributorsLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point([contributor.longitude, contributor.latitude]),
        object: contributor
      }))
    );
  }
}

import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
import { ItemClass } from './domain/items-list.class';

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

  @ViewChild('itemsList') itemsList: ElementRef;
  @ViewChild('map') mapElement: ElementRef;
  title = 'client';
  initialCoordinates: [number, number] = [538262.3872128094, 5740786.2887582248];
  initialZoom: number = 13;
  searchZoom: number = 16;
  map: ol.Map;

  public popupContent: SafeHtml;
  public sameLocationItems: ItemClass[] = [];
  public popup: ol.Overlay;
  public showSidenav: boolean = false;
  publishedEventsFeatures: ol.Feature[];
  notPublishedEventsFeatures: ol.Feature[];
  contributorsFeatures: ol.Feature[];
  sameLocationItemFeatures: ol.Feature[];
  publishedEventsMarkerSource: ol.source.Vector;
  notPublishedEventsMarkerSource: ol.source.Vector;
  contributorsMarkerSource: ol.source.Vector;
  sameLocationItemMarkerSource: ol.source.Vector;
  publishedEventsLayer: ol.layer.Vector;
  notPublishedEventsLayer: ol.layer.Vector;
  contributorsLayer: ol.layer.Vector;
  sameLocationItemLayer: ol.layer.Vector;
  selectInteraction: ol.interaction.Select;
  currentRouteWithNoSelection: ActivatedRoute;
  _publishedEventStyle: ol.style.Style;
  _notPublishedEventStyle: ol.style.Style;
  _contributorStyle: ol.style.Style;
  _sameLocationItemStyle: ol.style.Style;
  _selectedLocationPinStyle: ol.style.Style;
  _selectedEditLocationPinStyle: ol.style.Style;
  _selectedSameLocationPinStyle: ol.style.Style;

  constructor(
    private router: Router,
    private eventService: EventService,
    private contributorService: ContributorService,
    private authenticationService: AuthenticationService,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.authenticationService.connectionStatusChanged.subscribe((connected) => {
      if (connected === true || connected === false) {
        this.eventService.getAll().subscribe(events => {
          this.events = events;
          this.redrawAll();
        });
      }
      if (connected === true) {
        this.contributorService.getAll().subscribe(contributors => {
          this.contributors = contributors;
          this.redrawAll();
        });
      } else if (connected === false) {
        // We don't load any contributor
        this.contributors = [];
        this.redrawAll();
      }
    });

    // To handle click on popup results
    this.itemsList.nativeElement.addEventListener('click', (e) => {
      if (e.target.className.indexOf('event') >= 0) {
        this.router.navigate([...this.routingUrls.events, e.target.id.split('-')[1]]);
      } else if (e.target.className.indexOf('contributor') >= 0) {
        this.router.navigate([...this.routingUrls.contributors, e.target.id.split('-')[1]]);
      }
    });

    //Eagerly load styles to avoid rendering bugs when selecting a feature for the first time
    this.publishedEventStyle;
    this.notPublishedEventStyle;
    this.contributorStyle;
    this.sameLocationItemStyle;
    this.selectedLocationPinStyle;
    this.selectedEditLocationPinStyle;
    this.selectedSameLocationPinStyle;
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

  get sameLocationItemStyle() {
    if (!this._sameLocationItemStyle) {
      let canvas = this.addWhiteOutlineToMarker('assets/add_location.svg', this.eventColor);

      this._sameLocationItemStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          img: canvas,
          imgSize: canvas ? [canvas.width, canvas.height] : undefined,
          anchor: [0.5, 1]
        }))
      });
    }
    return this._sameLocationItemStyle;
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

  get selectedSameLocationPinStyle() {
    if (!this._selectedSameLocationPinStyle) {
      let canvas = this.addWhiteOutlineToMarker('assets/add_location.svg', this.selectedColor);

      this._selectedSameLocationPinStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          img: canvas,
          imgSize: canvas ? [canvas.width, canvas.height] : undefined,
          anchor: [0.5, 1]
        }))
      });
    }
    return this._selectedSameLocationPinStyle;
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

      // Compute items list of same coordinate elements
      this.filterItems();

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
    this.popupContent = '';
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

    let featureToSelect = undefined;

    if (ArrayUtils.compareSortedArrays(pathToCompare, this.routingUrls.events) && !isNaN(+next)) {
      featureToSelect = this.publishedEventsFeatures.find(x => x.get('object').id === +next) ||
        this.notPublishedEventsFeatures.find(x => x.get('object').id === +next);

      if (featureToSelect) {
        // The feature is not in events list
        this.selectInteraction.getFeatures().push(featureToSelect);
      } else {
        // Look for the feature in the "same location items" list
        featureToSelect = this.sameLocationItemFeatures.find(x =>
          _.find(x.get('object').itemsList, (item) => {
            return item instanceof EventClass && item.id === +next;
          }));

        if (featureToSelect) {
          this.initPopupContent(featureToSelect, 'event-' + next);
          // Feature is part of a list - add class to the right div
          this.selectInteraction.getFeatures().push(featureToSelect);
        } else {
          // Item is not displayed anywhere, then we go to root
          this.router.navigate(this.routingUrls.root);
        }
      }
    }
    else if (ArrayUtils.compareSortedArrays(pathToCompare, this.routingUrls.contributors) && !isNaN(+next)) {
      featureToSelect = this.contributorsFeatures.find(x => x.get('object').id === +next);

      if (featureToSelect) {
        this.selectInteraction.getFeatures().push(featureToSelect);
      } else {
        // Look for the feature in the "same location items" list
        featureToSelect = this.sameLocationItemFeatures.find(x =>
          _.find(x.get('object').itemsList, (item) => {
            return item instanceof ContributorClass && item.id === +next;
          }));

        if (featureToSelect) {
          this.initPopupContent(featureToSelect, 'contributor-' + next);
          // Feature is part of a list - add class to the right div
          this.selectInteraction.getFeatures().push(featureToSelect);
        } else {
          // Item is not displayed anywhere, then we go to root
          this.router.navigate(this.routingUrls.root);
        }
      }
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

      if (next) {
        if (ArrayUtils.compareSortedArrays(pathToCompare, this.routingUrls.events)) {
          if (!this.events.find(x => x.id === +next)) {
            // If event is not in events list
            this.router.navigate(this.routingUrls.root);
          } else {
            var item = _.find(this.sameLocationItems, sameLocationItem => _.find(sameLocationItem.itemsList, (item) => {
              return item instanceof EventClass && item.id === +next;
            }));
            if (!item) {
              // If event is not in "same location items" list
              this.router.navigate(this.routingUrls.root);
            }
          }
        }
        else if (ArrayUtils.compareSortedArrays(pathToCompare, this.routingUrls.contributors)) {
          if (!this.contributors.find(x => x.id === +next)) {
            // If contributor is not in contributors list
            this.router.navigate(this.routingUrls.root);
          } else {
            var item = _.find(this.sameLocationItems, sameLocationItem => _.find(sameLocationItem.itemsList, (item) => {
              return item instanceof ContributorClass && item.id === +next;
            }));
            if (!item) {
              // If contributor is not in "same location items" list
              this.router.navigate(this.routingUrls.root);
            }
          }
        }
      } else {
        this.popupContent = '';
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

    this.publishedEventsLayer = new ol.layer.Vector({
      source: this.publishedEventsMarkerSource,
      style: this.publishedEventStyle,
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

    this.notPublishedEventsLayer = new ol.layer.Vector({
      source: this.notPublishedEventsMarkerSource,
      style: this.notPublishedEventStyle,
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

    this.contributorsLayer = new ol.layer.Vector({
      source: this.contributorsMarkerSource,
      style: this.contributorStyle,
    });

    this.sameLocationItemFeatures = this.sameLocationItems.map((item) =>
      new ol.Feature({
        geometry: new ol.geom.Point([item.longitude, item.latitude]),
        object: item
      })
    );

    this.sameLocationItemMarkerSource = new ol.source.Vector({
      features: this.sameLocationItemFeatures
    });

    this.sameLocationItemLayer = new ol.layer.Vector({
      source: this.sameLocationItemMarkerSource,
      style: this.sameLocationItemStyle,
    });

    this.selectInteraction = new ol.interaction.Select(
      {
        multi: false,
        style: (feature: (ol.Feature | ol.render.Feature), resolution: number) => {
          if (feature.getProperties().object instanceof ItemClass) {
            return this.selectedSameLocationPinStyle;
          } else if (feature.getProperties().object instanceof EventClass && !feature.getProperties().object.publish) {
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
        this.sameLocationItemLayer
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
          this.popupContent = '';
          this.router.navigate([...this.routingUrls.events, e.target.getFeatures().item(0).getProperties().object.id]);
        }
        else if (e.target.getFeatures().item(0).get('object') instanceof ContributorClass) {
          this.popupContent = '';
          this.router.navigate([...this.routingUrls.contributors, e.target.getFeatures().item(0).getProperties().object.id]);
        } else if (e.target.getFeatures().item(0).get('object') instanceof ItemClass) {
          this.initPopupContent(e.target.getFeatures().item(0));
        }
      }
      else {
        this.popupContent = '';
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

  transform(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
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
        this.events = events;
        this.unloadFilteredEventOrContributor();
        this.redrawAll();
      });
    }, err => {
      console.error(err);
    });
    elementRef.filterContributors.subscribe(filters => {
      this.contributorService.getAll(filters).subscribe(contributors => {
        this.contributors = contributors;
        this.unloadFilteredEventOrContributor();
        this.redrawAll();
      });
    }, err => {
      console.error(err);
    });
  }

  redrawAll() {
    this.filterItems();
    this.redrawPublishedEvents();
    this.redrawUnpublishedEvents();
    this.redrawContributors();
    this.redrawSameLocationItems();
  }

  /**
   * Remove all published events from layer then add the new ones
   */
  redrawPublishedEvents() {
    // Removing all previous features of publishedEventsLayer
    _.each(this.publishedEventsLayer.getSource().getFeatures(), feature => {
      this.publishedEventsLayer.getSource().removeFeature(feature);
    });

    // Adding all new features (events) of publishedEventsLayer
    this.events.filter(x => x.publish).map((event) =>
      this.publishedEventsLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point([event.longitude, event.latitude]),
        object: event,
      }))
    );

    this.publishedEventsFeatures = this.events.filter(x => x.publish).map((event) =>
      new ol.Feature({
        geometry: new ol.geom.Point([event.longitude, event.latitude]),
        object: event
      })
    );
  }

  /**
   * Remove all unpublished events from layer then add the new ones
   */
  redrawUnpublishedEvents() {
    // Removing all previous features of notPublishedEventsLayer
    _.each(this.notPublishedEventsLayer.getSource().getFeatures(), feature => {
      this.notPublishedEventsLayer.getSource().removeFeature(feature);
    });

    // Adding all new features (events) of notPublishedEventsLayer
    this.events.filter(x => !x.publish).map((event) =>
      this.notPublishedEventsLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point([event.longitude, event.latitude]),
        object: event,
      }))
    );

    this.notPublishedEventsFeatures = this.events.filter(x => !x.publish).map((event) =>
      new ol.Feature({
        geometry: new ol.geom.Point([event.longitude, event.latitude]),
        object: event
      })
    );
  }

  /**
   * Remove all contributors from layer then add the new ones
   */
  redrawContributors() {
    // Removing all previous features
    _.each(this.contributorsLayer.getSource().getFeatures(), feature => {
      this.contributorsLayer.getSource().removeFeature(feature);
    });

    // Adding all new features
    this.contributors.map((contributor) =>
      this.contributorsLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point([contributor.longitude, contributor.latitude]),
        object: contributor
      }))
    );

    this.contributorsFeatures = this.contributors.map((contributor) =>
      new ol.Feature({
        geometry: new ol.geom.Point([contributor.longitude, contributor.latitude]),
        object: contributor
      })
    );
  }

  /**
   * Remove all same location items from layer then add the new ones
   */
  redrawSameLocationItems() {
    // Removing all previous features
    _.each(this.sameLocationItemLayer.getSource().getFeatures(), feature => {
      this.sameLocationItemLayer.getSource().removeFeature(feature);
    });

    // Adding all new features
    this.sameLocationItems.map((item) =>
      this.sameLocationItemLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point([item.longitude, item.latitude]),
        object: item
      }))
    );

    this.sameLocationItemFeatures = this.sameLocationItems.map((item) => {
      // TODO : Add overlay for the item list count
      return new ol.Feature({
        geometry: new ol.geom.Point([item.longitude, item.latitude]),
        object: item
      })
    });
  }

  filterItems() {
    var itemsList: ItemClass[] = this.sameLocationItems;

    // Group events by coordinate
    _.each(this.events, (event) => {
      var item = _.find(itemsList, { longitude: event.longitude, latitude: event.latitude });
      if (item) {
        item.itemsList.push(event);
      } else {
        itemsList.push(new ItemClass({
          longitude: event.longitude,
          latitude: event.latitude,
          itemsList: new Array(event)
        }));
      }
    });

    // Group contributors by coordinate
    _.each(this.contributors, (contributor) => {
      var item = _.find(itemsList, { longitude: contributor.longitude, latitude: contributor.latitude });
      if (item) {
        item.itemsList.push(contributor);
      } else {
        itemsList.push(new ItemClass({
          longitude: contributor.longitude,
          latitude: contributor.latitude,
          itemsList: new Array(contributor)
        }));
      }
    });

    // Remove item if not at least 2 element has the same coordinate
    this.sameLocationItems = _.reject(itemsList, item => item.itemsList.length < 2)

    _.each(this.sameLocationItems, (item) => {
      _.each(item.itemsList, (element) => {
        if (element instanceof EventClass) {
          _.remove(this.events, { id: element.id });
        } else if (element instanceof ContributorClass) {
          _.remove(this.contributors, { id: element.id });
        } else {
          // C'est pas normal
        }
      })
    });
  }

  initPopupContent(feature, elementId?) {
    // Add new overlay
    this.popup = new ol.Overlay({
      element: document.getElementById('itemsList')
    });
    this.map.addOverlay(this.popup);

    // Set popup position
    var coordinate = feature.getGeometry().getCoordinates();
    this.popup.setPosition(coordinate);

    // Fill popup content
    var theHtmlString = '';
    _.each(feature.get('object').itemsList, (item) => {
      const type = item instanceof EventClass ? 'event' : 'contributor';
      const id = type + '-' + item.id;
      theHtmlString += '<div class="item ' + (id == elementId ? 'selected ' : '') + type + '" id="' + id + '">' + item.name + '</div>';
    });

    this.popupContent = this.transform(theHtmlString);
  }
}

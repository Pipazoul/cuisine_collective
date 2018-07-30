import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import * as ol from 'openlayers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapElement: ElementRef;
  title = 'client';
  initialCoordinates: [number, number] = [538262.3872128094, 5740786.2887582248];
  initialZoom: number = 11;
  map: ol.Map;
  markerSource = new ol.source.Vector();
  markerStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      opacity: 0.75,
      src: 'https://openlayers.org/en/v4.6.4/examples/data/icon.png'
    }))
  });

  ngAfterViewInit(): void {
    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: this.markerSource,
          style: this.markerStyle,
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
  }

  ngOnInit(): void {
    
  }

  addMarker(lon, lat) {


    var iconFeatures = [];

    var iconFeature = new ol.Feature({
      geometry: new ol.geom.Point([lon, lat]),
      name: 'Null Island',
      population: 4000,
      rainfall: 500
    });

    this.markerSource.addFeature(iconFeature);
  }
}

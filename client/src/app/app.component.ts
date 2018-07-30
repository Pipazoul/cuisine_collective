import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as ol from 'openlayers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  title = 'client';
  initialCoordinates: [number, number] = [538262.3872128094, 5740786.2887582248];
  initialZoom: number = 11;
  map: ol.Map;

  ngOnInit(): void {
    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
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
}

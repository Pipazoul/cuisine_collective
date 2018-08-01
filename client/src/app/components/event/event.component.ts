import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventClass } from '../../domain/event.class';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  event: EventClass;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventService.getById(params['id']).subscribe(event => {
        this.event = event;
        console.log(event);
      }, err => {
        console.error(err);
      })
    });
  }

}

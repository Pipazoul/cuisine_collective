import { Component, OnInit, Input } from '@angular/core';
import { EventClass } from '../../domain/event.class';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-edition',
  templateUrl: './event-edition.component.html',
  styleUrls: ['./event-edition.component.css']
})
export class EventEditionComponent implements OnInit {

  public event: EventClass = new EventClass();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventService.getById(params['id']).subscribe(event => {
        this.event = event;
      }, err => {
        console.error(err);
      })
    });
  }

  public endCarousel() {
    this.router.navigate(['/admin']);
  }

}

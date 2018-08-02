import { Component, OnInit, Input } from '@angular/core';
import { EventClass } from '../../domain/event.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-edition',
  templateUrl: './event-edition.component.html',
  styleUrls: ['./event-edition.component.css']
})
export class EventEditionComponent implements OnInit {

  public event: EventClass = new EventClass();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public endCarousel() {
    this.router.navigate(['/admin']);
  }

}
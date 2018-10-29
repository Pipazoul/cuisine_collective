import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventClass } from '../../domain/event.class';
import { AuthenticationService } from '../../services/authentication.service';
import { RepresentedOnMapComponent } from '../base/represented-on-map/represented-on-map.component';
import { MatDialog } from '@angular/material';
import { DialogComponent, DialogParams } from '../common/dialog/dialog.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends RepresentedOnMapComponent implements OnInit {

  event: EventClass;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService,
    private eventService: EventService) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventService.getById(params['id']).subscribe(event => {
        this.event = event;
      })
    });
  }

  public deleteEvent(eventId) {
    this.dialog.open<DialogComponent, DialogParams>(DialogComponent, {
      width: '550px',
      panelClass: 'dialog',
      data: {
        title: 'Suppression',
        body: 'Êtes-vous sûr de vouloir supprimer cet événement ?'
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.eventService.delete(eventId).subscribe(res => {
          this.removePoint.emit({ type: EventClass, id: eventId });
          this.router.navigate(['/admin']);
        });
      }
    });
  }

  public modifyEvent(eventId) {
    this.router.navigate(['admin', 'events', eventId, 'edit']);
  }
}

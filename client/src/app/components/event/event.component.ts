import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventClass } from '../../domain/event.class';
import { AuthenticationService } from '../../services/authentication.service';
import { MatDialog } from '@angular/material';
import { DialogComponent, DialogParams } from '../common/dialog/dialog.component';
import { UserClass } from 'src/app/domain/user.class';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  public event: EventClass;
  public readonly connectedUser: UserClass;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private eventService: EventService) {
    this.connectedUser = this.authenticationService.user;
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
        this.eventService.delete(eventId).subscribe(() => {
          this.router.navigate(['/admin']);
        });
      }
    });
  }

  public modifyEvent(eventId) {
    this.router.navigate(['admin', 'events', eventId, 'edit']);
  }

  public get isConnected() {
    return this.authenticationService.isConnected;
  }
}

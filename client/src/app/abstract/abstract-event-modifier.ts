import { Input, EventEmitter, Output } from "@angular/core";
import { EventClass } from "../domain/event.class";
import { EventService } from "../services/event.service";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication.service";
import { NotificationsService } from "angular2-notifications";

export abstract class AbstractEventModifier {

    @Input() public event: EventClass;
    @Output() public backwardPressed: EventEmitter<EventClass> = new EventEmitter();
    @Output() public eventChanged: EventEmitter<EventClass> = new EventEmitter();

    constructor(protected eventService: EventService,
        protected authenticationService: AuthenticationService,
        protected notificationsService: NotificationsService) {

    }

    protected saveEvent(eventToSave: EventClass, goBack: boolean = false): Observable<EventClass> {
        return this.saveAndEmit(eventToSave, goBack ? this.backwardPressed : this.eventChanged).pipe(catchError((err) => {
            this.notificationsService.error('Erreur', 'Erreur lors de l\'enregistrement de l\'événement');
            throw err;
        }));
    }

    private saveAndEmit(event: EventClass, eventEmitter: EventEmitter<EventClass>): Observable<EventClass> {
        if (!this.event.id) {
            event.userId = this.authenticationService.user.id;
            return this.eventService.create(event).pipe(
                tap((event) => { Object.assign(this.event, event); eventEmitter.emit(event); })
            );
        }
        return this.eventService.update(event).pipe(
            tap((event) => { Object.assign(this.event, event); eventEmitter.emit(event); })
        );
    }
}
import { Input, EventEmitter, Output } from "@angular/core";
import { EventClass } from "../domain/event.class";
import { EventService } from "../services/event.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export abstract class AbstractEventModifier {

    @Input() public event: EventClass;
    @Output() public backwardPressed: EventEmitter<EventClass> = new EventEmitter();
    @Output() public eventSaved: EventEmitter<EventClass> = new EventEmitter();

    constructor(protected eventService: EventService) {

    }

    protected saveEvent(eventToSave: EventClass, goBack: boolean = false): Observable<EventClass> {
        return this.saveAndEmit(eventToSave, goBack ? this.backwardPressed : this.eventSaved);
    }

    private saveAndEmit(event: EventClass, eventEmitter: EventEmitter<EventClass>): Observable<EventClass> {
        if (!this.event.id) {
            return this.eventService.create(event).pipe(
                tap((event) => { Object.assign(this.event, event); eventEmitter.emit(event); })
            );
        }
        return this.eventService.update(event).pipe(
            tap((event) => { Object.assign(this.event, event); eventEmitter.emit(event); })
        );
    }
}
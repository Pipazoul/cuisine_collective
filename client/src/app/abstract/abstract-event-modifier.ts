import { Input, EventEmitter, Output } from "@angular/core";
import { EventClass } from "../domain/event.class";
import { EventService } from "../services/event.service";

export abstract class AbstractEventModifier {

    @Input() public event: EventClass;
    @Output() public backwardPressed: EventEmitter<EventClass> = new EventEmitter();
    @Output() public eventSaved: EventEmitter<EventClass> = new EventEmitter();

    constructor(protected eventService: EventService) {

    }

    protected saveEvent(eventToSave: EventClass, goBack: boolean = false) {
        this.saveAndEmit(eventToSave, goBack ? this.backwardPressed : this.eventSaved);
    }

    private saveAndEmit(event: EventClass, eventEmitter: EventEmitter<EventClass>) {
        if (!this.event.id) {
            this.eventService.create(event).subscribe(
                (event) => { Object.assign(this.event, event); eventEmitter.emit(event); }
            );
        } else {
            this.eventService.update(event).subscribe(
                (event) => { Object.assign(this.event, event); eventEmitter.emit(event); }
            );
        }
    }
}
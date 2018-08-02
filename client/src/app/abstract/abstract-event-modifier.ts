import { Input, EventEmitter, Output } from "@angular/core";
import { EventClass } from "../domain/event.class";
import { EventService } from "../services/event.service";

export abstract class AbstractEventModifier {

    @Input() public event: EventClass;
    @Output() public eventSaved: EventEmitter<EventClass> = new EventEmitter();
    @Output() public backwardPressed: EventEmitter<any> = new EventEmitter();

    constructor(protected eventService: EventService) {
        
    }

    protected saveEvent(event: EventClass) {
        if (!this.event.id) {
            this.eventService.create(event).subscribe(
                (event) => { Object.assign(this.event, event); this.eventSaved.emit(event); }
            );
        } else {
            this.eventService.update(event).subscribe(
                (event) => { Object.assign(this.event, event); this.eventSaved.emit(event); }
            );
        }
    }

    public goBackward() {
        this.backwardPressed.emit();
    }
}
import { Input, EventEmitter, Output } from "@angular/core";
import { EventClass } from "../domain/event.class";
import { EventService } from "../services/event.service";

export abstract class AbstractEventModifier {

    @Input() public event: EventClass;
    @Output() public eventSaved: EventEmitter<EventClass> = new EventEmitter();

    constructor(private eventService: EventService) {
        
    }

    public submitForm(value) {
        if (!this.event.id) {
            this.eventService.create(new EventClass(value)).subscribe(
                (event) => { Object.assign(this.event, event); this.eventSaved.emit(event); }
            );
        } else {
            this.eventService.update(new EventClass(value)).subscribe(
                (event) => { Object.assign(this.event, event); this.eventSaved.emit(event); }
            );
        }
    }
}
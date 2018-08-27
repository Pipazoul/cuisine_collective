import { ContributorClass } from "./contributor.class";
import { EventClass } from "./event.class";

export class ItemClass {

    public longitude: number;
    public latitude: number;
    public itemsList: Array<EventClass|ContributorClass>;
    
    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
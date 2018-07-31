import { OccurenceType } from "../enum/occurence-type.enum";

export class EventClass {

    public id: number;
    public name: string;
    public description: string;
    public participantsAmount: string;
    public datetime: string;
    public planner: string;
    public referent: string;
    public email: string;
    public phone: string;
    public url: string;
    public dateStart: Date;
    public dateEnd: Date;
    public occurenceType: OccurenceType;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
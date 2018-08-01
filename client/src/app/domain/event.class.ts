import { OccurenceType } from "../enum/occurence-type.enum";

export class EventClass {

    public id: number;
    public name: string;
    public description: string;
    public participantsAmount: string;
    public timeSlot: string;
    public planner: string;
    public referent: string;
    public email: string;
    public phone: string;
    public url: string;
    public dateStart: Date;
    public dateEnd: Date;
    public longitude: number;
    public latitude: number;
    public occurenceType: OccurenceType;
    public locationLabel: string;
    public informations: string;
    public eat: boolean = false;
    public cook: boolean = false;
    public public: boolean = false;
    // All about location from API
    public locationCity: string;
    public locationCitycode: string;
    public locationHousenumber: string;
    public locationName: string;
    public locationPostcode: string;
    public locationStreet: string;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
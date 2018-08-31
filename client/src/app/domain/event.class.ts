import * as moment from 'moment';
import { OccurenceType } from "../enum/occurence-type.enum";
import { ContributorClass } from "./contributor.class";

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
    public monday: string;
    public tuesday: string;
    public wednesday: string;
    public thursday: string;
    public friday: string;
    public saturday: string;
    public sunday: string;
    public longitude: number;
    public latitude: number;
    public occurenceType: OccurenceType;
    public locationLabel: string;
    public informations: string;
    public partnerInformations: string;
    public eat: boolean = false;
    public cook: boolean = false;
    public inscription: boolean = false;
    /* public public: boolean = false; */
    // All about location from API
    public locationCity: string;
    public locationCitycode: string;
    public locationHousenumber: string;
    public locationName: string;
    public locationPostcode: string;
    public locationStreet: string;
    // All about missing items
    public missingLocation: boolean = false;
    public missingFood: boolean = false;
    public missingSkills: boolean = false;
    public missingPeople: boolean = false;
    public missingAssistants: boolean = false;
    /**
     * Is event published ?
     */
    public publish: boolean = false;
    /**
     * Linked contributors
     */
    public contributorsLocation: ContributorClass[] = [];
    public contributorsFood: ContributorClass[] = [];
    public contributorsSkills: ContributorClass[] = [];
    public contributorsPeople: ContributorClass[] = [];
    public contributorsAssistants: ContributorClass[] = [];

    constructor(obj?: any) {
        Object.assign(this, obj, {
            contributorsLocation: obj && obj.contributorsLocation ? obj.contributorsLocation.map(c => new ContributorClass(c)) : [],
            contributorsFood: obj && obj.contributorsFood ? obj.contributorsFood.map(c => new ContributorClass(c)) : [],
            contributorsSkills: obj && obj.contributorsSkills ? obj.contributorsSkills.map(c => new ContributorClass(c)) : [],
            contributorsPeople: obj && obj.contributorsPeople ? obj.contributorsPeople.map(c => new ContributorClass(c)) : [],
            contributorsAssistants: obj && obj.contributorsAssistants ? obj.contributorsAssistants.map(c => new ContributorClass(c)) : []
        });
    }

    hasRange() {
        return this.dateStart || this.dateEnd;
    }

    isRecurrent() {
        return this.monday || this.tuesday || this.wednesday || this.thursday || this.friday || this.saturday || this.sunday;
    }

    getDateRange() {
        return this.dateStart && this.dateEnd ?
            'Du ' + moment(this.dateStart).format('DD/MM/YYYY') + ' au ' + moment(this.dateEnd).format('DD/MM/YYYY') :
            'A partir du ' + moment(this.dateStart).format('DD/MM/YYYY')
    }

    getRecurrency() {
        let days = []

        if (this.monday) days.push('lundi');
        if (this.tuesday) days.push('mardi');
        if (this.wednesday) days.push('mercredi');
        if (this.thursday) days.push('jeudi');
        if (this.friday) days.push('vendredi');
        if (this.saturday) days.push('samedi');
        if (this.sunday) days.push('dimanche');

        return 'Tous les ' + days.join(', ');
    }
}
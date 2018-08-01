export class ContributorClass {

    public id: number;
    public title: string;
    public name: string;
    public description: string;
    public hours: string;
    public email: string;
    public phone: string;
    public houseNumber: string;
    public address: string;
    public zipcode: string;
    public city: string;
    public longitude: number;
    public latitude: number;
    public location: boolean;
    public food: boolean;
    public skills: boolean;
    public people: boolean;
    public assistants: boolean;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
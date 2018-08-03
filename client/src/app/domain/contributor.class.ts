export class ContributorClass {

    public id: number;
    public title: string;
    public name: string;
    public description: string;
    public hours: string;
    public email: string;
    public phone: string;
    public longitude: number;
    public latitude: number;
    public location: boolean;
    public food: boolean;
    public skills: boolean;
    public people: boolean;
    public assistants: boolean;
    // All about location from API
    public houseNumber: string;
    public street: string;
    public zipcode: string;
    public city: string;

    get formattedAddress() {
        if(this.street && this.zipcode && this.city) {
            return (this.houseNumber ? this.houseNumber + ' ' : '')
            + this.street
            + ' '
            + this.zipcode
            + ' '
            + this.city;
        }
    }

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
import { LocationClass } from "./location.class";

export class LocationApiResponseClass {
    
    public attribution: string;
    public features: LocationClass[] = [];
    public licence: string;
    public limit: number;
    public query: string;
    public type: string;
    public version: string;

    constructor(obj?: any) {
        Object.assign(this, obj, {
            features: obj && obj.features ? obj.features.map(f => new LocationClass(f)) : []
        });
    }
}
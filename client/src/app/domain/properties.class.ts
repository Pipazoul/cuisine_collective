export class PropertiesClass {

    public adm_weight: number;
    public city: string;
    public citycode: string;
    public context: string;
    public housenumber: string;
    public id: number;
    public importance: number;
    public label: string;
    public name: string;
    public population: number;
    public postcode: string;
    public score: number;
    public street: string;
    public type: string;
    public x: number;
    public y: number;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
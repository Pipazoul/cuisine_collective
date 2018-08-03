export class PropertiesClass {

    public adm_weight: number = null;
    public city: string = null;
    public citycode: string = null;
    public context: string = null;
    public housenumber: string = null;
    public id: number = null;
    public importance: number = null;
    public label: string = null;
    public name: string = null;
    public population: number = null;
    public postcode: string = null;
    public score: number = null;
    public street: string = null;
    public type: string = null;
    public x: number = null;
    public y: number = null;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
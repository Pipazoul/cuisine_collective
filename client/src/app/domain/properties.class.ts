export class PropertiesClass {

    public adm_weight: number;
    public city: string;
    public citcodey: string;
    public context: string;
    public id: number;
    public importance: number;
    public label: string;
    public name: string;
    public population: number;
    public postcode: string;
    public score: number;
    public type: string;
    public x: number;
    public y: number;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
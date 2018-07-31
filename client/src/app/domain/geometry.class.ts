export class GeometryClass {

    public type: string;
    public coordinates: [number, number];

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
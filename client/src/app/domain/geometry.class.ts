export class GeometryClass {

    public type: string;
    /**
     * Longitude and latitude
     */
    public coordinates: [number, number];

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
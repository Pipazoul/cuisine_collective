import { GeometryClass } from "./geometry.class";
import { PropertiesClass } from "./properties.class";

export class LocationClass {

    public type: string;
    public geometry: GeometryClass;
    public properties: PropertiesClass;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
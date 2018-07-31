import { GeometryClass } from "./geometry.class";
import { PropertiesClass } from "./properties.class";

export class LocationClass {

    public type: string;
    public geometry: GeometryClass;
    public properties: PropertiesClass;

    constructor(obj?: any) {
        Object.assign(this, obj, {
            geometry: obj && obj.geometry ? new GeometryClass(obj.geometry) : null,
            properties: obj && obj.properties ? new PropertiesClass(obj.properties) : null
        });
    }
}
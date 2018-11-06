export class RoleClass {

    public static readonly ROLES: { [key: string]: string } = { ADMIN: 'admin' };

    public id: number;
    public name: string;
    public description: string;
    public created: string;
    public modified: string;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
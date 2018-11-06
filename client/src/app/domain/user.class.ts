export class UserClass {

    //Inner fields
    public id: number;
    public username: string;
    public email: string;
    public password: string;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
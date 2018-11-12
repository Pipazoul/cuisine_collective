export class UserClass {

    public static readonly DEFAULT_PASSWORD = 'useless';

    //Inner fields
    public id: number;
    public username: string;
    public email: string;
    public password: string;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
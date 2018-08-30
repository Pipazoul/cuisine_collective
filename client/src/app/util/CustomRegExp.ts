export class CustomRegExp {
    /**
     * Validate an url
     */
    public static readonly URL: RegExp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
}
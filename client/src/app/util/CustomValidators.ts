import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

    /**
     * From a given control, check if one of his siblings has a given value
     * 
     * @param otherControlName 
     * @param value 
     */
    public static checkIfOtherControlHasValue(otherControlName: string, value: any): ValidatorFn {
        let thisControl: AbstractControl;
        let otherControl: AbstractControl;

        return function matchOther(control: AbstractControl): ValidationErrors | null {
            if (!control.parent) {
                return null;
            }
            // Initializing the validator.
            if (!thisControl) {
                thisControl = control;
                // Get the other control from the parent
                otherControl = control.parent.get(otherControlName);
                if (!otherControl) {
                    throw new Error('checkIfOtherControlHasValue(): other control is not found in parent group');
                }
                // If other control change, we must compute again the validity
                otherControl.valueChanges.subscribe(() => {
                    thisControl.updateValueAndValidity();
                });
            }
            if (!otherControl) {
                return null;
            }
            return (otherControl.value !== value || thisControl.value) ? null : { matchOther: true };
        }
    }


    /**
     * Assert that a control contains the same value as an another control.
     * The other control must be a sibling of the control, in the same form
     *
     * @param otherControlName
     */
    public static matchOther(otherControlName: string): ValidatorFn {
        let thisControl: AbstractControl;
        let otherControl: AbstractControl;

        return function matchOther(control: AbstractControl): ValidationErrors | null {
            if (!control.parent) {
                return null;
            }
            // Initializing the validator.
            if (!thisControl) {
                thisControl = control;
                // Get the other control from the parent
                otherControl = control.parent.get(otherControlName);
                if (!otherControl) {
                    throw new Error('matchOtherValidator(): other control is not found in parent group');
                }
                // If other control change, we must compute again the validity
                otherControl.valueChanges.subscribe(() => {
                    thisControl.updateValueAndValidity();
                });
            }
            if (!otherControl) {
                return null;
            }
            return (otherControl.value === thisControl.value) ? null : { matchOther: true };
        }
    }

    /**
     * Assert that array length is equal or higher than given length
     * 
     * @param min 
     */
    public static minLengthArray(min: number): ValidatorFn {
        return (c: AbstractControl): ValidationErrors | null => {
            if (c.value.length >= min) {
                return null;
            }
            return { 'minLengthArray': { valid: false } };
        }
    }
}
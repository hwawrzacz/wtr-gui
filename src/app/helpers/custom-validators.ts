import { AbstractControl, ValidatorFn } from "@angular/forms";

export const phoneNumberValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any | null } => control.value.toString().match(/[0-9]{9}/) == control.value ? null : { phoneNumber: true };
}

export const matchOtherControlValidator = (otherControlName: string): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any | null } => {
    const otherControl = control.root.get(otherControlName);
    let errorValue = false;
    if (!!otherControl && !!otherControl.value) {
      errorValue = otherControl.value !== control.value;
      return errorValue ? { passwordMatches: errorValue } : null;
    } else {
      return null
    }
  }
}
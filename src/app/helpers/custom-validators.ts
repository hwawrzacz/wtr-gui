import { AbstractControl, ValidatorFn } from "@angular/forms";
import { AVAILABLE_PASSWORD_CHARACTERS } from "../model/constants";

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

export const passwordValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } => {
    const notMatchingCharacters = control.value ? control.value.split('').filter(char => !AVAILABLE_PASSWORD_CHARACTERS.includes(char)).length : 0;

    return notMatchingCharacters > 0
      ? { invalidPasswordCharacter: true }
      : null;
  }
}
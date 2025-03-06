import { AbstractControl, ValidationErrors } from "@angular/forms";

export function cnssNumberValidator(control: AbstractControl): ValidationErrors | null {
    const cnssRegex = /^\d{8}-\d{2}$/
    if (!control.value) return null
    const valid = cnssRegex.test(control.value)
    return valid ? null : { invalidCnss: true }
}
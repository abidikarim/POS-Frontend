import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmPasswordValidator(): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
        const passwordControl = formControl.get('password')
        const confirmPasswordControl = formControl.get('confirm_password')
        if (!passwordControl?.value || !confirmPasswordControl?.value) return null
        if (passwordControl?.value !== confirmPasswordControl?.value) {
            return { invalidConfirmPassword: true }
        }
        return null
    }
}
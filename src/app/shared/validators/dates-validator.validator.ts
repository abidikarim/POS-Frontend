import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function datesValidator(): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
        const start_date = formControl.get('start_date')
        const end_date = formControl.get('end_date')
        if (!start_date?.value || !end_date?.value) return null
        if (start_date?.value >= end_date?.value) {
            return { invalidStartDate: true }
        }
        return null
    }
}
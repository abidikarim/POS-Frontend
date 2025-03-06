import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function requiredCnss(): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
        const contract_type = formControl.get('contract_type')
        const cnss_number = formControl.get('cnss_number')
        if ((contract_type?.value === 'Cdi' || contract_type?.value === 'Cdd') && !cnss_number?.value) {
            return { requiredCnss: true }
        }
        return null
    }
}
export function handleForm(form: any) {
    for (const field in form) {
        if (typeof (form[field]) == "string")
            form[field] = form[field].trim() ? form[field].trim() : undefined
        if (form[field] === '')
            form[field] = undefined
    }
    return form
}
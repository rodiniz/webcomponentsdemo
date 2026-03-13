export const getFirstValidationError = (errors: Record<string, string>): string => {
    return Object.values(errors)[0] ?? 'Please check the form fields.';
};
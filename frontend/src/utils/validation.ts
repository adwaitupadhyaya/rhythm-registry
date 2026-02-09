export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function showFieldError(field: HTMLInputElement | HTMLSelectElement, message: string): void {
  field.classList.add('form-input--error');

  const existingError = field.parentElement?.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }

  const errorElement = document.createElement('span');
  errorElement.className = 'form-error';
  errorElement.textContent = message;
  field.parentElement?.appendChild(errorElement);
}

export function clearFormErrors(form: HTMLFormElement): void {
  const errorElements = form.querySelectorAll('.form-error');
  errorElements.forEach(el => el.remove());

  const errorInputs = form.querySelectorAll('.form-input--error');
  errorInputs.forEach(input => {
    input.classList.remove('form-input--error');
  });
}

export function setFormDisabled(form: HTMLFormElement, disabled: boolean): void {
  const elements = form.elements;
  for (let i = 0; i < elements.length; i++) {
    (elements[i] as HTMLInputElement | HTMLButtonElement).disabled = disabled;
  }
}

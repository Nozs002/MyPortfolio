/**
 * Password complexity validator helper according to REQ-RECOVERY-014.
 */

export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
  errors: string[];
}

export function validatePasswordComplexity(
  password: string,
): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(
    password,
  );

  const errors: string[] = [];
  if (!hasMinLength) errors.push('Độ dài tối thiểu 8 ký tự.');
  if (!hasUppercase) errors.push('Phải chứa ít nhất 1 chữ cái viết hoa (A-Z).');
  if (!hasLowercase)
    errors.push('Phải chứa ít nhất 1 chữ cái viết thường (a-z).');
  if (!hasDigit) errors.push('Phải chứa ít nhất 1 chữ số (0-9).');
  if (!hasSpecialChar)
    errors.push('Phải chứa ít nhất 1 ký tự đặc biệt (ví dụ: !, @, #, $, %).');

  const isValid =
    hasMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;

  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasDigit,
    hasSpecialChar,
    errors,
  };
}

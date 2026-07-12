/**
 * Basic email format check — good enough for client-side/server-side form
 * validation. Not a substitute for actually verifying the email address
 * (e.g. via a confirmation link).
 */
export function isValidEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim());
}

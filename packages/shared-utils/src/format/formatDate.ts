/**
 * Formats a date into a human-readable string.
 * Accepts either a Date object or an ISO date string (e.g. from an API response).
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  const parsed = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsed.getTime())) {
    throw new Error(`formatDate received an invalid date: "${date}"`);
  }

  return new Intl.DateTimeFormat("en-US", options).format(parsed);
}

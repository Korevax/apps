/**
 * Shared runtime guards for untrusted strings and timestamps.
 * Keep these checks independent from browser-only APIs so they can be reused by
 * the frontend and the future Kore API.
 */

export function hasControlCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 0x1f || code === 0x7f) return true;
  }

  return false;
}

export function hasControlOrSpaceCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 0x20 || code === 0x7f) return true;
  }

  return false;
}

export function isValidCalendarDate(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1 || month < 1 || month > 12 || day < 1) return false;

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysPerMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return day <= daysPerMonth[month - 1];
}

const TIMESTAMP_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|([+-])(\d{2}):(\d{2}))$/;

export function isIsoTimestampWithTimezone(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const match = TIMESTAMP_PATTERN.exec(value);
  if (!match || !isValidCalendarDate(\${match[1]}-\${match[2]}-\${match[3]})) return false;

  if (Number(match[4]) > 23 || Number(match[5]) > 59 || Number(match[6]) > 59) return false;

  if (match[7] !== "Z" && (
    Number(match[9]) > 14 ||
    Number(match[10]) > 59 ||
    (Number(match[9]) === 14 && Number(match[10]) !== 0)
  )) return false;

  return Number.isFinite(Date.parse(value));
}

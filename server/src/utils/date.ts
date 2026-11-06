export function toDateOrNull(dateString?: string | null): Date | null {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateToISO(date?: Date | null): string | null {
  if (!date) return null;
  return date.toISOString();
}


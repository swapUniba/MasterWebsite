const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateOnly(value: string): Date {
  if (!DATE_ONLY.test(value)) throw new Error(`Data non valida: ${value}`);
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Data non valida: ${value}`);
  }
  return date;
}

export function formatItalianDate(value: string | Date): string {
  const date = typeof value === 'string' ? parseDateOnly(value) : value;
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

export function sortByDateAsc<T extends { date: string }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => parseDateOnly(a.date).valueOf() - parseDateOnly(b.date).valueOf());
}

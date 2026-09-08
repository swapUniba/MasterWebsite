import { describe, expect, it } from 'vitest';
import { formatItalianDate, parseDateOnly, sortByDateAsc } from '../src/utils/dates';

describe('date editoriali', () => {
  it('formatta una data ISO senza spostare il giorno', () => {
    expect(formatItalianDate('2027-01-15')).toBe('15 gennaio 2027');
  });

  it('rifiuta valori non ISO', () => {
    expect(() => parseDateOnly('15/01/2027')).toThrow('Data non valida');
  });

  it('rifiuta un giorno inesistente', () => {
    expect(() => parseDateOnly('2027-02-31')).toThrow('Data non valida');
  });

  it('ordina le scadenze dalla più vicina', () => {
    const items = [{ date: '2027-02-15' }, { date: '2027-01-15' }];
    expect(sortByDateAsc(items).map((item) => item.date)).toEqual(['2027-01-15', '2027-02-15']);
  });
});

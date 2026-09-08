import { describe, expect, it } from 'vitest';
import { featuredEntries, latestNews, publishedNews, sortByOrder } from '../src/utils/content';

const news = [
  { id: 'vecchia', data: { date: new Date('2026-09-01T00:00:00Z'), draft: false, featured: false } },
  { id: 'nuova', data: { date: new Date('2026-10-01T00:00:00Z'), draft: false, featured: true } },
  { id: 'bozza', data: { date: new Date('2026-11-01T00:00:00Z'), draft: true, featured: true } },
];

describe('selezione contenuti', () => {
  it('ordina usando order senza mutare l’array', () => {
    const input = [{ data: { order: 20 } }, { data: { order: 10 } }];
    expect(sortByOrder(input).map((entry) => entry.data.order)).toEqual([10, 20]);
    expect(input[0].data.order).toBe(20);
  });

  it('esclude le bozze', () => {
    expect(publishedNews(news).map((entry) => entry.id)).toEqual(['vecchia', 'nuova']);
  });

  it('restituisce le ultime tre notizie pubblicate', () => {
    expect(latestNews(news, 3).map((entry) => entry.id)).toEqual(['nuova', 'vecchia']);
  });

  it('seleziona solo gli elementi in evidenza', () => {
    expect(featuredEntries(news).map((entry) => entry.id)).toEqual(['nuova', 'bozza']);
  });
});

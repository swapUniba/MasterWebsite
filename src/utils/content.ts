type Ordered = { data: { order: number } };
type Featured = { data: { featured: boolean } };
type NewsEntry = { data: { date: Date; draft: boolean } };

export function sortByOrder<T extends Ordered>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}

export function featuredEntries<T extends Featured>(entries: readonly T[]): T[] {
  return entries.filter((entry) => entry.data.featured);
}

export function publishedNews<T extends NewsEntry>(entries: readonly T[]): T[] {
  return entries.filter((entry) => !entry.data.draft);
}

export function latestNews<T extends NewsEntry>(entries: readonly T[], limit = 3): T[] {
  return publishedNews(entries)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, limit);
}

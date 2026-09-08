# Master AI e Data Science Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Costruire un sito Astro statico, responsive e gestibile con Pages CMS per il Master congiunto in AI e Data Science di UniBa e Politecnico di Bari.

**Architecture:** Astro genera tutte le route in fase di build a partire da Content Collections locali Markdown/YAML validate con Zod. I componenti Astro sono puramente presentazionali, le regole di selezione restano in utility TypeScript e Pages CMS modifica soltanto contenuti e media versionati in Git.

**Tech Stack:** Node.js 22.12+, npm, Astro 7.3.1, TypeScript strict, Astro Content Collections, Zod 4 tramite `astro/zod`, Vitest, CSS nativo, Pages CMS, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-08-master-ai-data-science-design.md`

## Global Constraints

- Il sito è esclusivamente in italiano e presenta una sola edizione attiva.
- UniBa e Politecnico di Bari hanno pari visibilità come istituzioni congiunte.
- I contenuti iniziali sono demo e mostrano sempre l’avviso configurato in `master.yml`.
- Nessun backend, database, React, framework client-side, autenticazione o form server-side.
- Nessun dato editoriale deve essere hardcoded nei componenti `.astro`.
- Il design segue la direzione approvata “Tecnologia mediterranea”.
- Il dominio dimostrativo è `https://master.example.it`; non configurare `base` in Astro.
- JavaScript client limitato al menu mobile; FAQ e moduli usano HTML nativo.
- Ogni task termina con test mirati e un commit autonomo.

---

## File map

### Configurazione e test

- `package.json`: dipendenze, requisito Node e script npm.
- `package-lock.json`: versioni risolte riproducibili.
- `astro.config.mjs`: sito statico, dominio e sitemap.
- `tsconfig.json`: TypeScript strict.
- `vitest.config.ts`: configurazione Vitest tramite Astro.
- `.gitignore`: output e artefatti locali.
- `tests/dates.test.ts`: formato e ordinamento date.
- `tests/content.test.ts`: ordinamento, evidenza e bozze.
- `tests/schemas.test.ts`: vincoli Zod dei contenuti.
- `tests/build-output.test.ts`: route, metadati e assenza bozze nel build.
- `tests/cms-config.test.ts`: corrispondenza dei percorsi Pages CMS.
- `scripts/check-links.mjs`: controllo dei link interni generati.

### Contenuti

- `src/content.config.ts`: registra tutte le collezioni Astro.
- `src/content/schemas.ts`: schemi Zod e tipi TypeScript condivisi.
- `src/data/*.yml`: dati globali, scadenze, contatti e FAQ.
- `src/content/editorial/*.md`: testi lunghi delle pagine.
- `src/content/courses/*.md`: moduli didattici.
- `src/content/faculty/*.md`: persone.
- `src/content/news/*.md`: notizie e bozze.

### Presentazione

- `src/styles/variables.css`: token della direzione visiva approvata.
- `src/styles/global.css`: reset, tipografia, layout e accessibilità.
- `src/styles/components.css`: primitive riutilizzabili.
- `src/layouts/BaseLayout.astro`: shell HTML, SEO e slot.
- `src/components/navigation/Header.astro`: navigazione desktop/mobile.
- `src/components/navigation/Footer.astro`: istituzioni e contatti.
- `src/components/layout/*.astro`: sezioni, heading, testate e breadcrumb.
- `src/components/elements/*.astro`: pulsanti, avviso e stato vuoto.
- `src/components/sections/*.astro`: hero, dati chiave, scadenze e CTA.
- `src/components/cards/*.astro`: corsi, docenti e news.
- `src/pages/*.astro`: route statiche.
- `src/pages/news/[slug].astro`: route generate dalle news pubblicate.

### Integrazioni e documentazione

- `.pages.yml`: modello editoriale Pages CMS.
- `.github/workflows/deploy.yml`: validazione e deploy Pages.
- `public/CNAME`: dominio dimostrativo.
- `public/robots.txt`: indicizzazione.
- `public/favicon.svg`: identità minima autonoma.
- `README.md`: uso locale, CMS, deploy, dominio e aggiornamento contenuti.

---

### Task 1: Fondazioni Astro e utility testate

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/utils/dates.ts`
- Create: `src/utils/content.ts`
- Create: `tests/dates.test.ts`
- Create: `tests/content.test.ts`

**Interfaces:**
- Produces: `parseDateOnly(value: string): Date`, `formatItalianDate(value: string | Date): string`, `sortByDateAsc<T>()`, `sortByOrder<T>()`, `publishedNews<T>()`, `latestNews<T>()`, `featuredEntries<T>()`.
- Consumes: nessuna interfaccia applicativa precedente.

- [ ] **Step 1: Verificare la versione Node e creare la configurazione npm**

Run: `node --version`

Expected: versione `v22.12.0` o superiore e pari. Se non lo è, interrompere il task e installare una versione Node supportata prima di proseguire.

Creare `package.json`:

```json
{
  "name": "master-ai-data-science",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "check:links": "node scripts/check-links.mjs",
    "validate": "npm run check && npm test && npm run build && npm run check:links"
  }
}
```

Run:

```bash
npm install astro@7.3.1 @astrojs/sitemap
npm install --save-dev @astrojs/check typescript vitest
```

Creare `.gitignore`:

```gitignore
node_modules/
dist/
.astro/
.DS_Store
.superpowers/
coverage/
```

- [ ] **Step 2: Creare la configurazione minima Astro e Vitest**

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://master.example.it',
  output: 'static',
  integrations: [sitemap()],
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

`vitest.config.ts`:

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Scrivere i test fallenti per date e selezione contenuti**

`tests/dates.test.ts`:

```ts
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
```

`tests/content.test.ts`:

```ts
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
```

- [ ] **Step 4: Eseguire i test e verificare il fallimento previsto**

Run: `npm test`

Expected: FAIL perché `src/utils/dates.ts` e `src/utils/content.ts` non esistono.

- [ ] **Step 5: Implementare le utility minime**

`src/utils/dates.ts`:

```ts
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
```

`src/utils/content.ts`:

```ts
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
```

- [ ] **Step 6: Verificare e committare**

Run: `npm test`

Expected: 8 test PASS.

Run: `npm run check`

Expected: comando completato senza errori anche se non esistono ancora pagine.

```bash
git add .gitignore package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts src/utils tests/dates.test.ts tests/content.test.ts
git commit -m "chore: scaffold Astro project and tested utilities"
```

---

### Task 2: Schemi, Content Collections e contenuti demo

**Files:**
- Create: `src/content/schemas.ts`
- Create: `src/content.config.ts`
- Create: `tests/schemas.test.ts`
- Create: `src/data/master.yml`
- Create: `src/data/deadlines.yml`
- Create: `src/data/contacts.yml`
- Create: `src/data/faq.yml`
- Create: `src/content/editorial/home.md`
- Create: `src/content/editorial/programma.md`
- Create: `src/content/editorial/ammissione.md`
- Create: `src/content/editorial/contatti.md`
- Create: `src/content/courses/data-management.md`
- Create: `src/content/courses/machine-learning.md`
- Create: `src/content/courses/generative-ai.md`
- Create: `src/content/faculty/mario-rossi.md`
- Create: `src/content/faculty/laura-bianchi.md`
- Create: `src/content/faculty/giulia-verdi.md`
- Create: `src/content/news/apertura-candidature.md`
- Create: `src/content/news/presentazione-online.md`
- Create: `src/content/news/bozza-partnership.md`

**Interfaces:**
- Produces: schemi esportati `masterSchema`, `deadlinesSchema`, `contactsSchema`, `faqSchema`, `editorialSchema`, `courseSchema`, `facultySchema`, `newsSchema` e relativi tipi `MasterData`, `ContactsData`.
- Consumes: utility di Task 1 solo nelle pagine successive; nessuna dipendenza circolare.

- [ ] **Step 1: Scrivere test fallenti per gli schemi**

`tests/schemas.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { courseSchema, facultySchema, masterSchema, newsSchema } from '../src/content/schemas';

describe('schemi editoriali', () => {
  it('accetta i dati minimi del master', () => {
    expect(masterSchema.safeParse({
      title: 'Master in AI e Data Science', short_title: 'Master AI & Data Science',
      subtitle: 'Dati e intelligenza per innovare', summary: 'Percorso congiunto.',
      academic_year: '2026/2027',
      institutions: [{ name: 'Università degli Studi di Bari Aldo Moro', short_name: 'UniBa', url: 'https://www.uniba.it' }],
      duration: '12 mesi', cfu: 60, total_hours: 1500, fee: '€ 3.500',
      teaching_mode: 'Mista', schedule: 'Formula weekend', location: 'Bari', demo_notice: 'Dati demo',
    }).success).toBe(true);
  });

  it('rifiuta un corso con ore negative', () => {
    expect(courseSchema.safeParse({ code: 'A1', title: 'Dati', summary: 'Sintesi', cfu: 5,
      hours: -1, semester: 'Primo semestre', lecturers: [], order: 10, featured: true }).success).toBe(false);
  });

  it('richiede alt quando è presente una foto', () => {
    expect(facultySchema.safeParse({ name: 'Mario Rossi', role: 'Professore', affiliation: 'UniBa',
      category: 'Docente', photo: '/images/faculty/rossi.webp', order: 10, featured: true }).success).toBe(false);
  });

  it('imposta le news come bozze per default', () => {
    const parsed = newsSchema.parse({ title: 'Notizia', date: '2026-10-01', summary: 'Sintesi' });
    expect(parsed.draft).toBe(true);
  });
});
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `npm test -- tests/schemas.test.ts`

Expected: FAIL perché `src/content/schemas.ts` non esiste.

- [ ] **Step 3: Implementare gli schemi Zod**

Creare `src/content/schemas.ts` esportando gli otto schemi. Usare questi vincoli esatti:

```ts
import { z } from 'astro/zod';

const optionalText = z.union([z.literal(''), z.string().trim().min(1)])
  .transform((value) => value || undefined).optional();
const optionalUrl = z.union([z.literal(''), z.string().url()])
  .transform((value) => value || undefined).optional();
const urlOrPublicPath = z.string().refine(
  (value) => value.startsWith('/documents/') || URL.canParse(value),
  'Inserire un URL valido o un percorso in /documents/',
).or(z.literal('')).transform((value) => value || undefined).optional();

export const masterSchema = z.object({
  title: z.string().min(1), short_title: z.string().min(1), subtitle: z.string().min(1),
  summary: z.string().min(1), academic_year: z.string().regex(/^\d{4}\/\d{4}$/),
  institutions: z.array(z.object({ name: z.string().min(1), short_name: z.string().min(1), url: z.string().url() })).min(2),
  duration: z.string().min(1), cfu: z.number().positive(), total_hours: z.number().int().positive(),
  places: z.number().int().positive().optional(), fee: z.string().min(1),
  teaching_mode: z.enum(['In presenza', 'Online', 'Mista']), schedule: z.string().min(1),
  location: z.string().min(1), attendance: optionalText, application_url: optionalUrl,
  official_call_url: urlOrPublicPath, brochure_url: urlOrPublicPath, demo_notice: optionalText,
});

export const deadlinesSchema = z.object({ items: z.array(z.object({
  title: z.string().min(1), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(), description: optionalText,
  url: z.string().refine((value) => value.startsWith('/') || URL.canParse(value)).optional(),
})) });

export const contactsSchema = z.object({
  general_email: z.string().email(), general_phone: optionalText,
  offices: z.array(z.object({ institution: z.string().min(1), department: z.string().min(1),
    address: z.string().min(1), city: z.string().min(1), postal_code: z.string().min(1),
    email: z.string().email().optional(), website: optionalUrl })).min(2),
  coordinators: z.array(z.object({ name: z.string().min(1), role: z.string().min(1),
    affiliation: z.string().min(1), email: z.string().email().optional() })),
  institutional_links: z.array(z.object({ label: z.string().min(1), url: z.string().url() })),
});

export const faqSchema = z.object({ items: z.array(z.object({
  question: z.string().min(1), answer: z.string().min(1), category: optionalText,
  order: z.number().int().nonnegative(),
})) });

export const editorialSchema = z.object({
  title: z.string().min(1), eyebrow: optionalText, description: z.string().min(1), heading: z.string().min(1),
});

export const courseSchema = z.object({
  code: z.string().min(1), title: z.string().min(1), summary: z.string().min(1),
  cfu: z.number().nonnegative(), hours: z.number().int().nonnegative(),
  semester: z.enum(['Primo semestre', 'Secondo semestre', 'Annuale', 'Altro']),
  lecturers: z.array(z.string().min(1)).default([]), order: z.number().int().nonnegative(),
  featured: z.boolean().default(false),
});

export const facultySchema = z.object({
  name: z.string().min(1), role: z.string().min(1), affiliation: z.string().min(1),
  category: z.enum(['Coordinamento', 'Comitato scientifico', 'Docente', 'Professionista']),
  photo: optionalText, photo_alt: optionalText, email: z.string().email().optional(), website: optionalUrl,
  order: z.number().int().nonnegative(), featured: z.boolean().default(false),
}).superRefine((value, context) => {
  if (value.photo && !value.photo_alt) context.addIssue({ code: 'custom', path: ['photo_alt'], message: 'Testo alternativo obbligatorio' });
});

export const newsSchema = z.object({
  title: z.string().min(1), date: z.coerce.date(), summary: z.string().min(1),
  image: optionalText, image_alt: optionalText, featured: z.boolean().default(false), draft: z.boolean().default(true),
}).superRefine((value, context) => {
  if (value.image && !value.image_alt) context.addIssue({ code: 'custom', path: ['image_alt'], message: 'Testo alternativo obbligatorio' });
});

export type MasterData = z.infer<typeof masterSchema>;
export type ContactsData = z.infer<typeof contactsSchema>;
```

- [ ] **Step 4: Registrare le collezioni**

`src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { contactsSchema, courseSchema, deadlinesSchema, editorialSchema, facultySchema, faqSchema, masterSchema, newsSchema } from './content/schemas';

const from = (pattern: string, base: string, schema: Parameters<typeof defineCollection>[0]['schema']) =>
  defineCollection({ loader: glob({ pattern, base }), schema });

export const collections = {
  master: from('master.yml', './src/data', masterSchema),
  deadlines: from('deadlines.yml', './src/data', deadlinesSchema),
  contacts: from('contacts.yml', './src/data', contactsSchema),
  faq: from('faq.yml', './src/data', faqSchema),
  editorial: from('**/*.md', './src/content/editorial', editorialSchema),
  courses: from('**/*.md', './src/content/courses', courseSchema),
  faculty: from('**/*.md', './src/content/faculty', facultySchema),
  news: from('**/*.md', './src/content/news', newsSchema),
};
```

Se l’inferenza del parametro `schema` del helper non è accettata da Astro 7, eliminare l’helper e ripetere esplicitamente gli otto `defineCollection({ loader, schema })`; non introdurre cast `any`.

- [ ] **Step 5: Aggiungere dati globali demo**

`src/data/master.yml` deve contenere:

```yaml
title: "Master di II livello in Intelligenza Artificiale e Data Science"
short_title: "Master AI & Data Science"
subtitle: "Intelligenza che crea valore"
summary: "Un percorso interdisciplinare dove ricerca, applicazione e impresa si incontrano."
academic_year: "2026/2027"
institutions:
  - name: "Università degli Studi di Bari Aldo Moro"
    short_name: "UniBa"
    url: "https://www.uniba.it"
  - name: "Politecnico di Bari"
    short_name: "PoliBa"
    url: "https://www.poliba.it"
duration: "12 mesi"
cfu: 60
total_hours: 1500
places: 30
fee: "€ 3.500"
teaching_mode: "Mista"
schedule: "Formula weekend"
location: "Bari"
attendance: "Frequenza minima dell’80%"
demo_notice: "Sito dimostrativo: contenuti, date e collegamenti sono in fase di aggiornamento."
```

`src/data/deadlines.yml` deve avere tre voci datate 2027-01-15, 2027-01-30 e 2027-02-15; `src/data/contacts.yml` deve avere due uffici demo, uno per Ateneo; `src/data/faq.yml` deve avere almeno cinque domande distribuite tra “Ammissione”, “Didattica” e “Costi”. Ogni testo deve dichiarare esplicitamente quando il dato è dimostrativo.

- [ ] **Step 6: Aggiungere contenuti Markdown demo**

Ogni file usa frontmatter valido e corpo realistico. Modello per `src/content/courses/machine-learning.md`:

```md
---
code: "A2"
title: "Machine Learning"
summary: "Modelli supervisionati e non supervisionati, valutazione e applicazioni."
cfu: 6
hours: 48
semester: "Primo semestre"
lecturers: ["Mario Rossi", "Laura Bianchi"]
order: 20
featured: true
---

Il modulo introduce il ciclo completo di sviluppo di un modello di apprendimento automatico.

## Obiettivi

- scegliere metriche coerenti con il problema;
- addestrare e confrontare modelli;
- riconoscere limiti, bias e rischi di generalizzazione.
```

Usare lo stesso formato per `data-management.md` con `order: 10` e `generative-ai.md` con `order: 30`. Creare tre persone nelle quattro categorie disponibili, due news pubblicate e `bozza-partnership.md` con `draft: true`. I quattro file editoriali devono avere `title`, `description`, `heading`, `eyebrow` e corpo Markdown distinto.

- [ ] **Step 7: Verificare schemi e build della content layer**

Run: `npm test -- tests/schemas.test.ts`

Expected: 4 test PASS.

Run: `npm run check`

Expected: nessun errore di contenuto o TypeScript.

```bash
git add src/content.config.ts src/content/schemas.ts src/content src/data tests/schemas.test.ts
git commit -m "feat: define validated editorial content"
```

---

### Task 3: Design system, layout base e navigazione accessibile

**Files:**
- Create: `src/styles/variables.css`
- Create: `src/styles/global.css`
- Create: `src/styles/components.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/navigation/Header.astro`
- Create: `src/components/navigation/Footer.astro`
- Create: `src/components/elements/Button.astro`
- Create: `src/components/elements/Notice.astro`
- Create: `src/components/elements/EmptyState.astro`
- Create: `src/components/layout/Section.astro`
- Create: `src/components/layout/SectionHeading.astro`
- Create: `src/components/layout/PageHeader.astro`
- Create: `src/components/layout/Breadcrumb.astro`
- Create: `src/pages/index.astro`
- Create: `public/favicon.svg`
- Create: `tests/build-output.test.ts`

**Interfaces:**
- Consumes: `MasterData`, `ContactsData` da Task 2.
- Produces: `BaseLayout` props `{ title, description, image? }`, `Header` props `{ master, currentPath }`, `Footer` props `{ master, contacts }`, primitive visuali condivise.

- [ ] **Step 1: Scrivere il primo test di output fallente**

`tests/build-output.test.ts`:

```ts
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('output statico', () => {
  it('include lingua, skip link, canonical e navigazione nella home', async () => {
    const html = await readFile('dist/index.html', 'utf8');
    expect(html).toContain('<html lang="it"');
    expect(html).toContain('href="#main-content"');
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('aria-current="page"');
  });
});
```

Run: `npm run build && npm test -- tests/build-output.test.ts`

Expected: FAIL perché `src/pages/index.astro` non esiste o non contiene la shell richiesta.

- [ ] **Step 2: Implementare i token della direzione visiva**

`src/styles/variables.css` deve definire almeno:

```css
:root {
  --color-primary: #102e38;
  --color-primary-dark: #08242d;
  --color-secondary: #0b9b90;
  --color-secondary-dark: #08776f;
  --color-accent: #ce8855;
  --color-text: #102e38;
  --color-text-muted: #5a7477;
  --color-background: #f7faf8;
  --color-background-tinted: #edf6f3;
  --color-surface: #ffffff;
  --color-border: #d7e5e2;
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --space-xs: .5rem; --space-sm: .75rem; --space-md: 1rem; --space-lg: 1.5rem;
  --space-xl: clamp(2.5rem, 6vw, 5.5rem);
  --radius-sm: .5rem; --radius-md: .875rem; --radius-lg: 1.25rem;
  --shadow-card: 0 1rem 2.5rem rgb(16 46 56 / .08);
  --container-width: 72rem;
}
```

`global.css` deve includere box sizing, margini azzerati, tipografia fluida, `.container`, `.skip-link`, stile focus con `outline: 3px solid var(--color-accent)`, regole media responsive e `prefers-reduced-motion`. `components.css` deve definire `.button`, `.card-grid`, `.prose`, `.section` e `.eyebrow` senza dati editoriali.

- [ ] **Step 3: Implementare shell, SEO e navigazione**

`BaseLayout.astro` deve:

```astro
---
import '../styles/variables.css';
import '../styles/global.css';
import '../styles/components.css';
interface Props { title: string; description: string; image?: string }
const { title, description, image } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const socialImage = image ? new URL(image, Astro.site) : undefined;
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href="/favicon.svg" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    {socialImage && <meta property="og:image" content={socialImage} />}
    <meta property="og:type" content="website" />
    <title>{title}</title>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Salta al contenuto</a>
    <slot />
  </body>
</html>
```

`Header.astro` usa un elemento `details` su mobile, link reali e `aria-current="page"` quando `currentPath` coincide. `Footer.astro` rende le istituzioni da `master.institutions` e i collegamenti da `contacts`. Non duplicare il markup dei link tra desktop e mobile: una sola lista viene adattata con CSS.

- [ ] **Step 4: Creare una home-shell minima che usa contenuti reali**

`src/pages/index.astro` recupera le entry `master`, `contacts` ed `editorial/home`, rende `Notice`, `Header`, un `<main id="main-content">` con il titolo editoriale e `Footer`. Aggiungere assert espliciti con errore leggibile se una entry singleton non viene trovata.

- [ ] **Step 5: Verificare output, accessibilità strutturale e commit**

Run: `npm run build && npm test -- tests/build-output.test.ts`

Expected: test PASS e `dist/index.html` presente.

Run: `npm run check`

Expected: nessun errore.

```bash
git add src/styles src/layouts src/components src/pages/index.astro public/favicon.svg tests/build-output.test.ts
git commit -m "feat: add accessible site shell and design system"
```

---

### Task 4: Homepage ibrida completa

**Files:**
- Create: `src/components/sections/Hero.astro`
- Create: `src/components/sections/KeyFacts.astro`
- Create: `src/components/sections/DeadlineList.astro`
- Create: `src/components/sections/CallToAction.astro`
- Create: `src/components/cards/CourseCard.astro`
- Create: `src/components/cards/FacultyCard.astro`
- Create: `src/components/cards/NewsCard.astro`
- Modify: `src/pages/index.astro`
- Modify: `tests/build-output.test.ts`

**Interfaces:**
- Consumes: utility `sortByOrder`, `featuredEntries`, `latestNews`; contenuti `master`, `deadlines`, `contacts`, `editorial`, `courses`, `faculty`, `news`.
- Produces: componenti scheda riutilizzati da Programma, Docenti e News; homepage finale approvata nel mockup.

- [ ] **Step 1: Estendere il test con criteri fallenti della homepage**

Aggiungere a `tests/build-output.test.ts`:

```ts
it('renderizza sezioni e contenuti selezionati della homepage', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  expect(html).toContain('Intelligenza che crea valore');
  expect(html).toContain('Perché questo Master');
  expect(html).toContain('Machine Learning');
  expect(html).toContain('Prossime scadenze');
  expect(html).toContain('Mario Rossi');
  expect(html).toContain('Apertura delle candidature');
  expect(html).not.toContain('Partnership in preparazione');
});
```

Run: `npm run build && npm test -- tests/build-output.test.ts`

Expected: FAIL sulle sezioni non ancora implementate.

- [ ] **Step 2: Implementare Hero e KeyFacts**

`Hero.astro` riceve `{ master }`, mostra istituzioni, `master.subtitle`, `master.summary`, CTA a `#il-master` e `/ammissione` e un motivo grafico CSS non informativo con `aria-hidden="true"`. `KeyFacts.astro` costruisce una lista semantica da CFU, durata, ore, modalità e sede.

La struttura della hero deve seguire questo contratto:

```astro
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div>
      <p class="eyebrow">{institutionNames}</p>
      <h1 id="hero-title">{master.subtitle}</h1>
      <p class="hero__summary">{master.summary}</p>
      <div class="hero__actions"><Button href="#il-master">Scopri il Master</Button><Button href="/ammissione" variant="secondary">Come iscriversi</Button></div>
    </div>
    <div class="hero__visual" aria-hidden="true"><span>AI</span></div>
  </div>
</section>
```

- [ ] **Step 3: Implementare schede, scadenze e CTA**

Le tre card ricevono una singola `CollectionEntry` e non eseguono query. `FacultyCard` produce iniziali quando `photo` manca. `NewsCard` usa `formatItalianDate` e collega `/news/${entry.id}/`. `DeadlineList` riceve gli item ordinati e usa `<time datetime={item.date}>`. `CallToAction` riceve heading, testo, etichetta e URL.

- [ ] **Step 4: Comporre la homepage completa**

In `index.astro`:

```ts
const featuredCourses = featuredEntries(sortByOrder(await getCollection('courses'))).slice(0, 3);
const featuredFaculty = featuredEntries(sortByOrder(await getCollection('faculty'))).slice(0, 3);
const recentNews = latestNews(await getCollection('news'), 3);
```

Rendere nell’ordine approvato: avviso, header, hero, key facts, presentazione editoriale con `id="il-master"`, corsi, scadenze, docenti, news, CTA e footer. Nascondere completamente una preview quando il relativo array è vuoto.

- [ ] **Step 5: Verificare e committare**

Run: `npm run build && npm test`

Expected: tutti i test PASS.

Run: `npm run check`

Expected: nessun errore.

```bash
git add src/components src/pages/index.astro tests/build-output.test.ts
git commit -m "feat: build content-driven homepage"
```

---

### Task 5: Pagine di dettaglio, news dinamiche e 404

**Files:**
- Create: `src/pages/programma.astro`
- Create: `src/pages/ammissione.astro`
- Create: `src/pages/docenti.astro`
- Create: `src/pages/faq.astro`
- Create: `src/pages/contatti.astro`
- Create: `src/pages/404.astro`
- Create: `src/pages/news/index.astro`
- Create: `src/pages/news/[slug].astro`
- Modify: `tests/build-output.test.ts`

**Interfaces:**
- Consumes: layout, navigazione, primitive e card dei Task 3–4; tutte le collezioni del Task 2.
- Produces: tutte le route pubbliche richieste, incluse solo le news non in bozza.

- [ ] **Step 1: Scrivere test fallenti per route e bozze**

Aggiungere a `tests/build-output.test.ts`:

```ts
import { access, readFile } from 'node:fs/promises';

it.each(['programma', 'ammissione', 'docenti', 'faq', 'contatti', 'news'])('genera /%s', async (route) => {
  await expect(access(`dist/${route}/index.html`)).resolves.toBeUndefined();
});

it('genera la pagina 404 nel percorso previsto da GitHub Pages', async () => {
  await expect(access('dist/404.html')).resolves.toBeUndefined();
});

it('genera news pubblicate ma non bozze', async () => {
  await expect(access('dist/news/apertura-candidature/index.html')).resolves.toBeUndefined();
  await expect(access('dist/news/bozza-partnership/index.html')).rejects.toThrow();
});

it('usa details nativi per FAQ e corsi', async () => {
  expect(await readFile('dist/faq/index.html', 'utf8')).toContain('<details');
  expect(await readFile('dist/programma/index.html', 'utf8')).toContain('<details');
});
```

Run: `npm run build && npm test -- tests/build-output.test.ts`

Expected: FAIL perché le route non esistono.

- [ ] **Step 2: Implementare Programma e Ammissione**

`programma.astro` carica `editorial/programma`, ordina i corsi e per ciascuno rende una scheda `<details>` con summary, CFU, ore, docenti e corpo Markdown ottenuto da `render(entry)`. `ammissione.astro` carica `editorial/ammissione`, master e scadenze; mostra requisiti, quota, procedura, documenti disponibili e link esterno di candidatura.

- [ ] **Step 3: Implementare Docenti, FAQ e Contatti**

`docenti.astro` raggruppa le persone nell’ordine fisso `Coordinamento`, `Comitato scientifico`, `Docente`, `Professionista`, poi applica `sortByOrder` in ciascun gruppo. `faq.astro` ordina e raggruppa le domande per categoria e usa `<details><summary>`. `contatti.astro` rende corpo editoriale, contatto generale, coordinatori, due uffici e link istituzionali.

- [ ] **Step 4: Implementare archivio e route delle news**

`news/index.astro` usa `publishedNews`, ordina per data discendente e mostra `EmptyState` se non esistono notizie. `[slug].astro` deve esportare:

```ts
export async function getStaticPaths() {
  const entries = publishedNews(await getCollection('news'));
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}
```

La pagina rende titolo, `<time>`, corpo Markdown, breadcrumb e link all’archivio.

- [ ] **Step 5: Implementare 404 e verificare**

`404.astro` usa `BaseLayout`, heading “Pagina non trovata”, una spiegazione e link a `/`, `/programma` e `/ammissione`.

Run: `npm run build && npm test`

Expected: tutti i test PASS, inclusa l’assenza della bozza.

Run: `npm run check`

Expected: nessun errore.

```bash
git add src/pages tests/build-output.test.ts
git commit -m "feat: add program, admissions, faculty and news pages"
```

---

### Task 6: Pages CMS, media, SEO e deploy GitHub Pages

**Files:**
- Create: `.pages.yml`
- Create: `.github/workflows/deploy.yml`
- Create: `public/CNAME`
- Create: `public/robots.txt`
- Create: `public/images/.gitkeep`
- Create: `public/documents/.gitkeep`
- Create: `tests/cms-config.test.ts`

**Interfaces:**
- Consumes: percorsi e nomi campo definiti nei Task 2 e 5.
- Produces: editor visuale coerente, sitemap/robots e deploy automatico da `main`.

- [ ] **Step 1: Scrivere test fallenti per configurazione CMS e deploy**

`tests/cms-config.test.ts`:

```ts
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('integrazioni editoriali e deploy', () => {
  it('espone tutti i contenuti in Pages CMS', async () => {
    const config = await readFile('.pages.yml', 'utf8');
    for (const path of ['src/data/master.yml', 'src/data/deadlines.yml', 'src/data/contacts.yml',
      'src/data/faq.yml', 'src/content/editorial', 'src/content/courses', 'src/content/faculty', 'src/content/news']) {
      expect(config).toContain(`path: ${path}`);
    }
    expect(config).toContain('input: public/images');
    expect(config).toContain('input: public/documents');
  });

  it('dispiega solo da main con i permessi Pages', async () => {
    const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
    expect(workflow).toContain('branches: [main]');
    expect(workflow).toContain('pages: write');
    expect(workflow).toContain('id-token: write');
    expect(workflow).toContain('withastro/action@');
    expect(workflow).toContain('actions/deploy-pages@');
  });
});
```

Run: `npm test -- tests/cms-config.test.ts`

Expected: FAIL perché `.pages.yml` e il workflow non esistono.

- [ ] **Step 2: Configurare Pages CMS**

Creare `.pages.yml` con due media source:

```yaml
media:
  - name: images
    label: Immagini
    input: public/images
    output: /images
    categories: [image]
    extensions: [jpg, jpeg, png, webp, avif, svg]
    rename: safe
  - name: documents
    label: Documenti
    input: public/documents
    output: /documents
    categories: [document]
    extensions: [pdf]
    rename: safe
```

Aggiungere un gruppo “Impostazioni” con i quattro file YAML, un gruppo “Pagine” con i file editoriali e tre collezioni per corsi, docenti e news. Ogni field name deve corrispondere esattamente allo schema del Task 2. Usare `rich-text` soltanto per `body` dei Markdown, `text` per `faq.items.answer`, `boolean` per `featured`/`draft`, `date` con formato `yyyy-MM-dd`, `file` collegato a `documents` e `image` collegato a `images`. Impostare `operations: { create: false, rename: false, delete: false }` sui file YAML ed editoriali.

- [ ] **Step 3: Configurare GitHub Pages**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm test
      - uses: withastro/action@v5
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

Prima di salvare il workflow, verificare nelle release ufficiali che le major `checkout@v5`, `setup-node@v5`, `withastro/action@v5` e `deploy-pages@v5` esistano; se una major non esiste, usare l’ultima major ufficiale disponibile e aggiornare le aspettative del test con gli stessi valori.

- [ ] **Step 4: Aggiungere dominio, robots e cartelle media**

`public/CNAME` contiene una sola riga: `master.example.it`.

`public/robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://master.example.it/sitemap-index.xml
```

Creare `.gitkeep` nelle cartelle media e non aggiungere PDF fittizi. I tre URL opzionali di candidatura, bando e brochure sono assenti dai dati demo, quindi i relativi pulsanti esterni non vengono renderizzati. La CTA interna verso `/ammissione` resta sempre disponibile.

- [ ] **Step 5: Verificare e committare**

Run: `npm test -- tests/cms-config.test.ts`

Expected: 2 test PASS.

Run: `npm run build`

Expected: build completa con sitemap, `robots.txt` e `CNAME` in `dist/`.

```bash
git add .pages.yml .github public tests/cms-config.test.ts
git commit -m "feat: configure Pages CMS and GitHub Pages deployment"
```

---

### Task 7: Controllo link, documentazione e validazione finale

**Files:**
- Create: `scripts/check-links.mjs`
- Create: `tests/check-links.test.ts`
- Create: `README.md`
- Modify: `package.json`
- Modify: `WebsiteIdea.md` only if the user explicitly asks; otherwise leave unchanged.

**Interfaces:**
- Consumes: intero output `dist/`, `.pages.yml`, workflow e configurazione dominio.
- Produces: `checkBuildLinks(root): Promise<string[]>`, documentazione operativa e comando `npm run validate` verde.

- [ ] **Step 1: Scrivere test fallenti per il link checker**

`tests/check-links.test.ts`:

```ts
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkBuildLinks } from '../scripts/check-links.mjs';

describe('link interni del build', () => {
  it('segnala una destinazione mancante', async () => {
    const root = await mkdtemp(join(tmpdir(), 'master-links-'));
    await mkdir(join(root, 'index'), { recursive: true });
    await writeFile(join(root, 'index.html'), '<a href="/pagina-mancante/">Link</a>');
    expect(await checkBuildLinks(root)).toEqual(['/pagina-mancante/']);
  });

  it('accetta route e frammenti esistenti', async () => {
    const root = await mkdtemp(join(tmpdir(), 'master-links-'));
    await mkdir(join(root, 'programma'), { recursive: true });
    await writeFile(join(root, 'index.html'), '<a href="/programma/">Programma</a><a href="#master">Master</a><h2 id="master">Master</h2>');
    await writeFile(join(root, 'programma/index.html'), '<h1>Programma</h1>');
    expect(await checkBuildLinks(root)).toEqual([]);
  });
});
```

- [ ] **Step 2: Eseguire il test e verificare il fallimento**

Run: `npm test -- tests/check-links.test.ts`

Expected: FAIL perché `scripts/check-links.mjs` non esiste.

- [ ] **Step 3: Implementare il link checker senza dipendenze**

`scripts/check-links.mjs` deve esportare `checkBuildLinks(root = 'dist')`, visitare ricorsivamente gli `.html`, estrarre gli `href` con URL relative alla root, ignorare `mailto:`, `tel:`, URL esterni e asset non HTML, verificare route directory/index e frammenti nella pagina corrente. Se eseguito direttamente, stampa ogni destinazione mancante e termina con exit code 1; termina con 0 e stampa `Link interni validi` quando non trova errori.

Usare `fileURLToPath(import.meta.url) === resolve(process.argv[1])` per distinguere import ed esecuzione CLI. Normalizzare `/foo`, `/foo/` e `/foo/index.html` sulla stessa destinazione.

- [ ] **Step 4: Verificare il link checker**

Run: `npm test -- tests/check-links.test.ts`

Expected: 2 test PASS.

Run: `npm run build && npm run check:links`

Expected: `Link interni validi`.

- [ ] **Step 5: Scrivere il README operativo**

`README.md` deve includere, in quest’ordine:

1. stato demo ben visibile;
2. requisiti Node.js 22.12+ e npm;
3. `npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npm run validate`;
4. mappa di `src/content/`, `src/data/`, `public/images/`, `public/documents/`;
5. istruzioni Pages CMS: installazione GitHub App, apertura repository, salvataggio diretto su `main` e build conseguente;
6. spiegazione di `.pages.yml` e dei campi non modificabili dagli editor;
7. configurazione GitHub Pages con “GitHub Actions” come source;
8. sostituzione coordinata di `site` in `astro.config.mjs`, `public/CNAME` e URL sitemap in `public/robots.txt`;
9. indicazioni DNS per sottodominio CNAME verso `<account>.github.io`, demandando i valori definitivi alla documentazione GitHub e al gestore DNS;
10. dimensioni consigliate: immagini docente quadrate WebP/AVIF, almeno 640×640 px e preferibilmente sotto 250 KB; immagini news 1600×900 px e preferibilmente sotto 400 KB;
11. procedura per sostituire tutti i dati demo prima della pubblicazione.

- [ ] **Step 6: Eseguire validazione completa**

Run: `npm run validate`

Expected, nello stesso comando:

- `astro check` senza errori;
- tutti i test Vitest PASS;
- build Astro completata;
- `Link interni validi`.

Run: `git status --short`

Expected: solo file intenzionalmente non versionati già presenti prima dell’implementazione; nessun output di build o artefatto `.superpowers/` tracciato.

- [ ] **Step 7: Revisione manuale e commit**

Avviare `npm run dev`, verificare con viewport mobile e desktop tutte le route, il menu con tastiera, i focus, le FAQ, i moduli, le immagini mancanti e i link esterni. Verificare che l’avviso demo sia presente su ogni pagina e che nessun PDF inesistente sia cliccabile.

```bash
git add README.md scripts/check-links.mjs tests/check-links.test.ts package.json package-lock.json
git commit -m "docs: add maintenance guide and final validation"
```

---

## Final review checkpoint

Eseguire:

```bash
npm run validate
git log --oneline --decorate -8
git status --short --branch
```

Accettazione finale:

- tutte le route richieste sono statiche e raggiungibili;
- la homepage coincide con gerarchia e direzione visiva approvate;
- contenuti demo, scadenze e collegamenti sono chiaramente marcati;
- modificare contenuti non richiede cambi a file `.astro`;
- `.pages.yml` rispecchia file e schemi effettivi;
- una news in bozza non è presente nel build;
- deploy e dominio seguono la configurazione GitHub Pages con custom domain;
- nessun backend, database o hydration client è stato introdotto;
- working tree pulito salvo file originariamente non tracciati e intenzionalmente preservati.

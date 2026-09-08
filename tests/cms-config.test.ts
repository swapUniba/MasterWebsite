import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import {
  contactsSchema, courseSchema, deadlinesSchema, editorialSchema,
  facultySchema, faqSchema, masterSchema, newsSchema,
} from '../src/content/schemas';

interface CmsField { name: string; type: string; options?: Record<string, unknown> }
interface CmsEntry {
  name: string; type: string; path?: string; format?: string;
  operations?: Record<string, boolean>; items?: CmsEntry[]; fields?: CmsField[];
}
interface CmsMedia { name: string; input: string; output: string; categories: string[]; extensions: string[] }
interface CmsConfig { media: CmsMedia[]; content: CmsEntry[] }

const loadConfig = async () => parse(await readFile('.pages.yml', 'utf8')) as CmsConfig;
const byName = <T extends { name: string }>(list: T[] | undefined, name: string): T => {
  const found = (list ?? []).find((item) => item.name === name);
  expect(found, `voce "${name}" assente da .pages.yml`).toBeDefined();
  return found as T;
};
const fieldNames = (entry: CmsEntry) => (entry.fields ?? []).map((field) => field.name).sort();
const schemaKeys = (schema: { shape: Record<string, unknown> }, extra: string[] = []) =>
  [...Object.keys(schema.shape), ...extra].sort();
const enumValues = (schema: { shape: Record<string, unknown> }, key: string) =>
  (schema.shape[key] as { options: string[] }).options;

describe('configurazione editoriale Pages CMS', () => {
  it('dichiara sorgenti media separate per immagini e documenti', async () => {
    const { media } = await loadConfig();
    const images = byName(media, 'images');
    expect(images.input).toBe('public/images');
    expect(images.output).toBe('/images');
    expect(images.categories).toContain('image');
    expect(images.extensions).toEqual(expect.arrayContaining(['jpg', 'png', 'webp', 'avif', 'svg']));

    const documents = byName(media, 'documents');
    expect(documents.input).toBe('public/documents');
    expect(documents.output).toBe('/documents');
    expect(documents.categories).toContain('document');
    expect(documents.extensions).toContain('pdf');
  });

  it('mappa ogni sorgente di contenuto sul percorso e sul formato usati dal sito', async () => {
    const { content } = await loadConfig();
    const settings = byName(content, 'impostazioni');
    const pages = byName(content, 'pagine');
    const expected: Record<string, { entry: CmsEntry; path: string; type: string }> = {
      master: { entry: byName(settings.items, 'master'), path: 'src/data/master.yml', type: 'file' },
      deadlines: { entry: byName(settings.items, 'deadlines'), path: 'src/data/deadlines.yml', type: 'file' },
      contacts: { entry: byName(settings.items, 'contacts'), path: 'src/data/contacts.yml', type: 'file' },
      faq: { entry: byName(settings.items, 'faq'), path: 'src/data/faq.yml', type: 'file' },
      editorial: { entry: byName(pages.items, 'editorial'), path: 'src/content/editorial', type: 'collection' },
      courses: { entry: byName(content, 'courses'), path: 'src/content/courses', type: 'collection' },
      faculty: { entry: byName(content, 'faculty'), path: 'src/content/faculty', type: 'collection' },
      news: { entry: byName(content, 'news'), path: 'src/content/news', type: 'collection' },
    };
    for (const [name, { entry, path, type }] of Object.entries(expected)) {
      expect(entry.path, name).toBe(path);
      expect(entry.type, name).toBe(type);
      expect(entry.format, name).toBe(type === 'file' ? 'yaml' : 'yaml-frontmatter');
    }
  });

  it('espone esattamente i campi degli schemi Zod, più il corpo Markdown delle collezioni', async () => {
    const { content } = await loadConfig();
    const settings = byName(content, 'impostazioni');
    const pages = byName(content, 'pagine');
    const parity: [string, CmsEntry, string[]][] = [
      ['master', byName(settings.items, 'master'), schemaKeys(masterSchema)],
      ['deadlines', byName(settings.items, 'deadlines'), schemaKeys(deadlinesSchema)],
      ['contacts', byName(settings.items, 'contacts'), schemaKeys(contactsSchema)],
      ['faq', byName(settings.items, 'faq'), schemaKeys(faqSchema)],
      ['editorial', byName(pages.items, 'editorial'), schemaKeys(editorialSchema, ['body'])],
      ['courses', byName(content, 'courses'), schemaKeys(courseSchema, ['body'])],
      ['faculty', byName(content, 'faculty'), schemaKeys(facultySchema, ['body'])],
      ['news', byName(content, 'news'), schemaKeys(newsSchema, ['body'])],
    ];
    for (const [name, entry, keys] of parity) {
      expect(fieldNames(entry), name).toEqual(keys);
    }
  });

  it('offre i valori enumerati degli schemi come campi select', async () => {
    const { content } = await loadConfig();
    const settings = byName(content, 'impostazioni');
    const enums: [CmsEntry, string, string[]][] = [
      [byName(settings.items, 'master'), 'teaching_mode', enumValues(masterSchema, 'teaching_mode')],
      [byName(content, 'courses'), 'semester', enumValues(courseSchema, 'semester')],
      [byName(content, 'faculty'), 'category', enumValues(facultySchema, 'category')],
    ];
    for (const [entry, name, values] of enums) {
      const field = byName(entry.fields, name);
      expect(field.type, name).toBe('select');
      expect(field.options?.values, name).toEqual(values);
    }
  });

  it('blocca creazione, rinomina e cancellazione solo per le sorgenti a percorso fisso', async () => {
    const { content } = await loadConfig();
    const settings = byName(content, 'impostazioni');
    const pages = byName(content, 'pagine');
    for (const name of ['master', 'deadlines', 'contacts', 'faq']) {
      expect(byName(settings.items, name).operations, name).toEqual({ create: false, rename: false, delete: false });
    }
    expect(byName(pages.items, 'editorial').operations).toEqual({ create: false, rename: false, delete: false });
    for (const name of ['courses', 'faculty', 'news']) {
      expect(byName(content, name).operations, name).toBeUndefined();
    }
  });
});

describe('workflow di pubblicazione', () => {
  it('dispiega solo da main con i permessi Pages e la validazione completa', async () => {
    const workflow = parse(await readFile('.github/workflows/deploy.yml', 'utf8')) as {
      on: { push: { branches: string[] }; workflow_dispatch: null };
      permissions: Record<string, string>;
      jobs: Record<string, { steps: { uses?: string; run?: string }[] }>;
    };
    expect(workflow.on.push.branches).toEqual(['main']);
    expect(workflow.on).toHaveProperty('workflow_dispatch');
    expect(workflow.permissions).toMatchObject({ 'pages': 'write', 'id-token': 'write' });

    const steps = Object.values(workflow.jobs).flatMap((job) => job.steps);
    expect(steps.map((step) => step.run)).toContain('npm run validate');
    const actions = steps.map((step) => step.uses).filter(Boolean) as string[];
    expect(actions.some((action) => action.startsWith('withastro/action@'))).toBe(true);
    expect(actions.some((action) => action.startsWith('actions/deploy-pages@'))).toBe(true);
  });
});

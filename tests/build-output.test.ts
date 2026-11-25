import { access, readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const home = () => readFile('dist/index.html', 'utf8');

const getCards = (html: string, className: string): string[] =>
  html.match(new RegExp(`<article\\b[^>]*class="${className}"[^>]*>[\\s\\S]*?<\\/article>`, 'g')) ?? [];

const getCardTitles = (html: string, className: string): string[] =>
  getCards(html, className)
    .map((card) => card.match(/<h3\b[^>]*>([^<]+)<\/h3>/)?.[1]?.trim() ?? '')
    .filter(Boolean);

describe('output statico', () => {
  it.each(['programma', 'ammissione', 'docenti', 'faq', 'contatti', 'news'])('genera /%s', async (route) => {
    await expect(access(`dist/${route}/index.html`)).resolves.toBeUndefined();
  });

  it('genera la pagina 404 nel percorso previsto da GitHub Pages', async () => {
    await expect(access('dist/404.html')).resolves.toBeUndefined();
  });

  it('non genera pagine per le news demo rimosse', async () => {
    await expect(access('dist/news/apertura-candidature/index.html')).rejects.toThrow();
    await expect(access('dist/news/presentazione-online/index.html')).rejects.toThrow();
    await expect(access('dist/news/bozza-partnership/index.html')).rejects.toThrow();
  });

  it('usa details nativi per FAQ e corsi', async () => {
    expect(await readFile('dist/faq/index.html', 'utf8')).toContain('<details');
    expect(await readFile('dist/programma/index.html', 'utf8')).toContain('<details');
  });

  it('include lingua e uno skip link verso il contenuto principale', async () => {
    const html = await home();
    expect(html).toContain('<html lang="it"');
    expect(html).toContain('href="#main-content"');
    expect(html).toMatch(/<main\b[^>]*id="main-content"/);
  });

  it('pubblica il canonical e i metadati senza una immagine social inesistente', async () => {
    const html = await home();
    expect(html).toContain('rel="canonical" href="https://masteriads.com/"');
    expect(html).toContain('name="description"');
    expect(html).toContain('property="og:title"');
    expect(html).not.toContain('property="og:image"');
    expect(await readFile('public/favicon.svg', 'utf8')).toContain('<svg');
  });

  it('offre una sola lista di navigazione con controllo nativo e pagina corrente', async () => {
    const html = await home();
    const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0] ?? '';
    expect(header).toMatch(/<details\b/);
    expect(header).toMatch(/<summary\b[^>]*>\s*Menu\s*<\/summary>/);
    expect(header.match(/<nav\b/g)).toHaveLength(1);
    expect(header.match(/<ul\b/g)).toHaveLength(1);
    expect(header).toMatch(/<a\b[^>]*href="\/"[^>]*aria-current="page"/);
    expect(header.match(/aria-current="page"/g)).toHaveLength(1);
    expect(header).not.toMatch(/href="#"/);
  });

  it('rende un titolo e contenuti editoriali non vuoti, senza avviso demo', async () => {
    const html = await home();
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    expect(headings).toHaveLength(1);
    expect(headings[0][1].replace(/<[^>]+>/g, '').trim().length).toBeGreaterThan(0);
    expect(html).toMatch(/<p\b[^>]*class="hero__summary"[^>]*>[^<]+<\/p>/);

    const introduction = html.match(/<section\b[^>]*id="il-master"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? '';
    expect(introduction).toMatch(/<div\b[^>]*class="prose"[^>]*>[\s\S]*?<p\b/);
    expect(html).not.toContain('Sito dimostrativo');
  });

  it('renderizza le sezioni e le anteprime della homepage', async () => {
    const html = await home();
    expect(html).toContain('id="il-master"');
    expect(html).toContain('id="courses-heading"');
    expect(html).toContain('id="deadlines-heading"');
    expect(html).toContain('id="faculty-heading"');
    expect(getCards(html, 'course-card').length).toBeGreaterThan(0);
    expect(getCards(html, 'faculty-card').length).toBeGreaterThan(0);
    expect(html).toContain('class="deadline-list"');
    expect(html).not.toContain('Mario Rossi');
    expect(html).not.toContain('Laura Bianchi');
    expect(html).not.toContain('Bozza di collaborazione');
  });

  it('associa la presentazione al suo titolo e conserva l ordine delle sezioni', async () => {
    const html = await home();
    const introduction = html.match(/<section\b[^>]*id="il-master"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? '';
    expect(introduction).toContain('aria-labelledby="master-heading"');
    expect(introduction).toMatch(/<h2\b[^>]*id="master-heading"[^>]*>[^<]+<\/h2>/);
    const sections = ['hero-title', 'key-facts', 'il-master', 'courses-heading', 'deadlines-heading', 'faculty-heading', 'cta-heading'];
    let previous = -1;
    for (const id of sections) {
      const position = html.indexOf(`id="${id}"`);
           expect(position, id).toBeGreaterThan(previous);
      previous = position;
    }
  });

  it('presenta dati chiave semantici e collegamenti utili nella hero', async () => {
    const html = await home();
    const hero = html.match(/<section\b[^>]*class="hero"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? '';
    expect(hero).toContain('href="#il-master"');
    expect(hero).toContain('href="/ammissione/"');
    expect(hero).toMatch(/class="hero__visual"[^>]*aria-hidden="true"/);
    const facts = html.match(/<dl\b[^>]*id="key-facts"[^>]*>[\s\S]*?<\/dl>/)?.[0] ?? '';
    const labels = facts.match(/<dt\b/g) ?? [];
    const values = facts.match(/<dd\b/g) ?? [];
    expect(labels.length).toBeGreaterThan(0);
    expect(values).toHaveLength(labels.length);
  });

  it('rende docenti e scadenze con avatar accessibili e date leggibili e ordinate', async () => {
    const html = await home();
    const facultyCards = getCards(html, 'faculty-card');
    expect(facultyCards.length).toBeGreaterThan(0);
    for (const card of facultyCards) {
      expect(card).toMatch(/<h3\b[^>]*>[^<]+<\/h3>/);
      const image = card.match(/<img\b[^>]*>/)?.[0];
      if (image) {
        expect(image).toMatch(/\balt="[^"]+"/);
      } else {
        expect(card).toMatch(/<span\b[^>]*aria-hidden="true"[^>]*>[^<]+<\/span>/);
      }
    }

    const deadlines = html.match(/<ol\b[^>]*class="deadline-list"[^>]*>[\s\S]*?<\/ol>/)?.[0] ?? '';
    const times = [...deadlines.matchAll(/<time\b[^>]*datetime="(\d{4}-\d{2}-\d{2})"[^>]*>([^<]+)<\/time>/g)];
    expect(times.length).toBeGreaterThan(0);
    const dates = times.map((match) => match[1]);
    expect(dates).toEqual([...dates].sort());
    for (const match of times) {
      expect(Number.isNaN(Date.parse(match[1]))).toBe(false);
      expect(match[2].trim()).toMatch(/\d{1,2}\s+\p{L}+\s+\d{4}/u);
    }
  });

  it('raggiunge dalla navigazione ogni pagina pubblicata e la sezione introduttiva', async () => {
    for (const page of ['dist/index.html', 'dist/faq/index.html', 'dist/news/index.html', 'dist/404.html']) {
      const header = (await readFile(page, 'utf8')).match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0] ?? '';
      for (const href of ['/', '/#il-master', '/programma/', '/docenti/', '/ammissione/', '/news/', '/faq/', '/contatti/']) {
        expect(header, `${page} -> ${href}`).toContain(`href="${href}"`);
      }
    }
  });

  it('rende il titolo ufficiale del Master nel footer', async () => {
    const footer = (await home()).match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0] ?? '';
    expect(footer).toContain('Master Congiunto di II Livello in Intelligenza Artificiale e Data Science');
  });

  it('mostra programma e contatti dei docenti senza dati di esempio', async () => {
    const programma = await readFile('dist/programma/index.html', 'utf8');
    const docenti = await readFile('dist/docenti/index.html', 'utf8');
    expect(programma).not.toMatch(/<dt\b[^>]*>Semestre<\/dt>/);
    expect(programma).not.toContain('>Altro<');
    expect(programma).toContain('<details');
    expect(docenti).toMatch(/href="mailto:[^"\s]+@[^"\s]+"/);
  });

  it('mantiene coerenti le anteprime dei corsi e dei docenti con le pagine complete', async () => {
    const html = await home();
    const programma = await readFile('dist/programma/index.html', 'utf8');
    const docenti = await readFile('dist/docenti/index.html', 'utf8');
    const courseTitles = getCardTitles(html, 'course-card');
    const facultyNames = getCardTitles(html, 'faculty-card');
    expect(courseTitles.length).toBeGreaterThan(0);
    expect(facultyNames.length).toBeGreaterThan(0);
    for (const title of courseTitles) expect(programma, title).toContain(title);
    for (const name of facultyNames) expect(docenti, name).toContain(name);
  });

  it('assegna un nome accessibile a ogni sezione generata', async () => {
    for (const page of ['dist/404.html', 'dist/news/index.html']) {
      const html = await readFile(page, 'utf8');
      const sections = html.match(/<section\b[^>]*class="section[^"]*"[^>]*>/g) ?? [];
      expect(sections.length, page).toBeGreaterThan(0);
      for (const section of sections) expect(section, page).toContain('aria-labelledby=');
    }
  });

  it('rende istituzioni e contatti nel footer', async () => {
    const html = await home();
    const footer = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0] ?? '';
    expect(footer).toContain('Università degli Studi di Bari Aldo Moro');
    expect(footer).toContain('Politecnico di Bari');
    expect(footer).toMatch(/href="mailto:[^"\s]+@[^"\s]+"/);
    expect(footer).toContain('href="https://www.uniba.it"');
    expect(footer).toContain('href="https://www.poliba.it"');
  });
});

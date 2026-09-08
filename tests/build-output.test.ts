import { access, readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const home = () => readFile('dist/index.html', 'utf8');
const BASE = '/MasterWebsite';

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

  it('pubblica canonical e metadati senza un’immagine social inesistente', async () => {
    const html = await home();
    expect(html).toContain(`rel="canonical" href="https://swapuniba.github.io${BASE}/"`);
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
    expect(header).toMatch(new RegExp(`<a\\b[^>]*href="${BASE}/"[^>]*aria-current="page"`));
    expect(header.match(/aria-current="page"/g)).toHaveLength(1);
    expect(header).not.toMatch(/href="#"/);
  });

  it('rende titolo e contenuto editoriale importati senza avviso demo', async () => {
    const html = await home();
    expect(html).toMatch(/<h1\b[^>]*>Progettare soluzioni intelligenti, valorizzare i dati<\/h1>/);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('Competenze avanzate per l’innovazione data-driven');
    expect(html).not.toContain('Sito dimostrativo');
    expect(html).toContain('data governance, explainable AI, sicurezza, privacy');
  });

  it('renderizza sezioni e contenuti selezionati della homepage', async () => {
    const html = await home();
    expect(html).toContain('Progettare soluzioni intelligenti, valorizzare i dati');
    expect(html).toContain('Perché questo Master');
    expect(html).toContain('Allineamento – Basi di Programmazione');
    expect(html).toContain('Prossime scadenze');
    expect(html).toContain('Cataldo Musto');
    expect(html).toContain('Emanazione prevista del bando di ammissione');
    expect(html).not.toContain('Mario Rossi');
    expect(html).not.toContain('Laura Bianchi');
    expect(html).not.toContain('Bozza di collaborazione');
  });

  it('associa la presentazione al suo titolo e conserva l’ordine delle sezioni', async () => {
    const html = await home();
    const introduction = html.match(/<section\b[^>]*id="il-master"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? '';
    expect(introduction).toContain('aria-labelledby="master-heading"');
    expect(introduction).toMatch(/<h2\b[^>]*id="master-heading"[^>]*>Perché questo Master<\/h2>/);
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
    expect(hero).toContain(`href="${BASE}/ammissione/"`);
    expect(hero).toMatch(/class="hero__visual"[^>]*aria-hidden="true"/);
    const facts = html.match(/<dl\b[^>]*id="key-facts"[^>]*>[\s\S]*?<\/dl>/)?.[0] ?? '';
    for (const value of ['CFU', '60', 'Durata', 'Annuale', 'Ore complessive', '1.500',
      'Posti disponibili', '50', 'Modalità', 'Mista', 'Sede', 'Dipartimento di Informatica, Bari']) {
      expect(facts).toContain(value);
    }
    expect(facts.match(/<dt\b/g)).toHaveLength(6);
    expect(facts.match(/<dd\b/g)).toHaveLength(6);
  });

  it('ordina corsi, persone e scadenze e offre avatar e date leggibili', async () => {
    const html = await home();
    expect(html.indexOf('Allineamento – Basi di Programmazione')).toBeLessThan(html.indexOf('Strumenti e Risorse per AI e Data Science'));
    expect(html.indexOf('Strumenti e Risorse per AI e Data Science')).toBeLessThan(html.indexOf('Data Management e Business Intelligence'));
    expect(html.indexOf('Cataldo Musto')).toBeLessThan(html.indexOf('Pasquale Lops'));
    expect(html).toMatch(/aria-hidden="true"[^>]*>CM<\/span>/);
    expect(html).toMatch(/aria-hidden="true"[^>]*>PL<\/span>/);
    expect(html).not.toContain(`href="${BASE}/news/apertura-candidature/"`);
    expect(html).not.toContain(`href="${BASE}/news/presentazione-online/"`);
    expect(html).toMatch(/<time\b[^>]*datetime="2026-10-01"[^>]*>1 ottobre 2026<\/time>/);
    const deadlines = html.match(/<ol\b[^>]*class="deadline-list"[^>]*>[\s\S]*?<\/ol>/)?.[0] ?? '';
    expect(deadlines.indexOf('2026-10-01')).toBeGreaterThan(-1);
    expect(deadlines.indexOf('2026-10-01')).toBeLessThan(deadlines.indexOf('2027-03-01'));
  });

  it('raggiunge dalla navigazione ogni pagina pubblicata e la sezione introduttiva', async () => {
    for (const page of ['dist/index.html', 'dist/faq/index.html', 'dist/news/index.html', 'dist/404.html']) {
      const header = (await readFile(page, 'utf8')).match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0] ?? '';
      for (const href of ['/', '/#il-master', '/programma/', '/docenti/', '/ammissione/', '/news/', '/faq/', '/contatti/']) {
        expect(header, `${page} → ${href}`).toContain(`href="${BASE}${href}"`);
      }
    }
  });

  it('rende il titolo ufficiale del Master nel footer', async () => {
    const footer = (await home()).match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0] ?? '';
    expect(footer).toContain('Master Congiunto di II Livello in Intelligenza Artificiale e Data Science');
  });

  it('non inventa semestri ed espone contatti e incarichi dei docenti', async () => {
    const programma = await readFile('dist/programma/index.html', 'utf8');
    expect(programma).not.toMatch(/<dt\b[^>]*>Semestre<\/dt>/);
    expect(programma).not.toContain('>Altro<');
    const docenti = await readFile('dist/docenti/index.html', 'utf8');
    expect(docenti).toContain('href="mailto:cataldo.musto@uniba.it"');
    expect(docenti).toContain('Coordinatore del Master e responsabile dei moduli 1 e 9');
  });

  it('espone solo i responsabili dei moduli e rimuove tutti gli altri docenti', async () => {
    const programma = await readFile('dist/programma/index.html', 'utf8');
    const docenti = await readFile('dist/docenti/index.html', 'utf8');
    for (const name of ['Cataldo Musto', 'Pierpaolo Basile', 'Fedelucio Narducci', 'Tommaso Di Noia',
      'Marco De Gemmis', 'Vito Walter Anelli', 'Pasquale Lops', 'Giovanni Semeraro']) {
      expect(programma, name).toContain(name);
      expect(docenti, name).toContain(name);
    }
    for (const name of ['Gennaro Vessio', 'Vincenzo Patruno', 'Gianvito Pio', 'Claudio Pomo',
      'Giovanna Castellano', 'Paolo Buono', 'Marco Polignano', 'Morena Ragone', 'Michelangelo Ceci']) {
      expect(programma, name).not.toContain(name);
      expect(docenti, name).not.toContain(name);
    }
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
    expect(footer).toContain('href="mailto:cataldo.musto@uniba.it"');
    expect(footer).toContain('href="https://www.uniba.it"');
    expect(footer).toContain('href="https://www.poliba.it"');
  });
});

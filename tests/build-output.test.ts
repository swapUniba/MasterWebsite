import { access, readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const home = () => readFile('dist/index.html', 'utf8');

describe('output statico', () => {
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

  it('include lingua e uno skip link verso il contenuto principale', async () => {
    const html = await home();
    expect(html).toContain('<html lang="it"');
    expect(html).toContain('href="#main-content"');
    expect(html).toMatch(/<main\b[^>]*id="main-content"/);
  });

  it('pubblica canonical e metadati senza un’immagine social inesistente', async () => {
    const html = await home();
    expect(html).toContain('rel="canonical" href="https://master.example.it/"');
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

  it('rende titolo, avviso e contenuto editoriale dalle entry', async () => {
    const html = await home();
    expect(html).toMatch(/<h1\b[^>]*>Intelligenza che crea valore<\/h1>/);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('Dai dati alle decisioni');
    expect(html).toContain('Sito dimostrativo: contenuti, date e collegamenti sono in fase di aggiornamento.');
    expect(html).toContain('competenze statistiche, informatiche e organizzative');
  });

  it('renderizza sezioni e contenuti selezionati della homepage', async () => {
    const html = await home();
    expect(html).toContain('Intelligenza che crea valore');
    expect(html).toContain('Perché questo Master');
    expect(html).toContain('Machine Learning');
    expect(html).toContain('Prossime scadenze');
    expect(html).toContain('Mario Rossi');
    expect(html).toContain('Apertura delle candidature');
    expect(html).not.toContain('Partnership in preparazione');
    expect(html).not.toContain('Bozza di collaborazione con imprese del territorio');
    expect(html).not.toContain('Giulia Verdi');
  });

  it('associa la presentazione al suo titolo e conserva l’ordine delle sezioni', async () => {
    const html = await home();
    const introduction = html.match(/<section\b[^>]*id="il-master"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? '';
    expect(introduction).toContain('aria-labelledby="master-heading"');
    expect(introduction).toMatch(/<h2\b[^>]*id="master-heading"[^>]*>Perché questo Master<\/h2>/);
    const sections = ['hero-title', 'key-facts', 'il-master', 'courses-heading', 'deadlines-heading', 'faculty-heading', 'news-heading', 'cta-heading'];
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
    for (const value of ['CFU', '60', 'Durata', '12 mesi', 'Ore complessive', '1.500',
      'Posti disponibili', '30', 'Modalità', 'Mista', 'Sede', 'Bari']) {
      expect(facts).toContain(value);
    }
    expect(facts.match(/<dt\b/g)).toHaveLength(6);
    expect(facts.match(/<dd\b/g)).toHaveLength(6);
  });

  it('ordina corsi, persone e notizie e offre avatar e date leggibili', async () => {
    const html = await home();
    expect(html.indexOf('Data Management')).toBeLessThan(html.indexOf('Machine Learning'));
    expect(html.indexOf('Machine Learning')).toBeLessThan(html.indexOf('Intelligenza Artificiale Generativa'));
    expect(html.indexOf('Mario Rossi')).toBeLessThan(html.indexOf('Laura Bianchi'));
    expect(html).toMatch(/aria-hidden="true"[^>]*>MR<\/span>/);
    expect(html).toMatch(/aria-hidden="true"[^>]*>LB<\/span>/);
    expect(html.indexOf('href="/news/presentazione-online/"')).toBeLessThan(html.indexOf('href="/news/apertura-candidature/"'));
    expect(html).toContain('href="/news/apertura-candidature/"');
    expect(html).toMatch(/<time\b[^>]*datetime="2027-01-30"[^>]*>30 gennaio 2027<\/time>/);
    const deadlines = html.match(/<ol\b[^>]*class="deadline-list"[^>]*>[\s\S]*?<\/ol>/)?.[0] ?? '';
    expect(deadlines.indexOf('2027-01-15')).toBeGreaterThan(-1);
    expect(deadlines.indexOf('2027-01-15')).toBeLessThan(deadlines.indexOf('2027-01-30'));
    expect(deadlines.indexOf('2027-01-30')).toBeLessThan(deadlines.indexOf('2027-02-15'));
    expect(deadlines).toContain('17:30');
    expect(deadlines).toContain('23:59');
  });

  it('raggiunge dalla navigazione ogni pagina pubblicata e la sezione introduttiva', async () => {
    for (const page of ['dist/index.html', 'dist/faq/index.html', 'dist/news/index.html', 'dist/404.html']) {
      const header = (await readFile(page, 'utf8')).match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0] ?? '';
      for (const href of ['/', '/#il-master', '/programma/', '/docenti/', '/ammissione/', '/news/', '/faq/', '/contatti/']) {
        expect(header, `${page} → ${href}`).toContain(`href="${href}"`);
      }
    }
  });

  it('rende il titolo ufficiale del Master nel footer', async () => {
    const footer = (await home()).match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0] ?? '';
    expect(footer).toContain('Master di II livello in Intelligenza Artificiale e Data Science');
  });

  it('espone semestre dei moduli, contatti e biografie dei docenti', async () => {
    const programma = await readFile('dist/programma/index.html', 'utf8');
    expect(programma).toMatch(/<dt\b[^>]*>Semestre<\/dt>/);
    expect(programma).toContain('Primo semestre');
    const docenti = await readFile('dist/docenti/index.html', 'utf8');
    expect(docenti).toContain('href="mailto:mario.rossi@demo-uniba.it"');
    expect(docenti).toContain('progettazione di sistemi informativi');
  });

  it('assegna un nome accessibile a ogni sezione generata', async () => {
    for (const page of ['dist/404.html', 'dist/news/index.html', 'dist/news/apertura-candidature/index.html']) {
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
    expect(footer).toContain('href="mailto:master.ai-data@demo-uniba.it"');
    expect(footer).toContain('href="https://www.uniba.it"');
    expect(footer).toContain('href="https://www.poliba.it"');
  });
});

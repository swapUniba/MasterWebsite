import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const home = () => readFile('dist/index.html', 'utf8');

describe('output statico', () => {
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
    expect(html).toMatch(/<h1\b[^>]*>Dai dati alle decisioni<\/h1>/);
    expect(html).toContain('Sito dimostrativo: contenuti, date e collegamenti sono in fase di aggiornamento.');
    expect(html).toContain('competenze statistiche, informatiche e organizzative');
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

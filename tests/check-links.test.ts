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

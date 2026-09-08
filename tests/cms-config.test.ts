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

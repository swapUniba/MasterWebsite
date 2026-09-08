import { readdir, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, join, resolve } from 'node:path';

const HREF_PATTERN = /<a\b[^>]*\bhref="([^"]*)"/gi;
const ID_PATTERN = /\bid="([^"]+)"/gi;

async function collectHtmlFiles(root) {
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(path);
      } else if (entry.isFile() && extname(entry.name) === '.html') {
        files.push(path);
      }
    }
  }
  await walk(root);
  return files;
}

function isCheckableHref(href) {
  if (!href || !href.startsWith('/')) return false;
  if (href.startsWith('//')) return false;
  return true;
}

function splitHref(href) {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return { path: href, fragment: undefined };
  return { path: href.slice(0, hashIndex), fragment: href.slice(hashIndex + 1) };
}

async function pathExists(path) {
  return access(path).then(() => true, () => false);
}

// Normalizes `/foo`, `/foo/` and `/foo/index.html` to the same destination:
// the generated directory-index file for that route.
async function destinationExists(root, path) {
  if (path === '') return true;
  if (path.endsWith('.html')) return pathExists(join(root, path));

  const withoutTrailingSlash = path.endsWith('/') ? path.slice(0, -1) : path;
  const indexPath = withoutTrailingSlash === ''
    ? join(root, 'index.html')
    : join(root, withoutTrailingSlash, 'index.html');
  return pathExists(indexPath);
}

export async function checkBuildLinks(root = 'dist') {
  const missing = new Set();
  const htmlFiles = await collectHtmlFiles(root);

  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const ids = new Set([...html.matchAll(ID_PATTERN)].map((match) => match[1]));

    for (const match of html.matchAll(HREF_PATTERN)) {
      const href = match[1];
      if (!isCheckableHref(href)) continue;
      if (extname(href.split('#')[0].split('?')[0]) && !href.endsWith('.html')) continue;

      const { path, fragment } = splitHref(href);

      // In-page fragment (e.g. "#master"): verified against the current
      // page's own ids. Fragments on other routes (e.g. "/foo/#bar") are
      // not resolved — only the route itself is checked.
      if (path === '') {
        if (fragment !== undefined && !ids.has(fragment)) missing.add(href);
        continue;
      }

      if (!(await destinationExists(root, path))) missing.add(href);
    }
  }

  return [...missing];
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) {
  const missing = await checkBuildLinks('dist');
  if (missing.length > 0) {
    for (const href of missing) console.error(`Destinazione mancante: ${href}`);
    process.exit(1);
  }
  console.log('Link interni validi');
  process.exit(0);
}

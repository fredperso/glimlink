import { readFile, writeFile } from 'node:fs/promises';
// Livrable autonome, sans serveur ni dépendance réseau, à partir du build vérifié.
let html = await readFile('dist/index.html', 'utf8');
const jsPath = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[1];
const cssPath = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)?.[1];
if (!jsPath || !cssPath) throw new Error('Assets du build introuvables');
const js = await readFile(`dist/${jsPath.replace(/^\//, '')}`, 'utf8');
const css = await readFile(`dist/${cssPath.replace(/^\//, '')}`, 'utf8');
const favicon = await readFile('public/favicon.svg', 'utf8');
html = html.replace(
  /<script[^>]+src="[^"]+"[^>]*><\/script>/,
  () => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`,
);
html = html.replace(/<link[^>]+href="[^"]+\.css"[^>]*>/, () => `<style>${css}</style>`);
html = html.replace(
  'href="/favicon.svg"',
  `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`,
);
await writeFile('maquette.html', html);
// Adaptateur pour le navigateur MCP lorsque le sandbox interdit un serveur local.
await writeFile(
  'scripts/qa-preview.local.js',
  `async (page) => {
  await page.unroute('http://glimlink.demo/**');
  await page.route('http://glimlink.demo/**', route => route.fulfill({status: 200, contentType: 'text/html', body: ${JSON.stringify(html)}}));
  await page.goto('http://glimlink.demo');
  return {title: await page.title(), heading: await page.locator('h1').textContent()};
}`,
);
console.log('Maquette autonome générée : maquette.html');

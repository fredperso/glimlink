async (page) => {
 const assert = (condition, message) => { if (!condition) throw new Error(message); };
 const report = [];
 const routes = ['/company/home', '/company/needs', '/company/discover?need=need-admin', '/company/selections', '/company/requests', '/company/alerts', '/company/new-need?need=need-admin', '/adviser/home', '/adviser/students', '/adviser/calendars', '/adviser/needs', '/adviser/requests', '/adviser/companies'];
 const layout = async (label) => {
  const measurements = await page.evaluate(() => {
   const dialog = document.querySelector('dialog[open]');
   const root = dialog ?? document.documentElement;
   return {overflow: root.scrollWidth > root.clientWidth + 1,
    smallFields: [...(dialog ?? document.querySelector('main')).querySelectorAll('input:not([type=checkbox]):not([type=file]),select,textarea')].filter(e => e.getBoundingClientRect().width > 0 && parseFloat(getComputedStyle(e).fontSize) < 16).map(e => e.name)};
  });
  assert(!measurements.overflow, 'Débordement : '+label);
  assert(!measurements.smallFields.length, 'Champs trop petits : '+label+' '+measurements.smallFields.join(', '));
 };
 await page.evaluate(() => localStorage.clear()); await page.reload();
 for(const [width, height] of [[320,740],[375,812],[390,844],[430,932],[740,390]]) {
  await page.setViewportSize({width,height});
  for(const route of routes) {
   await page.goto('http://glimlink.demo/#'+route); await page.locator('h1').waitFor(); await page.waitForTimeout(100);
   await layout(route);
   const nav = await page.locator('.mobile-nav a small').evaluateAll(labels => labels.map(e => ({text:e.textContent,height:e.clientHeight,lineHeight:parseFloat(getComputedStyle(e).lineHeight),width:e.clientWidth,scroll:e.scrollWidth})));
   assert(nav.every(e => e.height <= e.lineHeight + 2 && e.scroll <= e.width + 1), 'Libellé navigation coupé : '+JSON.stringify(nav));
   if(route === '/adviser/students' && width <= 480) {
    const search = page.locator('.search-field');
    assert(await search.evaluate(e => e.clientWidth >= e.parentElement.clientWidth - 2), 'Recherche candidats trop étroite');
   }
  }
  await page.goto('http://glimlink.demo/#/adviser/students');
  await page.locator('.student-row').first().getByRole('button', {name:'Ouvrir la fiche'}).click();
  await layout('Fiche conseiller');
  const dialog = page.getByRole('dialog');
  await dialog.evaluate(e => e.scrollTop = e.scrollHeight); await page.waitForTimeout(100);
  assert(await dialog.locator('.modal-header').evaluate(e => e.getBoundingClientRect().top >= -1), 'En-tête de fiche masqué');
  await page.getByRole('button', {name:'Fermer la fenêtre'}).click();
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  await page.locator('.talent-card').first().getByRole('button', {name:'Voir le profil'}).click();
  await layout('Profil entreprise');
  await page.getByRole('button', {name:'Année',exact:true}).click(); await layout('Calendrier annuel profil');
  await page.getByRole('button', {name:'Fermer la fenêtre'}).click();
  await page.goto('http://glimlink.demo/#/admin/calendars');
  await page.getByRole('button', {name:'Modifier la formation'}).click(); await layout('Éditeur calendrier');
  await page.getByRole('button', {name:'Fermer la fenêtre'}).click();
  if(width === 320 || width === 390) {
   for(const [route,name] of [['/company/home','home'],['/adviser/students','students'],['/adviser/companies','partners']]) {
    await page.goto('http://glimlink.demo/#'+route);
    await page.waitForTimeout(200);
    await page.screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/mobile-'+name+'-'+width+'.png', fullPage:true});
   }
  }
  report.push({width,height,pages:routes.length,modals:3,status:'pass'});
 }
 await page.goto('http://glimlink.demo/#/company/home');
 return report;
}

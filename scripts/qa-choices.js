async (page) => {
 const assert = (value, message) => { if (!value) throw new Error(message); };
 const report = [];
 const response = await page.request.get('https://unpkg.com/axe-core@4.10.3/axe.min.js');
 const axe = await response.text();
 for(const width of [1440, 390, 320]) {
  await page.setViewportSize({width, height: 1000});
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.goto('http://glimlink.demo/#/adviser/students');
  await page.locator('.student-row').filter({hasText: 'Sophie'}).getByRole('button', {name: 'Ouvrir la fiche'}).click();
  assert(await page.locator('input[name="mobility"]').count() === 0, 'Mobilité en saisie libre');
  await page.locator('select[name="mobility"]').selectOption('Jusqu’à 50 km du domicile');
  await page.locator('select[name="location"]').selectOption('Lattes');
  await page.getByRole('button', {name: 'Gérer les compétences'}).click();
  await page.locator('select[name="skillName"]').selectOption('Excel');
  await page.getByRole('button', {name: 'Ajouter la compétence', exact: true}).click();
  assert(await page.getByLabel('Niveau de Excel', {exact: true}).count() === 1, 'Compétence sélectionnée non ajoutée');
  await page.getByRole('button', {name: 'Enregistrer le brouillon'}).click();
  await page.getByRole('button', {name: 'Fermer la fenêtre'}).click();
  await page.reload();
  await page.locator('.student-row').filter({hasText: 'Sophie'}).getByRole('button', {name: 'Ouvrir la fiche'}).click();
  assert(await page.locator('select[name="mobility"]').inputValue() === 'Jusqu’à 50 km du domicile', 'Mobilité non persistée');
  await page.getByRole('button', {name: 'Fermer la fenêtre'}).click();
  await page.goto('http://glimlink.demo/#/company/new-need?need=need-admin');
  await page.getByRole('group', {name:'Domaines envisagés'}).locator('.choice-options > summary').click();
  await page.getByRole('group', {name:'Domaines envisagés'}).getByLabel('Commerce', {exact:true}).check();
  await page.getByRole('group', {name:'Domaines envisagés'}).getByLabel('Commerce', {exact:true}).uncheck();
  await page.getByRole('group', {name:'Domaines envisagés'}).locator('.choice-options > summary').click();
  await page.locator('select[name="location"]').selectOption('__custom__');
  await page.getByLabel('Préciser un autre choix').fill('Lyon');
  await page.addScriptTag({content: axe});
  const violations = await page.evaluate(async () => (await window.axe.run(document, {runOnly: {type:'tag', values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v => ({id:v.id, targets:v.nodes.map(n=>n.target)})));
  assert(violations.length === 0, JSON.stringify(violations));
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Débordement formulaire');
  await page.locator('[name="contract"]').focus();
  if(width === 390) await page.screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/choices-mobile.png', fullPage:true});
  await page.locator('#confirm-brief').check();
  await page.getByRole('button', {name:'C’est exactement ça'}).click();
  report.push({width, status:'pass', violations});
 }
 await page.evaluate(() => localStorage.clear()); await page.reload();
 return report;
}

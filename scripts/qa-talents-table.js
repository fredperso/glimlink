async(page)=>{
 const assert=(condition,message)=>{if(!condition)throw new Error(message);};
 const report=[];
 const axeSource=await (await page.request.get('https://unpkg.com/axe-core@4.10.3/axe.min.js')).text();
 for(const width of [1920,1366,1024,390,320]) {
  await page.setViewportSize({width,height:900});await page.evaluate(()=>localStorage.clear());await page.reload();
  await page.goto('http://glimlink.demo/#/adviser/students');
  const rows=page.locator('.talent-table tbody .student-row');
  await rows.first().waitFor();assert(await rows.count()===5,'Première page sans limite');
  assert(await page.getByRole('button',{name:'Précédent',exact:true}).isDisabled(),'Page précédente active sur page 1');
  const first=await rows.first().innerText();
  await page.getByRole('button',{name:'Suivant',exact:true}).click();
  assert(await rows.count()===4,'Dernière page incomplète incorrecte');assert((await rows.first().innerText())!==first,'Page non changée');
  assert(await page.getByRole('button',{name:'Suivant',exact:true}).isDisabled(),'Page suivante active sur dernière page');
  await page.locator('[name=search]').fill('Sophie');assert(await rows.count()===1,'Recherche non appliquée');assert((await rows.first().innerText()).includes('Sophie'),'Recherche mauvais candidat');
  await page.locator('[name=search]').fill('');assert(await rows.count()===5,'Retour recherche pas sur page 1');
  await page.locator('[name=status]').selectOption('draft');assert(await rows.count()===1,'Filtre brouillon non appliqué');assert((await rows.first().innerText()).includes('Zoé'),'Brouillon absent');
  await page.locator('[name=status]').selectOption('all');
  await page.locator('[name=pageSize]').selectOption('10');assert(await rows.count()===9,'Taille de page non appliquée');
  await rows.filter({hasText:'Zoé'}).getByRole('button',{name:'Vérifier la fiche'}).click();assert(await page.getByRole('dialog').count()===1,'Action fiche perdue');await page.getByRole('button',{name:'Fermer la fenêtre'}).click();
  await page.locator('[name=search]').fill('Aucun résultat 123');assert(await rows.count()===0,'État vide non appliqué');assert((await page.locator('.talents-pagination').innerText()).includes('0 talent'),'Compteur vide incorrect');await page.locator('[name=search]').fill('');
  await page.locator('[name=pageSize]').selectOption('5');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Débordement tableau');
  const clipping=await rows.evaluateAll(rows=>rows.flatMap(row=>[...row.querySelectorAll('td')].filter(td=>td.scrollWidth>td.clientWidth+1).map(td=>td.textContent)));
  assert(!clipping.length,'Cellule masquée '+JSON.stringify(clipping));
  await page.addScriptTag({content:axeSource});const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));assert(!violations.length,JSON.stringify(violations));
  await page.evaluate(()=>document.activeElement?.blur());await page.waitForTimeout(100);
  if(width===1366||width===390)await page.screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/talents-table-'+width+'.png',fullPage:true});
  report.push({width,status:'pass',violations:[]});
 }
 await page.evaluate(()=>localStorage.clear());await page.reload();return report;
}

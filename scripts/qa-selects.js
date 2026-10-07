async (page) => {
 const assert=(condition,message)=>{if(!condition)throw new Error(message);};
 const report=[];
 const axeSource=await (await page.request.get('https://unpkg.com/axe-core@4.10.3/axe.min.js')).text();
 const check=async(label)=>{
  const errors=await page.evaluate(()=>{const root=document.querySelector('dialog[open]')??document;return [...root.querySelectorAll('.select-field')].filter(e=>e.getBoundingClientRect().width>0).flatMap(e=>{const c=e.querySelector('.select-caption'),s=e.querySelector('select');return c.scrollWidth>c.clientWidth+1||c.scrollHeight>c.clientHeight+1||c.textContent!==s.selectedOptions[0]?.text ? [s.name+': '+c.textContent]:[];});});
  assert(!errors.length,'Libellés masqués '+label+': '+JSON.stringify(errors));
  assert(await page.evaluate(()=>{const r=document.querySelector('dialog[open]')??document.documentElement;return r.scrollWidth<=r.clientWidth+1;}),'Débordement '+label);
 };
 await page.evaluate(()=>localStorage.clear());await page.reload();
 for(const width of [1920,1366,1024,390,320]) {
  await page.setViewportSize({width,height:900});
  for(const route of ['/company/home','/company/selections','/company/new-need?need=need-admin','/adviser/students','/adviser/calendars','/adviser/requests']){
   await page.goto('http://glimlink.demo/#'+route);await page.locator('h1').waitFor();await check(route);
  }
  await page.goto('http://glimlink.demo/#/adviser/students');
  await page.locator('select[name=status]').selectOption('pending');await check('Filtre long');
  await page.locator('select[name=status]').selectOption('all');
  await page.locator('.student-row').first().getByRole('button',{name:'Ouvrir la fiche'}).click();
  await page.getByRole('button',{name:'Gérer les compétences'}).click();
  const level=page.getByLabel('Niveau actuel',{exact:true});await level.selectOption('intermediate');
  await page.locator('select[name=skillName]').selectOption('Communication digitale');
  await page.getByLabel('Formation associée à Relation client',{exact:true}).selectOption({label:'Bachelor Communication · Promotion 2026'});
  await check('Compétences et formation longue');
  const control=page.getByRole('combobox',{name:'Choisir : Niveau actuel',exact:true});
  await control.focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
  assert(await level.inputValue()==='autonomous','Navigation clavier interrompue');await check('Choix clavier');
  await control.click();await page.keyboard.press('End');await page.keyboard.press('Enter');
  assert(await level.inputValue()==='advanced','Choix clavier fin de liste');
  await control.click();await page.getByRole('option',{name:'Pratique accompagnée',exact:true}).click();
  assert(await level.inputValue()==='intermediate','Choix souris non appliqué');
  await control.click();await page.keyboard.press('Escape');assert(await control.getAttribute('aria-expanded')==='false','Échap');
  assert(await control.evaluate(e=>e===document.activeElement),'Focus perdu');
  await page.getByRole('combobox',{name:'Choisir : Formation associée à Relation client',exact:true}).click();
  assert(await page.getByRole('listbox').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}),'Menu hors écran');
  assert(await page.getByRole('option').evaluateAll(els=>els.every(e=>{const span=e.querySelector('span');return span.scrollWidth<=span.clientWidth+1&&span.scrollHeight<=span.clientHeight+1;})),'Options tronquées');
  await page.addScriptTag({content:axeSource});
  const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));
  assert(!violations.length, 'Accessibilité '+JSON.stringify(violations));
  if(width===1366||width===390){await page.getByRole('dialog').screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/selects-'+width+'.png'});}
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Fermer la fenêtre'}).click();
  await page.goto('http://glimlink.demo/#/adviser/calendars');await page.getByRole('button',{name:'Modifier le rythme'}).click();await check('Éditeur calendrier');await page.getByRole('button',{name:'Fermer la fenêtre'}).click();
  report.push({width,status:'pass',violations:[]});
 }
 await page.goto('http://glimlink.demo/#/adviser/companies');
 await page.getByRole('button',{name:'Inviter une entreprise'}).click();
 await page.locator('[name=companyName]').fill('Entreprise test menus');
 await page.locator('[name=email]').fill('menus@example.com');
 await page.getByRole('button',{name:'Préparer l’invitation'}).click();
 await page.getByRole('button',{name:'Explorer l’activation du compte'}).click();
 const sector=page.locator('select[name=sector]');
 assert(await sector.evaluate(e=>e.reportValidity())===false,'Champ obligatoire accepté vide');
 const sectorControl=page.getByRole('combobox',{name:'Choisir : Secteur d’activité',exact:true});
 assert(await sectorControl.evaluate(e=>e===document.activeElement),'Erreur sans focus visible');
 assert(await sectorControl.getAttribute('aria-invalid')==='true','Erreur non annoncée');
 await sectorControl.click();await page.getByRole('option',{name:'Services aux entreprises',exact:true}).click();
 assert(await sector.inputValue()==='Services aux entreprises','Choix formulaire perdu');
 assert(await sectorControl.getAttribute('aria-invalid')!=='true','Erreur non effacée');
 assert(await sector.evaluate(e=>new FormData(e.form).get('sector'))==='Services aux entreprises','Valeur absente du formulaire');
 await sectorControl.click();await page.getByRole('option',{name:'Autre…',exact:true}).click();
 await page.getByRole('textbox',{name:'Préciser un autre choix'}).fill('Autre secteur');
 assert(await page.locator('input[name=sector]').inputValue()==='Autre secteur','Choix personnalisé perdu');
 await page.getByRole('button',{name:'Fermer la fenêtre'}).click();
 report.push({scenario:'Validation obligatoire, formulaire et choix personnalisé',status:'pass'});
 await page.evaluate(()=>localStorage.clear());await page.reload();return report;
}

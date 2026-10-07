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
  await level.evaluate(e=>e.scrollIntoView({block:'center'}));await level.focus();
  await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
  assert(await level.inputValue()==='autonomous','Navigation clavier interrompue');await check('Choix clavier');
  await level.click(); await page.keyboard.press('End'); await page.keyboard.press('Enter');
  assert(await level.inputValue()==='advanced','Ouverture native à la souris interrompue'); await check('Choix souris et liste native');
  await level.evaluate(e=>e.scrollIntoView({block:'center'}));
  assert(await level.evaluate(e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e;}),'Sélecteur recouvert par un élément');
  await page.addScriptTag({content:axeSource});
  const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));
  assert(!violations.length, 'Accessibilité '+JSON.stringify(violations));
  if(width===1366||width===390){await level.selectOption('intermediate');await page.getByRole('dialog').screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/selects-'+width+'.png'});}
  await page.getByRole('button',{name:'Fermer la fenêtre'}).click();
  await page.goto('http://glimlink.demo/#/adviser/calendars');await page.getByRole('button',{name:'Modifier le rythme'}).click();await check('Éditeur calendrier');await page.getByRole('button',{name:'Fermer la fenêtre'}).click();
  report.push({width,status:'pass',violations:[]});
 }
 await page.evaluate(()=>localStorage.clear());await page.reload();return report;
}

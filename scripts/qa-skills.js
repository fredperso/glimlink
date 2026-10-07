async (page) => {
 const assert=(value,message)=>{if(!value)throw new Error(message);};
 const report=[];
 const response=await page.request.get('https://unpkg.com/axe-core@4.10.3/axe.min.js');const axe=await response.text();
 async function audit(name,width){await page.addScriptTag({content:axe});const result=await page.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));report.push({name,width,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
 async function open(){await page.goto('http://glimlink.demo/#/adviser/students');await page.locator('.student-row').filter({hasText:'Sophie'}).getByRole('button',{name:'Ouvrir la fiche'}).click();await page.getByRole('button',{name:'Gérer les compétences'}).click();}
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:width===1440?1000:844});await page.evaluate(()=>localStorage.clear());await page.reload();await open();
  const dialog=page.getByRole('dialog');
  await dialog.locator('select[name="skillName"]').selectOption('__custom__');
  await dialog.getByLabel('Préciser un autre choix').fill('Power BI');
  await dialog.getByLabel('Niveau actuel',{exact:true}).selectOption('intermediate');
  await dialog.getByLabel('État d’acquisition',{exact:true}).selectOption('learning');
  await dialog.getByLabel('Associer à la formation actuelle').check();
  await dialog.getByRole('button',{name:'Ajouter la compétence',exact:true}).click();
  assert(await dialog.getByLabel('Niveau de Power BI',{exact:true}).inputValue()==='intermediate','Niveau non attribué');
  await dialog.getByLabel('Préciser un autre choix').fill('POWER BI');
  await dialog.getByRole('button',{name:'Ajouter la compétence',exact:true}).click();
  assert((await dialog.getByRole('alert').innerText()).includes('déjà présente'),'Doublon accepté');
  await dialog.getByLabel('Préciser un autre choix').fill('');
  await dialog.getByRole('button',{name:'Supprimer la compétence Organisation',exact:true}).click();
  assert(await dialog.getByLabel('Niveau de Organisation',{exact:true}).count()===0,'Suppression échouée');
  await dialog.getByRole('button',{name:'Annuler la suppression',exact:true}).click();
  assert(await dialog.getByLabel('Niveau de Organisation',{exact:true}).count()===1,'Annulation échouée');
  await dialog.getByRole('button',{name:'Ajouter en cours d’acquisition : Facturation',exact:true}).click();
  assert(await dialog.getByLabel('Niveau de Facturation',{exact:true}).inputValue()==='unknown','Niveau inventé depuis formation');
  assert(await dialog.getByLabel('État de Facturation',{exact:true}).inputValue()==='learning','Acquis inventé depuis formation');
  await dialog.getByLabel('Niveau de Relation client',{exact:true}).selectOption('advanced');
  await audit('Éditeur de compétences',width);
  assert(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth),'Débordement éditeur');
  await page.getByRole('button',{name:'Gérer les compétences'}).click();
  if(width!==320)await page.screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/skills-editor'+(width===390?'-mobile':'')+'.png',fullPage:false});
  await dialog.getByRole('button',{name:'Enregistrer le brouillon',exact:true}).click();
  await dialog.getByRole('button',{name:'Fermer la fenêtre'}).click();
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  await page.locator('.talent-card').filter({hasText:'Sophie'}).getByRole('button',{name:'Voir le profil'}).click();
  assert(!(await page.getByRole('dialog').innerText()).includes('Power BI'),'Brouillon exposé à entreprise');
  await page.getByRole('button',{name:'Fermer la fenêtre'}).click();
  await page.reload();await open();
  assert(await page.getByLabel('Niveau de Power BI',{exact:true}).inputValue()==='intermediate','Niveau non conservé après rechargement');
  await page.locator('#student-confirmation').check();
  await page.getByRole('button',{name:'Valider et publier',exact:true}).click();
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  await page.locator('.talent-card').filter({hasText:'Sophie'}).getByRole('button',{name:'Voir le profil'}).click();
  const learning=page.getByRole('dialog').locator('.competency-learning');
  assert((await learning.innerText()).includes('Power BI'),'Acquisition non visible');
  assert((await learning.innerText()).includes('Pratique accompagnée'),'Niveau non visible');
  assert((await learning.innerText()).includes('BTS Gestion de la PME'),'Formation non visible');
  assert(!(await page.getByRole('dialog').locator('.competency-acquired').innerText()).includes('Power BI'),'Compétence en cours présentée comme acquise');
  await audit('Compétences sur le profil entreprise',width);
  if(width!==320)await page.screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/skills-profile'+(width===390?'-mobile':'')+'.png',fullPage:false});
  await page.getByRole('button',{name:'Fermer la fenêtre'}).click();
  await page.goto('http://glimlink.demo/#/adviser/calendars');
  assert((await page.locator('.formation-learning-skills').innerText()).includes('Tableaux de bord'),'Objectifs de formation non visibles');
  report.push({width,name:'Ajout, niveau, doublon, suppression, annulation, formation et publication',status:'pass'});
 }
 await page.evaluate(()=>localStorage.clear());await page.reload();
 return report;
}

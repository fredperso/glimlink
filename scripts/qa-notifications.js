async (page) => {
 const assert = (condition, message) => { if(!condition) throw new Error(message); };
 const report=[];
 const axeSource=await (await page.request.get('https://unpkg.com/axe-core@4.10.3/axe.min.js')).text();
 const bell=()=>page.getByRole('button',{name:/^Notifications, /});
 const close=()=>page.getByRole('button',{name:'Fermer la fenêtre'}).click();
 for(const width of [1440,390,320]) {
  await page.setViewportSize({width,height:844});
  await page.evaluate(()=>localStorage.clear());await page.reload();
  await page.goto('http://glimlink.demo/#/company/home');
  await bell().click();
  assert(await page.locator('.notification-item').count()===2,'Alerte initiale absente');
  await page.getByRole('button',{name:'Compris',exact:true}).click();
  await page.getByRole('button',{name:'Simuler une alerte de talent'}).click();
  assert(await page.locator('.notification-item').count()===3,'Simulation entreprise absente');
  assert((await bell().getAttribute('aria-label')).includes('2 non lues'),'Compteur entreprise non mis à jour');
  await page.locator('.notification-item').first().getByRole('button',{name:'Marquer comme lu',exact:true}).click();
  assert((await bell().getAttribute('aria-label')).includes('1 non lue'),'Lecture individuelle absente');
  await page.getByRole('button',{name:'Tout marquer comme lu'}).click();
  assert((await bell().getAttribute('aria-label')).includes('0 non lue'),'Lecture globale absente');
  await page.addScriptTag({content:axeSource});
  let violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));
  assert(!violations.length,'Accessibilité entreprise '+JSON.stringify(violations));
  assert(await page.getByRole('dialog').evaluate(e=>e.scrollWidth<=e.clientWidth),'Débordement notifications');
  await page.getByRole('dialog').evaluate(e=>e.scrollTop=0); await page.waitForTimeout(100);
  if(width===390)await page.screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/notifications-company-mobile.png'});
  await page.locator('.notification-item').first().getByRole('button',{name:'Voir le profil'}).click();
  assert(!(await page.getByRole('dialog').innerText()).includes('DURAND'),'Identité confidentielle affichée');
  await close();await page.reload();await bell().click();
  assert(await page.locator('.notification-item.unread').count()===0,'État lu perdu au rechargement');await close();
  await page.getByLabel('Entreprise de démonstration').selectOption('bloom-studio');await bell().click();
  assert(await page.locator('.notification-item').count()===1 && (await page.locator('.notification-item').innerText()).includes('Bienvenue'), 'Alerte d’une autre entreprise exposée');await close();
  await page.goto('http://glimlink.demo/#/adviser/home');await bell().click();
  assert(await page.locator('.notification-item').count()===1,'Notification de démonstration conseiller absente');
  await page.getByRole('button',{name:'Compris',exact:true}).click();
  await page.getByRole('button',{name:'Simuler une demande entreprise'}).click();
  assert(await page.locator('.notification-item').count()===2,'Demande simulée absente');
  assert((await bell().getAttribute('aria-label')).includes('1 non lue'),'Compteur conseiller absent');
  await page.addScriptTag({content:axeSource});
  violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));
  assert(!violations.length,'Accessibilité conseiller '+JSON.stringify(violations));
  await page.getByRole('dialog').evaluate(e=>e.scrollTop=0); await page.waitForTimeout(100);
  if(width===390)await page.screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/notifications-adviser-mobile.png'});
  await page.getByRole('button',{name:'Voir les demandes'}).click();
  await page.locator('.request-card').waitFor();
  assert((await page.locator('.request-card').innerText()).includes('[Simulation]'),'Demande absente du parcours conseiller');
  await bell().click();assert((await bell().getAttribute('aria-label')).includes('0 non lue'),'Ouverture demande non lue');await close();
  await page.reload();assert((await bell().getAttribute('aria-label')).includes('0 non lue'),'Lecture conseiller non persistée');
  report.push({width,status:'pass',violations:[]});
 }
 await page.evaluate(()=>{const key='glimlink-prototype-v1';const s=JSON.parse(localStorage.getItem(key));delete s.notificationWelcomeRead;s.alerts=s.alerts.map(a=>({...a,read:true}));s.requests=[];localStorage.setItem(key,JSON.stringify(s));});await page.reload();
 for(const role of ['company','adviser']) { await page.goto('http://glimlink.demo/#/'+role+'/home');assert((await bell().getAttribute('aria-label')).includes('1 non lue'),'Badge absent sur données anciennes : '+role);await bell().click();await page.getByRole('button',{name:'Compris',exact:true}).click();assert((await bell().getAttribute('aria-label')).includes('0 non lue'),'Lecture bienvenue absente');await close();await page.reload();assert((await bell().getAttribute('aria-label')).includes('0 non lue'),'Bienvenue réapparaît après lecture');}
 report.push({scenario:'Données anciennes avec alertes lues et aucune demande',status:'pass'});
 await page.evaluate(()=>localStorage.clear());await page.reload();return report;
}

async(page)=>{
 const assert=(condition,message)=>{if(!condition)throw new Error(message);};
 const report=[];
 const axeSource=await (await page.request.get('https://unpkg.com/axe-core@4.10.3/axe.min.js')).text();
 const trigger=()=>page.getByRole('button',{name:/^Choisir l’espace de démonstration/});
 for(const [width,height] of [[1920,1080],[1366,900],[1024,768],[390,844],[320,740],[740,390]]) {
  await page.setViewportSize({width,height});await page.goto('http://glimlink.demo/#/company/home');
  await trigger().click();await page.getByRole('menu').waitFor();
  assert(await page.getByRole('menuitemradio').count()===2,'Deux choix absents');
  assert(await page.getByRole('menuitemradio',{name:'Espace entreprise',exact:true}).getAttribute('aria-checked')==='true','Espace courant absent');
  const measurements=await page.getByRole('menu').evaluate(e=>{const r=e.getBoundingClientRect();return {inside:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,clipped:[...e.querySelectorAll('button span')].some(s=>s.scrollWidth>s.clientWidth+1||s.scrollHeight>s.clientHeight+1)};});
  assert(measurements.inside&&!measurements.clipped,'Menu ou texte coupé');
  await page.addScriptTag({content:axeSource});const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));assert(!violations.length,JSON.stringify(violations));
  if(width===1366||width===390){await page.getByRole('menuitemradio',{name:'Espace entreprise',exact:true}).focus();await page.screenshot({path:'/home/fjeanne/dev/projets/glimlink/docs/screenshots/role-picker-'+width+'.png'});}
  await page.getByRole('menuitemradio',{name:'Espace conseiller',exact:true}).click();
  await page.locator('h1').filter({hasText:'Bonjour Mathilde'}).waitFor();
  assert(await trigger().getAttribute('aria-expanded')==='false','Menu non fermé après choix');
  await trigger().focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('End');
  assert(await page.getByRole('menuitemradio',{name:'Espace conseiller',exact:true}).evaluate(e=>e===document.activeElement),'Navigation clavier End');
  await page.keyboard.press('Escape');assert(await trigger().evaluate(e=>e===document.activeElement),'Focus non restauré');
  await page.keyboard.press('ArrowDown');await page.keyboard.press('Home');await page.keyboard.press('Enter');
  await page.locator('h1').filter({hasText:'Bonjour'}).waitFor();assert(await page.getByRole('menu').count()===0,'Menu encore ouvert');
  await trigger().click();await page.locator('h1').click();assert(await page.getByRole('menu').count()===0,'Clic extérieur non pris en compte');
  await trigger().click();await page.keyboard.press('Tab');assert(await page.getByRole('menu').count()===0,'Menu maintenu après Tab');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Débordement en-tête');
  report.push({width,height,status:'pass',violations:[]});
 }
 return report;
}

async (page) => {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  // Charger au préalable la maquette autonome via qa-preview.local.js.
  const html = await page.content();
  const report = [];
  for (const viewport of [{width:320,height:740},{width:390,height:844},{width:740,height:390}]) {
    const context = await page.context().browser().newContext({viewport,isMobile:true,hasTouch:true});
    try {
      await context.route('http://glimlink.demo/**', route => route.fulfill({status:200,contentType:'text/html',body:html}));
      const mobile = await context.newPage();
      for (const role of ['company','adviser']) {
        await mobile.goto('http://glimlink.demo/#/'+role+'/home');
        const home = mobile.locator('.mobile-nav > a[href="#/'+role+'/home"]');
        await mobile.evaluate(() => scrollTo(0,document.body.scrollHeight));
        assert(await mobile.evaluate(() => scrollY > 0),'Accueil trop court pour tester le défilement');
        await home.tap();
        assert(await mobile.evaluate(() => scrollY === 0),'Accueil déjà actif ne revient pas en haut');
        const views = role === 'company' ? ['needs','selections','requests','alerts','home'] : ['students','calendars','needs','home'];
        for (const view of views) {
          const link = mobile.locator('.mobile-nav > a[href="#/'+role+'/'+view+'"]');
          // Un seul appui tactile, sans délai ajouté ni deuxième activation.
          await link.tap();
          assert(await link.getAttribute('aria-current') === 'page','Appui non pris en compte : '+role+'/'+view);
          assert(await mobile.evaluate(() => location.hash) === '#/'+role+'/'+view,'Route incorrecte');
          assert(await mobile.evaluate(() => scrollY === 0),'Page ouverte hors du haut');
        }
        if (role === 'adviser') {
          const more = mobile.getByRole('button',{name:/Plus.*Demandes et entreprises/});
          await more.tap();await mobile.locator('#mobile-more-links a[href="#/adviser/companies"]').tap();
          assert(await mobile.evaluate(() => location.hash) === '#/adviser/companies','Plus ne navigue pas');
          assert(await mobile.locator('#mobile-more-links').count() === 0,'Plus reste ouvert');
          await more.tap();await mobile.locator('#mobile-more-links a[href="#/adviser/companies"]').tap();
          assert(await mobile.locator('#mobile-more-links').count() === 0,'Même destination ne ferme pas Plus');
          await home.tap();
          await mobile.evaluate(() => scrollTo(0,document.body.scrollHeight));
          await more.tap();await home.tap();
          assert(await mobile.locator('#mobile-more-links').count() === 0,'Accueil ne ferme pas Plus');
          assert(await mobile.evaluate(() => scrollY === 0),'Accueil après Plus ne revient pas en haut');
        } else {
          const picker = mobile.getByRole('combobox',{name:'Choisir : Entreprise de démonstration',exact:true});
          await picker.tap();
          assert(await mobile.getByRole('listbox').evaluate(e=>e.getBoundingClientRect().bottom<=document.querySelector('.mobile-nav').getBoundingClientRect().top),'Menu recouvre la navigation');
          await mobile.locator('.mobile-nav > a[href="#/company/needs"]').tap();
          assert(await mobile.evaluate(() => location.hash) === '#/company/needs','Premier appui absorbé par un sélecteur');
          await home.tap();
          await mobile.locator('.mobile-nav > a[href="#/company/needs"]').tap();
          await mobile.goBack();
          assert(await home.getAttribute('aria-current') === 'page','Retour navigateur cassé');
          await mobile.goForward();
          assert(await mobile.locator('.mobile-nav > a[href="#/company/needs"]').getAttribute('aria-current') === 'page','Avance navigateur cassée');
        }
        report.push({...viewport,role,status:'pass'});
      }
    } finally { await context.close(); }
  }
  return report;
}

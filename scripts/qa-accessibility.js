async (page) => {
  const response = await page.request.get('https://unpkg.com/axe-core@4.10.3/axe.min.js', {timeout: 15000});
  if (!response.ok()) throw new Error('axe-core indisponible');
  const script = await response.text();
  const report = [];
  const audit = async (name, width) => {
    await page.addScriptTag({content: script});
    const result = await page.evaluate(async () => await window.axe.run(document, {
      runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']},
    }));
    report.push({name, width, violations: result.violations.map(v => ({
      id: v.id, nodes: v.nodes.map(n => ({target: n.target, summary: n.failureSummary})),
    }))});
  };
  for (const width of [1440, 390]) {
    await page.setViewportSize({width, height: 1000});
    await page.evaluate(() => localStorage.clear());
    for (const route of ['/company/home', '/company/needs', '/company/discover?need=need-admin', '/company/selections', '/company/requests', '/company/alerts', '/company/new-need', '/adviser/home', '/adviser/students', '/adviser/calendars', '/adviser/needs', '/adviser/companies']) {
      await page.goto('http://glimlink.demo/#'+route);
      await page.locator('h1').waitFor();
      await audit(route, width);
    }
    await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
    await page.locator('.talent-card').first().getByRole('button', {name: 'Voir le profil'}).click();
    await audit('Profil détaillé', width);
    await page.getByRole('button', {name: 'Fermer la fenêtre'}).click();
    await page.goto('http://glimlink.demo/#/adviser/students');
    await page.locator('.student-row').first().getByRole('button', {name: 'Ouvrir la fiche'}).click();
    await audit('Fiche conseiller', width);
    await page.getByRole('button', {name: 'Fermer la fenêtre'}).click();
    await page.locator('.page-footer button').click();
    await audit('Guide de la maquette', width);
    await page.getByRole('button', {name: 'Fermer la fenêtre'}).click();
  }
  await page.goto('http://glimlink.demo/');
  return report;
}

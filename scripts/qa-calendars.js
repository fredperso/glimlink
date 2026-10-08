async (page) => {
  const assert = (value, message) => {
    if (!value) throw new Error(message);
  };
  const report = [];
  const response = await page.request.get('https://unpkg.com/axe-core@4.10.3/axe.min.js');
  const axe = await response.text();
  async function audit(name, width) {
    await page.addScriptTag({ content: axe });
    const result = await page.evaluate(
      async () =>
        await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        }),
    );
    report.push({
      name,
      width,
      violations: result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    });
  }
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.goto('http://glimlink.demo/#/admin/calendars');
    await page.getByRole('heading', { name: 'Le rythme de vos formations.' }).waitFor();
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      'Débordement du mois',
    );
    await audit('Calendrier mois', width);
    if (width === 1440 || width === 390)
      await page.screenshot({
        path:
          '/home/fjeanne/dev/projets/glimlink/docs/screenshots/calendar-month' +
          (width === 390 ? '-mobile' : '') +
          '.png',
        fullPage: true,
      });
    await page.getByRole('button', { name: 'Année', exact: true }).click();
    assert((await page.locator('.year-month').count()) === 12, 'Douze mois attendus');
    await audit('Calendrier année', width);
    if (width === 1440 || width === 390)
      await page.screenshot({
        path:
          '/home/fjeanne/dev/projets/glimlink/docs/screenshots/calendar-year' +
          (width === 390 ? '-mobile' : '') +
          '.png',
        fullPage: true,
      });
    await page.getByRole('button', { name: 'Ouvrir novembre 2026', exact: true }).click();
    assert(
      (await page.locator('.calendar-navigation h3').textContent()).includes('novembre'),
      'Détail du mois',
    );
    await page.getByRole('button', { name: 'Modifier la formation' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Ajouter', exact: true }).click();
    await dialog.getByLabel('Libellé de l’exception').fill('Regroupement de novembre');
    await dialog.getByLabel('Début de l’exception').fill('2026-11-06');
    await dialog.getByLabel('Fin de l’exception').fill('2026-11-06');
    await audit('Éditeur avec exception', width);
    await dialog.getByRole('button', { name: 'Appliquer l’exception' }).click();
    await dialog.getByRole('button', { name: 'Ajouter', exact: true }).click();
    await dialog.getByLabel('Libellé de l’exception').fill('Chevauchement');
    await dialog.getByLabel('Début de l’exception').fill('2026-11-06');
    await dialog.getByLabel('Fin de l’exception').fill('2026-11-06');
    await dialog.getByRole('button', { name: 'Appliquer l’exception' }).click();
    assert(
      (await dialog.getByRole('alert').textContent()).includes('chevauche'),
      'Chevauchement accepté',
    );
    await dialog.getByRole('button', { name: 'Annuler l’exception' }).click();
    assert(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth), 'Débordement éditeur');
    if (width === 1440 || width === 390)
      await page.screenshot({
        path:
          '/home/fjeanne/dev/projets/glimlink/docs/screenshots/calendar-editor' +
          (width === 390 ? '-mobile' : '') +
          '.png',
        fullPage: false,
      });
    await dialog.getByRole('button', { name: 'Enregistrer le calendrier' }).click();
    await page.reload();
    await page.getByRole('heading', { name: 'Le rythme de vos formations.' }).waitFor();
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('glimlink-prototype-v1')),
    );
    assert(
      saved.calendars[0].exceptions[0].label === 'Regroupement de novembre',
      'Exception non conservée',
    );
    await page.getByRole('button', { name: 'Année', exact: true }).click();
    await page.getByRole('button', { name: 'Ouvrir novembre 2026', exact: true }).click();
    assert(
      (await page.locator('.date-course').filter({ hasText: /^6/ }).count()) > 0,
      'Exception non visible',
    );
    await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
    await page.getByRole('button', { name: /Conflits identifiés/ }).click();
    for (const name of ['Sophie', 'Inès'])
      assert(
        (await page.locator('.talent-card').filter({ hasText: name }).textContent()).includes(
          'Cours le vendredi',
        ),
        'Exception non héritée ' + name,
      );
    report.push({
      name: 'Navigation, exception, chevauchement, persistance et héritage',
      width,
      status: 'pass',
    });
  }
  await page.evaluate(() => localStorage.clear());
  return report;
}

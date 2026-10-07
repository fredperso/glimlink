async (page) => {
  const assert = (value, message) => {
    if (!value) throw new Error(message);
  };
  const report = [];
  const reset = async () => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://glimlink.demo/');
    await page.reload();
    await page.locator('h1').waitFor();
  };
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await reset();
    await page.getByRole('button', { name: 'Décrire mon besoin', exact: true }).click();
    await page.getByRole('button', { name: 'Accueil & administratif', exact: true }).click();
    await page.getByRole('button', { name: 'Préparer mon brief' }).click();
    await page.getByRole('heading', { name: 'Est-ce bien votre besoin ?' }).waitFor();
    await page.locator('#brief-location').fill('Montpellier');
    await page.getByRole('button', { name: 'C’est exactement ça' }).click();
    assert(
      (await page.getByRole('alert').textContent()).includes('Confirmez le brief'),
      'Matching sans confirmation',
    );
    await page.locator('#confirm-brief').check();
    await page.getByRole('button', { name: 'C’est exactement ça' }).click();
    await page.getByRole('button', { name: 'Affichage en grille' }).click();
    await page.locator('.talent-card').first().waitFor();
    assert((await page.locator('.talent-card').count()) === 4, 'Résultats après confirmation');
    report.push({ width, scenario: 'Brief confirmé avant matching', status: 'pass' });
    await reset();
    await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
    await page.getByRole('button', { name: 'Affichage en grille' }).click();
    await page
      .locator('.talent-card')
      .first()
      .getByRole('button', { name: 'Voir le profil' })
      .click();
    assert(
      (await page.getByRole('dialog').textContent()).includes('Pourquoi ça matche ?'),
      'Explication du matching absente',
    );
    await page.getByRole('button', { name: 'Ajouter à ma sélection' }).click();
    await page.getByRole('button', { name: 'Fermer la fenêtre' }).click();
    await page.getByRole('button', { name: 'Demander une mise en relation' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Demander une mise en relation' })
      .click();
    await page.locator('.request-card').waitFor();
    assert(
      (await page.locator('.request-card').textContent()).includes('Demande reçue'),
      'Demande absente',
    );
    await page.getByLabel('Choisir l’espace de démonstration').selectOption('adviser');
    await page.goto('http://glimlink.demo/#/adviser/requests');
    assert(
      (await page.locator('.request-card').textContent()).includes('Maison Alba'),
      'Routage conseiller absent',
    );
    report.push({ width, scenario: 'Sélection et demande au conseiller', status: 'pass' });
    await reset();
    await page.goto('http://glimlink.demo/#/adviser/calendars');
    await page.getByRole('button', { name: 'Modifier le rythme' }).click();
    await page.getByRole('dialog').getByText('Vendredi', { exact: true }).click();
    await page.getByRole('button', { name: 'Enregistrer le calendrier' }).click();
    await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
    await page.getByRole('button', { name: 'Affichage en grille' }).click();
    await page.getByRole('button', { name: /Conflits identifiés/ }).click();
    for (const name of ['Sophie', 'Inès'])
      assert(
        (await page.locator('.talent-card').filter({ hasText: name }).textContent()).includes(
          'Cours le vendredi',
        ),
        'Héritage du calendrier pour ' + name,
      );
    report.push({ width, scenario: 'V3-05 Calendrier partagé', status: 'pass' });
    await reset();
    await page.goto('http://glimlink.demo/#/adviser/students');
    await page.getByRole('button', { name: 'Importer un CV' }).click();
    await page.getByLabel('Prénom du talent').fill('Alice');
    await page.getByRole('button', { name: 'Créer le brouillon' }).click();
    assert(
      (await page.getByRole('dialog').textContent()).includes('Brouillon privé'),
      'Import publié automatiquement',
    );
    assert(
      (await page.getByRole('dialog').getByLabel('Permis B', { exact: true }).inputValue()) ===
        'unknown',
      'Permis inconnu perdu',
    );
    await page.getByRole('button', { name: 'Fermer la fenêtre' }).click();
    await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
    await page.getByRole('button', { name: 'Affichage en grille' }).click();
    assert(
      (await page.locator('.talent-card').filter({ hasText: 'Alice' }).count()) === 0,
      'Brouillon exposé',
    );
    report.push({ width, scenario: 'V3-01 Brouillon privé et permis inconnu', status: 'pass' });
    await reset();
    await page.keyboard.press('Tab');
    assert(
      await page
        .getByRole('link', { name: 'Aller au contenu' })
        .evaluate((el) => el === document.activeElement),
      'Lien d’évitement',
    );
    await page.locator('.page-footer button').click();
    assert((await page.getByRole('dialog').count()) === 1, 'Guide non ouvert');
    await page.keyboard.press('Escape');
    assert((await page.getByRole('dialog').count()) === 0, 'Échap ne ferme pas le dialog');
    assert(
      await page.locator('.page-footer button').evaluate((el) => el === document.activeElement),
      'Focus non restauré',
    );
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      'Débordement horizontal',
    );
    report.push({ width, scenario: 'Clavier, dialog, focus et mise en page', status: 'pass' });
  }
  await reset();
  return report;
}

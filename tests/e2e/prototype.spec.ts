import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  const html = await readFile('maquette.html', 'utf8');
  // Test sans serveur ni requête externe : tout le livrable est autonome.
  await page.route('http://glimlink.demo/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: html }),
  );
  await page.goto('http://glimlink.demo');
});
test('V6 — Besoin : phrase libre, reformulation vérifiée puis découverte sans score', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Comprendre mon besoin', exact: true }).click();
  await page.getByRole('button', { name: 'Accueil & administratif', exact: true }).click();
  await page.getByRole('button', { name: 'Comprendre mon besoin' }).click();
  await expect(page.getByRole('heading', { name: 'Est-ce que j’ai bien compris ?' })).toBeVisible();
  await expect(page.getByText('Présence obligatoire le vendredi')).toBeVisible();
  await page.locator('select[name="location"]').selectOption('Montpellier');
  await page.getByRole('button', { name: 'Retirer la mission 3' }).click();
  await page.locator('#confirm-brief').check();
  await page.getByRole('button', { name: 'Oui, c’est bien ça' }).click();
  await expect(page.getByRole('alert')).toContainText('au moins 3 missions');
  await page.getByRole('button', { name: 'Ajouter une mission' }).click();
  await page.getByLabel('Mission 3', { exact: true }).fill('Assurer le suivi administratif');
  await page.locator('#confirm-brief').check();
  await page.getByRole('button', { name: 'Oui, c’est bien ça' }).click();
  await expect(
    page.getByRole('heading', { name: 'Accueil & gestion administrative', level: 1 }),
  ).toBeVisible();
  await page.getByRole('button', { name: /Tous les profils/ }).click();
  await expect(page.locator('.talent-card')).toHaveCount(7);
  await expect(page.locator('main')).not.toContainText('%');
});
test('Sélection : fiche expliquée et demande transmise à la conseillère', async ({ page }) => {
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  await page.getByRole('button', { name: /Tous les profils/ }).click();
  await page
    .locator('.talent-card')
    .first()
    .getByRole('button', { name: 'Voir le profil' })
    .click();
  await expect(page.getByRole('dialog')).toContainText('Pourquoi ce profil pour votre besoin ?');
  await expect(page.getByRole('dialog')).toContainText('Pas de conflit scolaire le vendredi');
  await page.getByRole('tab', { name: 'CV anonymisé' }).click();
  await expect(page.getByRole('dialog')).toContainText('Nom, téléphone, e-mail et adresse');
  await expect(page.getByRole('dialog')).not.toContainText('DURAND');
  await page.getByRole('button', { name: 'Ajouter à ma sélection' }).click();
  await page.getByRole('button', { name: 'Fermer la fenêtre' }).click();
  await page.getByRole('button', { name: 'Demander une mise en relation' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Demander une mise en relation' })
    .click();
  await expect(page.getByRole('heading', { name: 'Du talent à la rencontre.' })).toBeVisible();
  await expect(page.locator('.request-card')).toContainText('Demande reçue');
  await page.getByRole('button', { name: /^Choisir l’espace de démonstration/ }).click();
  await page.getByRole('menuitemradio', { name: 'Espace conseiller', exact: true }).click();
  await page.goto('http://glimlink.demo/#/adviser/requests');
  await expect(page.locator('.request-card')).toContainText('Maison Alba');
});
test('V3-05 : modifier un calendrier change le contrôle de deux profils', async ({ page }) => {
  await page.goto('http://glimlink.demo/#/admin/calendars');
  await page.getByRole('button', { name: 'Modifier la formation' }).click();
  await page.getByRole('dialog').getByText('Vendredi', { exact: true }).click();
  await page.getByRole('button', { name: 'Enregistrer le calendrier' }).click();
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  await page.getByRole('button', { name: /Tous les profils/ }).click();
  await expect(page.locator('.talent-card').filter({ hasText: 'Sophie' })).toContainText(
    'Cours le vendredi',
  );
  await expect(page.locator('.talent-card').filter({ hasText: 'Inès' })).toContainText(
    'Cours le vendredi',
  );
});
test('V3-01 : un import reste brouillon avant contrôle et publication', async ({ page }) => {
  await page.goto('http://glimlink.demo/#/adviser/students');
  await page.getByRole('button', { name: 'Importer un CV' }).click();
  await page.getByLabel('Prénom du talent').fill('Alice');
  await page.getByRole('button', { name: 'Créer le brouillon' }).click();
  await expect(page.getByRole('dialog')).toContainText('Brouillon privé');
  await expect(page.getByRole('dialog').getByLabel('Permis B', { exact: true })).toHaveValue(
    'unknown',
  );
  await page.getByRole('button', { name: 'Fermer la fenêtre' }).click();
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  await page.getByRole('button', { name: /Tous les profils/ }).click();
  await expect(page.locator('.talent-card').filter({ hasText: 'Alice' })).toHaveCount(0);
});
test('Accessibilité de base : aucun débordement, formulaire et dialog au clavier', async ({
  page,
}) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
  await page.locator('.page-footer button').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('USR-17 : administrateur ajoute les référentiels, conseiller consulte', async ({ page }) => {
  await page.goto('http://glimlink.demo/#/admin/home');
  await page.getByRole('button', { name: 'Ajouter une formation', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Nom de la formation').fill('BTS test');
  await dialog.getByLabel('Début d’application').fill('2026-10-01');
  await dialog.getByLabel('Fin d’application').fill('2027-07-01');
  await dialog.getByLabel('Nom de la compétence').fill('Gestion de projet');
  await dialog.getByRole('button', { name: 'Ajouter la compétence', exact: true }).click();
  await dialog.getByRole('button', { name: 'Enregistrer le calendrier' }).click();
  await page.goto('http://glimlink.demo/#/adviser/calendars');
  await expect(page.getByRole('button', { name: 'Modifier la formation' })).toHaveCount(0);
  await expect(page.locator('select option').filter({ hasText: 'BTS test' })).toHaveCount(1);
  await page.goto('http://glimlink.demo/#/admin/users');
  await page.getByRole('button', { name: 'Ajouter un utilisateur' }).click();
  for (const [label, value] of [
    ['Prénom', 'Lou'],
    ['Nom', 'Martin'],
    ['E-mail', 'lou@example.com'],
    ['Téléphone', '04 00 00 00 00'],
    ['Adresse complète', '1 rue du Centre, Montpellier'],
  ])
    await dialog.getByLabel(label, { exact: true }).fill(value);
  await dialog.getByRole('button', { name: 'Enregistrer l’utilisateur' }).click();
  await page.reload();
  await expect(page.locator('.admin-record').filter({ hasText: 'lou@example.com' })).toContainText(
    'Lou Martin',
  );
  await page.goto('http://glimlink.demo/#/admin/companies');
  await page.getByRole('button', { name: 'Ajouter une entreprise' }).click();
  for (const [label, value] of [
    ['Nom de l’entreprise', 'Entreprise test'],
    ['Secteur d’activité', 'Services'],
    ['Contact principal', 'Lou Martin'],
    ['Fonction du contact', 'Direction'],
    ['Ville', 'Montpellier'],
    ['E-mail', 'entreprise@example.com'],
    ['Téléphone', '04 00 00 00 01'],
    ['Adresse complète', '2 rue du Centre, Montpellier'],
  ])
    await dialog.getByLabel(label, { exact: true }).fill(value);
  await dialog.getByRole('button', { name: 'Enregistrer l’entreprise' }).click();
  await page.reload();
  await expect(page.locator('.admin-record').filter({ hasText: 'Entreprise test' })).toContainText(
    'Activation à effectuer',
  );
});
test('Swipe : sélectionner ouvre le match, puis le choix reste annulable', async ({ page }) => {
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  const top = page.locator('.deck-slot-0 h3');
  const first = await top.textContent();
  await page.getByRole('button', { name: 'Sélectionner', exact: true }).click();
  const match = page.getByRole('dialog', { name: `${first} rejoint votre sélection` });
  await expect(match).toBeVisible();
  await expect(match.getByRole('button', { name: 'Continuer à explorer' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(match).toBeHidden();
  await expect(top).not.toHaveText(first!);
  await page.getByRole('button', { name: 'Annuler le dernier choix' }).click();
  await expect(top).toHaveText(first!);
});
test('Swipe : raccourcis clavier et match limité à la première sélection', async ({ page }) => {
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  const top = page.locator('.deck-slot-0 h3');
  const first = await top.textContent();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('dialog')).toContainText('Pourquoi ce profil pour votre besoin ?');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.keyboard.press('ArrowLeft');
  await expect(top).not.toHaveText(first!);
  await page.keyboard.press('Backspace');
  await expect(top).toHaveText(first!);
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog', { name: /rejoint votre sélection/ })).toBeVisible();
  await page.getByRole('button', { name: 'Continuer à explorer' }).click();
  const second = await top.textContent();
  await page.keyboard.press('ArrowRight');
  await expect(top).not.toHaveText(second!);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: 'ajouté à votre sélection' })).toBeVisible();
});

test('V6 — Passer n’écarte pas : le profil reste dans Tous les profils et le relais est proposé', async ({
  page,
}) => {
  await page.goto('http://glimlink.demo/#/company/discover?need=need-sales');
  const top = page.locator('.deck-slot-0 h3');
  const first = await top.textContent();
  await page.getByRole('button', { name: 'Passer', exact: true }).click();
  await expect(top).not.toHaveText(first!);
  await page.getByRole('button', { name: /Tous les profils/ }).click();
  const card = page.locator('.talent-card').filter({ hasText: first! });
  await expect(card).toContainText('Passé');
  await expect(
    page.getByRole('heading', { name: 'Vous n’avez pas encore trouvé le profil recherché ?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Être accompagné par Mathilde' }).click();
  await expect(page.locator('.adviser-relay')).toContainText('Mathilde a été prévenue');
  await page.goto('http://glimlink.demo/#/adviser/needs');
  await expect(page.locator('.relay-request')).toContainText('Relais demandé');
});

test('V6 — Mon profil : un site ajouté préremplit le lieu d’un nouveau besoin', async ({ page }) => {
  await page.goto('http://glimlink.demo/#/company/profile');
  await page.getByLabel('Site principal').fill('Sète');
  await page.getByRole('button', { name: 'Enregistrer mon profil' }).click();
  await page.goto('http://glimlink.demo/#/company/new-need');
  await page
    .getByLabel('Les missions, avec vos mots')
    .fill('Je cherche quelqu’un pour accueillir les clients, gérer des devis et classer les dossiers.');
  await page.getByRole('button', { name: 'Comprendre mon besoin' }).click();
  await expect(page.locator('select[name="location"]')).toHaveValue('Sète');
});

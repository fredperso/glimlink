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
test('Besoin : confirmer le brief avant de découvrir les profils', async ({ page }) => {
  await page.getByRole('button', { name: 'Décrire mon besoin', exact: true }).click();
  await page.getByRole('button', { name: 'Accueil & administratif', exact: true }).click();
  await page.getByRole('button', { name: 'Préparer mon brief' }).click();
  await expect(page.getByRole('heading', { name: 'Est-ce bien votre besoin ?' })).toBeVisible();
  await page.locator('#brief-location').fill('Montpellier');
  await page.getByRole('button', { name: 'C’est exactement ça' }).click();
  await expect(page.getByRole('alert')).toContainText('Confirmez le brief');
  await page.locator('#confirm-brief').check();
  await page.getByRole('button', { name: 'C’est exactement ça' }).click();
  await expect(
    page.getByRole('heading', { name: 'Accueil & gestion administrative', level: 1 }),
  ).toBeVisible();
  await expect(page.locator('.talent-card')).toHaveCount(4);
});
test('Sélection : fiche expliquée et demande transmise à la conseillère', async ({ page }) => {
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  await page
    .locator('.talent-card')
    .first()
    .getByRole('button', { name: 'Voir le profil' })
    .click();
  await expect(page.getByRole('dialog')).toContainText('Pourquoi ça matche ?');
  await expect(page.getByRole('dialog')).toContainText('Pas de conflit scolaire le vendredi');
  await page.getByRole('button', { name: 'Ajouter à ma sélection' }).click();
  await page.getByRole('button', { name: 'Fermer la fenêtre' }).click();
  await page.getByRole('button', { name: 'Demander une mise en relation' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Demander une mise en relation' })
    .click();
  await expect(page.getByRole('heading', { name: 'Du talent à la rencontre.' })).toBeVisible();
  await expect(page.locator('.request-card')).toContainText('Demande reçue');
  await page.getByLabel('Choisir l’espace de démonstration').selectOption('adviser');
  await page.goto('http://glimlink.demo/#/adviser/requests');
  await expect(page.locator('.request-card')).toContainText('Maison Alba');
});
test('V3-05 : modifier un calendrier change le contrôle de deux profils', async ({ page }) => {
  await page.goto('http://glimlink.demo/#/adviser/calendars');
  await page
    .getByRole('button', { name: 'Modifier le rythme' })
    .click();
  await page.getByRole('dialog').getByText('Vendredi', { exact: true }).click();
  await page.getByRole('button', { name: 'Enregistrer le calendrier' }).click();
  await page.goto('http://glimlink.demo/#/company/discover?need=need-admin');
  await page.getByRole('button', { name: /Conflits identifiés/ }).click();
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

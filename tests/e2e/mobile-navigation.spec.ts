import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('Mobile — un appui change la vue et Accueil revient en haut', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Parcours tactile');
  const html = await readFile('maquette.html', 'utf8');
  await page.route('http://glimlink.demo/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: html }),
  );
  for (const role of ['company', 'adviser']) {
    await page.goto(`http://glimlink.demo/#/${role}/home`);
    const home = page.locator(`.mobile-nav > a[href="#/${role}/home"]`);
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
    await home.tap();
    expect(await page.evaluate(() => scrollY)).toBe(0);
    const views =
      role === 'company'
        ? ['needs', 'selections', 'requests', 'alerts', 'home']
        : ['students', 'calendars', 'needs', 'home'];
    for (const view of views) {
      const link = page.locator(`.mobile-nav > a[href="#/${role}/${view}"]`);
      await link.tap();
      expect(await link.getAttribute('aria-current')).toBe('page');
      expect(await page.evaluate(() => location.hash)).toBe(`#/${role}/${view}`);
    }
    if (role === 'adviser') {
      const more = page.getByRole('button', { name: /Plus.*Demandes et entreprises/ });
      await more.tap();
      await page.locator('#mobile-more-links a[href="#/adviser/companies"]').tap();
      await more.tap();
      await page.locator('#mobile-more-links a[href="#/adviser/companies"]').tap();
      await expect(page.locator('#mobile-more-links')).toHaveCount(0);
      await home.tap();
    } else {
      await page
        .getByRole('combobox', { name: 'Choisir : Entreprise de démonstration', exact: true })
        .tap();
      expect(
        await page
          .getByRole('listbox')
          .evaluate(
            (element) =>
              element.getBoundingClientRect().bottom <=
              document.querySelector('.mobile-nav')!.getBoundingClientRect().top,
          ),
      ).toBe(true);
      await page.locator('.mobile-nav > a[href="#/company/needs"]').tap();
      expect(await page.evaluate(() => location.hash)).toBe('#/company/needs');
    }
  }
});

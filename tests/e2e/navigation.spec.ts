import { test, expect } from '@playwright/test';

test.describe('Navigation dans l\'application', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page d'accueil
    await page.goto('/');
    
    // Attendre que la navigation soit chargée
    await page.waitForSelector('nav');
  });

  test('doit naviguer vers la page Dashboard', async ({ page }) => {
    // Cliquer sur le lien "Dashboard" dans la barre de navigation
    await page.click('a:has-text("Dashboard")');
    
    // Vérifier que l'URL a changé
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Vérifier que le titre de la page est affiché
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('doit naviguer vers la page Formations', async ({ page }) => {
    // Cliquer sur le lien "Formations" dans la barre de navigation
    await page.click('a:has-text("Formations")');
    
    // Vérifier que l'URL a changé
    await expect(page).toHaveURL(/.*formations/);
    
    // Vérifier que le titre de la page est affiché
    await expect(page.locator('h1:has-text("Catalogue de Formations")')).toBeVisible();
  });

  test('doit naviguer vers la page Promos', async ({ page }) => {
    // Cliquer sur le lien "Promos" dans la barre de navigation
    await page.click('a:has-text("Promos")');
    
    // Vérifier que l'URL a changé
    await expect(page).toHaveURL(/.*promos/);
    
    // Vérifier que le titre de la page est affiché
    await expect(page.locator('h1')).toBeVisible();
  });

  test('doit naviguer vers la page Campus', async ({ page }) => {
    // Cliquer sur le lien "Campus" dans la barre de navigation
    await page.click('a:has-text("Campus")');
    
    // Vérifier que l'URL a changé
    await expect(page).toHaveURL(/.*campus/);
    
    // Vérifier que le titre de la page est affiché
    await expect(page.locator('h1')).toBeVisible();
  });

  test('doit naviguer vers la page Apprenants', async ({ page }) => {
    // Cliquer sur le lien "Apprenants" dans la barre de navigation
    await page.click('a:has-text("Apprenants")');
    
    // Vérifier que l'URL a changé
    await expect(page).toHaveURL(/.*apprenants/);
    
    // Vérifier que le titre de la page est affiché
    await expect(page.locator('h1')).toBeVisible();
  });

  test('doit naviguer entre les différentes sections', async ({ page }) => {
    // Naviguer vers Formations
    await page.click('a:has-text("Formations")');
    await expect(page).toHaveURL(/.*formations/);
    
    // Naviguer vers Promos
    await page.click('a:has-text("Promos")');
    await expect(page).toHaveURL(/.*promos/);
    
    // Naviguer vers Campus
    await page.click('a:has-text("Campus")');
    await expect(page).toHaveURL(/.*campus/);
    
    // Naviguer vers Apprenants
    await page.click('a:has-text("Apprenants")');
    await expect(page).toHaveURL(/.*apprenants/);
    
    // Revenir au Dashboard
    await page.click('a:has-text("Dashboard")');
    await expect(page).toHaveURL(/.*dashboard/);
  });
}); 
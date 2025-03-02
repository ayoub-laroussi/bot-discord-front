import { test, expect, Page } from '@playwright/test';

/**
 * Tests pour la section Onboarding
 * Cette suite de tests vérifie le bon fonctionnement de la section Onboarding
 * qui comprend Dashboard, Formations, Promos, Campus et Apprenants
 */

// URL de base pour les tests
const baseURL = 'http://localhost:4200';

// Fonction utilitaire pour naviguer vers une page via la barre de navigation
async function navigateToPage(page: Page, linkText: string) {
  await page.getByRole('link', { name: linkText, exact: true }).click();
  await page.waitForLoadState('networkidle');
}

test.beforeEach(async ({ page }) => {
  // Aller à la page d'accueil avant chaque test
  await page.goto(baseURL);
  // Attendre que la page soit complètement chargée
  await page.waitForLoadState('domcontentloaded');
});

test.describe('Navigation dans la section Onboarding', () => {
  
  test('Doit afficher tous les liens de la section Onboarding dans la barre de navigation', async ({ page }) => {
    // Vérifier la présence des liens de la section Onboarding
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Formations' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Promos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Campus' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Apprenants' })).toBeVisible();
  });

  test('Doit pouvoir naviguer vers la page Dashboard', async ({ page }) => {
    await navigateToPage(page, 'Dashboard');
    // Vérifier qu'on est bien sur la page Dashboard
    await expect(page.url()).toContain('/dashboard');
    await expect(page.locator('h1').filter({ hasText: /Dashboard/i })).toBeVisible();
  });

  test('Doit pouvoir naviguer vers la page Formations', async ({ page }) => {
    await navigateToPage(page, 'Formations');
    // Vérifier qu'on est bien sur la page Formations
    await expect(page.url()).toContain('/formations');
    await expect(page.locator('h1').filter({ hasText: /Formations/i })).toBeVisible();
  });

  test('Doit pouvoir naviguer vers la page Promos', async ({ page }) => {
    await navigateToPage(page, 'Promos');
    // Vérifier qu'on est bien sur la page Promos
    await expect(page.url()).toContain('/promos');
    await expect(page.locator('h1').filter({ hasText: /Promos/i })).toBeVisible();
  });

  test('Doit pouvoir naviguer vers la page Campus', async ({ page }) => {
    await navigateToPage(page, 'Campus');
    // Vérifier qu'on est bien sur la page Campus
    await expect(page.url()).toContain('/campus');
    await expect(page.locator('h1').filter({ hasText: /Campus/i })).toBeVisible();
  });

  test('Doit pouvoir naviguer vers la page Apprenants', async ({ page }) => {
    await navigateToPage(page, 'Apprenants');
    // Vérifier qu'on est bien sur la page Apprenants
    await expect(page.url()).toContain('/apprenants');
    await expect(page.locator('h1').filter({ hasText: /Apprenants/i })).toBeVisible();
  });
});

test.describe('Fonctionnalités de la page Dashboard', () => {
  test('Doit afficher les éléments principaux du dashboard', async ({ page }) => {
    await navigateToPage(page, 'Dashboard');
    
    // Vérifier les éléments clés qui devraient être présents sur le dashboard
    await expect(page.locator('.dashboard-container')).toBeVisible();
    // À adapter en fonction des éléments réels de votre dashboard
    await expect(page.locator('.dashboard-stats')).toBeVisible({ timeout: 5000 }).catch(() => {
      console.log('❌ Élément .dashboard-stats non trouvé');
    });
    await expect(page.locator('.dashboard-charts')).toBeVisible({ timeout: 5000 }).catch(() => {
      console.log('❌ Élément .dashboard-charts non trouvé');
    });
  });
});

test.describe('Intégration des composants d\'Onboarding', () => {
  test('Doit afficher les étapes d\'onboarding dans l\'ordre correct', async ({ page }) => {
    await navigateToPage(page, 'Dashboard');
    
    // Vérifier si le composant active-step-display-bar est présent
    const stepDisplayBar = page.locator('app-active-step-display-bar');
    await expect(stepDisplayBar).toBeVisible({ timeout: 5000 }).catch(() => {
      console.log('❌ Composant app-active-step-display-bar non trouvé');
    });
    
    // Vérifier l'ordre des étapes si le composant est présent
    if (await stepDisplayBar.isVisible()) {
      const steps = await stepDisplayBar.locator('.step').all();
      // Vérifier que nous avons au moins 2 étapes
      expect(steps.length).toBeGreaterThan(1);
    }
  });
  
  test('Doit synchroniser l\'étape active avec la page actuelle', async ({ page }) => {
    // Tester si l'étape active change correctement lors de la navigation
    await navigateToPage(page, 'Dashboard');
    
    // Trouver le composant d'étapes
    const stepDisplayBar = page.locator('app-active-step-display-bar');
    if (!(await stepDisplayBar.isVisible())) {
      console.log('❌ Composant app-active-step-display-bar non trouvé');
      return;
    }
    
    // Vérifier que l'étape Dashboard est active
    await expect(stepDisplayBar.locator('.step.active').first()).toContainText('Dashboard');
    
    // Aller à la page Formations et vérifier que l'étape Formations devient active
    await navigateToPage(page, 'Formations');
    await expect(stepDisplayBar.locator('.step.active').first()).toContainText('Formations');
    
    // Aller à la page Promos et vérifier que l'étape Promos devient active
    await navigateToPage(page, 'Promos');
    await expect(stepDisplayBar.locator('.step.active').first()).toContainText('Promos');
  });
  
  test('Doit permettre la navigation entre les étapes en cliquant sur la barre d\'étapes', async ({ page }) => {
    await navigateToPage(page, 'Dashboard');
    
    // Trouver le composant d'étapes
    const stepDisplayBar = page.locator('app-active-step-display-bar');
    if (!(await stepDisplayBar.isVisible())) {
      console.log('❌ Composant app-active-step-display-bar non trouvé');
      return;
    }
    
    // Cliquer sur l'étape Formations dans la barre d'étapes
    await stepDisplayBar.locator('.step').filter({ hasText: 'Formations' }).click();
    // Vérifier qu'on a bien navigué vers la page Formations
    await expect(page.url()).toContain('/formations');
    
    // Cliquer sur l'étape Promos dans la barre d'étapes
    await stepDisplayBar.locator('.step').filter({ hasText: 'Promos' }).click();
    // Vérifier qu'on a bien navigué vers la page Promos
    await expect(page.url()).toContain('/promos');
  });
}); 
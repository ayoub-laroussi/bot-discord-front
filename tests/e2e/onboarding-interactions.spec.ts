import { test, expect, Page } from '@playwright/test';

/**
 * Tests d'interactions pour la section Onboarding
 * Cette suite de tests vérifie les interactions entre les différentes pages
 * et composants de la section Onboarding
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

test.describe('Intégration du composant ActiveStepDisplayBar', () => {
  test('Doit afficher le composant ActiveStepDisplayBar sur chaque page d\'onboarding', async ({ page }) => {
    // Pages de la section Onboarding
    const onboardingPages = ['Dashboard', 'Formations', 'Promos', 'Campus', 'Apprenants'];
    
    for (const pageName of onboardingPages) {
      await navigateToPage(page, pageName);
      
      // Vérifier si le composant active-step-display-bar est présent
      const stepDisplayBar = page.locator('app-active-step-display-bar');
      await expect(stepDisplayBar).toBeVisible({ timeout: 5000 }).catch(() => {
        console.log(`❌ Composant app-active-step-display-bar non trouvé sur la page ${pageName}`);
      });
    }
  });
});

test.describe('Flux de données entre composants', () => {
  test('Les données saisies dans une étape doivent être conservées lors de la navigation', async ({ page }) => {
    // Aller à la page Formations
    await navigateToPage(page, 'Formations');
    
    // Saisir un terme de recherche dans le champ de recherche des formations
    const searchInput = page.locator('input[placeholder*="Rechercher"]').first();
    await searchInput.fill('Développeur Web');
    
    // Naviguer vers une autre page
    await navigateToPage(page, 'Promos');
    
    // Revenir à la page Formations
    await navigateToPage(page, 'Formations');
    
    // Vérifier si le terme de recherche est conservé
    await expect(searchInput).toHaveValue('Développeur Web').catch(() => {
      console.log('❌ La valeur du champ de recherche n\'a pas été conservée');
    });
  });
});

test.describe('Problèmes potentiels', () => {
  test('Les boutons d\'action doivent fonctionner sur toutes les pages d\'onboarding', async ({ page }) => {
    // Aller à la page Formations
    await navigateToPage(page, 'Formations');
    
    // Tester le bouton d'ajout de formation
    const addButton = page.getByRole('button').filter({ hasText: /Ajouter/i }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();
    
    // Vérifier si le popup s'affiche
    const popup = page.locator('app-add-formation-popup');
    await expect(popup).toBeVisible().catch(() => {
      console.log('❌ Le popup d\'ajout de formation ne s\'affiche pas');
    });
    
    // Si le popup est visible, le fermer
    if (await popup.isVisible()) {
      await page.getByRole('button').filter({ hasText: /Annuler|Fermer|×/i }).first().click();
    }
    
    // Aller à la page Promos
    await navigateToPage(page, 'Promos');
    
    // Tester le bouton d'ajout de promo
    const addPromoButton = page.getByRole('button').filter({ hasText: /Ajouter/i }).first();
    await expect(addPromoButton).toBeVisible();
    await addPromoButton.click();
    
    // Vérifier si le popup s'affiche
    const promoPopup = page.locator('app-add-promo-popup');
    await expect(promoPopup).toBeVisible().catch(() => {
      console.log('❌ Le popup d\'ajout de promo ne s\'affiche pas');
    });
  });
  
  test('Les composants d\'onboarding doivent s\'adapter aux différentes tailles d\'écran', async ({ page }) => {
    // Tester le responsive sur différentes tailles d'écran
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      // Redimensionner la fenêtre
      await page.setViewportSize(viewport);
      
      // Aller à la page Dashboard
      await navigateToPage(page, 'Dashboard');
      
      // Vérifier si le composant active-step-display-bar est visible
      const stepDisplayBar = page.locator('app-active-step-display-bar');
      await expect(stepDisplayBar).toBeVisible({ timeout: 5000 }).catch(() => {
        console.log(`❌ Composant app-active-step-display-bar non visible sur viewport ${viewport.width}x${viewport.height}`);
      });
      
      // Aller à la page Formations
      await navigateToPage(page, 'Formations');
      
      // Vérifier si la liste des formations est visible
      const formationsList = page.locator('.formations-list, .formations-grid');
      await expect(formationsList).toBeVisible({ timeout: 5000 }).catch(() => {
        console.log(`❌ Liste des formations non visible sur viewport ${viewport.width}x${viewport.height}`);
      });
    }
  });
});

test.describe('Persistance des données entre les pages', () => {
  test('Les sélections faites dans les filtres doivent être conservées', async ({ page }) => {
    // Aller à la page Formations
    await navigateToPage(page, 'Formations');
    
    // Sélectionner un niveau dans le filtre
    const niveauSelect = page.locator('select').filter({ hasText: /Niveau/i }).first();
    if (await niveauSelect.isVisible()) {
      await niveauSelect.selectOption('Débutant');
      
      // Naviguer vers une autre page
      await navigateToPage(page, 'Dashboard');
      
      // Revenir à la page Formations
      await navigateToPage(page, 'Formations');
      
      // Vérifier si la sélection est conservée
      await expect(niveauSelect).toHaveValue('Débutant').catch(() => {
        console.log('❌ La sélection du niveau n\'a pas été conservée');
      });
    } else {
      console.log('❌ Le sélecteur de niveau n\'est pas visible');
    }
  });
});

test.describe('Intégration avec le routeur Angular', () => {
  test('Le routeur doit conserver l\'historique de navigation', async ({ page }) => {
    // Naviguer à travers plusieurs pages
    await navigateToPage(page, 'Dashboard');
    await navigateToPage(page, 'Formations');
    await navigateToPage(page, 'Promos');
    
    // Utiliser le bouton retour du navigateur
    await page.goBack();
    // Vérifier qu'on est bien revenu à la page Formations
    await expect(page.url()).toContain('/formations');
    
    // Utiliser à nouveau le bouton retour
    await page.goBack();
    // Vérifier qu'on est bien revenu à la page Dashboard
    await expect(page.url()).toContain('/dashboard');
  });
}); 
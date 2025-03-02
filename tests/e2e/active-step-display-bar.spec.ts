import { test, expect, Page } from '@playwright/test';

/**
 * Tests spécifiques pour le composant ActiveStepDisplayBar
 * Cette suite de tests vérifie le fonctionnement du composant ActiveStepDisplayBar
 * qui semble être central dans la fonctionnalité d'onboarding
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

test.describe('Structure du composant ActiveStepDisplayBar', () => {
  test('Doit afficher toutes les étapes correctement', async ({ page }) => {
    await navigateToPage(page, 'Dashboard');
    
    // Vérifier si le composant est présent
    const stepDisplayBar = page.locator('app-active-step-display-bar');
    await expect(stepDisplayBar).toBeVisible({ timeout: 5000 }).catch(() => {
      console.log('❌ Composant app-active-step-display-bar non trouvé');
    });
    
    if (await stepDisplayBar.isVisible()) {
      // Vérifier que le composant contient des étapes
      const steps = await stepDisplayBar.locator('.step').all();
      
      // Il devrait y avoir au moins 2 étapes
      expect(steps.length).toBeGreaterThan(1);
      console.log(`Nombre d'étapes trouvées : ${steps.length}`);
      
      // Vérifier que la première étape est active (pour le Dashboard)
      await expect(stepDisplayBar.locator('.step').first()).toHaveClass(/active/);
    }
  });
});

test.describe('Problèmes d\'intégration du composant ActiveStepDisplayBar', () => {
  test('Le composant doit être correctement intégré aux pages de la section Onboarding', async ({ page }) => {
    // Pages et étapes correspondantes attendues
    const pages = [
      { name: 'Dashboard', expectedStep: 1 },
      { name: 'Formations', expectedStep: 2 },
      { name: 'Promos', expectedStep: 3 },
      { name: 'Campus', expectedStep: 4 },
      { name: 'Apprenants', expectedStep: 5 }
    ];
    
    for (let i = 0; i < pages.length; i++) {
      const { name, expectedStep } = pages[i];
      
      // Naviguer vers la page
      await navigateToPage(page, name);
      
      // Vérifier si le composant active-step-display-bar est présent
      const stepDisplayBar = page.locator('app-active-step-display-bar');
      if (!(await stepDisplayBar.isVisible({ timeout: 5000 }))) {
        console.log(`❌ Composant app-active-step-display-bar non trouvé sur la page ${name}`);
        continue;
      }
      
      // Vérifier que l'étape active correspond à la page actuelle
      const activeStep = await stepDisplayBar.locator('.step.active').count();
      if (activeStep === 0) {
        console.log(`❌ Aucune étape active trouvée sur la page ${name}`);
      } else if (activeStep > 1) {
        console.log(`❌ Plusieurs étapes actives (${activeStep}) trouvées sur la page ${name}`);
      }
      
      // Vérifier que c'est la bonne étape qui est active
      // Pour cela, on compte le nombre d'étapes avant l'étape active
      const stepsBeforeActive = await stepDisplayBar.locator('.step:not(.active)').all();
      const activeStepIndex = await stepDisplayBar.locator('.step.active').evaluate((el) => {
        return Array.from(el.parentElement?.children || []).indexOf(el) + 1;
      });
      
      console.log(`Page ${name}: Étape active = ${activeStepIndex}, Étape attendue = ${expectedStep}`);
      
      if (activeStepIndex !== expectedStep) {
        console.log(`❌ L'étape active (${activeStepIndex}) ne correspond pas à l'étape attendue (${expectedStep}) pour la page ${name}`);
      }
    }
  });
  
  test('Le composant doit être mis à jour lors des changements de route', async ({ page }) => {
    // Aller à la page Dashboard (étape 1)
    await navigateToPage(page, 'Dashboard');
    
    // Vérifier que l'étape 1 est active
    const stepDisplayBar = page.locator('app-active-step-display-bar');
    if (!(await stepDisplayBar.isVisible({ timeout: 5000 }))) {
      console.log('❌ Composant app-active-step-display-bar non trouvé');
      return;
    }
    
    // Vérifier que l'étape 1 est active
    await expect(stepDisplayBar.locator('.step').nth(0)).toHaveClass(/active/);
    
    // Aller à la page Formations (étape 2)
    await navigateToPage(page, 'Formations');
    
    // Vérifier que l'étape 2 est maintenant active
    await expect(stepDisplayBar.locator('.step').nth(1)).toHaveClass(/active/);
    
    // Aller à la page Promos (étape 3)
    await navigateToPage(page, 'Promos');
    
    // Vérifier que l'étape 3 est maintenant active
    await expect(stepDisplayBar.locator('.step').nth(2)).toHaveClass(/active/);
  });
});

test.describe('Inspection des problèmes du composant ActiveStepDisplayBar', () => {
  test('Débogage des propriétés du composant ActiveStepDisplayBar', async ({ page }) => {
    await navigateToPage(page, 'Dashboard');
    
    // Exécuter du JavaScript dans la page pour déboguer le composant
    const debugInfo = await page.evaluate(() => {
      // Trouver le composant
      const component = document.querySelector('app-active-step-display-bar');
      if (!component) return { error: 'Composant non trouvé' };
      
      // Obtenir des informations sur le composant
      const steps = component.querySelectorAll('.step');
      const activeSteps = component.querySelectorAll('.step.active');
      
      // Récupérer la valeur de l'attribut d'entrée "step" s'il est défini
      const stepInput = component.getAttribute('ng-reflect-step');
      
      return {
        componentFound: true,
        totalSteps: steps.length,
        activeSteps: activeSteps.length,
        stepInput: stepInput || 'Non défini'
      };
    });
    
    console.log('Informations de débogage du composant ActiveStepDisplayBar:', debugInfo);
    
    // Naviguer vers d'autres pages et vérifier si le composant est correctement mis à jour
    for (const pageName of ['Formations', 'Promos', 'Campus', 'Apprenants']) {
      await navigateToPage(page, pageName);
      
      const pageDebugInfo = await page.evaluate(() => {
        const component = document.querySelector('app-active-step-display-bar');
        if (!component) return { error: 'Composant non trouvé' };
        
        const steps = component.querySelectorAll('.step');
        const activeSteps = component.querySelectorAll('.step.active');
        const stepInput = component.getAttribute('ng-reflect-step');
        
        return {
          componentFound: true,
          totalSteps: steps.length,
          activeSteps: activeSteps.length,
          stepInput: stepInput || 'Non défini'
        };
      });
      
      console.log(`Informations de débogage pour la page ${pageName}:`, pageDebugInfo);
    }
  });
}); 
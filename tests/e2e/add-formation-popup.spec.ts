import { test, expect } from '@playwright/test';

test.describe('Popup d\'ajout de formation', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page d'accueil
    await page.goto('/');
    
    // Attendre que la navigation soit chargée
    await page.waitForSelector('nav');
    
    // Cliquer sur le lien "Formations" dans la barre de navigation
    await page.click('a:has-text("Formations")');
    
    // Attendre que la page Formations soit chargée
    await page.waitForSelector('h1:has-text("Catalogue de Formations")');
    
    // Ouvrir le popup
    await page.click('button:has-text("Ajouter une formation")');
    
    // Vérifier que le popup est visible
    await expect(page.locator('h2:has-text("Ajouter une formation")')).toBeVisible();
  });

  test('doit avoir tous les champs requis', async ({ page }) => {
    // Vérifier que tous les champs requis sont présents
    await expect(page.locator('input#titre')).toBeVisible();
    await expect(page.locator('textarea#description')).toBeVisible();
    await expect(page.locator('input#duree')).toBeVisible();
    await expect(page.locator('select#niveau')).toBeVisible();
    await expect(page.locator('input[name="technoInput"]')).toBeVisible();
    await expect(page.locator('input#image')).toBeVisible();
    await expect(page.locator('input#popularite')).toBeVisible();
  });

  test('doit afficher une erreur si les champs obligatoires ne sont pas remplis', async ({ page }) => {
    // Le bouton d'ajout doit être désactivé initialement
    const addButton = page.locator('button:has-text("Ajouter la formation")');
    await expect(addButton).toBeDisabled();
    
    // Remplir seulement certains champs
    await page.fill('input#titre', 'Formation Test');
    await page.fill('textarea#description', 'Description de test');
    
    // Le bouton doit toujours être désactivé car tous les champs obligatoires ne sont pas remplis
    await expect(addButton).toBeDisabled();
  });

  test('doit permettre d\'ajouter et supprimer des technologies', async ({ page }) => {
    // Ajouter une technologie
    await page.fill('input[name="technoInput"]', 'Angular');
    await page.click('button:has-text("+")');
    
    // Vérifier que la technologie a été ajoutée
    await expect(page.locator('.bg-gray-100.text-gray-800:has-text("Angular")')).toBeVisible();
    
    // Ajouter une autre technologie
    await page.fill('input[name="technoInput"]', 'TypeScript');
    await page.click('button:has-text("+")');
    
    // Vérifier que la deuxième technologie a été ajoutée
    await expect(page.locator('.bg-gray-100.text-gray-800:has-text("TypeScript")')).toBeVisible();
    
    // Supprimer la première technologie
    await page.locator('.bg-gray-100.text-gray-800:has-text("Angular") button').click();
    
    // Vérifier que la première technologie a été supprimée
    await expect(page.locator('.bg-gray-100.text-gray-800:has-text("Angular")')).not.toBeVisible();
    
    // Vérifier que la deuxième technologie est toujours présente
    await expect(page.locator('.bg-gray-100.text-gray-800:has-text("TypeScript")')).toBeVisible();
  });

  test('doit permettre de soumettre le formulaire avec tous les champs remplis', async ({ page }) => {
    // Compter le nombre initial de formations
    await page.click('button:has-text("Annuler")');
    const initialCount = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div').count();
    
    // Rouvrir le popup
    await page.click('button:has-text("Ajouter une formation")');
    
    // Remplir tous les champs obligatoires
    await page.fill('input#titre', 'Formation E2E Test');
    await page.fill('textarea#description', 'Description créée par test e2e');
    await page.fill('input#duree', '6');
    await page.selectOption('select#niveau', 'Intermédiaire');
    
    // Ajouter des technologies
    await page.fill('input[name="technoInput"]', 'Playwright');
    await page.click('button:has-text("+")');
    await page.fill('input[name="technoInput"]', 'Testing');
    await page.click('button:has-text("+")');
    
    // Définir l'URL de l'image
    await page.fill('input#image', 'https://example.com/test-image.jpg');
    
    // Définir la popularité
    await page.fill('input#popularite', '4.5');
    
    // Soumettre le formulaire
    await page.click('button:has-text("Ajouter la formation")');
    
    // Vérifier que le popup est fermé
    await expect(page.locator('h2:has-text("Ajouter une formation")')).not.toBeVisible();
    
    // Vérifier qu'une nouvelle formation a été ajoutée
    await page.waitForTimeout(500); // Attendre que la liste soit mise à jour
    const newCount = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div').count();
    expect(newCount).toBe(initialCount + 1);
    
    // Vérifier que la nouvelle formation est visible dans la liste
    await expect(page.locator('h3:has-text("Formation E2E Test")')).toBeVisible();
  });

  test('doit permettre de supprimer une formation', async ({ page }) => {
    // Fermer le popup d'abord
    await page.click('button:has-text("Annuler")');
    
    // Compter le nombre initial de formations
    const initialCount = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div').count();
    
    // S'assurer qu'il y a au moins une formation à supprimer
    expect(initialCount).toBeGreaterThan(0);
    
    // Simuler la confirmation de suppression
    page.on('dialog', dialog => dialog.accept());
    
    // Cliquer sur le bouton de suppression de la première formation
    await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div').first().locator('button.bg-white.text-red-500').click();
    
    // Attendre que la suppression soit traitée
    await page.waitForTimeout(500);
    
    // Vérifier qu'une formation a été supprimée
    const newCount = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div').count();
    expect(newCount).toBe(initialCount - 1);
  });
}); 
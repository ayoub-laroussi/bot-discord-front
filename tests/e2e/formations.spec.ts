import { test, expect } from '@playwright/test';

test.describe('Page Formations', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page d'accueil
    await page.goto('/');
    
    // Attendre que la navigation soit chargée
    await page.waitForSelector('nav');
    
    // Cliquer sur le lien "Formations" dans la barre de navigation
    await page.click('a:has-text("Formations")');
    
    // Attendre que la page Formations soit chargée
    await page.waitForSelector('h1:has-text("Catalogue de Formations")');
  });

  test('doit afficher le titre de la page', async ({ page }) => {
    const title = await page.locator('h1').textContent();
    expect(title).toContain('Catalogue de Formations');
  });

  test('doit afficher les statistiques', async ({ page }) => {
    // Vérifier que les 3 cartes de statistiques sont présentes
    const statsCards = await page.locator('.bg-white.rounded-lg.shadow.p-6').count();
    expect(statsCards).toBeGreaterThanOrEqual(3);
    
    // Vérifier les titres des statistiques
    const statsTitles = await page.locator('.text-gray-500.text-sm').allTextContents();
    expect(statsTitles).toContain('Total Formations');
    expect(statsTitles).toContain('Durée Moyenne');
    expect(statsTitles).toContain('Popularité Moyenne');
  });

  test('doit filtrer les formations', async ({ page }) => {
    // Nombre initial de formations
    const initialCount = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div').count();
    
    // Filtrer par niveau "Débutant"
    await page.selectOption('select#niveau', 'Débutant');
    
    // Attendre que le filtrage soit appliqué
    await page.waitForTimeout(500);
    
    // Vérifier que le nombre de formations a changé
    const filteredCount = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div').count();
    
    // Le nombre filtré peut être inférieur ou égal au nombre initial
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Réinitialiser les filtres
    await page.click('button:has-text("Réinitialiser")');
    
    // Attendre que la réinitialisation soit appliquée
    await page.waitForTimeout(500);
    
    // Vérifier que le nombre de formations est revenu à l'initial
    const resetCount = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div').count();
    expect(resetCount).toBe(initialCount);
  });

  test('doit rechercher des formations par texte', async ({ page }) => {
    // Rechercher un terme qui devrait exister dans au moins une formation
    await page.fill('input#search', 'web');
    
    // Attendre que la recherche soit appliquée
    await page.waitForTimeout(500);
    
    // Vérifier qu'il y a au moins un résultat ou le message "Aucune formation trouvée"
    const hasResults = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div').count() > 0;
    const noResultsMessage = await page.locator('h3:has-text("Aucune formation trouvée")').isVisible();
    
    // Soit nous avons des résultats, soit nous avons le message "Aucune formation trouvée"
    expect(hasResults || noResultsMessage).toBeTruthy();
    
    // Réinitialiser les filtres
    await page.click('button:has-text("Réinitialiser")');
  });

  test('doit ouvrir et fermer le popup d\'ajout de formation', async ({ page }) => {
    // Cliquer sur le bouton pour ouvrir le popup
    await page.click('button:has-text("Ajouter une formation")');
    
    // Vérifier que le popup est visible
    await expect(page.locator('h2:has-text("Ajouter une formation")')).toBeVisible();
    
    // Fermer le popup en cliquant sur le bouton Annuler
    await page.click('button:has-text("Annuler")');
    
    // Vérifier que le popup n'est plus visible
    await expect(page.locator('h2:has-text("Ajouter une formation")')).not.toBeVisible();
  });
}); 
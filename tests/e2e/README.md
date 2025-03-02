# Tests End-to-End (E2E) pour Dashboard Simplon

Ce répertoire contient les tests end-to-end (E2E) pour l'application Dashboard Simplon, utilisant [Playwright](https://playwright.dev/).

## Structure des tests

- `navigation.spec.ts` : Tests de navigation entre les différentes pages de l'application
- `formations.spec.ts` : Tests pour la page Formations
- `add-formation-popup.spec.ts` : Tests pour le popup d'ajout de formation

## Exécution des tests

Pour exécuter tous les tests E2E :

```bash
npm run test:e2e
```

Pour exécuter un test spécifique :

```bash
npx playwright test formations.spec.ts
```

Pour exécuter les tests avec l'interface utilisateur de Playwright :

```bash
npx playwright test --ui
```

Pour exécuter les tests dans un navigateur spécifique :

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Génération de rapports

Après l'exécution des tests, un rapport HTML est généré dans le répertoire `playwright-report/`. Pour visualiser ce rapport :

```bash
npx playwright show-report
```

## Déboguer les tests

Pour déboguer les tests en mode pas à pas :

```bash
npx playwright test --debug
```

## Maintenance des tests

Lors de la modification de l'interface utilisateur, assurez-vous de mettre à jour les sélecteurs correspondants dans les tests. Les tests utilisent principalement des sélecteurs basés sur le texte et les attributs pour être plus robustes face aux changements de structure HTML.

## Structure de l'application testée

L'application Dashboard Simplon est structurée comme suit :

- **Barre de navigation latérale** : Permet de naviguer entre les différentes sections
  - Section **Onboarding** : Dashboard, Formations, Promos, Campus, Apprenants
  - Section **Community** : Logs, Modération, Commentaires, Ressources, Signalements
  - Section **Feedback** : Sondage

- **Page Formations** : Affiche un catalogue de formations avec possibilité de filtrage et d'ajout
  - **Popup d'ajout de formation** : Formulaire pour ajouter une nouvelle formation

Les tests vérifient que la navigation fonctionne correctement et que les fonctionnalités spécifiques à chaque page sont opérationnelles. 
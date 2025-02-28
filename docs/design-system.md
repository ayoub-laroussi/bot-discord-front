# Design system

## 1. Introduction

Objectif :
Le Design System de Dashboard Simplon vise à fournir un ensemble de directives pour garantir la cohérence visuelle et fonctionnelle de l'application.

Contenu :

- [Couleurs](#2-couleurs)
- [Typographie](#3-typographie)
- [Iconographie](#4-iconographie)

## 2. Couleurs

**Palette de Couleurs**

```scss
--color-primary: #E40046; //Background Nav & buttons (Rouge Simplon)
--color-white: #ffffff; //Background Cards (Blanc)
--color-body: #f0f0f0; //Background body (Blanc foncé)
--color-select: #f8fafc; //Background selects (Gris clair)
--color-black: #000000; //Text (Noir)
--color-success: #009640; //Success (Vert)
--color-disabled: #c4c4c4; //Disabled (Gris)
```

## 3. Typographie

**Polices**

- Police principale : 'Nunito SANS';
- Police secondaire : 'Inter', sans-serif;

**Hiérarchie des Titres**

```html
<h1>Titre principal</h1>
<h2>Sous titres</h2>
<h3>Titre cartes et composants dashboard</h3>
<p>Petit texte</p>
```

**Tailles**

- Titres : 36px / 2.25 rem - semi-bold
- Sous-titre : 24px / 1.5 rem - regular
- Titre carte et composants dashboard : 24px / 1.5 rem - semi-bold
- Elements des tableaux : 14px / 0.875 rem - semi-bold
- Form label : 16px / 1 rem - regular

## 4. Iconographie

**Utilisation des Icônes**
Nous utilisons FontAwesome pour les icônes.

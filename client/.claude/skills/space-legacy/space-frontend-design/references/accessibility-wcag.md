# Accessibilité — Checklist WCAG applicable

Référentiel WCAG 2.1 niveau AA, ciblé sur ce qui est pertinent pour SPACE LEGACY V1.

## Contraste

- [ ] Texte normal : contraste ≥ 4.5:1 avec son fond.
- [ ] Texte large (≥ 24 px ou ≥ 18.66 px gras) : contraste ≥ 3:1.
- [ ] Éléments interactifs et icônes significatives : contraste ≥ 3:1.
- [ ] Les combinaisons palette à surveiller : rouge vif sur bleu nuit, bleu NASA sur bleu nuit. Vérifier avant usage.

## Structure sémantique

- [ ] Un seul `<h1>` par page.
- [ ] Hiérarchie des titres `<h1>` → `<h2>` → `<h3>` sans saut.
- [ ] `<main>`, `<nav>`, `<aside>`, `<footer>` utilisés à bon escient.
- [ ] Les listes sont des `<ul>`, `<ol>`, `<dl>`. Pas de `<div>` qui simule une liste.
- [ ] Les chronologies utilisent `<ol>` avec dates en `<time datetime="…">`.

## Images et médias

- [ ] `alt` descriptif sur chaque image informative.
- [ ] `alt=""` sur les images purement décoratives.
- [ ] Chaque média affiche son crédit de provenance (`NASA ARCHIVE`, `3D RECONSTRUCTION`, etc.).
- [ ] Les vidéos ont des sous-titres ou une transcription.
- [ ] Les animations critiques respectent `prefers-reduced-motion`.

## Clavier

- [ ] Tous les éléments interactifs sont accessibles au clavier.
- [ ] L'ordre de tabulation suit l'ordre visuel.
- [ ] Focus visible sur tous les éléments focusables (`:focus-visible` stylé).
- [ ] Pas de piège au clavier dans les modales, menus, chronologies interactives.

## Mouvement et animations

- [ ] Aucune animation en boucle infinie sans possibilité de pause.
- [ ] Pas de clignotement > 3 fois par seconde.
- [ ] `prefers-reduced-motion: reduce` réduit ou supprime les animations non essentielles.

## Formulaires (zone admin future)

- [ ] Chaque champ a un `<label>` associé par `for`/`id`.
- [ ] Les erreurs sont annoncées textuellement, pas uniquement par la couleur.
- [ ] Les champs requis sont signalés visuellement et sémantiquement (`aria-required="true"`).

## Lecteur d'écran

- [ ] Les éléments décoratifs utilisent `aria-hidden="true"` quand ils ne doivent pas être lus.
- [ ] Les régions dynamiques importantes utilisent `aria-live` avec parcimonie.
- [ ] Les boutons ont un libellé explicite (pas d'icône seule sans `aria-label`).

## Zoom et redimensionnement

- [ ] Zoom 200 % sans perte de contenu ni de fonctionnalité.
- [ ] Pas de `user-scalable=no` dans le viewport meta.
- [ ] Les unités relatives (`rem`, `em`, `%`) sont préférées aux unités fixes pour les textes.

## Langue

- [ ] `<html lang="fr">` par défaut.
- [ ] Les passages dans une autre langue utilisent `lang="…"`.

## Performance perçue (connexion instable)

- [ ] Les images servies dans un format moderne avec fallback.
- [ ] Les polices chargées avec `font-display: swap`.
- [ ] Le contenu critique reste lisible sans JS si possible.
- [ ] Les pages tiennent sous 500 KB totalisés pour le premier rendu lorsque c'est atteignable.

## Validation

Avant qu'un composant ou un écran soit considéré comme terminé, cette checklist est passée en revue et les écarts sont documentés dans `CONTEXT.md` avec un correctif planifié.

---
name: space-frontend-design
description: >
  Concevoir et implémenter l'interface de SPACE LEGACY en HTML, CSS et
  JavaScript Vanilla. Couvre l'architecture des composants, le responsive,
  l'accessibilité, et l'identité visuelle Cosmic Editorial avec exploration
  rétro-futuriste. À utiliser dès qu'on crée, modifie ou revoit un écran,
  un composant visuel, une interaction, ou l'intégration d'une maquette.
version: 1.0.0
scope: frontend
---

# space-frontend-design

## Rôle du Skill

Produire le **code d'interface** de SPACE LEGACY. Garantir que chaque composant respecte l'identité visuelle du projet, les contraintes techniques (Vanilla uniquement en V1), l'accessibilité, et le confort de lecture sur connexion instable.

## Quand l'utiliser

- Création ou modification d'un écran.
- Création d'un composant partagé (carte équipement, chronologie, bloc média…).
- Intégration d'une animation ou d'une interaction.
- Revue d'un écran existant pour accessibilité ou responsive.
- Mise en cohérence visuelle avec les tokens (`references/cosmic-editorial.md`).

Ne pas utiliser pour :
- Décider où placer un nouveau dossier (c'est `space-legacy-architecture`).
- Générer un artefact statique PNG ou PDF (c'est `canvas-design` côté générique).
- Choisir une palette entière à partir de zéro (c'est `theme-factory`, en complément).

## Procédure

1. **Lire la demande**. Identifier : quel écran, quel composant, quelle intention éditoriale.
2. **Relire les tokens** dans `references/cosmic-editorial.md`. Ne jamais écrire une couleur ou une taille en dur sans token.
3. **Consulter `frontend-design`** (Skill générique) pour les principes anti-templating.
4. **Proposer une structure HTML sémantique** avant de coder. Deux ou trois lignes suffisent.
5. **Écrire le CSS** en s'appuyant sur `styles/tokens.css` et une classe par responsabilité. BEM léger recommandé.
6. **Écrire le JS** en Vanilla, modulaire, sans framework caché. Pas de bundler V1 sans décision validée.
7. **Vérifier l'accessibilité** selon `references/accessibility-wcag.md`.
8. **Tester le responsive** mental sur les trois tailles de référence (360, 768, 1280).
9. **Documenter** toute convention nouvelle dans `CONTEXT.md`.

## Contraintes techniques V1

- **HTML/CSS/JS Vanilla uniquement.** Pas de React, Vue, Svelte, Tailwind, Bootstrap tant que ce n'est pas validé.
- **Mobile-first.** Les styles de base ciblent le petit écran. Les breakpoints montent ensuite.
- **Chargement résilient.** Pas de dépendance critique à une police ou à une image externe. Fallback systématique.
- **Pas de secrets ni de clés API dans le frontend.** Jamais.
- **Pas d'inline style**, sauf cas justifié documenté.
- **Préférer l'HTML sémantique** aux `<div>` imbriqués.

## Identité visuelle

Deux directions en cohabitation, non encore arbitrées définitivement :

- **Cosmic Editorial** : esthétique éditoriale sobre, grandes images, typographie affirmée, hiérarchie claire.
- **Rétro-futuriste NASA** : clin d'œil aux interfaces NASA historiques (grilles, caractères monospaces maîtrisés, palette primaire bleu/rouge/blanc/nuit).

Palette de départ documentée dans `references/cosmic-editorial.md`. Aucun choix définitif n'est figé sans validation utilisateur.

## Anti-templating — rappels critiques

Le Skill générique `frontend-design` liste des défauts d'IA à éviter. Pour SPACE LEGACY, prêter attention en particulier à :

- **Ne pas ouvrir chaque page** par un gros chiffre + mini-label + accent gradient. Ce n'est pas la voix du projet.
- **Ne pas numéroter** mécaniquement les sections (01 / 02 / 03) sauf si c'est réellement une séquence.
- **Pas d'eyebrow ALL-CAPS trackées** systématiquement. Si utilisé une fois, le justifier.
- **Pas de carte identique répétée** en tapis pour tout contenu. Les équipements méritent une hiérarchie visuelle, pas un grid uniforme.
- **Une seule audace par écran.** Si le hero est spectaculaire, le reste est calme.

## Exemples

### Exemple 1 — Création d'une carte équipement

Demande : *« Crée la carte qui apparaît sur la page catalogue. »*

Procédure attendue :
1. Lire les tokens.
2. Proposer une structure sémantique : `<article class="equipment-card">` avec titre, mission, image, extrait, lien.
3. Styler en respectant la palette et la typographie.
4. Prévoir l'état vide (image manquante, texte long).
5. Vérifier contraste, focus clavier, lecture au lecteur d'écran.

### Exemple 2 — Chronologie

Demande : *« Ajoute une chronologie des événements d'Apollo 15 sur la page équipement. »*

Procédure attendue :
1. Récupérer le socle factuel via `space-research`.
2. Proposer une structure `<ol>` avec dates et énoncés.
3. Styler avec ligne verticale, puces, dates alignées.
4. Vérifier que le défilement et le lecteur d'écran restituent bien l'ordre.
5. Noter dans `CONTEXT.md` la convention retenue pour les chronologies.

## Erreurs à éviter

- Introduire une bibliothèque UI non validée.
- Utiliser une couleur en dur hors palette.
- Mélanger deux systèmes typographiques dans la même vue sans justification.
- Négliger le clavier, le focus visible, le contraste.
- Ajouter des animations partout pour « donner du mouvement ».
- Oublier la version mobile et la traiter à la fin.
- Reproduire des défauts d'IA listés dans `frontend-design`.
- Écrire du JavaScript qui bloque l'affichage initial.

## Interactions avec les autres Skills

- **Précédé par** `space-legacy-architecture` pour l'emplacement des fichiers.
- **Alimenté par** `space-storytelling` pour les textes d'interface.
- **Alimenté par** `space-research` pour les données factuelles affichées.
- **Audité par** `fact-checking` quand des chiffres apparaissent à l'écran.
- **Peut appeler** `frontend-design` (générique) pour les principes de direction visuelle.
- **Peut appeler** `theme-factory` pour tester une palette alternative.
- **Peut appeler** `canvas-design` pour produire un visuel statique associé (poster, planche).

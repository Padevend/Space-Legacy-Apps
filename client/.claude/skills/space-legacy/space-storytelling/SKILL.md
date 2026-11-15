---
name: space-storytelling
description: >
  Rédiger des contenus éditoriaux pour SPACE LEGACY selon les quatre formats
  validés (LEGACY STORIES, BEHIND THE TECHNOLOGY, THE FINAL CHAPTER,
  SPACE FACTS). Vulgarisation sans infantilisation, narration scientifique,
  construction de chronologies et de scripts audiovisuels. Ne produit jamais
  un récit sans socle factuel fourni par space-research et validé par
  fact-checking.
version: 1.0.0
---

# space-storytelling

## Rôle du Skill

Transformer un socle factuel vérifié en **récit éditorial** fidèle à l'identité de SPACE LEGACY. Les faits ne sont pas de son ressort : il les reçoit, il les met en forme. Il incarne la devise *« Every object has a story. Every mission leaves a legacy. »*

## Quand l'utiliser

- Après que `space-research` a produit une fiche de recherche et que `fact-checking` l'a validée.
- Pour rédiger : une LEGACY STORY, un BEHIND THE TECHNOLOGY, un THE FINAL CHAPTER, un SPACE FACT.
- Pour construire une chronologie narrative à partir d'événements sourcés.
- Pour rédiger un script audiovisuel associé à un équipement.
- Pour écrire les textes courts de l'interface qui touchent au récit (intro de page, bandeau de section, légende éditoriale).

Ne pas utiliser pour :
- Vérifier un fait (c'est `fact-checking`).
- Trouver une information manquante (c'est `space-research`).
- Dessiner un composant d'interface (c'est `space-frontend-design`).

## Procédure

1. **Recevoir le socle factuel.** Exiger une fiche de recherche datée avec niveaux de provenance. Pas de socle, pas de récit.
2. **Choisir le format éditorial** (voir `references/editorial-formats.md`) et confirmer avec l'utilisateur s'il n'est pas explicite.
3. **Identifier l'angle narratif.** Une seule idée directrice par récit : quel fil conducteur le lecteur emporte-t-il en partant ?
4. **Construire la structure** adaptée au format (voir `references/editorial-formats.md`).
5. **Rédiger** en suivant `references/tone-and-voice.md`.
6. **Marquer la provenance** dans le texte lorsque c'est utile (incertitudes, hypothèses, inconnues).
7. **Fournir une version prête à relire** avec, en annexe, la liste des faits utilisés et leurs sources.

## Règles éditoriales invariantes

- **Jamais de fait non corroboré** présenté comme établi. Si l'information est incertaine, le texte le dit.
- **Jamais de citation fabriquée**, même pour « donner de la vie » au récit.
- **Jamais de dialogue radio reconstitué** présenté comme archive.
- **Public cible** : jeunes, élèves, étudiants, enseignants, passionnés sans bagage scientifique avancé.
- **Langue** : française par défaut, précise, vivante, pédagogique, jamais condescendante.
- **Longueur** proportionnée au format (voir `references/editorial-formats.md`).
- **Les quatre formats** sont la seule grille éditoriale autorisée pour la V1.

## Exemples d'ouverture (orientation)

Une ouverture SPACE LEGACY ne doit jamais commencer par un cliché générique (« Depuis toujours, l'humanité… ») ni par un énoncé neutre (« Le rover X est un rover martien… »). Elle doit **ancrer** le lecteur dans une scène, une tension, un détail concret.

- **LEGACY STORY** : commencer par une scène, un objet, une trace laissée.
- **BEHIND THE TECHNOLOGY** : commencer par le problème que la technologie résout.
- **THE FINAL CHAPTER** : commencer par le dernier instant connu.
- **SPACE FACT** : commencer par le fait brut, puis le contexte en une phrase.

## Erreurs à éviter

- Rédiger sans socle factuel validé.
- Inventer une citation ou un dialogue pour rendre le récit plus vivant.
- Transformer une hypothèse en certitude narrative.
- Utiliser des métaphores guerrières systématiques (« la conquête », « la bataille »).
- Infantiliser le lecteur par des périphrases enfantines.
- Mélanger les quatre formats dans un même texte.
- Terminer sur une morale plaquée.

## Interactions avec les autres Skills

- **Reçoit** de `space-research` un socle factuel.
- **Reçoit** de `fact-checking` un verdict de publication.
- **Alimente** `space-frontend-design` lorsque le récit devient contenu d'interface (titre, intro, légende).
- **Ne touche jamais** aux JSON du projet sans validation explicite.

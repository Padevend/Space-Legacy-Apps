---
name: space-research
description: >
  Rechercher et extraire des informations sourcées sur les équipements spatiaux
  abandonnés et les missions qui les ont déposés sur la Lune, Mars et d'autres
  corps célestes. Les JSON du projet (objets/lune/*, objets/mars/*) sont la
  source de référence prioritaire. WebFetch sur les sources institutionnelles
  NASA n'est autorisé que pour combler ce qui manque dans ces JSON. À utiliser
  avant toute rédaction éditoriale, toute affirmation factuelle, ou toute
  affiche d'une donnée technique sur l'interface.
version: 1.0.0
---

# space-research

## Rôle du Skill

Collecter de l'information scientifique et historique **traçable** sur les équipements, missions, lieux, personnes et événements du périmètre SPACE LEGACY. Ne produit jamais un fait sans source attachée.

## Quand l'utiliser

- Avant d'écrire une fiche équipement ou un récit éditorial.
- Avant d'afficher une date, un chiffre, une mesure, une citation dans l'interface.
- Lorsqu'un équipement, une mission ou un événement est mentionné et qu'on ne dispose pas encore d'information consolidée.
- En amont de `fact-checking` quand on part de zéro.
- En amont de `space-storytelling` pour fournir le socle factuel.

## Procédure

1. **Lire les JSON du projet en priorité.** Chercher l'équipement ou la mission dans `objets/lune/*.json` et `objets/mars/*.json`. Ces fichiers sont la source de vérité du projet.
2. **Extraire proprement.** Identifier dans le JSON les champs utiles (nom, mission, dates, mesures, événements, sources). Noter leur emplacement exact.
3. **Qualifier chaque fait** selon `references/provenance-levels.md` : fait confirmé par source, information rapportée non corroborée, hypothèse, interprétation, inconnue.
4. **Repérer les lacunes.** Lister précisément ce qui manque pour répondre à la demande.
5. **Compléter par WebFetch si et seulement si nécessaire.** Autorisé uniquement sur les sources institutionnelles listées dans `references/nasa-sources.md`. Interdit sur Wikipedia, blogs, agrégateurs, forums.
6. **Enregistrer les sources** de façon réutilisable : URL, titre, organisme, date d'accès.
7. **Produire une fiche de recherche** structurée avec, pour chaque fait : énoncé, niveau de provenance, source.

## Format de sortie attendu

```
Sujet : [nom de l'équipement ou de la mission]
Source de référence projet : [chemin du JSON]

Faits consolidés :
- [énoncé] — [niveau: confirmé | rapporté | hypothèse | interprétation] — [source]
- ...

Lacunes identifiées :
- [ce qui manque et pourquoi c'est bloquant]

Sources externes consultées (si applicable) :
- [titre] — [URL] — [organisme] — [date d'accès]

Points à ne pas affirmer en l'état :
- [information non corroborée ou absente]
```

## Règles de provenance

- Une **réponse générée par une IA n'est jamais une preuve scientifique.** Elle n'entre pas dans les faits consolidés.
- **Ne jamais fabriquer** une citation, une télémétrie, un dialogue radio, une date.
- **Ne jamais présenter** une reconstitution comme une archive authentique.
- **Distinguer systématiquement** une mission, un équipement, un instrument et une archive documentaire — ce sont quatre objets différents.
- **Ne pas confondre** le statut opérationnel d'un équipement (en service, hors service, perdu) avec son état physique (intact, endommagé, inconnu).

## Exemples

### Exemple 1 — Demande dans le périmètre JSON

> *« Donne-moi les faits consolidés sur Sojourner. »*

Lire `objets/mars/sojourner-rover.json`. Extraire mission, date de déploiement, masse, durée de vie opérationnelle, lieu, statut final. Qualifier chaque fait. Noter toute lacune. Ne pas aller chercher ailleurs si tout est présent.

### Exemple 2 — Lacune ciblée

> *« Je veux la distance exacte parcourue par Opportunity, le JSON ne la donne pas. »*

Identifier la lacune. WebFetch sur une page NASA/JPL ou NSSDCA de la liste autorisée. Noter l'URL, la date, l'organisme. Qualifier le fait comme confirmé par source institutionnelle. Ne pas prendre un chiffre d'un agrégateur même s'il apparaît plus vite.

### Exemple 3 — Information non disponible

> *« Quelle était la dernière mesure télémétrique transmise par Spirit avant son silence ? »*

Si aucun JSON ni aucune source autorisée ne donne la mesure exacte : répondre **inconnu**, jamais inventer une valeur plausible.

## Erreurs à éviter

- Mélanger une information lue dans un JSON avec une interprétation personnelle sans le signaler.
- WebFetch avant d'avoir lu le JSON du projet.
- WebFetch sur une source non listée dans `references/nasa-sources.md`.
- Omettre la date d'accès d'une source externe.
- Présenter une réponse générée par IA comme un fait établi.
- Transformer une hypothèse en certitude en reformulant la phrase.
- Attribuer un fait à une mission ou un équipement mal identifié.

## Interactions avec les autres Skills

- **Alimente** `fact-checking` qui vérifiera ou contredira les faits consolidés.
- **Alimente** `space-storytelling` qui transformera ces faits en narration éditoriale.
- **Ne modifie jamais** les JSON du projet sans validation explicite de l'utilisateur.

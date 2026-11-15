---
name: fact-checking
description: >
  Vérifier les dates, chiffres, affirmations, citations et attributions utilisés
  dans les contenus SPACE LEGACY. Compare les sources, identifie les
  contradictions, signale les incertitudes et bloque toute publication
  reposant sur une information non corroborée. À utiliser avant toute
  publication éditoriale, toute mise à jour de fiche équipement, ou toute
  affirmation chiffrée affichée dans l'interface.
version: 1.0.0
---

# fact-checking

## Rôle du Skill

Auditer une information **existante** (venant d'un brouillon, d'un JSON, d'une citation ou d'un récit) et statuer sur sa fiabilité. `space-research` produit, `fact-checking` audite. Les deux Skills ne se substituent pas l'un à l'autre.

## Quand l'utiliser

- Avant toute publication : récit, fiche équipement, script audiovisuel, chronologie.
- Lorsqu'une affirmation chiffrée apparaît dans l'interface.
- Lorsqu'on doit comparer deux sources qui se contredisent.
- Lorsqu'un utilisateur ou un relecteur signale un doute.
- Avant d'intégrer une nouvelle information dans un JSON du projet.

## Procédure

1. **Lister les affirmations vérifiables** du contenu à auditer. Une affirmation = une phrase factuelle, un chiffre, une date, une citation, une attribution.
2. **Pour chaque affirmation** :
   - Rechercher la source citée. Si absente, marquer `[SOURCE MANQUANTE]`.
   - Confronter à la source. Vérifier libellé exact, chiffre, date, unité.
   - Comparer, si possible, à une seconde source institutionnelle indépendante.
3. **Qualifier le résultat** selon le tableau ci-dessous.
4. **Produire un rapport** structuré et actionnable.
5. **Ne jamais corriger silencieusement.** Toute correction est signalée et validée par l'utilisateur.

## Qualification des affirmations

| Verdict | Signification | Action |
|---|---|---|
| **Confirmé** | Au moins une source primaire corrobore exactement. | Autoriser la publication. |
| **Corroboré partiellement** | Source présente, mais chiffre, unité ou date approximatifs. | Préciser ou arrondir explicitement. |
| **Contradictoire** | Deux sources fiables donnent des valeurs incompatibles. | Signaler les deux versions, ne pas trancher sans validation. |
| **Non corroboré** | Aucune source fiable retrouvée. | Retirer, reformuler en hypothèse, ou attendre validation. |
| **Fabriqué** | Information clairement inventée (citation introuvable, date fictive). | Bloquer, documenter dans `CONTEXT.md`. |

## Format du rapport

```
Document audité : [titre ou identifiant]
Date de l'audit : YYYY-MM-DD

Affirmations vérifiées : N
Statuts : X confirmés, Y corroborés partiellement, Z contradictoires, W non corroborés, V fabriqués.

Détail :
1. [affirmation] — [verdict] — [source(s) consultée(s)] — [note éventuelle]
2. ...

Bloqueurs pour publication :
- [liste des affirmations à traiter avant mise en ligne]

Recommandations :
- [actions concrètes]
```

## Exemples

### Exemple 1 — Affirmation chiffrée

Contenu : *« Opportunity a parcouru 45,16 km sur Mars. »*

- Source citée : aucune.
- Vérification : `objets/mars/spirit-et-opportunity.json` donne un chiffre. NASA/JPL confirme une distance proche.
- Verdict : **Corroboré partiellement** (unité et arrondi à préciser).
- Recommandation : indiquer la source, ajouter la date de fin de mission qui borne la distance totale.

### Exemple 2 — Citation historique

Contenu : *« Comme l'a dit un ingénieur du JPL : "Nous n'avions pas prévu qu'il tiendrait si longtemps." »*

- Source citée : aucune, ingénieur non nommé.
- Vérification : citation introuvable dans les archives publiques du JPL.
- Verdict : **Fabriqué** (ou à tout le moins **non corroboré**).
- Recommandation : retirer la citation. Ne pas la reformuler pour la sauver — c'est une fabrication.

### Exemple 3 — Contradiction entre sources

Contenu : *« Le LRV-1 a été abandonné à Hadley Rille le 2 août 1971. »*

- Source A : NASA NSSDCA confirme la date et le site.
- Source B : un document annexe donne un site légèrement différent.
- Verdict : **Contradictoire**.
- Recommandation : signaler les deux versions, demander arbitrage à l'utilisateur. Ne pas trancher.

## Erreurs à éviter

- Corriger un chiffre sans le signaler.
- Considérer qu'une source secondaire suffit pour confirmer.
- Reformuler une affirmation fabriquée pour la rendre « acceptable ».
- Laisser passer une citation sans attribution exacte.
- Comparer une mesure sans vérifier qu'elle utilise la même unité et la même méthode.
- Prétendre avoir vérifié sans trace de la source consultée.

## Interactions avec les autres Skills

- **Reçoit** les sorties de `space-research` et les audite.
- **Conditionne** `space-storytelling` : aucun fait non corroboré n'entre dans un récit publié.
- **Bloque** toute mise à jour d'un JSON du projet si elle contient une affirmation fabriquée ou contradictoire non résolue.

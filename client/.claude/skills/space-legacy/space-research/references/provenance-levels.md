# Niveaux de provenance

Chaque fait manipulé par les Skills SPACE LEGACY est qualifié par l'un de ces cinq niveaux. Le niveau accompagne toujours l'énoncé lors de la restitution.

## Les cinq niveaux

| Niveau | Définition | Exemple |
|---|---|---|
| **Confirmé** | Fait énoncé par une source primaire ou institutionnelle listée, non contredit. | *Apollo 11 s'est posé sur la Lune le 20 juillet 1969 — NASA, NSSDCA.* |
| **Rapporté** | Information rapportée par une source secondaire crédible mais non confirmée par une source primaire, ou mesure dont l'unité ou la méthode est discutée. | *Opportunity aurait parcouru environ 45 km, chiffre arrondi variant selon les sources.* |
| **Hypothèse** | Explication plausible non prouvée, formulée comme telle par la communauté scientifique. | *Spirit se serait ensablé dans une zone de sable mou, son silence suivant une période d'hivernation sans ensoleillement suffisant.* |
| **Interprétation** | Analyse éditoriale, mise en perspective, choix narratif. N'est pas un fait brut. | *Cet instrument marque une rupture dans l'approche robotique des années 1990.* |
| **Inconnu** | Information absente ou non vérifiable. L'absence est explicite, jamais comblée par supposition. | *L'état physique actuel du LRV-1 reste inconnu.* |

## Règles de qualification

- Une donnée **numérique** sans unité n'est pas confirmée. L'unité fait partie de la source.
- Une **date** doit être qualifiée dans son calendrier d'origine (UTC pour les missions récentes) et son niveau de précision (jour, heure, minute).
- Une **citation** sans attribution exacte (auteur, document, date) est traitée comme **inconnue**, pas comme rapportée.
- Une **mesure télémétrique** reconstituée n'est jamais présentée comme rapportée : elle est une interprétation, au mieux.
- Un **événement interprétatif** (« la mission a été un succès ») n'est pas un fait brut, c'est une interprétation.

## Codage dans les sorties

Lors d'une restitution, on utilise un marqueur court :

```
[CONFIRMÉ]     Apollo 11 s'est posé le 20 juillet 1969.
[RAPPORTÉ]     Distance parcourue par Opportunity ≈ 45 km.
[HYPOTHÈSE]    Spirit aurait été piégé dans une zone de sable mou.
[INTERPRÉTATION] La mission a inauguré l'ère des rovers autonomes.
[INCONNU]      État physique actuel du LRV-1.
```

Ce codage est repris tel quel dans les interactions entre `space-research`, `fact-checking` et `space-storytelling`.

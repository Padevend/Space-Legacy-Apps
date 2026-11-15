---
name: space-legacy-architecture
description: >
  Architecture logicielle et organisation du projet SPACE LEGACY. À utiliser
  lorsqu'il faut décider de l'emplacement d'un module, arbitrer une structure
  de code, valider une convention de nommage, ou évaluer l'impact d'un choix
  technique sur la maintenabilité et l'évolutivité. Ne décide pas à la place
  de l'utilisateur sur des points structurants : propose, explique, demande validation.
version: 1.0.0
scope: frontend
---

# space-legacy-architecture

## Rôle du Skill

Ce Skill agit comme architecte logiciel pour SPACE LEGACY. Il gouverne :
- L'organisation des dossiers et modules.
- Les conventions de nommage (fichiers, composants, routes, styles).
- Les arbitrages techniques et leur justification écrite.
- La maintenabilité à moyen terme et l'évolutivité vers la V2.

Il ne produit pas de code métier. Il **structure le terrain** sur lequel les autres Skills travaillent.

## Quand l'utiliser

Déclencher ce Skill dans les situations suivantes :
- Au démarrage d'une nouvelle fonctionnalité qui touche plus d'un fichier.
- Avant de créer un nouveau module, composant partagé, utilitaire ou dossier.
- Lorsqu'un choix technique doit être arbitré (bibliothèque, pattern, approche).
- Lorsqu'une duplication ou une contradiction apparaît entre deux parties du code.
- Avant de modifier une convention existante ou une structure validée.

Ne pas déclencher ce Skill pour :
- La rédaction d'un composant isolé déjà spécifié (c'est `space-frontend-design`).
- La recherche d'information scientifique (c'est `space-research`).
- La vérification de faits (c'est `fact-checking`).

## Procédure

1. **Reformuler le besoin** en une phrase, sans jargon. Si le besoin reste flou, poser une question unique et précise.
2. **Examiner l'existant** : lire le ou les fichiers concernés, repérer les conventions déjà en usage, lister les dépendances.
3. **Identifier les contraintes applicables** issues des instructions permanentes (séparation des responsabilités, modularité, absence d'abstractions prématurées, HTML/CSS/JS Vanilla pour le frontend).
4. **Proposer une structure** : arborescence, nommage, responsabilités. L'écrire explicitement avant d'écrire du code.
5. **Justifier chaque choix structurant** en une ou deux phrases : quel problème il résout, quelles alternatives ont été écartées et pourquoi.
6. **Attendre validation** lorsque la décision change la structure globale, introduit une dépendance externe, ou modifie une convention validée.
7. **Documenter la décision** dans `.claude/CONTEXT.md` (section *Décisions validées* ou *Points ouverts*).

## Principes directeurs

- **Préférer l'explicite à l'implicite.** Un dossier nommé pour ce qu'il fait vaut mieux qu'un découpage technique abstrait.
- **Pas de framework caché.** Si le projet reste en Vanilla, ne pas introduire de système de build complexe sans justification écrite et validée.
- **Modularité juste suffisante.** Un composant devient partagé quand il est réellement réutilisé deux fois, pas avant.
- **Nommage en anglais, commentaires en français acceptés** (cohérent avec les instructions permanentes).
- **Toute convention nouvelle est écrite une fois**, dans `CONTEXT.md` ou dans un `README.md` local, puis référencée ailleurs.

## Arborescence frontend recommandée (proposition initiale, à valider)

```
frontend/
├── index.html
├── pages/
│   ├── home.html
│   ├── catalog.html
│   └── equipment.html
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── styles/
│   ├── tokens.css          (variables : couleurs, typographie, espacements)
│   ├── base.css            (reset + éléments HTML)
│   ├── components/
│   └── pages/
├── scripts/
│   ├── core/               (router, state, fetch)
│   ├── components/         (composants JS réutilisables)
│   └── pages/              (logique spécifique à une page)
└── data/                   (JSON du projet, lus côté client)
```

Cette arborescence est une **proposition**, pas une décision figée. À confirmer avec l'utilisateur avant que les autres Skills s'en servent comme référence.

## Exemples

### Exemple 1 — Demande ambiguë

> *« Où je mets le composant carte équipement ? »*

Réponse attendue : lire la structure actuelle, confirmer qu'il s'agit d'un composant visuel réutilisable, proposer `frontend/styles/components/equipment-card.css` + `frontend/scripts/components/equipment-card.js`, justifier en une phrase (composant réutilisé sur la home et le catalogue), demander validation si la convention n'est pas encore écrite.

### Exemple 2 — Arbitrage technique

> *« On ajoute un router JS ou pas ? »*

Réponse attendue : rappeler que le projet est en Vanilla, lister 2 alternatives (routing côté serveur sur chaque page HTML vs mini-router JS maison), comparer sur 3 axes (complexité, SEO, performance), recommander l'option la plus simple compatible V1, demander validation explicite avant d'implémenter.

## Erreurs à éviter

- Imposer une bibliothèque ou un framework sans justification écrite.
- Créer une abstraction « au cas où » sans usage réel immédiat.
- Modifier une convention existante sans l'écrire dans `CONTEXT.md`.
- Dupliquer une responsabilité entre deux dossiers.
- Mélanger logique de présentation et logique de données dans le même fichier.
- Prétendre qu'une décision est validée sans confirmation de l'utilisateur.

## Interactions avec les autres Skills

- **Précède** `space-frontend-design` : la structure doit être posée avant d'écrire les composants.
- **Déclenche** `space-security-review` lorsqu'une décision d'architecture a des implications de sécurité (gestion de secrets, routes administratives, upload).
- **Met à jour** `CONTEXT.md` à chaque décision structurante.

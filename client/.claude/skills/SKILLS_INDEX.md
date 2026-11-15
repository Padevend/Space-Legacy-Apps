# SPACE LEGACY — Index des Skills

Ce document décrit chaque Skill de la collection, précise quand l'utiliser, comment le déclencher, et avec quels autres Skills il se combine.

---

## Organisation du dossier

```
.claude/
├── CONTEXT.md                        Journal des décisions et état courant
├── INSTALL.md                        Guide d'installation Claude Desktop / Claude Code
└── skills/
    ├── SKILLS_INDEX.md               ← ce document
    ├── generic/                      Skills génériques (hors métier SPACE LEGACY)
    │   ├── canvas-design/
    │   ├── theme-factory/
    │   └── frontend-design/
    └── space-legacy/                 Skills métier SPACE LEGACY
        ├── space-legacy-architecture/
        ├── space-research/
        ├── fact-checking/
        ├── space-storytelling/
        └── space-frontend-design/
```

---

## Skills métier

### `space-legacy-architecture`

- **Rôle.** Architecture logicielle globale, organisation, nommage, arbitrages techniques.
- **Déclencher quand.** On crée un nouveau module, on arbitre une structure, on introduit une convention, on change une décision structurante.
- **Exemple de prompt.** *« Où placer le composant chronologie partagé ? Propose une arborescence et justifie. »*
- **Complémentaires.** Précède `space-frontend-design`. Peut appeler `space-security-review` (hors périmètre V1 actuel).

### `space-research`

- **Rôle.** Recherche d'information sourcée à partir des JSON du projet et, si nécessaire, des sources NASA listées.
- **Déclencher quand.** Besoin d'un socle factuel avant toute rédaction ou tout affichage de donnée technique.
- **Exemple de prompt.** *« Donne-moi les faits consolidés sur Sojourner, au niveau de provenance. »*
- **Complémentaires.** Alimente `fact-checking`, `space-storytelling`.

### `fact-checking`

- **Rôle.** Audit des affirmations, détection des incertitudes et contradictions, blocage des informations fabriquées.
- **Déclencher quand.** Avant publication, avant affichage d'un chiffre dans l'interface, lorsqu'un doute est signalé.
- **Exemple de prompt.** *« Audite ce brouillon de LEGACY STORY avant publication. »*
- **Complémentaires.** Suit `space-research`. Conditionne `space-storytelling`.

### `space-storytelling`

- **Rôle.** Rédaction éditoriale selon les 4 formats SPACE LEGACY (LEGACY STORIES, BEHIND THE TECHNOLOGY, THE FINAL CHAPTER, SPACE FACTS).
- **Déclencher quand.** On rédige un contenu éditorial, une chronologie narrative, un script, un texte d'interface.
- **Exemple de prompt.** *« Écris un BEHIND THE TECHNOLOGY de 600 mots sur la caméra du LRV, avec les sources jointes. »*
- **Complémentaires.** Dépend de `space-research` et de `fact-checking`. Alimente `space-frontend-design`.

### `space-frontend-design`

- **Rôle.** Code d'interface HTML/CSS/JS Vanilla, identité visuelle Cosmic Editorial, responsive, accessibilité.
- **Déclencher quand.** Création ou modification d'un écran, d'un composant, d'une interaction.
- **Exemple de prompt.** *« Crée la carte équipement pour la page catalogue, en respectant les tokens. »*
- **Complémentaires.** Précédé par `space-legacy-architecture`. Appelle au besoin `frontend-design`, `theme-factory`, `canvas-design`.

---

## Skills génériques

### `canvas-design`

- **Rôle.** Création d'artefacts visuels PNG/PDF à partir d'une philosophie de design.
- **Déclencher quand.** Besoin d'un poster, d'une planche, d'un visuel statique autonome.
- **Exemple de prompt.** *« Génère un poster A2 pour l'exposition LEGACY STORIES autour de Sojourner. »*

### `theme-factory`

- **Rôle.** Application d'un thème (palette + typographies) à un artefact.
- **Déclencher quand.** On veut tester une variation visuelle, styliser rapidement un artefact autonome.
- **Exemple de prompt.** *« Applique le thème Midnight Galaxy à ce deck. »*

### `frontend-design`

- **Rôle.** Direction visuelle distinctive, anti-templating, principes typographiques et de composition.
- **Déclencher quand.** On conçoit une nouvelle UI et on veut éviter les défauts d'IA.
- **Exemple de prompt.** *« Revois la page d'accueil et signale ce qui ressemble à un défaut de templating. »*

---

## Chaîne d'interactions

```
          ┌──────────────────────┐
          │ space-research       │
          │ (produit des faits)  │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ fact-checking        │
          │ (audite les faits)   │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ space-storytelling   │
          │ (met en récit)       │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ space-frontend-design│
          │ (met à l'écran)      │
          └──────────┬───────────┘
                     │
                     ▼
              frontend-design
              theme-factory
              canvas-design
            (outils génériques)

          space-legacy-architecture
          gouverne l'ensemble (structure, conventions)
```

---

## Prompts d'orchestration recommandés

### Préparer un nouveau LEGACY STORY

> *« Je veux écrire un LEGACY STORY sur [équipement]. Utilise space-research pour consolider les faits, puis fact-checking pour les valider, puis space-storytelling pour rédiger. Donne-moi le socle factuel avant la rédaction. »*

### Intégrer un écran

> *« Je veux intégrer la page détail équipement. Utilise space-legacy-architecture pour valider l'emplacement, puis space-frontend-design pour coder le composant principal, en consultant frontend-design pour éviter les défauts d'IA. »*

### Auditer un contenu existant

> *« Audite ce brouillon avec fact-checking. Liste chaque affirmation, son verdict, et les bloqueurs de publication. »*

### Essayer une variation visuelle

> *« Avant de valider la palette, propose deux variantes avec theme-factory et compare-les au Cosmic Editorial actuel. »*

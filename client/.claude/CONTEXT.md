# SPACE LEGACY — Contexte de travail

> Journal des décisions structurantes et état courant du système de Skills.
> Mis à jour à chaque modification importante.

---

## État courant

- **Branche active** : `frontend`
- **Périmètre en cours** : Frontend uniquement (backend, base de données et audit sécurité reportés)
- **Dernière mise à jour** : 2026-11-15 — Initialisation du système de Skills

---

## Décisions validées

| # | Décision | Date | Statut |
|---|---|---|---|
| D-001 | Emplacement des Skills : `.claude/skills/` à la racine du dépôt | 2026-11-15 | Validée |
| D-002 | Séparation `space-legacy/` (métier) et `generic/` (outils externes) | 2026-11-15 | Validée |
| D-003 | Frontmatter avec champ `version` obligatoire | 2026-11-15 | Validée |
| D-004 | `space-research` peut utiliser WebFetch uniquement pour combler les manques des JSON du projet | 2026-11-15 | Validée |
| D-005 | Fichier `CONTEXT.md` maintenu à chaque modification importante | 2026-11-15 | Validée |
| D-006 | Périmètre V1 limité à 5 équipements, 3 avec traitement approfondi | depuis `projet_context.txt` | Validée |

---

## Points encore ouverts

| # | Sujet | Impact |
|---|---|---|
| O-001 | Choix définitif du framework backend (Express, Fastify, NestJS…) | Backend |
| O-002 | Choix définitif de l'ORM (Prisma présent dans le dépôt mais pas confirmé) | Base de données |
| O-003 | Choix de la stratégie d'authentification | Sécurité |
| O-004 | Validation finale de la direction visuelle (Cosmic Editorial vs rétro-futuriste) | Frontend |
| O-005 | Liste définitive des 5 équipements de la V1 | Contenu |

---

## Skills créés

### Génériques (`.claude/skills/generic/`)

| Skill | Rôle | Version |
|---|---|---|
| `canvas-design` | Création d'artefacts visuels PNG/PDF à partir d'une philosophie de design | 1.0.0 |
| `theme-factory` | Application de thèmes colorimétriques et typographiques à des artefacts | 1.0.0 |
| `frontend-design` | Direction visuelle distinctive et non templatée pour des UI web | 1.0.0 |

### Métier SPACE LEGACY (`.claude/skills/space-legacy/`)

| Skill | Rôle | Version |
|---|---|---|
| `space-legacy-architecture` | Architecture logicielle, organisation, décisions techniques | 1.0.0 |
| `space-research` | Recherche sourcée sur les équipements spatiaux abandonnés | 1.0.0 |
| `fact-checking` | Vérification des affirmations, détection des incertitudes | 1.0.0 |
| `space-storytelling` | Narration éditoriale selon les 4 formats SPACE LEGACY | 1.0.0 |
| `space-frontend-design` | Composants HTML/CSS/JS Vanilla, Cosmic Editorial, accessibilité | 1.0.0 |

### À concevoir ultérieurement (hors périmètre frontend)

- `space-backend-engineering`
- `space-database-engineering`
- `space-security-review`

---

## Chaîne d'interactions

```
Recherche              Vérification           Narration
space-research    →    fact-checking    →    space-storytelling
                             ↓
                   (publication bloquée si incertitudes)

                space-legacy-architecture
                           ↓
                 space-frontend-design
                     ↓            ↓
            frontend-design   canvas-design + theme-factory
                              (artefacts visuels ponctuels)
```

---

## Journal des modifications

### 2026-11-15 — Initialisation
- Création de la structure `.claude/skills/`
- Intégration des 3 Skills génériques fournis : `canvas-design`, `theme-factory`, `frontend-design`
- Création des 5 Skills métier du périmètre frontend
- Documentation : `SKILLS_INDEX.md`, `INSTALL.md`

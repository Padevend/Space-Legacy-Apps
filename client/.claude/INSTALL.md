# SPACE LEGACY — Guide d'installation des Skills

Ce guide décrit comment rendre les Skills de `.claude/skills/` disponibles pour Claude Desktop et Claude Code.

---

## Prérequis

- Le dépôt est cloné localement.
- Le dossier `.claude/skills/` est à la racine du dépôt.
- Branche de travail : `frontend` (ou la branche où vous souhaitez activer les Skills).

---

## Claude Code

Claude Code détecte automatiquement un dossier `.claude/` à la racine du projet ouvert. Les Skills présents dans `.claude/skills/` deviennent accessibles lorsque la session est lancée depuis la racine du dépôt.

### Vérification

1. Ouvrir un terminal à la racine du dépôt.
2. Lancer Claude Code depuis cette racine.
3. Demander : *« Quels Skills sont disponibles dans ce projet ? »*
4. La liste doit inclure les 8 Skills (3 génériques + 5 métier).

### Invocation

Dans une conversation Claude Code :

```
/skill space-research
```

Ou en langage naturel :

> *« Utilise space-storytelling pour rédiger un LEGACY STORY sur Sojourner. »*

Claude Code chargera le `SKILL.md` correspondant et suivra ses instructions.

---

## Claude Desktop

Claude Desktop lit les Skills attachés au projet (ici `Space_Legacy`). Deux modes possibles.

### Mode 1 — Skills fournis via le dépôt (recommandé)

Si Claude Desktop est connecté à la machine via le pont de fichiers et pointe sur le dossier du dépôt, les Skills présents dans `.claude/skills/` sont accessibles comme ressources du projet.

Demander dans Claude Desktop :

> *« Vérifie que tu as accès aux Skills du dossier `.claude/skills/` de Space_Legacy. »*

Si la vérification échoue, Claude Desktop ne lit pas ce dossier automatiquement : passer au mode 2.

### Mode 2 — Skills attachés au projet Claude.ai

Les Skills peuvent être publiés comme ressources du projet `Space_Legacy` sur claude.ai :

1. Zipper chaque dossier de Skill (`generic/canvas-design.zip`, etc.).
2. Les déposer dans l'onglet *Project files* du projet `Space_Legacy`.
3. Dans les instructions du projet, mentionner la présence de ces Skills et leurs noms.

Cette méthode rend les Skills disponibles sur toutes les surfaces liées au projet.

---

## Vérifications post-installation

Après activation, poser à Claude les questions suivantes pour contrôler l'accès :

- *« Liste les Skills disponibles pour ce projet. »*
- *« Résume le rôle de `space-research` et de `fact-checking`. »*
- *« Quelles sont les sources autorisées pour `space-research` ? »*

Les réponses doivent correspondre au contenu des `SKILL.md` et des `references/`.

---

## Mise à jour

À chaque modification d'un Skill :

1. Mettre à jour le champ `version` dans le frontmatter si le changement est significatif.
2. Ajouter une ligne dans `CONTEXT.md` (section *Journal des modifications*).
3. Commiter les changements sur la branche active.
4. Redémarrer Claude Code si nécessaire pour recharger les Skills.

---

## Désactiver temporairement un Skill

- **Claude Code** : renommer le dossier avec un préfixe `_disabled-` (par exemple `_disabled-canvas-design/`).
- **Claude Desktop (mode 2)** : retirer le fichier du projet claude.ai.

Documenter la désactivation dans `CONTEXT.md`.

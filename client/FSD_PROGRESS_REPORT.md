# 🛰️ SPACE LEGACY — Rapport d'Avancement FSD Frontend (V1)

**Date :** 15 Novembre 2026  
**Architecture :** **Feature-Sliced Design (FSD)**  
**Gestionnaire de paquets :** **pnpm v12.21.0** (avec `pnpm-lock.yaml`)  
**Stack :** React 18 / TypeScript / Tailwind CSS / Vite  
**Branche Git :** `frontend`  
**Derniers Commits :**
- `cc5cbe2` : *chore(frontend): switch package manager to pnpm with verified pnpm-lock.yaml*
- `ffab0b3` : *docs(frontend): add FSD architecture progress report*
- `49b85df` : *feat(frontend): implement React TypeScript frontend with FSD architecture and NASA retro-futurist design*

---

## 1. 🏗️ Découpage Strict selon la Norme FSD

L'architecture du frontend respecte désormais les couches et règles de dépendance descendantes de la norme **Feature-Sliced Design** :

```
frontend/src/
├── app/                  # Initialisation globale, styles, orchestration racine
│   ├── App.tsx
│   └── index.ts
├── pages/                # Écrans assemblés (compositions de widgets & features)
│   ├── home/             # Page d'accueil narrative & immersive (Hero, Counters, Formats)
│   ├── catalogue/        # Exploration des 5 équipements avec recherche et filtres
│   ├── equipment-detail/ # Fiche technique complète, spécifications, sources, timeline
│   └── story/            # Récits éditoriaux immersifs & simulateur de télémétrie laser
├── widgets/              # Blocs d'interface autonomes
│   ├── navbar/           # Navigation sticky avec indicateur mission & bascule de thème
│   └── footer/           # Crédits institutionnels NASA Space Apps, sources primaires
├── entities/             # Modèles métier et leurs représentations UI
│   ├── equipment/        # Carte d'équipement (EquipmentCard), statuts découplés
│   └── event/            # Chronologie des missions (Timeline, nodes terminaux en rouge)
└── shared/               # Code réutilisable sans logique métier
    ├── api/              # Couche d'accès aux données (mock initial & client REST ready)
    ├── types/            # Types stricts miroir direct de schema.prisma (11 modèles + enums)
    └── ui/               # Primitives graphiques (Badge avec variantes de provenance, Button)
```

---

## 2. 📦 Utilisation avec `pnpm`

Le projet est entièrement configuré pour **pnpm** :
* `pnpm-lock.yaml` est généré, verrouillé et commité.
* Les scripts de compilation post-install (`esbuild`) sont approuvés.
* Le dev server démarre en moins de 500 ms.

### Commandes usuelles :
```powershell
cd c:\Users\SAMYTECH\Desktop\Space_legacy\frontend

# Installer les dépendances
pnpm.cmd install

# Lancer le serveur de développement Vite
pnpm.cmd dev

# Compiler le projet en production
pnpm.cmd build

# Prévisualiser le build de production
pnpm.cmd preview
```
*(Sur Windows PowerShell, utiliser `pnpm.cmd` si les scripts `.ps1` sont bloqués par l'ExecutionPolicy).*

---

## 3. 🎯 Réalisations Validées

1. **Conformité stricte au contrat `schema.prisma` :**
   - Aucune dépendance en dur : les statuts physique (`PhysicalStatus`) et opérationnel (`OperationalStatus`) sont obligatoirement distincts.
   - Les badges de provenance des médias (`NASA_ARCHIVE`, `3D_RECONSTRUCTION`, etc.) sont intégrés.
   - Les unités et mesures scientifiques (`mass`, `duration`, `distance`) sont explicitées.

2. **Direction Visuelle NASA Retro-Futurist :**
   - Palette : Fond `#0F172A`, Bleu NASA `#2E3192`, Rouge `#C82027`, Cyan télémétrie `#38BDF8`.
   - Typographies chargées : **Fraunces** (titres), **Inter** (UI), **Syne Mono / IBM Plex Mono** (données techniques).
   - Texture de grille géométrique subtile en arrière-plan.

3. **Intégration des Données réelles V1 :**
   - Données complètes intégrées pour **Apollo 11 Eagle & EASEP**, **Opportunity (MER-B)**, **Surveyor 3**, **Ingenuity** et **Viking 1**.
   - Simulateur de télémétrie laser Terre-Lune fonctionnel dans la Story Apollo 11.

4. **Qualité & Build :**
   - Compilation TypeScript stricte sans aucun warning (`pnpm.cmd build` validé).
   - Tout le code est versionné sur la branche `frontend` avec convention *Conventional Commits*.

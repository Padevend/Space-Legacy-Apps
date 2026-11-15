# 🛰️ SPACE LEGACY — Document de Transmission & Avancement Frontend (V1)

**Date :** 15 Novembre 2026  
**Destinataire :** Agent de développement Frontend prenant le relais  
**Projet :** NASA Space Apps Challenge 2026 — *Abandoned but not Forgotten*  
**Stack confirmée :** **React 18 + TypeScript + Tailwind CSS + Vite** (architecture modulaire prête pour API REST Hono.js)

---

## 1. 📌 Synthèse de l'état d'avancement actuel

### Ce qui est en place et validé :
1. **Socle documentaire & Technique :**
   - Schéma de base de données PostgreSQL consolidé dans `schema.prisma` à la racine (11 entités + tous les enums stricts : `MissionStatus`, `EquipmentType`, `OperationalStatus`, `PhysicalStatus`, `EventType`, `DatePrecision`, etc.).
   - Cahier des charges consolidé v2.0 (`cahier-des-charges.md`).
   - Guide et charte visuelle validée (`couleur défini.odt` + `space-frontend-design`).

2. **Environnement Frontend initialisé (`frontend/`) :**
   - **`package.json`** configuré et dépendances installées avec succès (`react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`, `vite`, `typescript`, `tailwindcss`, `autoprefixer`, `postcss`).
   - **`vite.config.ts`** & **`tsconfig.json`** configurés avec alias `@/` pointant vers `src/`.
   - **`tailwind.config.js`** configuré avec la palette **NASA Retro-Futurist** (couleurs `nasa.blue`, `nasa.red`, échelle `space-950` à `space-light`, `signal`, polices `display`, `sans`, `mono`, `tech`).
   - **`index.html`** avec imports des Google Fonts cibles (**Fraunces**, **Inter**, **Syne Mono**, **IBM Plex Mono**, **Space Grotesk**).
   - **Tokens CSS & Grille rétro** configurés dans `src/styles/index.css`.
   - **Contrat TypeScript (`src/types/models.ts`)** : 100% fidèle au `schema.prisma` pour garantir un découplage total et un branchement immédiat de l'API REST sans refactor.

3. **Sources de Données identifiées & disponibles :**
   - Fiches documentaires nettoyées de référence : `Downloads/Compressed/fiches-nettoyees/` (`opportunity.json`, `ingenuity.json`, `viking-1.json`).
   - Données brutes et extractions globales : `frontend/objets/` (`lune/` et `mars/`).
   - Données d'ingénierie et de storytelling interactif : `frontend/maquette.html` (Apollo 11 Eagle, EASEP, télémétrie laser, chronologie TU).

---

## 2. 🎨 Charte Visuelle & Système de Design

### Palette NASA Retro-Futurist
* **Mode Sombre (Défaut immersif) :**
  - Fond dominant : `#0F172A` (et dégradé `#050816` à `#030611`)
  - Surfaces / Cartes : `#141B2D` / `#1F2A44`
  - Couleur primaire (NASA Blue) : `#2E3192`
  - Accent vif (Actions, Badges, Alertes) : `#C82027`
  - Textes : `#FFFFFF` (titres/corps), `#94A3B8` (secondaire), `#64748B` (métadonnées)
* **Mode Clair (Secondaire) :**
  - Fond : `#F8FAFC`, Surfaces : `#FFFFFF`, Texte : `#1E293B`, Bordures : `#CBD5E1`.

### Règles d'Intégrité Pédagogique (Non négociables)
* **Statuts découplés :** Toujours afficher séparément `operationalStatus` (ex. `MISSION_ENDED`) et `physicalStatus` (ex. `LEFT_ON_SURFACE`).
* **Provenance obligatoire sur chaque média :** `NASA_ARCHIVE`, `3D_RECONSTRUCTION`, `AI_GENERATED_ILLUSTRATION`, `DATA_VISUALIZATION`.
* **Aucune donnée inventée :** Les valeurs non documentées doivent afficher explicitement `UNDOCUMENTED` ou `UNKNOWN`.

---

## 3. 🗺️ Roadmap pour l'Agent Suivant (Phase par Phase)

### Étape 1 : Couche de Données & Client API (`src/services/`)
1. **Créer `src/services/mockData.ts` :**
   - Consolider les 5 équipements de la V1 avec leurs relations complètes (Missions, Events, Media, Locations, Measurements, Sources) :
     1. `apollo-11-lm-eagle-easep` (Lune - Lander / Science)
     2. `opportunity` (Mars - Rover)
     3. `surveyor-3` (Lune - Lander)
     4. `ingenuity` (Mars - Hélicoptère)
     5. `viking-1` (Mars - Lander / Orbiter)
2. **Créer `src/services/api.ts` :**
   - Implémenter l'interface de service simulant l'API REST :
     - `getEquipments(): Promise<Equipment[]>`
     - `getEquipmentBySlug(slug: string): Promise<Equipment | null>`
     - `getStories(): Promise<Story[]>`
     - `getStats(): Promise<{ equipmentsCount: number, missionsCount: number, yearsSpan: number, celestialBodiesCount: number }>`
   - Prévoir la bascule simple via variable d'environnement `VITE_API_BASE_URL`.

### Étape 2 : Composants Fondamentaux (`src/components/common/`)
- `Navbar.tsx` : Navigation sticky, logo Space Legacy avec indicateur mission rouge, liens (Home, Explore, Stories, About), bascule de thème.
- `Footer.tsx` : 3 colonnes, mentions institutionnelles NASA Space Apps 2026, sources officielles vérifiables.
- `Badge.tsx` : Badges typés pour statuts physiques, opérationnels et provenance des médias (font Syne Mono).
- `Button.tsx` : Variantes `primary` (#C82027), `secondary`, `mono` (rétro-tech) avec support des états focus et accessibilité.

### Étape 3 : Écran 1 — Page d'Accueil (`src/pages/HomePage.tsx`)
- **Hero Section :** Titre narratif Fraunces display (*"Every object has a story. Every mission leaves a legacy"*), fond d'archive spatiale avec texture grille subtile et boutons d'action.
- **Mission Statement :** Présentation du musée numérique.
- **Legacy Counters :** Compteurs dynamiques calculés depuis les données (équipements, missions, années, corps célestes).
- **Featured Equipments :** Mise en avant des 3 équipements phares (Eagle, Opportunity, Ingenuity) en format éditorial asymétrique.
- **Editorial Formats :** Présentation des 4 formats d'histoires (`LEGACY_STORY`, `BEHIND_THE_TECHNOLOGY`, `FINAL_CHAPTER`, `SPACE_FACT`).

### Étape 4 : Écran 2 — Catalogue (`src/pages/CataloguePage.tsx`)
- Barre de filtres (Corps céleste : Moon / Mars, Statut physique, Type d'équipement).
- Barre de recherche en temps réel avec debounce sur nom et mission.
- Grille responsive de cartes d'équipements (`EquipmentCard.tsx`).
- État vide soigné si aucun filtre ne correspond.

### Étape 5 : Écran 3 — Fiche Équipement Détaillée (`src/pages/EquipmentDetailPage.tsx`)
- En-tête avec nom officiel, NSSDCA ID, badges de statuts séparés, photo principale avec attribution.
- Spécifications techniques (masse, dimensions, puissance, instruments).
- **Composant Chronologie (`Timeline.tsx`)** : Événements chronologiques avec précision de date (`EXACT`, `MONTH_ONLY`, etc.) et mise en valeur rouge sur `LAST_SIGNAL` / `MISSION_END`.
- Galerie médias avec crédits et badges de provenance.
- Section académique des sources et documents NASA consultés.

### Étape 6 : Écran 4 — Stories & Récits Immersifs (`src/pages/StoryPage.tsx`)
- Rendu narratif éditorial long format (mise en page 65ch max, drop cap, encadrés citations).
- Schéma interactif ou simulation inspirée de `maquette.html` (ex : télémétrie laser Terre-Lune ou séparation Socle/Cabine d'Apollo 11).

---

## 4. 🚀 Commandes Utiles pour Démarrer

```powershell
# Se positionner dans le dossier frontend
cd c:\Users\SAMYTECH\Desktop\Space_legacy\frontend

# Lancer le serveur de développement Vite
npm.cmd run dev

# Vérifier le build TypeScript & Vite
npm.cmd run build
```
*(Toujours utiliser `npm.cmd` sous Windows PowerShell pour éviter les restrictions d'exécution de scripts).*

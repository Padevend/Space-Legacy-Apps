# Cosmic Editorial — Référence visuelle

Document de référence pour l'identité visuelle V1. **Les valeurs ci-dessous sont des propositions de départ** et restent à valider définitivement par l'utilisateur. Toute modification passe par `CONTEXT.md`.

## Palette

### Couleurs de marque

| Nom | Hex | Rôle proposé |
|---|---|---|
| Bleu NASA | `#2E3192` | Couleur de marque primaire, titres, accents forts |
| Rouge vif | `#C82027` | Accent secondaire, actions critiques, soulignement |
| Blanc glacé | `#F8FAFC` | Fond clair, surfaces |
| Bleu nuit | `#0F172A` | Fond sombre, hero, sections immersives |
| Texte clair | `#FFFFFF` | Texte sur fond sombre |
| Texte sombre | `#1E293B` | Texte sur fond clair |

### Règles d'usage

- Un seul accent fort par vue. Le rouge vif n'est pas une couleur d'ornement.
- Le bleu nuit domine les hero immersifs ; le blanc glacé domine les sections de lecture.
- Jamais de gradient par défaut. Si un gradient apparaît, c'est un choix justifié.
- Les couleurs doivent toujours être référencées via des variables CSS (voir ci-dessous).

### Variables CSS proposées

```css
:root {
  --color-brand-blue:    #2E3192;
  --color-brand-red:     #C82027;
  --color-surface-light: #F8FAFC;
  --color-surface-dark:  #0F172A;
  --color-text-light:    #FFFFFF;
  --color-text-dark:     #1E293B;

  --color-focus-ring:    #2E3192;
}
```

## Typographie

### Choix typographique

- **Syne Mono** fait partie des pistes à tester (mention explicite dans `projet_context.txt`). Adaptée aux titres techniques, aux labels, aux éléments de type « étiquette d'archive ».
- **Pour le corps de texte**, prévoir une seconde famille plus lisible aux petites tailles. Choix non figé, à arbitrer. Pistes :
  - Serif éditoriale pour le corps long (lecture confortable des LEGACY STORIES).
  - Sans-serif humaniste pour l'UI courante.

Le choix définitif est un point ouvert documenté dans `CONTEXT.md` (O-004).

### Échelle de type suggérée

```
--font-size-xs:   0.75rem;   /* 12px — labels, méta */
--font-size-sm:   0.875rem;  /* 14px — texte secondaire */
--font-size-base: 1rem;      /* 16px — corps */
--font-size-lg:   1.125rem;  /* 18px — texte dense éditorial */
--font-size-xl:   1.5rem;    /* 24px — sous-titres */
--font-size-2xl:  2rem;      /* 32px — titres de section */
--font-size-3xl:  3rem;      /* 48px — titres de page */
--font-size-hero: 4.5rem;    /* 72px — hero éditorial, écrans larges */
```

### Hauteur de ligne

- Corps serif : `1.6`.
- Corps sans-serif : `1.5`.
- Titres : `1.15` à `1.25`.

### Règles typographiques

- Pas d'ALL CAPS trackés systématiques pour les labels. Utiliser la capitalisation normale.
- Pas de bascule arbitraire italique/bold pour accentuer un mot dans un titre.
- Pas d'eyebrow décoratif systématique avant chaque titre.

## Espacements

```
--space-1:  0.25rem;
--space-2:  0.5rem;
--space-3:  0.75rem;
--space-4:  1rem;
--space-6:  1.5rem;
--space-8:  2rem;
--space-12: 3rem;
--space-16: 4rem;
--space-24: 6rem;
```

Le rythme vertical des pages de lecture s'appuie sur `--space-8` et `--space-16`.

## Breakpoints

| Nom | Largeur min | Cible |
|---|---|---|
| `sm` | 480 px | Mobile large |
| `md` | 768 px | Tablette |
| `lg` | 1024 px | Petit desktop |
| `xl` | 1280 px | Desktop standard |
| `2xl` | 1536 px | Grand écran |

Mobile-first : les styles par défaut ciblent < 480 px, les media queries montent.

## Motifs visuels récurrents

- **Hairline rules** fines (1 px, bleu nuit à 40 % d'opacité) pour séparer les blocs de lecture.
- **Captions sous les images** systématiques avec crédit source et provenance (voir balisage des médias : `NASA ARCHIVE`, `3D RECONSTRUCTION`, `AI-GENERATED ILLUSTRATION`, `DATA VISUALIZATION`, `VERIFIED FACT`).
- **Grille éditoriale** à colonnes variables : la grille de lecture d'un LEGACY STORY n'est pas la même que celle du catalogue.

## À ne pas faire

- Appliquer la palette entière sur une seule vue.
- Mettre du rouge vif en fond large.
- Mélanger Cosmic Editorial et rétro-futuriste dans la même page sans intention.
- Styliser toutes les cartes à l'identique dans une vue de catalogue.
- Oublier d'afficher le crédit de provenance sous chaque média.

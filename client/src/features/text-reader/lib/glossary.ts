import { GlossaryTerm } from '../types';

export const SPACE_GLOSSARY: GlossaryTerm[] = [
  {
    term: 'EASEP',
    aliases: ['EASEP', 'Early Apollo Scientific Experiments Package'],
    definition: "Ensemble expérimental scientifique d'Apollo 11 déployé par Neil Armstrong et Buzz Aldrin, comprenant le réflecteur laser passif.",
    nasaRef: 'NASA SP-214 (1969)',
    category: 'instrument',
  },
  {
    term: 'Rétroréflecteur',
    aliases: ['rétroréflecteur', 'retroreflector', 'réflecteur laser', 'LRRR'],
    definition: 'Dispositif optique passif à prismes de quartz renvoyant un faisceau laser directement vers son émetteur sur Terre, mesurant la distance Terre-Lune à moins de 2 cm près sans aucune source électrique.',
    nasaRef: 'Lunar Laser Ranging Experiment',
    category: 'instrument',
  },
  {
    term: 'LEM',
    aliases: ['LEM', 'LM', 'Module Lunaire', 'Eagle', 'étage de descente'],
    definition: "Module d'atterrissage du programme Apollo. L'étage de descente d'Eagle sert de plateforme de lancement pour l'étage de remontée et reste pour toujours sur la Mer de la Tranquillité.",
    nasaRef: 'Apollo Lunar Module Manual',
    category: 'technology',
  },
  {
    term: 'Régolithe',
    aliases: ['régolithe', 'regolith', 'poussière lunaire'],
    definition: 'Couche de poussière et de débris rocheux concassés recouvrant la roche mère des corps sans atmosphère comme la Lune ou les astéroïdes.',
    nasaRef: 'Lunar Sample Compendium',
    category: 'science',
  },
  {
    term: 'RTG',
    aliases: ['RTG', 'générateur thermoélectrique', 'radioisotope'],
    definition: 'Générateur électrique utilisant la chaleur issue de la désintégration radioactive naturelle du plutonium-238 pour alimenter des sondes comme Viking ou Curiosity.',
    nasaRef: 'NASA Radioisotope Power Systems',
    category: 'technology',
  },
  {
    term: 'Sol',
    aliases: ['sol', 'sols'],
    definition: "Jour solaire martien, équivalent à 24 heures, 39 minutes et 35 secondes terrestres. Unité officielle de mesure du temps pour les rovers martiens.",
    nasaRef: 'Mars Exploration Rover Project',
    category: 'science',
  },
  {
    term: 'Opportunity',
    aliases: ['Opportunity', 'MER-B', 'Oppy'],
    definition: 'Rover de la NASA qui a parcouru 45,16 km sur Mars entre 2004 et 2018 (prévu initialement pour 90 jours seulement !).',
    nasaRef: 'JPL Mars Exploration Rovers',
    category: 'mission',
  },
  {
    term: 'Ingenuity',
    aliases: ['Ingenuity', 'Mars Helicopter', "l'hélicoptère martien"],
    definition: "Premier aéronef motorisé à voler sur une autre planète. Il a réalisé 72 vols dans l'atmosphère ténue de Mars entre 2021 et 2024.",
    nasaRef: 'NASA JPL Ingenuity Mars Helicopter',
    category: 'technology',
  },
  {
    term: 'Télémétrie',
    aliases: ['télémétrie', 'telemetry'],
    definition: 'Technique permettant la mesure et la transmission à distance de données scientifiques et techniques depuis un vaisseau spatial vers le centre de contrôle sur Terre.',
    nasaRef: 'Deep Space Network Basics',
    category: 'technology',
  },
  {
    term: 'Panneaux solaires',
    aliases: ['panneaux solaires', 'cellules photovoltaïques'],
    definition: 'Capteurs convertissant le rayonnement solaire en électricité. Sur Mars, leur efficacité diminue avec le dépôt progressif de poussière atmosphérique.',
    nasaRef: 'NASA Photovoltaic Engineering',
    category: 'technology',
  },
];

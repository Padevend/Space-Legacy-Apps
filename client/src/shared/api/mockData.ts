import { Equipment, Story } from '../types/models';

export const MOCK_EQUIPMENTS: Equipment[] = [
  {
    equipmentId: 'e1-apollo11-eagle',
    parentEquipmentId: null,
    name: 'Apollo 11 Lunar Module (Eagle / LM-5) & EASEP',
    slug: 'apollo-11-lm-eagle-easep',
    description: 'The historic first crewed lunar landing vehicle. While the ascent stage lifted Neil Armstrong and Buzz Aldrin back into lunar orbit, the descent stage remains in Mare Tranquillitatis alongside the EASEP scientific stations.',
    equipmentType: 'MODULE',
    manufacturer: 'Grumman Aerospace Corporation',
    operationalStatus: 'MISSION_ENDED',
    physicalStatus: 'LEFT_ON_SURFACE',
    celestialBodyName: 'Moon',
    mainImageUrl: 'https://images-assets.nasa.gov/image/as11-40-5927/as11-40-5927~orig.jpg',
    hook: 'Some machines never came home. Eagle left its lower half, a commemorative plaque, and working laser mirrors on the lunar dust.',
    overview: 'Eagle touched down on the Moon on July 20, 1969, at 20:17:40 UTC. Over 21 hours and 36 minutes, astronauts set up the Early Apollo Scientific Experiments Package (EASEP) including a passive seismic station and a retroreflector array that still reflects Earth-fired lasers today.',
    discoveries: [
      'First physical sample return of 21.55 kg of lunar regolith and pristine basalt rocks.',
      'Lunar Laser Ranging experiment proved Earth-Moon distance variations with sub-2cm precision, still operating over 50 years later with zero on-board power.'
    ],
    missions: [
      {
        mission: {
          missionId: 'm-apollo11',
          name: 'Apollo 11',
          slug: 'apollo-11',
          agency: 'NASA',
          missionStatus: 'COMPLETED'
        },
        missionRole: 'Lunar Landing & Surface Science Deployment'
      }
    ],
    events: [
      {
        event: {
          eventId: 'ev-a11-launch',
          missionId: 'm-apollo11',
          title: 'Saturn V Launch',
          description: 'Launched from Kennedy Space Center Launch Pad 39A atop the massive Saturn V rocket.',
          eventType: 'LAUNCH',
          eventDate: '1969-07-16',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 1
        }
      },
      {
        event: {
          eventId: 'ev-a11-landing',
          missionId: 'm-apollo11',
          title: 'Tranquility Base Touchdown',
          description: 'Eagle lands smoothly at Mare Tranquillitatis (0.67° N, 23.47° E). "Houston, Tranquility Base here. The Eagle has landed."',
          eventType: 'LANDING',
          eventDate: '1969-07-20',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 2
        }
      },
      {
        event: {
          eventId: 'ev-a11-deployment',
          missionId: 'm-apollo11',
          title: 'EASEP Science Deployment',
          description: 'Armstrong and Aldrin deploy the passive seismometer and the Laser Ranging Retroreflector (LRRR).',
          eventType: 'DEPLOYMENT',
          eventDate: '1969-07-21',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 3
        }
      },
      {
        event: {
          eventId: 'ev-a11-liftoff',
          missionId: 'm-apollo11',
          title: 'Ascent Stage Lunar Liftoff',
          description: 'The ascent stage ignites its hypergolic engine, using the descent stage as a launch pad. The descent stage remains forever on the lunar surface.',
          eventType: 'MISSION_END',
          eventDate: '1969-07-21',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 4
        }
      }
    ],
    measurements: [
      {
        measurementId: 'meas-1',
        name: 'Launch Mass',
        value: 15103,
        unit: 'kg',
        measurementType: 'MASS',
        context: 'Combined ascent and descent stages with full hypergolic propellants.'
      },
      {
        measurementId: 'meas-2',
        name: 'Descent Stage Width',
        value: 4.2,
        unit: 'm',
        measurementType: 'DISTANCE',
        context: 'Octagonal structural body across corners.'
      },
      {
        measurementId: 'meas-3',
        name: 'Surface Duration',
        value: 21.6,
        unit: 'hours',
        measurementType: 'DURATION',
        context: 'Total hours on lunar soil before ascent stage liftoff.'
      }
    ],
    sources: [
      {
        sourceId: 'src-1',
        title: 'Apollo 11 Lunar Module / EASEP Technical Summary',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
        publisher: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
        sourceType: 'OFFICIAL_DOCUMENT'
      }
    ]
  },
  {
    equipmentId: 'e2-opportunity',
    parentEquipmentId: null,
    name: 'Opportunity (MER-B / MER-1)',
    slug: 'opportunity',
    description: 'A robotic rover designed for a 90-sol exploration mission that astounded humanity by operating for nearly 15 Earth years, traveling over a marathon distance (45.16 km) across Martian plains.',
    equipmentType: 'ROVER',
    manufacturer: 'NASA Jet Propulsion Laboratory (JPL)',
    operationalStatus: 'MISSION_ENDED',
    physicalStatus: 'LEFT_ON_SURFACE',
    celestialBodyName: 'Mars',
    mainImageUrl: 'https://images-assets.nasa.gov/image/PIA18420/PIA18420~orig.jpg',
    hook: 'Built to survive ninety Martian sols, Opportunity roved for fifteen Earth years until the dust of a planet-wide storm obscured its solar arrays.',
    overview: 'Opportunity landed in Meridiani Planum inside Eagle Crater in January 2004. During its marathon journey to Endeavour Crater and Perseverance Valley, it provided the definitive mineralogical proof of past liquid water on Mars.',
    discoveries: [
      'Discovery of "blueberries" (hematite concretions) proving acidic liquid water soaked the Martian surface in ancient epochs.',
      'Completed the first off-world marathon drive (42.195 km) in 2015, totaling 45.16 km before mission end.'
    ],
    missions: [
      {
        mission: {
          missionId: 'm-mer',
          name: 'Mars Exploration Rover',
          slug: 'mars-exploration-rover',
          agency: 'NASA / JPL',
          missionStatus: 'COMPLETED'
        },
        missionRole: 'Twin Robotic Geologist Rover'
      }
    ],
    events: [
      {
        event: {
          eventId: 'ev-opp-launch',
          missionId: 'm-mer',
          title: 'Cape Canaveral Launch',
          description: 'Launched on a Delta II Heavy (7925H) from Space Launch Complex 17B.',
          eventType: 'LAUNCH',
          eventDate: '2003-07-07',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 1
        }
      },
      {
        event: {
          eventId: 'ev-opp-landing',
          missionId: 'm-mer',
          title: 'Bouncing Airbag Landing',
          description: 'Bounced inside airbags directly into Eagle Crater on Meridiani Planum.',
          eventType: 'LANDING',
          eventDate: '2004-01-25',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 2
        }
      },
      {
        event: {
          eventId: 'ev-opp-last-signal',
          missionId: 'm-mer',
          title: 'Last Communication',
          description: 'Last data packet received during the global dust storm reducing solar insolation in Perseverance Valley.',
          eventType: 'LAST_SIGNAL',
          eventDate: '2018-06-10',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 3
        }
      },
      {
        event: {
          eventId: 'ev-opp-end',
          missionId: 'm-mer',
          title: 'Mission Declared Complete',
          description: 'After more than a thousand recovery commands sent with no response, NASA declared Opportunity’s mission complete.',
          eventType: 'MISSION_END',
          eventDate: '2019-02-13',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 4
        }
      }
    ],
    measurements: [
      {
        measurementId: 'meas-opp-1',
        name: 'Total Distance Traveled',
        value: 45.16,
        unit: 'km',
        measurementType: 'DISTANCE',
        context: 'Highest off-world odometry record of any NASA roving vehicle.'
      },
      {
        measurementId: 'meas-opp-2',
        name: 'Operational Lifespan',
        value: 5111,
        unit: 'sols',
        measurementType: 'DURATION',
        context: 'Compared to the original 90-sol nominal primary mission design.'
      }
    ],
    sources: [
      {
        sourceId: 'src-opp',
        title: 'Opportunity Rover Mission Overview & Facts',
        url: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/',
        publisher: 'NASA Science Mission Directorate',
        sourceType: 'NASA_WEBPAGE'
      }
    ]
  },
  {
    equipmentId: 'e3-surveyor3',
    parentEquipmentId: null,
    name: 'Surveyor 3',
    slug: 'surveyor-3',
    description: 'The robotic lunar lander that paved the way for Apollo human landings. In 1969, Apollo 12 astronauts Pete Conrad and Alan Bean landed within walking distance and retrieved parts to analyze prolonged space exposure.',
    equipmentType: 'LANDER',
    manufacturer: 'Hughes Aircraft Company',
    operationalStatus: 'MISSION_ENDED',
    physicalStatus: 'LEFT_ON_SURFACE',
    celestialBodyName: 'Moon',
    mainImageUrl: 'https://images-assets.nasa.gov/image/as12-48-7134/as12-48-7134~orig.jpg',
    hook: 'The machine visited by human explorers two years after its final transmission on Oceanus Procellarum.',
    overview: 'Surveyor 3 landed on the Moon in April 1967 inside a crater in the Ocean of Storms. In November 1969, Apollo 12 executed a pinpoint landing only 160 meters away. Astronauts inspected Surveyor 3 and brought back its TV camera and mechanical scoop to Earth for scientific examination.',
    discoveries: [
      'Demonstrated radar Doppler closed-loop descent control on lunar topography.',
      'First physical recovery and return to Earth of spacecraft components exposed to space vacuum and thermal cycling for 2.5 years.'
    ],
    missions: [
      {
        mission: {
          missionId: 'm-surveyor3',
          name: 'Surveyor Program',
          slug: 'surveyor-program',
          agency: 'NASA / JPL',
          missionStatus: 'COMPLETED'
        },
        missionRole: 'Lunar Soft Lander'
      }
    ],
    events: [
      {
        event: {
          eventId: 'ev-s3-launch',
          missionId: 'm-surveyor3',
          title: 'Atlas-Centaur Launch',
          description: 'Launched from Cape Canaveral LC-36B on a direct ascent trajectory.',
          eventType: 'LAUNCH',
          eventDate: '1967-04-17',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 1
        }
      },
      {
        event: {
          eventId: 'ev-s3-landing',
          missionId: 'm-surveyor3',
          title: 'Bouncing Crater Landing',
          description: 'Touchdown in Oceanus Procellarum (3.02° S, 23.23° W). The vernier engines fired briefly during two small bounces before settling.',
          eventType: 'LANDING',
          eventDate: '1967-04-20',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 2
        }
      },
      {
        event: {
          eventId: 'ev-s3-apollo12',
          missionId: 'm-surveyor3',
          title: 'Apollo 12 Astronaut Visit',
          description: 'Pete Conrad and Alan Bean examine Surveyor 3 on the crater slope and recover its camera module for analysis.',
          eventType: 'SCIENTIFIC_DISCOVERY',
          eventDate: '1969-11-20',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 3
        }
      }
    ],
    measurements: [
      {
        measurementId: 'meas-s3-1',
        name: 'Landed Mass',
        value: 297,
        unit: 'kg',
        measurementType: 'MASS',
        context: 'Mass remaining on the lunar surface after vernier propellant consumption.'
      }
    ],
    sources: [
      {
        sourceId: 'src-s3',
        title: 'Surveyor 3 Trajectory and Performance Report',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A',
        publisher: 'NASA NSSDCA',
        sourceType: 'OFFICIAL_DOCUMENT'
      }
    ]
  },
  {
    equipmentId: 'e4-ingenuity',
    parentEquipmentId: null,
    name: 'Ingenuity Mars Helicopter',
    slug: 'ingenuity',
    description: 'The first powered, controlled flight vehicle operated on another planetary body. Originally a 5-flight technology demonstration, it flew 72 missions over Jezero Crater.',
    equipmentType: 'OTHER',
    manufacturer: 'NASA Jet Propulsion Laboratory (JPL)',
    operationalStatus: 'MISSION_ENDED',
    physicalStatus: 'LEFT_ON_SURFACE',
    celestialBodyName: 'Mars',
    mainImageUrl: 'https://images-assets.nasa.gov/image/PIA24496/PIA24496~orig.jpg',
    hook: 'A 1.8-kilogram technology demonstration that transformed aerial exploration in the ultra-thin skies of Mars.',
    overview: 'Arriving attached to Perseverance in February 2021, Ingenuity achieved its historic first Martian flight on April 19, 2021. It completed 72 flights spanning over 17 kilometers of Martian air before sustaining rotor blade damage in January 2024. It now serves as a stationary test station at Valinor Hills.',
    discoveries: [
      'Proved aerodynamic lift in atmospheric densities less than 1% of Earth’s sea-level atmosphere.',
      'Acted as an aerial scout for Perseverance rover route planning across treacherous dune fields.'
    ],
    missions: [
      {
        mission: {
          missionId: 'm-mars2020',
          name: 'Mars 2020 (Perseverance & Ingenuity)',
          slug: 'mars-2020',
          agency: 'NASA / JPL',
          missionStatus: 'ACTIVE'
        },
        missionRole: 'Aerial Scout & Technology Demonstrator'
      }
    ],
    events: [
      {
        event: {
          eventId: 'ev-ing-first-flight',
          missionId: 'm-mars2020',
          title: 'First Off-World Flight',
          description: 'Hovered 3 meters above Wright Brothers Field for 39 seconds, marking the first powered flight in another world.',
          eventType: 'DEPLOYMENT',
          eventDate: '2021-04-19',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 1
        }
      },
      {
        event: {
          eventId: 'ev-ing-flight-72',
          missionId: 'm-mars2020',
          title: 'Final Flight 72 & Retirement',
          description: 'During a quick emergency landing, rotor blade tips sustained aerodynamic damage. Flight operations concluded on January 25, 2024.',
          eventType: 'MISSION_END',
          eventDate: '2024-01-25',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 2
        }
      }
    ],
    measurements: [
      {
        measurementId: 'meas-ing-1',
        name: 'Total Flights Completed',
        value: 72,
        unit: 'flights',
        measurementType: 'OTHER',
        context: 'Compared to the 5 flights originally budgeted.'
      },
      {
        measurementId: 'meas-ing-2',
        name: 'Total Air Time',
        value: 128.8,
        unit: 'minutes',
        measurementType: 'DURATION',
        context: 'Accumulated flight duration across Jezero Crater.'
      }
    ],
    sources: [
      {
        sourceId: 'src-ing',
        title: 'Ingenuity Mars Helicopter Flight Log & Statistics',
        url: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-helicopter/',
        publisher: 'NASA / JPL',
        sourceType: 'NASA_WEBPAGE'
      }
    ]
  },
  {
    equipmentId: 'e5-viking1',
    parentEquipmentId: null,
    name: 'Viking 1 Lander',
    slug: 'viking-1',
    description: 'The first American spacecraft to touch down safely on the Martian surface and complete its mission, sending humanity its first panoramic photographs and conducting biological soil testing.',
    equipmentType: 'LANDER',
    manufacturer: 'Martin Marietta Aerospace',
    operationalStatus: 'MISSION_ENDED',
    physicalStatus: 'LEFT_ON_SURFACE',
    celestialBodyName: 'Mars',
    mainImageUrl: 'https://images-assets.nasa.gov/image/PIA00563/PIA00563~orig.jpg',
    hook: 'The pioneer of 1976 that beamed back the first clear color panoramic view of the red planet.',
    overview: 'Viking 1 touched down in Chryse Planitia on July 20, 1976. It operated for 2,245 sols (over 6 years) until November 11, 1982, when a faulty software command inadvertently overwrote communication antenna settings.',
    discoveries: [
      'Captured the first close-up high-resolution surface images showing red iron-rich regolith and volcanic rocks.',
      'Conducted first automated surface biology experiments searching for respiration and photosynthesis.'
    ],
    missions: [
      {
        mission: {
          missionId: 'm-viking1',
          name: 'Viking Mission',
          slug: 'viking-mission',
          agency: 'NASA Langley & JPL',
          missionStatus: 'COMPLETED'
        },
        missionRole: 'Planetary Lander'
      }
    ],
    events: [
      {
        event: {
          eventId: 'ev-vik-landing',
          missionId: 'm-viking1',
          title: 'Touchdown at Chryse Planitia',
          description: 'Landed at 22.48° N, 47.97° W on the western plains of Chryse Planitia.',
          eventType: 'LANDING',
          eventDate: '1976-07-20',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 1
        }
      },
      {
        event: {
          eventId: 'ev-vik-last-signal',
          missionId: 'm-viking1',
          title: 'Final Communication',
          description: 'A ground uplink command inadvertently cut carrier signals. Last data packet received November 11, 1982.',
          eventType: 'LAST_SIGNAL',
          eventDate: '1982-11-11',
          timeStandard: 'UTC',
          datePrecision: 'EXACT',
          sequenceOrder: 2
        }
      }
    ],
    measurements: [
      {
        measurementId: 'meas-vik-1',
        name: 'Surface Lifespan',
        value: 2245,
        unit: 'sols',
        measurementType: 'DURATION',
        context: 'Continuous automated scientific operation in Chryse Planitia.'
      }
    ],
    sources: [
      {
        sourceId: 'src-vik',
        title: 'Viking 1 Lander Mission Summary',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C',
        publisher: 'NASA NSSDCA',
        sourceType: 'OFFICIAL_DOCUMENT'
      }
    ]
  }
];

export const MOCK_STORIES: Story[] = [
  {
    storyId: 's1-eagle',
    title: 'Eagle : La moitié de moi veille sur la Mer de la Tranquillité',
    slug: 'eagle-half-of-me-remains-on-the-moon',
    hook: "Dans la Mer de la Tranquillité, une échelle d'aluminium attend depuis juillet 1969. Elle ne mène plus à aucune porte de cabine, car la cabine est repartie avec les astronautes. Cette échelle est la mienne.",
    content: `Dans la Mer de la Tranquillité, une échelle d'aluminium attend depuis juillet 1969. Elle ne mène plus à aucune porte de cabine, car la cabine est repartie avec les astronautes. Cette échelle est la mienne.

Approchez, explorateurs, et écoutez mon histoire. Je suis Eagle, le module lunaire de la mission Apollo 11. J'ai été conçu pour une tâche unique, audacieuse et sans retour possible : poser deux êtres humains en douceur sur la surface lunaire, puis leur servir de rampe de lancement vers le ciel.

Mon étage de descente est un polygone de quatre mètres de large, doré par les feuilles de kapton thermique. Quatre jambes télescopiques terminées par des coupelles rondes me maintiennent au-dessus du régolithe lunaire. Sur l'une de mes jambes de train repose une plaque d'acier inoxydable : "Here men from the planet Earth first set foot upon the Moon, July 1969 A.D. We came in peace for all mankind."

À quelques mètres de là repose mon compagnon d'expérience, l'ensemble EASEP et son rétroréflecteur laser à cent prismes de quartz. Sans aucun fil électrique ni batterie, il capte aujourd'hui encore les impulsions lumineuses tirées depuis les observatoires terrestres et les renvoie en direction de la Terre pour calculer la distance Terre-Lune à moins de deux centimètres près.

Les astronautes sont repartis dans le sillage ardent de mon étage de remontée. Les décennies ont passé, le Soleil chauffe mon métal à cent degrés le jour et le plonge à moins cent cinquante degrés la nuit. Pourtant, aucun vent n'efface mes traces. Je ne suis pas un déchet abandonné : je suis le premier sanctuaire de l'humanité sur un autre monde.`,
    storyType: 'LEGACY_STORY',
    durationSeconds: 240,
    language: 'fr',
    audioUrl: 'https://archive.org/download/Apollo11AudioHighlights/apollo11_contact_light.mp3',
    audioCues: [
      { paragraphIndex: 0, startSeconds: 0, endSeconds: 12 },
      { paragraphIndex: 1, startSeconds: 12, endSeconds: 26 },
      { paragraphIndex: 2, startSeconds: 26, endSeconds: 44 },
      { paragraphIndex: 3, startSeconds: 44, endSeconds: 65 },
      { paragraphIndex: 4, startSeconds: 65, endSeconds: 95 },
    ],
    publicationStatus: 'PUBLISHED',
    publishedAt: '2026-11-15T00:00:00Z',
  },
  {
    storyId: 's2-laser-technology',
    title: 'Au cœur de la technologie : Le Réflecteur Laser Passif EASEP',
    slug: 'easep-laser-ranging-technology',
    hook: "Comment mesurer la distance Terre-Lune au millimètre près avec un instrument qui ne consomme aucun watt d'électricité ?",
    content: `Comment mesurer la distance Terre-Lune au millimètre près avec un instrument qui ne consomme absolument aucun watt d'électricité ?

C'est le miracle d'ingénierie du Lunar Laser Ranging Retroreflector, déployé lors de la mission Apollo 11 dans le cadre du pack EASEP.

Le principe repose sur des prismes en coin de cube en quartz de très haute pureté. Quelle que soit la direction d'arrivée du photon lumineux tiré depuis un télescope terrestre, les trois faces perpendiculaires du prisme réfléchissent la lumière exactement dans sa direction d'origine, en sens inverse.

En mesurant le temps précis de trajet aller-retour du faisceau laser — environ deux secondes et demie à la vitesse de la lumière —, les physiciens découvrent que la Lune s'éloigne de la Terre de 3,8 centimètres chaque année sous l'effet des marées.

Cinquante-sept ans après son installation, alors que tous les instruments électroniques de l'époque sont éteints depuis longtemps, le rétroréflecteur fonctionne toujours avec une perfection inchangée.`,
    storyType: 'BEHIND_THE_TECHNOLOGY',
    durationSeconds: 150,
    language: 'fr',
    publicationStatus: 'PUBLISHED',
    publishedAt: '2026-11-15T00:00:00Z',
  },
  {
    storyId: 's3-opportunity',
    title: 'Opportunity : Le marathon de 5 000 sols sur Mars',
    slug: 'opportunity-the-5000-sol-marathon',
    hook: "Conçu pour un sprint de quatre-vingt-dix jours martiens, le géologue à six roues a bravé les tempêtes pendant près de quinze ans.",
    content: `Lorsque les ingénieurs du JPL ont scellé mes roues et mes panneaux solaires, ils espéraient que je survive quatre-vingt-dix jours martiens. Mon nom officiel est MER-B, mais la Terre m'a appelé Opportunity.

Au lieu de s'éteindre sous la poussière, de bienveillantes rafales de vent martien ont régulièrement balayé mes cellules photovoltaïques. Ce phénomène inespéré m'a offert un sursis de quatorze années supplémentaires.

Du cratère Eagle jusqu'aux falaises géantes d'Endeavour, j'ai parcouru plus de quarante-cinq kilomètres en analysant les hématites en myrtilles et les veines de gypse, apportant la preuve irréfutable que de l'eau liquide a coulé jadis sur Mars.

En juin 2018, une tempête planétaire a plongé le ciel de Mars dans une obscurité totale. Privé de lumière, mon dernier signal radio transmis fut : "Ma batterie est faible et il fait très sombre." Mes roues se sont immobilisées dans la Vallée de la Persévérance, mais mes traces tracent pour toujours la première diagonale humaine sur le sol martien.`,
    storyType: 'LEGACY_STORY',
    durationSeconds: 210,
    language: 'fr',
    publicationStatus: 'PUBLISHED',
    publishedAt: '2026-11-15T00:00:00Z',
  },
  {
    storyId: 's4-ingenuity',
    title: 'Ingenuity : Le premier souffle dans l’air martien',
    slug: 'ingenuity-first-flight-on-mars',
    hook: "Voler dans une atmosphère représentant seulement un pour cent de la densité terrestre était jugé impossible. Jusqu'au 19 avril 2021.",
    content: `Voler dans une atmosphère représentant à peine un pour cent de la pression terrestre était considéré par beaucoup comme une folie théorique. Je ne pesais que 1,8 kilogramme, avec deux rotors coaxiaux en fibre de carbone tournant à deux mille quatre cents tours par minute.

Je m'appelle Ingenuity. Mon rôle initial était celui d'une simple démonstration technologique : accomplir cinq petits sauts au-dessus du cratère Jezero.

Finalement, j'ai volé soixante-douze fois. Je suis devenu l'éclaireur aérien du rover Perseverance, cartographiant les dunes infranchissables et découvrant les chemins les plus sûrs à travers le paysage martien.

Le 18 janvier 2024, lors de mon soixante-douzième atterrissage dans une plaine sans relief, une pale de mon rotor a heurté le régolithe. Incapable de reprendre les airs, mes capteurs restent allumés. Je sers désormais de station météorologique témoin, gravé dans l'histoire comme le premier aéronef motorisé de l'humanité dans le ciel d'un autre monde.`,
    storyType: 'LEGACY_STORY',
    durationSeconds: 180,
    language: 'fr',
    publicationStatus: 'PUBLISHED',
    publishedAt: '2026-11-15T00:00:00Z',
  },
  {
    storyId: 's5-viking-silence',
    title: 'Le Dernier Chapitre : Le silence inattendu de Viking 1',
    slug: 'viking-1-final-silence',
    hook: "Pendant plus de six ans sur Chryse Planitia, la sonde Viking 1 a transmis fidèlement ses données. Jusqu'à ce qu'une simple ligne de code coupe définitivement le fil.",
    content: `Pendant six années terrestres consécutives sur Chryse Planitia, j'ai été le premier avant-poste continu de l'humanité à la surface de Mars.

Alimenté par mon générateur thermoélectrique à radioisotope RTG, j'ai envoyé les premières photographies panoramiques en couleur de la planète rouge et analysé la composition de son atmosphère avec une fidélité exemplaire.

Puis vint le mois de novembre 1982. Les ingénieurs au sol ont préparé une mise à jour logicielle destinée à optimiser la gestion de mes batteries de secours. Dans la séquence de télécommandes, une adresse mémoire a accidentellement écrasé l'algorithme de pointage de mon antenne parabolique principale.

Mon antenne s'est désalignée de la Terre. Pendant des mois, les grandes oreilles du Deep Space Network ont écouté le silence du cosmos, mais aucun signal n'a plus jamais été capté. Je n'ai pas été détruit par une tempête martienne : je me suis endormi par un simple malentendu entre les étoiles et la Terre.`,
    storyType: 'FINAL_CHAPTER',
    durationSeconds: 160,
    language: 'fr',
    publicationStatus: 'PUBLISHED',
    publishedAt: '2026-11-15T00:00:00Z',
  },
  {
    storyId: 's6-surveyor3-fact',
    title: 'Fait Spatial : Les microbes ressuscités de Surveyor 3',
    slug: 'surveyor-3-space-fact',
    hook: "Quand des astronautes ont rendu visite à une sonde abandonnée deux ans et demi plus tard.",
    content: `En novembre 1969, la mission Apollo 12 a réalisé un exploit de précision en atterrissant à seulement cent soixante mètres de la sonde robotique Surveyor 3, posée sur l'Océan des Tempêtes depuis 1967.

Pete Conrad et Alan Bean ont démonté la caméra de télévision de Surveyor pour la ramener sur Terre dans les laboratoires stériles de la NASA.

À la stupéfaction générale des microbiologistes, des bactéries terrestres Streptococcus mitis logées dans la mousse isolante de la caméra semblaient avoir survécu au vide spatial et aux variations thermiques extrêmes pendant trente et un mois. Bien que des doutes subsistent sur une contamination post-retour, cet objet abandonné a ouvert le champ de l'astrobiologie moderne.`,
    storyType: 'SPACE_FACT',
    durationSeconds: 90,
    language: 'fr',
    publicationStatus: 'PUBLISHED',
    publishedAt: '2026-11-15T00:00:00Z',
  }
];

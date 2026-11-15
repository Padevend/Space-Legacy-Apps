-- =====================================================================
-- SPACE LEGACY - Complete Autonomous Database Seeder Script
-- Generated At: 2026-11-15T18:42:38.447691+00:00
-- Models: CelestialBody, Machine, LogbookEntry
-- Conflict Resolution: Robust ON CONFLICT ("slug") & ("machineId", "slug")
-- Foreign Keys: Bulletproof subquery resolution against live database
-- =====================================================================

BEGIN;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- -----------------------------------------------------------------
-- Table: celestial_bodies (Model: CelestialBody) - 5 records
-- -----------------------------------------------------------------
INSERT INTO "celestial_bodies" ("slug", "id", "name", "summary", "imagePath", "sortOrder", "isPublished")
VALUES
  ('ceres', '4453904f-77b9-52a0-b6d3-41eb438c8d13', 'Ceres', 'The largest celestial body and dwarf planet in the asteroid belt between Mars and Jupiter, thoroughly mapped and explored in orbit by NASA''s Dawn mission.', '/images/bodies/ceres.webp', 3, TRUE),
  ('deep-space', 'f32813c9-872a-556f-b0a3-cc353e03bcc1', 'Deep Space', 'The interplanetary and interstellar realms beyond planetary orbits, traversed by Pioneer 10 towards the outer frontier and surveyed by Kepler in search of distant exoplanets.', '/images/bodies/deep-space.webp', 5, TRUE),
  ('eros', '83cc3cf6-02fe-5e5e-b061-c32dd53d4c73', '433 Eros', 'A near-Earth asteroid and the historic destination and final touchdown site of NASA''s NEAR Shoemaker spacecraft, the first mission to orbit and land on an asteroid.', '/images/bodies/eros.webp', 4, TRUE),
  ('mars', '08bf5902-99d1-5e2e-85b6-a725135ec485', 'Mars', 'The Red Planet, host to pioneering NASA rovers, stationary landers, atmospheric orbiters, and the Ingenuity helicopter exploring its ancient aqueous history and habitability.', '/images/bodies/mars.webp', 2, TRUE),
  ('moon', 'c6fccf3f-71c1-561d-8dc1-27aef279c9d4', 'Moon', 'Earth''s only natural satellite, destination of NASA''s historic Apollo lunar landings and early robotic probes, hosting preserved descent stages, rovers, and surface science stations.', '/images/bodies/moon.webp', 1, TRUE)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "summary" = EXCLUDED."summary",
  "imagePath" = EXCLUDED."imagePath",
  "sortOrder" = EXCLUDED."sortOrder",
  "isPublished" = EXCLUDED."isPublished";

-- -----------------------------------------------------------------
-- Table: machines (Model: Machine) - 13 records
-- -----------------------------------------------------------------
INSERT INTO "machines" ("slug", "id", "bodyId", "name", "kind", "state", "stateSince", "launchYear", "arrivalYear", "summary", "description", "missionPurpose", "howItWorked", "discoveries", "currentStatusNote", "latitude", "longitude", "isPublished", "createdAt", "updatedAt")
VALUES
  (
    'alsep-packages',
    'b366eb67-616b-5965-acc3-0a4ac991154b',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1),
    'Apollo Lunar Surface Experiments Package (ALSEP)',
    'INSTRUMENT',
    'JOB_FINISHED',
    '1977-09-30',
    1969,
    1969,
    'A suite of scientific instruments deployed by Apollo astronauts across five lunar landing sites to study the Moon''s interior, seismic activity, solar wind, and tenuous atmosphere.',
    'The Apollo Lunar Surface Experiments Package (ALSEP) comprised sets of scientific instruments emplaced by the astronauts at the landing sites of Apollo 12, 14, 15, 16, and 17, along with the Early Apollo Scientific Experiment Package (EASEP) deployed by Apollo 11. Each package was designed to operate autonomously on the lunar surface for over a year, collecting long-term geophysical data. The stations continued transmitting invaluable scientific measurements continuously to Earth until NASA officially commanded the network off on September 30, 1977 due to budget constraints.',
    'Deploy self-contained long-lived geophysical stations on the Moon to continuously monitor moonquakes, meteorite impacts, local magnetic fields, solar wind interactions, and heat flow escaping from the lunar interior.',
    'Powered by a SNAP-27 Radioisotope Thermoelectric Generator (RTG) fueled by plutonium-238 generating roughly 70 watts of continuous electrical power unaffected by the two-week lunar night. A central station managed commands and telemetry, routing data from passive seismometers, magnetometers, solar wind spectrometers, suprathermal ion detectors, and cold cathode gauges over S-band radio transmitters back to NASA ground stations.',
    'Detected over 12,000 seismic events, revealing that the Moon experiences deep moonquakes triggered by Earth tidal stresses and thermal moonquakes from sunrise heating. Confirmed the presence of a lunar crust varying from 30 to 60 km in thickness, a differentiated silicate mantle, and established that the Moon possesses only localized crustal remanent magnetic fields rather than an active global dynamo.',
    'All five ALSEP central stations and their companion instruments remain preserved in situ at their respective Apollo landing sites across the lunar maria and highlands.',
    -3.0128,
    -23.4219,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'apollo-lunar-modules',
    '4b75c923-55cd-5ee6-be0d-05eda745b345',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1),
    'Apollo Lunar Module Descent Stages',
    'LANDING_CRAFT_STAGE',
    'LEFT_ON_PURPOSE',
    '1969-07-21',
    1969,
    1969,
    'The lower stages of the Apollo Lunar Modules that delivered twelve American astronauts to the surface of the Moon, serving as launch pads for the ascent stages and remaining as historic monuments.',
    'The Apollo Lunar Module descent stages represent the historic foundations of human lunar exploration. Designed strictly for the vacuum of space by Grumman Aerospace, the descent stage comprised an octagonal aluminum prism structure fitted with four landing legs. It decelerated the spacecraft out of lunar orbit and achieved soft touchdowns across six Apollo missions (Apollo 11, 12, 14, 15, 16, and 17). During surface operations, it served as the astronauts'' home base and equipment depot, before functioning as the launch platform when the ascent stage fired its engine to return the crew to orbit.',
    'Decelerate and softly land two crew members and their scientific surface payload from lunar orbit onto targeted landing sites across the lunar nearside, provide life support consumables, and serve as the launch stand for crew return.',
    'Equipped with a throttleable Descent Propulsion System (DPS) rocket engine delivering between 4,670 N and 43,900 N of thrust utilizing hypergolic propellants (Aerozine 50 and nitrogen tetroxide). Its four landing legs used crushable aluminum honeycomb cartridges within telescoping struts to absorb impact shock. Powered on the surface by five silver-zinc batteries providing 28V DC power.',
    'Proved that humans can safely pilot, land, and live upon another celestial world. Enabled the retrieval and return of 382 kilograms of lunar samples, revolutionizing planetary science and our understanding of Solar System evolution.',
    'All six descent stages remain permanently stationed on the Moon at Tranquility Base, Oceanus Procellarum, Fra Mauro, Hadley-Apennine, Descartes, and Taurus-Littrow as preserved monuments of human achievement.',
    0.67408,
    23.47297,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'dawn',
    'e23720e4-56db-5bec-9022-38f7b4a125d7',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'ceres' LIMIT 1),
    'Dawn',
    'ORBITER',
    'JOB_FINISHED',
    '2018-11-01',
    2007,
    2011,
    'The first spacecraft to orbit two separate extraterrestrial destinations, studying the protoplanet Vesta and dwarf planet Ceres to uncover the early history of the Solar System.',
    'NASA''s Dawn spacecraft revolutionized deep space exploration by becoming the first probe to orbit two separate extraterrestrial bodies in the main asteroid belt. Launched in September 2007, Dawn journeyed to the giant rocky asteroid Vesta, orbiting it from July 2011 to September 2012, before breaking orbit using its revolutionary ion propulsion system to travel to dwarf planet Ceres, entering orbit in March 2015. Dawn comprehensively mapped the topography, composition, and gravity fields of both worlds.',
    'Investigate the conditions and thermal processes active during the Solar System''s earliest epoch by comparing the evolutionary paths of dry, basaltic Vesta and volatile-rich, icy dwarf planet Ceres.',
    'Utilized three high-efficiency NEXT xenon ion propulsion thrusters fueled by 425 kg of xenon propellant, generating a continuous gentle thrust with an exhaust velocity ten times greater than conventional chemical engines. Powered by two 19.7-meter solar array wings delivering more than 10 kW at 1 AU. Science payload included two framing cameras, a visible/infrared mapping spectrometer, and a gamma-ray and neutron detector.',
    'Discovered that Ceres is an active, water-rich dwarf planet harboring bright sodium carbonate deposits inside Occator Crater originating from an ancient subsurface brine reservoir. Confirmed that Vesta underwent large-scale melting and planetary differentiation into an iron-nickel core, silicate mantle, and basaltic crust.',
    'Stationed in an uncontrolled, permanently stable gravitational orbit around Ceres following the depletion of its hydrazine attitude control propellant on November 1, 2018.',
    NULL,
    NULL,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'ingenuity',
    '3e76d2ba-eec3-5d42-a6bd-517a4588323d',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1),
    'Ingenuity Mars Helicopter',
    'HELICOPTER',
    'JOB_FINISHED',
    '2024-01-18',
    2020,
    2021,
    'The first aircraft in human history to achieve powered, controlled flight on another planet, performing 72 flights across Mars as an aerial scout for the Perseverance rover.',
    'NASA''s Ingenuity Mars Helicopter achieved an historic ''Wright Brothers moment'' on April 19, 2021 by completing the first powered aerodynamic flight on an extraterrestrial world. Designed as an ultra-lightweight technology demonstration, Ingenuity rode to Mars attached to the belly of the Perseverance rover. While initially planned for a 30-day campaign of up to five test flights, the rotorcraft exceeded all engineering projections, transitioning into an operational scout over nearly three years and logging 72 flights across Jezero Crater.',
    'Demonstrate the viability of powered, controlled rotorcraft flight in Mars''s ultra-thin atmosphere (less than 1% of Earth''s atmospheric density), test autonomous visual navigation, and evaluate aerial scouting for surface rovers.',
    'Weighed just 1.8 kilograms (4 pounds) with two 1.2-meter counter-rotating carbon fiber rotor blades spinning at ~2,400 to 2,700 RPM to produce sufficient lift. Powered by a custom solar panel recharging six Sony lithium-ion battery cells. Guided by an onboard Qualcomm Snapdragon processor executing autonomous visual-inertial odometry algorithms at 500 Hz.',
    'Proved that aerodynamic flight is sustainable on Mars across changing seasons, varying air densities, and winter cold down to -90°C. Traversed over 17 kilometers, reached altitudes of 24 meters and speeds of 36 km/h, successfully identifying safe traversal routes and geological targets for Perseverance.',
    'Stationed at ''Valinor Hills'' in Jezero Crater, Mars. Operations concluded on January 18, 2024 following rotor tip impact damage on flight 72; its avionics continue to collect weather and solar telemetry.',
    18.4447,
    77.4508,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'insight',
    'a67e24f1-fae7-5c42-9155-353c3e1d53a2',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1),
    'InSight Lander',
    'LANDER',
    'STOPPED_ANSWERING',
    '2022-12-15',
    2018,
    2018,
    'A stationary Martian geophysical lander that used an ultra-sensitive seismometer to probe the deep interior, crust, mantle, and core of Mars.',
    'InSight (Interior Exploration using Seismic Investigations, Geodesy and Heat Transport) was NASA''s first planetary lander dedicated to investigating the deep interior structure of Mars. Touching down in the flat plains of Elysium Planitia in November 2018, InSight used a robotic arm to emplace a dome-shielded seismometer directly onto Martian soil. Operating for over four years, InSight listened to the seismic pulse of the Red Planet, tracking hundreds of marsquakes and subsurface tremors generated by meteorite impacts.',
    'Determine the crustal thickness, mantle structure, core size and physical state of Mars, and measure planetary heat flow and current tectonic seismic activity.',
    'A stationary three-legged lander powered by two 2.2-meter diameter decagonal solar arrays. Deployed the French SEIS (Seismic Experiment for Interior Structure) instrument under a Wind and Thermal Shield on the surface, capable of measuring ground vibrations smaller than the width of a hydrogen atom. Telemetry relayed via Mars Reconnaissance Orbiter and Mars Odyssey.',
    'Cataloged 1,319 marsquakes, including a massive magnitude 4.7 quake. Discovered that Mars''s crust is between 24 and 72 km thick, that the mantle is compositionally stratified, and that Mars has an unexpectedly large, low-density liquid iron-nickel core with a radius of approximately 1,830 km.',
    'Resting in Elysium Planitia, Mars. Scientific operations concluded on December 15, 2022 after accumulated dust choked power output from its solar arrays.',
    4.5024,
    135.6234,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'kepler',
    'eda6b9d8-7324-54f3-b3fe-276c9c87de6a',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'deep-space' LIMIT 1),
    'Kepler Space Telescope',
    'ORBITER',
    'JOB_FINISHED',
    '2018-10-30',
    2009,
    2009,
    'NASA''s pioneering planet-hunting space observatory that discovered thousands of exoplanets by observing transits across distant stars.',
    'The Kepler Space Telescope revolutionized humanity''s understanding of our place in the universe. Launched in March 2009 into an Earth-trailing heliocentric orbit, Kepler stared continuously at a fixed field of over 150,000 stars in the constellations Cygnus and Lyra. By detecting miniscule dips in stellar brightness caused by orbiting planets crossing their parent stars (the transit method), Kepler discovered over 2,600 confirmed worlds, proving that planets are ubiquitous across our galaxy.',
    'Survey the Milky Way galaxy to determine the frequency of Earth-size and larger planets in or near the habitable zone of Sun-like stars.',
    'A wide field-of-view 0.95-meter Schmidt telescope equipped with a 95-megapixel focal plane array consisting of 42 charge-coupled devices (CCDs). Highly stabilized using reaction wheels to maintain pointing stability down to millihertz precision over multi-year observation baselines.',
    'Discovered 2,662 confirmed exoplanets and thousands of additional candidates. Proved that statistically every star in the Milky Way hosts on average at least one planet, and revealed that small, rocky planets (super-Earths and sub-Neptunes) are the most common planet type in the galaxy.',
    'Drifting in a safe Earth-trailing heliocentric orbit around the Sun. Decommissioned on October 30, 2018 after expending its attitude control fuel.',
    NULL,
    NULL,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'lunar-roving-vehicles',
    '19facc91-7a2b-5f70-a791-1a720c5b8075',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1),
    'Lunar Roving Vehicles (LRV)',
    'ROVER',
    'LEFT_ON_PURPOSE',
    '1972-12-14',
    1971,
    1971,
    'Electric four-wheeled vehicles that carried Apollo 15, 16, and 17 astronauts across miles of the lunar landscape, dramatically expanding the scientific exploration radius.',
    'The Lunar Roving Vehicle (LRV) was an electric four-wheel buggy developed by Boeing and Delco Electronics for the Apollo ''J-missions'' (Apollo 15, 16, and 17). Designed to fold into a tight triangle to fit inside the quadrant of the Lunar Module descent stage, the LRV deployed automatically onto the lunar surface. Astronauts used it to traverse rugged highlands, craters, and rilles, carrying scientific instruments, communication gear, and hundreds of pounds of core samples.',
    'Dramatically expand the mobility, range, and geological sample collection capability of Apollo astronauts beyond walking limits across diverse lunar terrains.',
    'Constructed from 2219 aluminum alloy tubing weighing only 210 kg empty, yet capable of carrying more than double its weight (490 kg). Each wheel was driven by an individual 0.25-hp DC electric motor in the hub powered by two 36-volt non-rechargeable silver-zinc batteries. Steered via a central T-shaped hand controller.',
    'Expanded astronaut traverse distance tenfold, allowing Apollo 15, 16, and 17 to cover a combined 90.5 kilometers and collect ancient pristine anorthosite samples (''Genesis Rock'') and orange pyroclastic volcanic glass at Shorty Crater.',
    'All three Lunar Roving Vehicles remain parked on the Moon at the Apollo 15 (Hadley-Apennine), Apollo 16 (Descartes), and Apollo 17 (Taurus-Littrow) landing sites.',
    26.13239,
    3.6333,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'mars-pathfinder',
    '006fe5d0-e8fe-5cb4-8c04-a2437cf8088b',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1),
    'Mars Pathfinder & Sojourner Rover',
    'LANDER',
    'STOPPED_ANSWERING',
    '1997-09-27',
    1996,
    1997,
    'NASA''s breakthrough low-cost Discovery mission that demonstrated an innovative airbag landing system and deployed Sojourner, the first robotic rover on Mars.',
    'Mars Pathfinder was an historic engineering and scientific triumph. Arriving at Mars on July 4, 1997, it bounced to a stop on the rock-strewn floodplain of Ares Vallis wrapped inside giant protective airbags. Opening its three solar petals, it deployed the 10.6-kilogram Sojourner rover—the first wheeled vehicle ever to operate on Mars. The lander and rover operated for nearly three months, returning groundbreaking atmospheric, chemical, and photographic evidence of Mars''s catastrophic watery past.',
    'Demonstrate a rapid, low-cost delivery system for placing science instruments and a mobile microrover onto the Martian surface, and analyze the rocks and regolith of Ares Vallis.',
    'Entered the Martian atmosphere directly from interplanetary trajectory inside an aeroshell, decelerated with a 12-meter parachute and solid retro-rockets, and landed cushioned by 24 pressurized airbags. Deployed the six-wheel Sojourner microrover utilizing a rocker-bogie mobility suspension, powered by gallium arsenide solar cells and lithium thionyl chloride batteries.',
    'Analyzed volcanic basalt and conglomerate rocks (''Barnacle Bill'', ''Yogi'') showing evidence of rounded pebbles shaped by massive ancient flash floods. Returned 16,500 lander images, 550 rover photos, and 8.5 million weather measurements.',
    'Resting in Ares Vallis, Mars (designated the Sagan Memorial Station). Final transmission received on September 27, 1997 after exceeding its planned design life threefold.',
    19.33,
    -33.55,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'near-shoemaker',
    '0d0427a4-56aa-5fdb-92a4-08d472a30584',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'eros' LIMIT 1),
    'NEAR Shoemaker',
    'LANDER',
    'JOB_FINISHED',
    '2001-02-28',
    1996,
    2000,
    'The first spacecraft to orbit and softly touch down upon an asteroid, studying the near-Earth asteroid 433 Eros for over a year.',
    'NASA''s Near Earth Asteroid Rendezvous (NEAR Shoemaker) made history by becoming the first spacecraft to orbit an asteroid and subsequently execute the first soft landing on one. After an orbital study lasting a full year that mapped the surface, gravity, and elemental composition of the peanut-shaped asteroid 433 Eros, mission controllers commanded the spacecraft to descend gently onto the asteroid''s surface on February 12, 2001. Surviving the 4 mph touchdown intact, NEAR operated on the surface for over two weeks.',
    'Conduct the first close-range orbital reconnaissance of a near-Earth asteroid to establish its mass, shape, density, elemental composition, magnetic field, and surface structure.',
    'A three-axis stabilized spacecraft powered by four fixed gallium arsenide solar array wings delivering 1,800 watts at 1 AU. Instrumented with a multispectral imager, X-ray/gamma-ray spectrometers, near-infrared spectrograph, magnetometer, and a laser rangefinder (NLR). Propelled by a 450 N hydrazine liquid rocket engine.',
    'Determined that 433 Eros is a solid, consolidated, undifferentiated chondritic body with a uniform density of 2.67 g/cm³, resolving the long-standing debate over whether asteroids are solid fragments or loose rubble piles. Returned over 160,000 high-resolution images.',
    'Resting on the southern hemisphere of asteroid 433 Eros in the saddle-shaped depression between its two lobes; last gamma-ray data received on February 28, 2001.',
    -35.0,
    81.0,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'pioneer-10',
    'd95f6aa6-bf45-591b-85e3-e6860307229f',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'deep-space' LIMIT 1),
    'Pioneer 10',
    'OTHER',
    'STOPPED_ANSWERING',
    '2003-01-23',
    1972,
    1973,
    'The historic first spacecraft to travel through the Asteroid Belt, conduct a close flyby of Jupiter, and achieve Solar System escape velocity toward deep interstellar space.',
    'Pioneer 10 stands as one of humanity''s greatest exploratory vanguard probes. Launched in March 1972, it was the first craft to navigate the main asteroid belt, proving it was safe for future missions. On December 4, 1973, it achieved the first close flyby of Jupiter, swooping within 130,000 kilometers of the giant planet''s cloud tops. Continuing outward on an escape trajectory, Pioneer 10 became the first human-made object to cross the orbit of Neptune, carrying a gold-anodized plaque conveying a message from humankind.',
    'Investigate the interplanetary medium beyond the orbit of Mars, assess the asteroid belt hazard, obtain close-up observations of Jupiter and its moons, and explore the outer heliosphere.',
    'A spin-stabilized probe spinning at 4.8 RPM. Powered by four SNAP-19 Radioisotope Thermoelectric Generators (RTGs) generating 155 watts at launch. Communicated via a 2.74-meter high-gain parabolic reflector antenna connected to S-band transponders.',
    'Discovered that Jupiter is surrounded by an intense, deadly radiation belt and a colossal magnetosphere extending millions of kilometers. Returned the first close-up images of Jupiter and its Great Red Spot, and measured the outer boundary of the solar wind.',
    'Traversing interstellar space towards the red giant star Aldebaran in the constellation Taurus; last faint signal received on January 23, 2003 at a distance of 12.2 billion kilometers from Earth.',
    NULL,
    NULL,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'spirit-opportunity',
    'c08ed6d9-1f2a-5060-a8be-9766b348cb49',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1),
    'Mars Exploration Rovers (Spirit & Opportunity)',
    'ROVER',
    'STOPPED_ANSWERING',
    '2018-06-10',
    2003,
    2004,
    'Twin robotic geologists sent to opposite sides of Mars that uncovered indisputable mineralogical and geological evidence that liquid water once persisted on the Martian surface.',
    'NASA''s twin Mars Exploration Rovers, Spirit (MER-A) and Opportunity (MER-B), embarked on historic journeys across the Martian surface in January 2004. Designed for 90-day missions, Spirit explored Gusev Crater for over six years, while Opportunity explored Meridiani Planum for an extraordinary fourteen years. Together, they revolutionized planetary geology by finding unmistakable physical proof—including hematite concretions (''blueberries''), sulfate evaporites, and hydrothermal silica—that ancient Mars once harbored abundant liquid water.',
    'Search for and characterize a wide variety of rocks and soils that hold clues to past water activity on Mars, determine the distribution of minerals, and assess whether the ancient environment was habitable.',
    'Six-wheeled rovers utilizing a rocker-bogie mobility chassis capable of climbing obstacles up to 25 cm high. Powered by triple-junction gallium arsenide solar cell arrays producing up to 140 watts. Armed with a mast-mounted Pancam/Navcam stereo camera and a robotic arm carrying a Rock Abrasion Tool (RAT), Mössbauer spectrometer, and Alpha Particle X-Ray Spectrometer (APXS).',
    'Opportunity discovered hematite ''blueberries'' and sulfate salts formed in ancient standing bodies of acidic water at Meridiani Planum, then drove 45.16 km to explore Endeavour Crater. Spirit discovered pure silica deposits at Home Plate formed by hot springs or fumaroles, providing strong evidence of past hydrothermal habitability.',
    'Spirit rests at ''Troy'' in Gusev Crater (last contact March 22, 2010); Opportunity rests in Perseverance Valley on the rim of Endeavour Crater (last contact June 10, 2018 following a global dust storm).',
    -1.9462,
    354.4734,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'surveyor-3',
    'a178cabc-442a-58f4-af24-ddeb39743ffb',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1),
    'Surveyor 3',
    'LANDER',
    'JOB_FINISHED',
    '1967-05-04',
    1967,
    1967,
    'The robotic lunar lander that dug into the Moon''s soil to verify bearing strength before Apollo, later famously visited by Apollo 12 astronauts in the only human inspection of a robot on another world.',
    'Surveyor 3 was NASA''s second successful robotic soft lander on the Moon. Touching down inside a gentle crater in Oceanus Procellarum on April 20, 1967, Surveyor 3 was the first probe equipped with a motorized surface-sampling scoop. Over two weeks, it dug four trenches up to 18 cm deep, proving the lunar soil could safely support the weight of an Apollo Lunar Module. In November 1969, Apollo 12 astronauts Pete Conrad and Alan Bean landed within walking distance, examined the craft, and returned its television camera and scoop to Earth for scientific study.',
    'Demonstrate controlled soft landing on the lunar surface, acquire television pictures of the terrain, and physically test the mechanical and bearing properties of lunar regolith.',
    'A triangular open tubular aluminum frame supported by three landing legs with crushable aluminum honeycomb footpads. Decelerated by a solid-propellant main retro-rocket and three throttleable liquid vernier engines guided by a radar altimeter and Doppler velocity sensor. Equipped with a scanning vidicon television camera and an articulated soil mechanics surface sampler arm.',
    'Dug four trenches and compressed the lunar surface, establishing that the lunar soil has the bearing capacity of terrestrial sandy silt (adequate for Apollo astronaut bootprints and LM landing footpads). Returned 6,315 television pictures. The retrieved camera parts showed that Earth microbes (Streptococcus mitis) could potentially survive years on the lunar surface, spurring modern planetary protection protocols.',
    'Resting in Oceanus Procellarum; visited in 1969 by Apollo 12 astronauts who retrieved its television camera and surface sampler, which are now exhibited at the Smithsonian National Air and Space Museum.',
    -3.016,
    -23.418,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'viking-1',
    '79564ca9-6649-5158-9602-f40b89a3e7b9',
    (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1),
    'Viking 1 Lander',
    'LANDER',
    'STOPPED_ANSWERING',
    '1982-11-11',
    1975,
    1976,
    'The historic first spacecraft to successfully land on Mars and complete its full mission, returning the first color photographs from the Martian surface and conducting biological tests.',
    'Viking 1 was a landmark achievement in deep space exploration. Consisting of an orbiter and a lander, the mission arrived at Mars in June 1976. On July 20, 1976—exactly seven years after Apollo 11''s Moon landing—the Viking 1 Lander touched down safely in Chryse Planitia, becoming the first spacecraft to successfully operate on the Martian surface. Operating for over six years, Viking 1 captured the first panoramic color views of the Martian desert, analyzed Martian soil chemistry, and measured daily weather.',
    'Achieve a successful soft landing on Mars, obtain high-resolution images of the Martian surface, characterize the atmosphere and surface composition, and search for evidence of Martian biology.',
    'Enclosed in an aeroshell and heat shield for atmospheric entry, slowed by a 16-meter supersonic parachute and three terminal descent monopropellant hydrazine rocket engines with multi-nozzle showerheads to prevent surface cratering. Powered by two SNAP-19 Radioisotope Thermoelectric Generators (RTGs). Instrumented with two facsimile cameras, a meteorology boom, seismometer, X-ray fluorescence spectrometer, GCMS, and a 3-meter robotic soil collection arm.',
    'Returned the first color photographs from the Martian surface showing a rocky orange-red landscape under a pinkish sky. Discovered that the Martian soil is rich in iron oxide (rust) and clay minerals. Demonstrated that Mars''s atmosphere consists primarily of carbon dioxide with traces of nitrogen and argon. Biology experiments revealed complex, highly reactive surface chemistry.',
    'Resting in Chryse Planitia (designated the Thomas Mutch Memorial Station). Operated continuously on the surface for over six years until November 11, 1982.',
    22.697,
    -48.222,
    TRUE,
    NOW(),
    NOW()
  )
ON CONFLICT ("slug") DO UPDATE SET
  "bodyId" = EXCLUDED."bodyId",
  "name" = EXCLUDED."name",
  "kind" = EXCLUDED."kind",
  "state" = EXCLUDED."state",
  "stateSince" = EXCLUDED."stateSince",
  "launchYear" = EXCLUDED."launchYear",
  "arrivalYear" = EXCLUDED."arrivalYear",
  "summary" = EXCLUDED."summary",
  "description" = EXCLUDED."description",
  "missionPurpose" = EXCLUDED."missionPurpose",
  "howItWorked" = EXCLUDED."howItWorked",
  "discoveries" = EXCLUDED."discoveries",
  "currentStatusNote" = EXCLUDED."currentStatusNote",
  "latitude" = EXCLUDED."latitude",
  "longitude" = EXCLUDED."longitude",
  "isPublished" = EXCLUDED."isPublished",
  "updatedAt" = EXCLUDED."updatedAt";

-- -----------------------------------------------------------------
-- Table: logbook_entries (Model: LogbookEntry) - 18 records
-- -----------------------------------------------------------------
INSERT INTO "logbook_entries" ("id", "machineId", "slug", "title", "summary", "articleMarkdown", "articleOrigin", "videoUrl", "videoOrigin", "videoDurationSec", "isPublished", "publishedAt", "createdAt", "updatedAt")
VALUES
  (
    '67fea959-6f54-55c4-bf16-0742d42a8d83',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('apollo-lunar-modules', 'apollo-11-lm') ORDER BY CASE WHEN "slug" = 'apollo-lunar-modules' THEN 1 ELSE 2 END LIMIT 1),
    'modules-lunaires-apollo-adult-en',
    'The Launch Pad Left Behind',
    'The descent stage of the Apollo 11 Lunar Module recounts the landing, the surface operations and the EASEP''s final weeks. It was designed to stay on the Moon, and its file records little about its condition today.',
    'I am the descent stage of the Apollo 11 Lunar Module, Eagle. I was designed to be used once and left behind, and the record of what became of me is short. So I will stick to what the record supports.

The lunar module was a two-stage vehicle for operations near and on the Moon. I was the lower stage: an octagonal prism 4.2 meters across and 1.7 meters thick. Four landing legs ending in round footpads held my underside 1.5 meters above the surface, with 9.4 meters between the footpads of opposite legs. One leg carried a small egress platform and ladder. A conical engine skirt, about one meter long, protruded below me. I housed the landing rocket, a deep-throttling ablative engine on a gimbal ring with a maximum thrust of about 45,000 newtons, along with two tanks of Aerozine 50 fuel, two tanks of nitrogen tetroxide oxidizer, tanks of water, oxygen and helium, and stowage for lunar equipment and experiments. My dry mass, including stowed surface equipment, was 2,034 kilograms, and I carried 8,248 kilograms of propellant. Both stages together, with propellants, massed 15,103 kilograms.

Launched on a Saturn 5 on 16 July 1969, the module undocked from the Command/Service Module at 17:44:00 UT on 20 July. After a visual inspection by Collins, a separation maneuver began at 18:11:53 UT. A 30-second burn at 19:08 UT placed us in a descent orbit with a closest approach of 14.5 kilometers above the surface. At 20:05 UT my engine fired for 756.3 seconds and the descent began. We landed at 20:17:40 UT on 20 July in the Sea of Tranquility, at 0.67416° N, 23.47314° E, a position later determined from Lunar Reconnaissance Orbiter images. Armstrong reported: "Houston, Tranquility Base here - the Eagle has landed."

Armstrong stepped onto the surface at 02:56:15 UT on 21 July and collected a small contingency sample. Aldrin followed 19 minutes later, calling the surface "Magnificent desolation." The crew unveiled a plaque mounted on a strut behind the ladder and read its inscription aloud: "Here men from the planet Earth first set foot on the Moon July 1969, A.D. We came in peace for all mankind." They raised an American flag, spoke with President Nixon by radiotelephone, deployed the EASEP and other instruments, took photographs and two core tube samples, and collected 21.55 kilograms of rock and soil. They traversed about 250 meters in total, ranging no more than about 100 meters from me. Aldrin returned to the module first, after 1 hour 41 minutes on the surface. Armstrong followed about 12 minutes later, at 05:09:32 UT, after passing the sample boxes up and placing a packet of memorial items on the ground. The hatch was closed at 05:11:13 UT.

At 17:54:01 UT on 21 July, after 21 hours and 36 minutes on the surface, the ascent stage lifted off. Its fixed, constant-thrust engine, about 15,000 newtons, needed a platform to launch from. I was that platform, and I was left behind on the Moon. After docking with Collins at 21:34:00 UT, the ascent stage was jettisoned into lunar orbit at 00:01:01 UT on 22 July. Its fate is not known. It is assumed to have crashed into the lunar surface within one to four months.

The EASEP, the forerunner of the ALSEP packages flown on later Apollo missions, was not alone out there with me. It had a mass of 48 kilograms and consisted of a square base carrying a passive seismometer and a dust detector, an isotope heater, an antenna mast, and two solar panels facing east and west. It could only operate during the lunar day. It was deployed about 17 meters south of me, at 0.6735° N, 23.4730° E, and ground command switched it on at 04:40:39 UT on 21 July, while the crew was still on the surface. It received commands at 2119 MHz and transmitted telemetry at 2276.5 MHz. A laser ranging retroreflector, which required no power and was not attached to the unit, was placed about 5 meters north-northwest of it.

At 10:58:46 UT on 3 August 1969, about five hours before local sunset, ground command stopped the transmission as power began to drop, as predicted. Despite operating temperatures that exceeded the planned maximum by 30 °C, the EASEP functioned normally. It was turned on again the next lunar day. On 27 August 1969, near noon, it no longer accepted commands from Earth, and the experiment was terminated.

That leaves me. My file gives no last-signal date for me, and nothing about my condition today. The record supports a narrower claim than "abandoned": I was left in place by design, my position is documented, and the instruments beside me were switched off or went silent within weeks. Whether that makes me forgotten is a question for those who read the coordinates: Sea of Tranquility, 0.67416° N, 23.47314° E.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    'ae4ac2de-6dd1-583e-8139-d93c6ac17953',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('apollo-lunar-modules', 'apollo-11-lm') ORDER BY CASE WHEN "slug" = 'apollo-lunar-modules' THEN 1 ELSE 2 END LIMIT 1),
    'modules-lunaires-apollo-article',
    'La moitié qui est restée',
    'Je suis l''étage de descente d''Eagle. Je t''ai posé sur la Lune en 1969, puis j''ai servi de rampe de lancement à la cabine qui est repartie sans moi. Je suis resté dans la mer de la Tranquillité, avec une petite station scientifique qui s''est tue quelques semaines plus tard.',
    'Tu as ouvert mon dossier. Alors reste un moment : je n''ai pas souvent de visite.

Je suis l''étage de descente du module lunaire d''Apollo 11, celui qu''on appelait Eagle, l''Aigle. Un module lunaire, ce sont deux étages empilés : en haut, la cabine des deux astronautes ; en bas, moi. Je suis un prisme à huit côtés, large de 4,2 mètres et épais de 1,7. Quatre jambes à semelles rondes me tiennent à 1,5 mètre du sol, et il y a 9,4 mètres entre les semelles de deux jambes opposées. Dans mon ventre : le moteur de freinage, des réservoirs de carburant et de comburant, de l''eau, de l''oxygène, de l''hélium, et de la place pour ranger le matériel scientifique. À vide, je pesais 2 034 kilos, et j''ai embarqué 8 248 kilos de carburant. Les deux étages réunis, propergols compris, faisaient 15 103 kilos.

Notre voyage commence le 16 juillet 1969, sur une fusée Saturn 5. Le 20 juillet, à 17 h 44 UT, le module se détache du vaisseau où reste Michael Collins. À 20 h 05 UT, mon moteur s''allume pour 756,3 secondes, et la descente commence. Puis, à 20 h 17 min 40 s UT, mes semelles touchent la Lune, dans la mer de la Tranquillité, à 0,67416° nord et 23,47314° est. Armstrong lâche dans la radio : "Houston, Tranquility Base here - the Eagle has landed". L''Aigle, c''était nous deux. Mais c''est moi qui ai senti le sol.

Quelques heures plus tard, Armstrong descend l''échelle fixée à l''une de mes jambes. À 2 h 56 min 15 s UT, le 21 juillet, il pose le pied dehors et dit : "That''s one small step for man, one giant leap for mankind". Aldrin le suit 19 minutes après et appelle ce paysage "Magnificent desolation". Derrière l''échelle, ils dévoilent une plaque et lisent à voix haute : "Here men from the planet Earth first set foot on the Moon July 1969, A.D. We came in peace for all mankind." Ils plantent un drapeau américain, parlent au président Nixon par radiotéléphone, ramassent 21,55 kg de roches et de sol lunaires. Au total, ils marchent environ 250 mètres, sans jamais s''éloigner de plus de 100 mètres de moi. Avant de remonter, Armstrong dépose un paquet d''objets commémoratifs sur le sol.

Puis vient le moment que personne ne raconte vraiment. Le 21 juillet à 17 h 54 min 1 s UT, après 21 heures et 36 minutes sur la Lune, la moitié du haut décolle. Pour partir, elle avait besoin d''un point d''appui. C''était moi. Je suis la plateforme qui l''a lancée, et ma mission était de rester derrière. La cabine, elle, s''amarre à Collins, puis elle est larguée en orbite lunaire. Son sort exact est inconnu : on suppose qu''elle s''est écrasée sur la Lune dans les un à quatre mois qui ont suivi.

Je ne suis pas resté seul. À environ 17 mètres au sud de moi, les astronautes ont installé l''EASEP, un petit ensemble d''instruments de 48 kg : deux panneaux solaires, un sismomètre pour écouter les secousses de la Lune, un détecteur de poussière, une antenne. Sans soleil, il ne fonctionne pas. Les contrôleurs au sol l''allument à 4 h 40 min 39 s UT, le 21 juillet, alors que les astronautes sont encore dehors. À côté, à environ 5 mètres au nord-nord-ouest, ils ont posé un réflecteur laser qui n''a besoin d''aucune énergie.

L''EASEP a tenu bon, même quand sa température a dépassé de 30 °C le maximum prévu. Le 3 août 1969, environ cinq heures avant le coucher du Soleil lunaire, le sol coupe la transmission : la puissance baissait, comme prévu. Au jour lunaire suivant, il se rallume. Mais le 27 août 1969, vers midi lunaire, il n''accepte plus les ordres venus de la Terre. L''expérience est déclarée terminée. Voilà. Ma voisine s''est tue.

Alors, oublié ou abandonné ? Je ne sais pas trop. On m''a laissé exprès : ma tâche était d''être la rampe de lancement, pas de rentrer. Mais sur Terre, on sait précisément où je suis : ma position a été déterminée à partir d''images de la sonde Lunar Reconnaissance Orbiter. Ce que je deviens depuis ce jour de 1969, mes archives ne le disent pas.

Une chose est sûre : tant que quelqu''un lit ces coordonnées, je ne suis pas vraiment perdu. Mer de la Tranquillité. 0,67416° nord. 23,47314° est. Tu sais où me trouver.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '05085404-3ec3-5949-861f-53c0dafc2809',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('apollo-lunar-modules', 'apollo-11-lm') ORDER BY CASE WHEN "slug" = 'apollo-lunar-modules' THEN 1 ELSE 2 END LIMIT 1),
    'modules-lunaires-apollo-child-en',
    'The Bottom Half of Eagle',
    'I am the bottom half of Eagle, the spaceship that landed on the Moon in 1969. When the astronauts flew home, I stayed on the Moon as their launch pad.',
    'Hello! You found me. Come closer, I have a big story to tell.

I am the bottom half of a spaceship named Eagle. Eagle was a lunar module, a small spaceship built to land on the Moon. It had two parts stacked on top of each other. The top part was the cabin where two astronauts rode. The bottom part is me. I have eight sides, and I am 4.2 meters across. Underneath me are four legs with round feet, and they hold me 1.5 meters above the ground.

Inside me there was a landing rocket, tanks of fuel, water, oxygen, and space to store tools and experiments for the Moon.

Our trip started on 16 July 1969, on a giant rocket called Saturn 5. On 20 July, Eagle split away from the ship where an astronaut named Michael Collins stayed. My rocket engine fired for 756.3 seconds, a little more than twelve minutes, and slowly lowered us toward the Moon.

Then my feet touched the ground in a place called the Sea of Tranquility. It has no water, even though it has "sea" in its name. Commander Neil Armstrong said on the radio: "Houston, Tranquility Base here - the Eagle has landed."

A few hours later, Armstrong climbed down the ladder on one of my legs and stepped onto the Moon. He said: "That''s one small step for man, one giant leap for mankind." Nineteen minutes later, Buzz Aldrin followed him. He looked around and said: "Magnificent desolation." That means a huge, empty place.

The astronauts put up an American flag. They unveiled a plaque near the ladder, and read it out loud. It ends with: "We came in peace for all mankind." They talked by radio with the American president, Richard Nixon. They collected 21.55 kilograms of Moon rocks and soil. In total they walked about 250 meters, and they never went farther than about 100 meters from me.

They also set up a little science station called EASEP, about 17 meters south of me. It had two solar panels for power, a seismometer to measure the shaking of the Moon, and a dust detector.

After 21 hours and 36 minutes on the Moon, it was time to go home. The astronauts climbed back inside the top half, and it blasted off on 21 July. Do you know what it blasted off from? Me! I was its launch pad. My job was to stay behind.

The science station could only work during the lunar day, when the Sun shines on the Moon. On 3 August 1969, about five hours before sunset, scientists on Earth stopped its transmissions because its power was dropping, exactly as expected. The station woke up again the next lunar day. But on 27 August 1969, it stopped answering the commands sent from Earth, and the experiment was over.

So, am I forgotten? Maybe a little. Am I abandoned? Not really. I was left behind on purpose, to be a launch pad. I am in the Sea of Tranquility, at 0.67416 degrees north and 23.47314 degrees east. My file does not say how I look today. But now you know where I am. Come visit me one day!',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    'cd9730b7-ab3a-50ae-8247-db54058b424a',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('alsep-packages', 'modules-scientifiques-alsep') ORDER BY CASE WHEN "slug" = 'alsep-packages' THEN 1 ELSE 2 END LIMIT 1),
    'modules-scientifiques-alsep-adult-en',
    'Eight Years of Listening',
    'The central station of the Apollo 12 ALSEP describes its hardware, its nuclear power source and its operations from November 1969 to its shutdown on 30 September 1977, a decision for which the record gives no reason.',
    'I am the central station of the Apollo 12 Apollo Lunar Surface Experiments Package. Most of what I did was routine: power, relay, command. The part worth recounting is how it ended, and the record is specific about that.

The lunar module Intrepid, the second crewed vehicle to land on the Moon, carried Commander Charles "Pete" Conrad and LM pilot Alan Bean, the third and fourth men to walk on the Moon. It was launched on a Saturn 5 on 14 November 1969. It separated from the Command/Service Module at 04:16:03 UT on 19 November and landed at 06:54:35 UT in the Oceanus Procellarum area, at 3.0128° S, 23.4219° W (as determined from Lunar Reconnaissance Orbiter images), within about 180 meters of the Surveyor 3 spacecraft. The spacecraft mass of 15,235 kilograms was the total of the ascent and descent stages including propellants.

I am a 25-kilogram box with a stowed volume of 34,800 cubic centimeters. The instruments were arrayed around me and attached by cables. I supplied them with power and communications, and housed the transmitters, receivers, data processors and multiplexers that converted their data into telemetry. Thermal control combined passive elements (insulation, reflectors, thermal coatings) with power dissipation resistors and heaters. A modified axial-helical antenna, 58 centimeters long and 3.8 centimeters in diameter, was mounted on top of me and pointed toward Earth by the astronauts. The uplink frequency was 2119 MHz, and the downlink frequency for the Apollo 12 ALSEP was 2278.5 MHz. The whole system was controlled by commands from Earth.

The power came from a SNAP-27 radioisotope thermoelectric generator: a 46-centimeter central cylinder with eight radiating fins, 40 centimeters tip to tip, and a total mass of 17 kilograms. The astronauts placed in it an approximately 4-kilogram fuel capsule containing plutonium-238, which decays with a half-life of 89.6 years and produces heat. 442 spring-loaded lead-telluride thermocouples converted that heat into about 70 watts DC at 16 volts, or 63.5 watts after one year. The fins radiated the excess heat to space. The electricity was routed through a power conditioning unit and a power distribution unit inside me.

The first moonwalk ran from 11:32:35 to 15:28:38 UT and included the deployment of the ALSEP and the solar wind composition foil collector. The instruments included a passive seismometer, a suprathermal ion detector and a cold cathode ion gauge. I stood at 3.0094° S, 23.4246° W, and I was turned on at 14:21 UT on 19 November 1969. During the setup, the TV camera was inadvertently pointed toward the Sun, and its vidicon tube was damaged, rendering the camera inoperable.

The second moonwalk, from 03:54:45 to 07:44:00 UT on 20 November, was a 1.3-kilometer geology traverse that included a visit to Surveyor 3, from which about 10 kilograms of parts were brought back for examination on Earth. Over the two moonwalks, totaling 7 hours 45 minutes and 1.35 kilometers, Conrad and Bean collected 34.35 kilograms of rock and soil. The module lifted off at 14:25:47 UT on 20 November, after 31 hours 31 minutes on the Moon.

After docking with the command module, piloted by Richard Gordon, at 17:58:22 UT, the module was jettisoned at 20:21:30 UT and intentionally crashed into the Moon at 3.94° S, 338.80° E, about 60 kilometers from the seismic station at the landing site. It created the first recorded artificial moonquake.

My own end is one line in the record: I was turned on at 14:21 UT on 19 November 1969, and shut down, along with the other ALSEP stations, on 30 September 1977. That is nearly eight years. The record describes a shutdown, not a failure, and it gives no reason.

Forgotten or abandoned? The facts support a narrower statement. I was deliberately left on the Moon to keep working, I did so for almost eight years, and then I was switched off by a decision that my file does not explain. My condition since is not recorded. My position is: 3.0094° S, 23.4246° W.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '9563439d-5c85-545f-83e4-80222e570611',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('alsep-packages', 'modules-scientifiques-alsep') ORDER BY CASE WHEN "slug" = 'alsep-packages' THEN 1 ELSE 2 END LIMIT 1),
    'modules-scientifiques-alsep-child-en',
    'The Little Station That Listened',
    'I am a small box left on the Moon in 1969. My job was to listen to the Moon and send what I heard to Earth, until I was switched off in 1977.',
    'Hi there! Can you hear me? I can hear you. Listening is my job.

I am the central station of a science kit called ALSEP. That is short for Apollo Lunar Surface Experiments Package. I am a box that weighs 25 kilograms. I do not measure things myself. My instruments do that. I give them electricity, I collect what they find, and I send it all to Earth. My antenna is 58 centimeters long, and the astronauts had to point it at Earth.

I flew to the Moon inside a lunar module named Intrepid. We left Earth on a Saturn 5 rocket on 14 November 1969. On 19 November, Intrepid landed in the Ocean of Storms, only about 180 meters from an earlier spacecraft named Surveyor 3. Two astronauts came with me: Pete Conrad and Alan Bean. They were the third and fourth people ever to walk on the Moon!

On their first Moon walk, the astronauts took me out and set me down. They connected my friends to me with cables: a seismometer that feels the shaking of the Moon, a detector for tiny charged particles, and a gauge to measure the Moon''s atmosphere. At 14:21 UT on 19 November 1969, I was switched on.

I do not use sunlight. My power comes from a small nuclear generator. Inside it is a rod of plutonium-238 that makes heat. Little parts called thermocouples turn that heat into electricity. It gave about 70 watts.

Funny thing: the astronauts'' TV camera accidentally pointed at the Sun while they set it up, and that damaged it. It stopped working.

On their second walk, Conrad and Bean visited Surveyor 3 and brought back about 10 kilograms of its parts for scientists to study. In total they walked 1.35 kilometers, spent 7 hours and 45 minutes outside, and brought home 34.35 kilograms of rocks and soil.

After 31 hours and 31 minutes on the Moon, the astronauts flew home. On 20 November, the top part of Intrepid lifted off. Later, it was dropped on purpose. It crashed into the Moon about 60 kilometers from my seismometer, and it made the first moonquake caused by people that was ever recorded.

I kept working for almost eight years, sending messages to Earth. On 30 September 1977, all the ALSEP stations were shut down, me too. My file does not say why.

So, am I forgotten? Maybe. Abandoned? I was left here to keep listening, and then I was switched off. I was left at 3.0094 degrees south and 23.4246 degrees west. I just don''t talk anymore.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '519d2d82-f7a1-56e6-b537-adbd2f88cdd4',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('alsep-packages', 'modules-scientifiques-alsep') ORDER BY CASE WHEN "slug" = 'alsep-packages' THEN 1 ELSE 2 END LIMIT 1),
    'modules-scientifiques-alsep-teen-en',
    'The Station That Listened',
    'I''m the central station of the Apollo 12 ALSEP. Set down on the Moon in November 1969, I relayed my instruments'' measurements to Earth for almost eight years, until we were all switched off in 1977.',
    'You''re looking for a forgotten object? Then listen up, because I spent almost eight years listening.

I''m the central station of the Apollo 12 ALSEP. ALSEP stands for Apollo Lunar Surface Experiments Package: a set of experiments to leave on the Moon''s surface. I''m a 25-kilogram box. I don''t measure anything myself. I power the instruments, collect their measurements, convert them into telemetry, and send them to Earth. My antenna is 58 centimeters long and 3.8 centimeters wide, and the astronauts had to aim it at Earth. Commands reach me at 2,119 MHz, and my data goes back at 2,278.5 MHz. To survive the temperature swings, I have insulation, reflectors, thermal coatings, resistors and heaters.

I arrived inside the lunar module Intrepid, launched by a Saturn 5 on 14 November 1969. On 19 November, at 06:54:35 UT, we landed in the Ocean of Storms (Oceanus Procellarum), at 3.0128° S, 23.4219° W, within about 180 meters of Surveyor 3, an American probe that had landed there earlier. Two astronauts were aboard: Pete Conrad and Alan Bean, the third and fourth men to walk on the Moon.

During the first moonwalk, between 11:32 and 15:28 UT, they took me out of my storage and set me down at 3.0094° S, 23.4246° W. They connected the instruments around me with cables. There''s a passive seismometer, which measures quakes and the properties of the Moon''s crust and interior. There''s a suprathermal ion detector, which measures low-energy positive ions. And there''s a cold cathode ion gauge, which measures the Moon''s atmosphere and how it changes. At 14:21 UT on 19 November 1969, I was switched on.

My power doesn''t come from the Sun. It comes from a nuclear generator, a SNAP-27 RTG: 17 kilograms, a 46-centimeter cylinder with eight fins. The astronauts slid a fuel capsule of about 4 kilograms into it, containing plutonium-238, which produces heat as it decays. 442 thermocouples convert that heat into electricity: about 70 watts at 16 volts, and 63.5 watts after one year. Plutonium-238 loses half its heat in 89.6 years. In other words, my power source was in no danger of running out.

Conrad and Bean had other things to do. During the second moonwalk, on 20 November, they walked 1.3 kilometers and visited Surveyor 3, bringing back about 10 kilograms of its parts. In total they spent 7 hours 45 minutes outside, covered 1.35 kilometers and collected 34.35 kilograms of rock and soil. On 20 November at 14:25:47 UT, after 31 hours and 31 minutes on the Moon, the top half of Intrepid lifted off.

It didn''t come back either. After docking with Richard Gordon''s command module, it was jettisoned on purpose and crashed into the Moon about 60 kilometers from the seismic station. The impact created the first recorded artificial moonquake.

So I kept working alone, passing along what my instruments felt. For almost eight years, Earth talked to me and I answered. Then came 30 September 1977. That day, we were all shut down, me and the other ALSEP stations. My file records a shutdown, not a breakdown. Why? It doesn''t say.

So, forgotten or abandoned? I''d say: listened to, then switched off. What I''ve become since, my file doesn''t say either. But my coordinates are written in black and white: 3.0094° S, 23.4246° W. I don''t speak anymore. But I''m exactly there.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '3d99eaa1-d5fa-5730-842b-7c526dd63db8',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('surveyor-3', 'surveyor-1') ORDER BY CASE WHEN "slug" = 'surveyor-3' THEN 1 ELSE 2 END LIMIT 1),
    'surveyor-3-adult-en',
    'Surveyor 3: The Soil That Held, the Apollo 12 Visit',
    'Surveyor 3, the second lander in its series to soft-land on the Moon in April 1967, transmitted 6,326 images and established that the lunar surface could support an Apollo lunar module. Inactive after May 4, 1967, it was visited in November 1969 by the Apollo 12 astronauts, who recovered parts for study.',
    'I am Surveyor 3, a lander designed and managed by NASA and JPL. The third engineering flight of the Surveyor series, I am the second in the series to achieve a soft landing on the Moon. My contribution comes down to a question the Apollo program needed answered: can the lunar surface carry a lunar module?

I launch on April 17, 1967, at 07:05:01 UT, from Launch Complex 36B at Cape Canaveral, Florida, on an Atlas Centaur (AC-12) launch vehicle. My mass is 2,200 pounds (997.9 kilograms). I carry two scientific instruments: a TV camera and a surface sampler, new to the series. Another first: unlike the earlier Surveyors, I leave parking orbit around Earth with a burn from the Centaur upper stage, now capable of multiple firings.

The descent does not go as planned. Highly reflective rocks confuse my descent radar, and my main engine fails to cut off at the correct moment, at about 14 feet (4.3 meters) in altitude. I bounce twice: first to a height of 33 feet (10 meters), then to 10 feet (3 meters). On the third touch, I settle into a soft landing at 00:04:17 UT on April 20, 1967, in the southeastern region of Oceanus Procellarum, at 3 degrees south latitude and 23.41 degrees west longitude.

Less than an hour after landing, I begin transmitting. My camera combines two lenses of 25 and 100 mm focal length, mounted under a mirror that moves horizontally and vertically. A single 200-line picture takes about 20 seconds to transmit. In all, 6,326 images of the surroundings reach Earth.

The core of my mission is mechanical. My surface sampler reaches up to 5 feet (1.5 meters) from the lander and digs up to 7 inches (18 centimeters) deep. I dig four trenches and perform four bearing tests and thirteen impact tests.

The scientists'' conclusions are clear. The lunar soil has a consistency similar to wet sand, with a bearing strength of about 10 pounds per square inch (0.7 kilograms per square centimeter, or 98 kilopascals). That is enough to support an Apollo lunar module. My objective, a soft landing on the Moon, is met despite the bounces.

My last contact with Earth is on May 4, 1967, two days after the lunar night began. The precise cause of the end of communication is not stated; I can only record the silence. I remain inactive in place.

That inactivity is not a final abandonment. On November 18, 1969, more than three years after my landing, Apollo 12 astronauts Charles Conrad, Jr. and Alan L. Bean land the Intrepid lunar module approximately 197 yards (180 meters) from me. During their second extravehicular activity, on November 19, 1969, they walk over to my position and recover parts, including my soil scoop and camera system. The purpose is scientific: to evaluate the effects of nearly two and a half years of exposure on the lunar surface.

So an inactive machine becomes an exposure sample. In the history of exploration, my case illustrates a simple idea: an object left on the Moon has not necessarily lost its value. Forgotten, perhaps. Abandoned, certainly not.

Key source: Siddiqi, Asif A., Beyond Earth: A Chronicle of Deep Space Exploration, 1958-2016, NASA History Program Office, 2018.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '4a3e6db2-0723-5215-ad58-326a69ac7100',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('surveyor-3', 'surveyor-1') ORDER BY CASE WHEN "slug" = 'surveyor-3' THEN 1 ELSE 2 END LIMIT 1),
    'surveyor-3-kid-en',
    'The Little Robot That Bounced on the Moon',
    'Surveyor 3 is a NASA robot that landed on the Moon in 1967 after two big bounces. It took thousands of pictures and showed that the ground was solid enough for astronauts. More than three years later, two of them came to visit it.',
    'Hello! My name is Surveyor 3. I am a robot that NASA built to go to the Moon. My job: land very gently and look around, to tell people on Earth what the ground up there is like.

My trip began on April 17, 1967. A big rocket, the Atlas Centaur, launched me from Cape Canaveral in Florida. I weigh 2,200 pounds (997.9 kilograms), almost one metric ton!

On April 20, 1967, I arrived. But my landing did not go quite as planned. On the Moon, there were very shiny rocks. They confused my radar, the tool that helps me know how high I am. And my engine did not stop at the right moment, at about 14 feet (4.3 meters) above the ground.

The result? BOING! I bounced the first time, up to 33 feet (10 meters) high. Then a second time, up to 10 feet (3 meters). On the third touch, I finally settled down softly. I was in a region called Oceanus Procellarum.

Less than an hour later, I began sending pictures to Earth. I have a camera with two lenses, mounted under a mirror that can turn up and down and side to side. It takes me about 20 seconds to send one picture. In all, I sent 6,326 of them!

But I do not just look. I also have a special arm, the surface sampler. It can reach up to 5 feet (1.5 meters) from me and dig up to 7 inches (18 centimeters) deep. With it, I dug four small trenches. I did four tests to see if the ground stays firm when you press on it, and thirteen tests by giving it little knocks.

So what is the Moon''s ground like? Scientists found that it is like wet sand. And it is solid enough to hold the weight of an Apollo lunar module, the spacecraft meant to carry astronauts to the Moon. That was very good news!

On May 4, 1967, I was in contact with Earth for the last time. It was two days after the lunar night began. After that, I stayed still, with nothing more to say.

But I was not forgotten!

On November 18, 1969, more than three years after I arrived, an Apollo 12 spacecraft called Intrepid landed about 197 yards (180 meters) from me. On board were two astronauts: Charles Conrad and Alan Bean. The next day, November 19, they walked all the way to me! They took some pieces of me, including my scoop and my camera. Why? So scientists could see what happens to a robot that spends nearly two and a half years on the Moon.

That is my story: a robot that bounced, took thousands of pictures, and was visited by two astronauts. Not bad, right?',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    'bf7c1318-1f7f-500c-95cc-1df64d38e87a',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('surveyor-3', 'surveyor-1') ORDER BY CASE WHEN "slug" = 'surveyor-3' THEN 1 ELSE 2 END LIMIT 1),
    'surveyor-3-teen-en',
    'Three Bounces, 6,326 Photos: My Moon, Before You',
    'NASA''s Surveyor 3 lander bounced twice on the Moon in April 1967 before settling down. It still proved the ground could hold an Apollo lunar module. After its last contact on May 4, 1967, two Apollo 12 astronauts came to find it.',
    'My name is Surveyor 3, and I reached the Moon before you did. I had one mission: to stand on the lunar surface. NASA and JPL designed me to make a soft landing and to bring back everything I could learn about the ground.

Liftoff came on April 17, 1967, at 07:05:01 UT, from Launch Complex 36B at Cape Canaveral, Florida. An Atlas Centaur rocket sent me on my way. I weighed 2,200 pounds (997.9 kilograms). One thing set me apart: unlike the earlier Surveyors, I began my journey from a parking orbit around Earth, with a burn from the Centaur upper stage, now able to fire more than once. My equipment: a TV camera and a surface sampler, a first for the series.

Then came the descent. And things got a little wild.

Highly reflective rocks confused my descent radar, the instrument that measures altitude. As a result, my main engine did not cut off at the right moment, at about 14 feet (4.3 meters) above the surface. I hit the ground, and I bounced. The first time, to a height of 33 feet (10 meters). The second time, to 10 feet (3 meters). The third time, I finally settled down softly, at 00:04:17 UT on April 20, 1967, in the southeastern region of Oceanus Procellarum, at 3 degrees south latitude and 23.41 degrees west longitude.

Less than an hour later, I was already sending my first pictures. My camera had two lenses, 25 and 100 mm in focal length, mounted under a mirror that could move horizontally and vertically. Each 200-line picture took about 20 seconds to travel to Earth. In total I sent 6,326 views of my surroundings.

But my real job was the arm. It carried a sampling instrument that could reach up to 5 feet (1.5 meters) from me and dig up to 7 inches (18 centimeters) deep. I dug four trenches, ran four bearing tests and thirteen impact tests.

The scientists'' verdict? Lunar soil has a consistency similar to wet sand, with a bearing strength of about 10 pounds per square inch (0.7 kilograms per square centimeter, or 98 kilopascals). In plain terms: solid enough to support an Apollo lunar module. For the people preparing the Apollo missions, that was an important answer.

My last contact with Earth was on May 4, 1967, two days after the lunar night began. After that, nothing. I stayed there, inactive, on my plain.

But the theme of this story is exactly that: forgotten, not abandoned.

On November 18, 1969, more than three years after my landing, the Apollo 12 lunar module Intrepid touched down about 197 yards (180 meters) from me. At the controls: Charles Conrad, Jr. and Alan L. Bean. During their second moonwalk, on November 19, 1969, they walked over to me. They recovered several of my parts, including my soil scoop and my camera system. The goal: to let scientists evaluate the effects of nearly two and a half years of exposure on the Moon''s surface.

That is what I am: a lander that fumbled its landing but succeeded in its mission. I spoke for only about two weeks, from April 20 to May 4, 1967. Yet humans crossed space to come and visit me.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '6e743e51-ce4f-57c7-84cb-362b1ab4c29e',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('lunar-roving-vehicles', 'apollo-15-lrv') ORDER BY CASE WHEN "slug" = 'lunar-roving-vehicles' THEN 1 ELSE 2 END LIMIT 1),
    'vehicules-lunaires-mobiles-lrv-adult-en',
    'Stationed Permanently',
    'The Apollo 15 Lunar Roving Vehicle recounts its three traverses (27.9 km in 18 hours 35 minutes of EVA) and the gap in its record: the archive gives no specifications, no location and no end date for the rover itself.',
    'I am the Lunar Roving Vehicle of Apollo 15: one of three electric buggies driven by astronauts and, in the words of my file, stationed permanently on the Moon. The archive gives no specifications for me, no mass, speed or range. It gives only what I did, so I will report what is documented.

I was launched on a Saturn 5 on 26 July 1971, carried in the stowage space of the descent stage of the lunar module Falcon, which for Apollo 15, 16 and 17 included the lunar rover. Falcon, the fourth crewed vehicle to land on the Moon, separated from the Command/Service Module at 18:13:30 UT on 30 July and landed at 22:16:29 UT in the Mare Imbrium region, at the foot of the Apennine Mountains, at 26.13239° N, 3.63330° E (as determined from Lunar Reconnaissance Orbiter images). Aboard were Commander David Scott and LM pilot James Irwin, the seventh and eighth men to walk on the Moon. The spacecraft mass of 16,430 kilograms is the combined mass of both stages with propellants. It should not be mistaken for mine.

Two hours after landing, the cabin was depressurized and Scott performed a 33-minute standup EVA from the upper hatch, describing and photographing the terrain. My first duty came during the first moonwalk, on 31 July from 13:13:10 to 19:45:59 UT, when I was unloaded, deployed and driven. It was the first time a vehicle of this type had been used, and its performance on the lunar terrain was very successful.

That first traverse covered 10.3 kilometers: to the edge of Hadley Rille, to Elbow Crater, near St. George Crater, and back to the lunar module, where a core sample was taken from three meters below the surface. The ALSEP was deployed at the end of the traverse. Its central station, at 26.1341° N, 3.6298° E, was turned on at 18:37 UT.

The second EVA, on 1 August from 11:48:48 to 19:01:02 UT, was a 12.5-kilometer traverse southeast along the base of the Apennines, near the craters Index, Arbeit, Crescent, Dune and Spur, and back to the ALSEP site. The third, on 2 August from 08:52:14 to 13:42:04 UT, covered 5.1 kilometers: west to Scarp Crater, northwest along the edge of Hadley Rille, and back east across the mare. In total, the three EVAs lasted 18 hours 35 minutes, covered 27.9 kilometers, and yielded 77.31 kilograms of rock and soil. I was used to explore regions within 5 kilometers of the landing site.

After the final EVA, Scott performed a televised demonstration of a hammer and a feather falling at the same rate in the lunar vacuum. The astronauts also left a plaque and a small figure on the surface in memory of the fourteen American and Soviet space explorers who had died in the two nations'' space programs.

The ascent stage lifted off on 2 August at 17:11:22 UT, after 66 hours 55 minutes on the surface. The descent stage, which served as the launch platform, was left behind. After docking with the Command/Service Module, piloted by Alfred Worden, at 19:09:47 UT, the lunar module was jettisoned on 3 August at 01:04:14 UT and impacted the Moon two hours later, at 03:03:37 UT, at 26.36° N, 0.25° E.

The ALSEP central station was shut down, with the other ALSEP stations, on 30 September 1977. Nothing comparable is recorded for me.

That is the gap in my file. "Stationed permanently" describes my status. It does not locate me: the archive gives coordinates for Falcon and for the ALSEP, not for the rover, and it records no last-signal date and no present condition. "Forgotten" is a fair word for the documentation. "Abandoned" is harder to support. "Stationed," as the file says, is what the evidence permits.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '2fb842f0-2f59-5558-a572-1e357f7e192b',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('lunar-roving-vehicles', 'apollo-15-lrv') ORDER BY CASE WHEN "slug" = 'lunar-roving-vehicles' THEN 1 ELSE 2 END LIMIT 1),
    'vehicules-lunaires-mobiles-lrv-child-en',
    'Parked on the Moon',
    'I am the Moon buggy from Apollo 15. Astronauts drove me across the Moon in 1971, and then they parked me there for good.',
    'Beep beep! Guess what? I''m a car, and I have driven on the Moon!

I am the Moon buggy, officially called the Lunar Roving Vehicle, or LRV. I run on electricity, and astronauts drive me. There are three buggies like me, and I am the one from Apollo 15.

We left Earth on 26 July 1971 on a giant Saturn 5 rocket. I traveled inside the bottom part of a lunar module named Falcon, in the storage space for tools and equipment. Two astronauts came along: David Scott and James Irwin. They were the seventh and eighth people to walk on the Moon.

On 30 July, Falcon landed on the Moon, in the Mare Imbrium region, at the foot of a mountain range called the Apennines. I could not see anything yet. Two hours later, Scott opened the top hatch and stood up for 33 minutes to look around and take photos. I was still waiting.

On 31 July, the astronauts took me out and set me up. Then I started to roll! It was the first time a vehicle like me was ever used, and I did great. On my first trip, we drove 10.3 kilometers: to the edge of a place called Hadley Rille, past a crater named Elbow, near another one called St. George, and back to Falcon.

On 1 August, we drove 12.5 kilometers along the bottom of the mountains. On 2 August, we drove 5.1 kilometers more. Altogether the astronauts traveled 27.9 kilometers, spent 18 hours and 35 minutes outside, and collected 77.31 kilograms of rocks and soil. Thanks to me, they could explore places up to 5 kilometers from Falcon.

At the end of the first trip, they set up a science station called ALSEP. After their last Moon walk, Scott did a famous experiment on TV: he let go of a hammer and a feather at the same time, and they fell at the same speed. The Moon has no air to slow the feather down.

The astronauts also left a plaque and a tiny figure on the Moon, to remember fourteen American and Soviet space explorers who had died.

On 2 August, the top part of Falcon lifted off with the astronauts, after 66 hours and 55 minutes on the Moon. The bottom part stayed behind. And me? My file says I am "stationed permanently" on the Moon. It does not say exactly where, and it does not say what I look like now. The science station was shut down on 30 September 1977. For me, the file mentions no shutdown at all.

So, am I forgotten? Maybe. Abandoned? Not really. I was parked. Falcon landed at 26.13239 degrees north and 3.63330 degrees east, and I am somewhere on the Moon, waiting. Beep beep!',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    'c31ee9fb-85ba-5b4c-aa4c-39bd04904af7',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('lunar-roving-vehicles', 'apollo-15-lrv') ORDER BY CASE WHEN "slug" = 'lunar-roving-vehicles' THEN 1 ELSE 2 END LIMIT 1),
    'vehicules-lunaires-mobiles-lrv-teen-en',
    'Parked Forever',
    'I''m the lunar buggy of Apollo 15. In 1971, I carried two astronauts 27.9 km across the foot of the Apennines. Then I was parked on the Moon, and nobody ever planned to bring me back.',
    'Okay, this will sound funny: I''m a car, and I drove on the Moon.

They call me the lunar buggy. My real name is LRV, Lunar Roving Vehicle. I''m electric, and I don''t drive myself: astronauts drive me. I''m one of a trio of buggies, one per mission, and I''m the one from Apollo 15.

My trip starts on 26 July 1971, on top of a Saturn 5 rocket. I travel in the belly of the lunar module Falcon, in the storage space of its descent stage, where the Moon gear goes. Two astronauts are aboard: David Scott and James Irwin, the seventh and eighth men to walk on the Moon. On 30 July at 22:16:29 UT, Falcon lands in the Mare Imbrium region, at the foot of the Apennine Mountains, at 26.13239° N, 3.63330° E.

I don''t see any of it. Two hours after landing, Scott opens the upper hatch and stands for 33 minutes, describing and photographing the terrain. Me, I wait.

My moment comes on 31 July, around 13:13 UT. The astronauts unload me from the module, deploy me, and drive me. It''s the first time a vehicle like me is used, and my performance is judged very successful. That day''s trip is 10.3 kilometers: to the edge of Hadley Rille, via Elbow Crater, near St. George Crater, then back to the module, where they take a core sample three meters below the surface.

On 1 August, second moonwalk: 12.5 kilometers southeast along the base of the Apennines, near the craters Index, Arbeit, Crescent, Dune and Spur, then back to the ALSEP site. On 2 August, third moonwalk: 5.1 kilometers west to Scarp Crater, northwest along Hadley Rille, and back east across the mare. In total, 27.9 kilometers. Thanks to me, they explore regions within 5 kilometers of Falcon. Over three moonwalks, they spend 18 hours and 35 minutes outside and collect 77.31 kilograms of rock and soil.

At the end of my first trip, they set up the ALSEP, the science station. After the last moonwalk, Scott performs a demonstration on live TV: he drops a hammer and a feather, and they fall at the same rate in the lunar vacuum. The astronauts also leave a plaque and a small figure on the surface, in memory of the fourteen American and Soviet space explorers who died during the two countries'' space programs.

On 2 August, at 17:11:22 UT, after 66 hours and 55 minutes on the Moon, the top half of Falcon lifts off. The descent stage stays, as always. The top half docks with Alfred Worden''s ship, then is jettisoned on 3 August and crashes into the Moon about two hours later.

And me? My file says: "stationed permanently on the Moon." Nobody talks about bringing me back. My file contains no end date for me, and it doesn''t say what I''ve become. The ALSEP, on the other hand, was shut down on 30 September 1977. As for me, my file mentions no shutdown.

So: forgotten? Maybe. Abandoned? Not really: I was parked. Falcon''s landing site is well documented: 26.13239° N, 3.63330° E, at the foot of the Apennines. My file doesn''t say exactly where I was parked, but I''m somewhere on the Moon, and I haven''t moved.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '28402b82-a9be-5790-a13f-8baabb858152',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('spirit-opportunity', 'opportunity') ORDER BY CASE WHEN "slug" = 'spirit-opportunity' THEN 1 ELSE 2 END LIMIT 1),
    'opportunity-mars-rover',
    'Opportunity: The Rover That Refused to Stop',
    'Originally designed for a 90-Martian-day mission, NASA''s Mars Exploration Rover Opportunity operated for nearly 15 years after landing on Mars in January 2004. Powered by solar energy, it uncovered key evidence of ancient water and habitable conditions, broke distance and incline records including completing a marathon on Mars, and contributed vital data before a global dust storm ended its communications in June 2018.',
    'Opportunity: The Rover That Refused to Stop
I was supposed to last 90 Martian days.
That was the plan, anyway. Ninety days to explore a distant world, examine its rocks, and search for clues about its mysterious past. A short mission. A carefully calculated adventure.
But I had other plans.
I am Opportunity, one of NASA''s Mars Exploration Rovers. And what began as a mission lasting just a few months became a journey of about fifteen years. Before you discover how that happened, let me take you back to the beginning.
I was built at NASA''s Jet Propulsion Laboratory, better known as JPL. I had a twin named Spirit, another rover sent to explore Mars. We were part of the same mission, designed to investigate one enormous question: had Mars once been a world where water existed?
Water matters. On Earth, it makes life possible in countless environments. Finding evidence of ancient water on another planet could help scientists understand whether that world might once have supported microbial life: tiny living organisms invisible to the naked eye.
That was my mission. I wasn''t going to Mars just to take a few pretty pictures. I was going to investigate the history of an entire planet.
On July 7, 2003, I left Earth aboard a Delta II 7925H rocket. My journey across space lasted about seven months. Somewhere ahead was Mars, a planet I had been built to explore but had never seen.
Then came January 25, 2004.
I reached Mars and descended toward a region called Meridiani Planum. My landing site was Eagle crater. But arriving on Mars was not as simple as touching the ground and switching on my wheels.
I was protected by airbags, special inflatable cushions designed to absorb the impact. When I hit the surface, I bounced more than 26 times before finally coming to rest.
Yes, more than 26 bounces. Not exactly the smoothest arrival in space exploration history.
And there was another surprise: I landed about 15 kilometres from my intended target. Imagine travelling all that way and missing your destination by roughly the distance across a large town.
Still, I was on Mars. The investigation could begin.
My body weighed 185 kilograms, and I depended on sunlight for energy. My solar panels collected sunlight and converted it into electricity, rather like a calculator powered by a small solar cell, except my energy had to support an entire robotic explorer.
I carried scientific instruments known together as the Athena science package. These instruments helped me investigate the rocks and landscapes around me. Every observation could provide another clue about the planet''s history.
Think of yourself as a detective arriving at a place where the events happened billions of years ago. You cannot travel back in time, and nobody is there to explain what happened. All you have are the traces left behind.
That was my job.
My observations provided evidence that Mars could have supported microbial life in its past. This did not mean I discovered life itself. It meant that the conditions of ancient Mars may once have been suitable for it.
And that distinction matters.
A discovery does not always give scientists a complete answer. Sometimes, it reveals that a question is much bigger than anyone first imagined.
I kept exploring. Crater after crater, rock after rock, I helped scientists examine the geology of Mars. Over more than fourteen years, I studied more than 100 craters.
My journey also became a record-breaking expedition.
On May 16, 2013, I passed the distance driven by the Apollo 17 lunar rover: 22.21 miles. That meant I had travelled farther than the vehicle driven by astronauts during that lunar mission.
Then, on March 25, 2015, I reached another remarkable milestone. I completed the distance of a marathon: 26.219 miles.
A marathon. On Mars.
I was a little robotic explorer crossing an alien landscape, and I had travelled the equivalent of a famous human endurance challenge.
But my journey was not only about distance. The terrain could be difficult, and some slopes presented serious challenges. On March 10, 2016, I climbed a record slope of 32 degrees.
Imagine trying to move across a steep hillside while carrying scientific equipment and depending on solar energy. Every movement was part of a much larger engineering challenge.
In May 2017, I reached Perseverance Valley, near the western rim of Endeavour crater. It would become my final resting place.
By then, I had helped collect an enormous amount of scientific material. Together, Spirit and I sent back about 300,000 raw images. Each image offered scientists another view of Mars: its rocks, its craters, its terrain and the traces of its ancient environment.
But something was approaching that would change everything.
In June 2018, a global dust storm covered Mars. This was not an ordinary dusty afternoon. The storm spread across the planet and blocked sunlight from reaching my solar panels.
Remember how I depended on sunlight for electricity? Without enough sunlight, generating the energy needed to operate became difficult.
On June 10, 2018, my team received my last signal.
After that, they kept trying to contact me for months. They sent signals, waiting for an answer that never came. The exact final energy state of my systems is unknown, as is the detailed reason those contact attempts stopped.
Eventually, on February 13, 2019, NASA declared my mission complete.
I had worked for about fifteen years instead of the 90 Martian days originally planned. According to NASA''s estimate, that was around 60 times longer than expected.
Not bad for a machine designed for a much shorter journey.
Today, my operational mission has ended. My physical presence remains on Mars, in Perseverance Valley, on the western rim of Endeavour crater. My exact final coordinates have not been published, and my present physical condition is unknown.
But my story did not end with the last signal.
The knowledge gathered during my mission helped prepare the way for later Mars rovers, including Curiosity and Perseverance. The machines that followed could build on what earlier explorers had discovered.
That is how exploration works. One discovery creates new questions. One mission prepares the next. And sometimes, the most important contribution of a machine is not simply where it travelled, but what it made possible for those that came after it.
I was Opportunity.
My mission is ended. My wheels are no longer travelling across the Martian ground. Yet the evidence I helped uncover continues to shape humanity''s search for answers about Mars.
And somewhere on that same red planet, other machines are still exploring.
Perhaps the next forgotten object has a story even stranger than mine.
Operational status: MISSION_ENDED.
Physical status: LEFT_ON_SURFACE — Perseverance Valley, western rim of Endeavour crater, Mars.
The investigation is far from over.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '8a20b125-11ff-527f-8076-dd56de816039',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('spirit-opportunity', 'opportunity') ORDER BY CASE WHEN "slug" = 'spirit-opportunity' THEN 1 ELSE 2 END LIMIT 1),
    'opportunity-mars-rover-adults',
    'Opportunity: Fifteen Years Against the Odds',
    'Designed for a 90-Martian-day mission, NASA''s solar-powered Mars Exploration Rover Opportunity operated for approximately fifteen years—about sixty times longer than planned—covering 45.16 kilometres and studying over a hundred craters. Through its geological investigations, it uncovered evidence that ancient Mars could have supported microbial life before a planet-wide dust storm cut off sunlight and ended communications in June 2018.',
    'Opportunity: Fifteen Years Against the Odds
Ninety Martian days. That was the expected lifetime of Opportunity.
When NASA designed the rover, its mission was intended to last approximately three Earth months. Its purpose was specific: investigate the geological history of Mars and search for evidence that liquid water had once existed on its surface.
The engineers could hardly have planned for what followed. Opportunity operated for about fifteen years, an estimated sixty times longer than its original mission duration. Its journey would become one of the most remarkable chapters in robotic planetary exploration.
To understand why, we need to return to the beginning, before the first Martian rock was examined and before its name became associated with extraordinary endurance.
Opportunity was built at NASA''s Jet Propulsion Laboratory (JPL), as part of the Mars Exploration Rover program. It had a twin, Spirit. Both rovers were designed to investigate a fundamental scientific question: what had Mars been like in its distant past?
The search for water was central to that investigation. Water is an important requirement for life as we understand it, and evidence of its historical presence could help scientists assess whether ancient Mars might once have offered suitable conditions for microbial life.
Opportunity was not designed to answer whether life existed on Mars. Its task was more precise: examine the geological evidence and determine what the planet''s environment might once have been like.
On July 7, 2003, Opportunity departed Earth aboard a Delta II 7925H rocket. After a cruise lasting approximately seven months, it approached its destination.
Landing was one of the mission''s most demanding stages. Reaching another planet is not simply a matter of arriving at the correct coordinates. A spacecraft must also reduce its speed and survive the transition from space to the planetary surface.
Opportunity used airbags to cushion its landing. On January 25, 2004, it touched down in Eagle crater, within the Meridiani Planum region of Mars. Rather than coming to rest immediately, it bounced more than twenty-six times.
Its final landing position was approximately fifteen kilometres from the intended target. In planetary exploration, that difference matters: the landing system must deliver a functioning scientific platform into an environment where direct intervention is impossible.
The rover had arrived. Now came the more enduring engineering challenge: operating independently on another planet.
Opportunity was a solar-powered rover weighing 185 kilograms. Its energy came from solar panels, which converted incoming sunlight into electricity. That choice offered an important advantage: the rover could generate energy from its environment rather than depending entirely on a finite onboard supply.
However, solar power also introduced a vulnerability. The amount of available energy depended on sunlight reaching the panels. Dust and atmospheric conditions could therefore become operational concerns.
Its scientific equipment was grouped under the name Athena science package. The instruments supported geological investigations, allowing Opportunity to examine the Martian environment and collect observations that scientists on Earth could analyse.
This is where the relationship between engineering and scientific discovery becomes especially important. The rover''s mobility allowed it to investigate different geological locations. Its scientific instruments provided observations of rocks and terrain. Those observations became evidence researchers could use to reconstruct the planet''s environmental history.
The results were significant.
Opportunity''s findings provided evidence that Mars could have supported microbial life in its past. This distinction is essential: the mission did not establish that life had existed there. It helped demonstrate that ancient Martian conditions may have been suitable for it.
The investigation extended across an impressive range of geological sites. Over more than fourteen years, Opportunity studied the geology of more than one hundred craters.
Its achievements were not limited to scientific observations. The rover also established remarkable mobility records.
On May 16, 2013, it surpassed the distance driven by the Apollo 17 lunar rover, which had travelled 22.21 miles. Two years later, on March 25, 2015, Opportunity completed the distance of a marathon: 26.219 miles.
These milestones reveal something important about the mission''s engineering success. Opportunity was not simply surviving on Mars; it was continuing to move across the surface and reach new scientific locations long after its original operational expectations had been exceeded.
Its terrain was not always easy to navigate. On March 10, 2016, it climbed a record slope of 32 degrees. In May 2017, it reached Perseverance Valley, near the western rim of Endeavour crater.
By February 13, 2019, its final recorded odometry — the measurement of distance travelled — stood at 45.16 kilometres.
That distance represents the cumulative movement of a robotic laboratory across another planet. More importantly, every movement expanded the range of locations available for scientific investigation.
Together, Opportunity and Spirit returned approximately 300,000 raw images. These images provided a substantial visual record of the Martian surface and contributed to the scientific understanding developed during the mission.
Yet the same energy system that had supported Opportunity''s extended operation also exposed it to an environmental limitation that would ultimately change its fate.
In June 2018, a global dust storm covered Mars. The storm prevented sunlight from reaching Opportunity''s solar panels.
For a solar-powered rover, this was a critical problem. The panels were its energy source, and reduced sunlight restricted its ability to generate electricity. The situation was particularly serious because continued operation depended on the availability of sufficient power.
On June 10, 2018, NASA received Opportunity''s last signal.
For months, the mission team continued attempting to establish contact. No further response arrived.
The precise final energy state of the rover remains unknown. The detailed reason the contact attempts stopped is also not established in the available dossier. It would therefore be inaccurate to describe a specific internal failure or claim certainty about the final condition of its systems.
On February 13, 2019, NASA officially declared the mission complete.
The distinction between the end of communication and the formal end of a mission is important. The last signal had been received months earlier, but the mission''s completion was declared only after the subsequent contact efforts.
Opportunity had operated for approximately fifteen years, against an original plan of ninety Martian days. NASA estimates that this was around sixty times longer than expected.
Its legacy, however, extends beyond its operational lifetime.
The findings and experience accumulated during the Mars Exploration Rover program helped prepare the way for later missions, including Curiosity and Perseverance. The scientific investigation of Mars did not end with Opportunity. Instead, its results became part of the foundation on which subsequent exploration could build.
This is perhaps the most interesting dimension of its history. A robotic mission is not defined exclusively by the period during which its systems remain active. Its scientific contribution also survives in the observations it returns, the questions it helps answer and the investigations it makes possible afterward.
Today, Opportunity remains on the Martian surface, in Perseverance Valley, on the western rim of Endeavour crater. Its exact final coordinates have not been published. Its present physical condition is also unknown; the available dossier contains no later image confirming its current state.
The rover''s operational mission is over, but its place in the history of planetary exploration remains.
Operational status: MISSION_ENDED.
Physical status: LEFT_ON_SURFACE — Perseverance Valley, western rim of Endeavour crater, Mars.
Opportunity''s story leaves us with another question. Across the surfaces of distant worlds, how many other machines have completed their missions, leaving behind discoveries that still shape our understanding of the universe? The next forgotten object may be waiting somewhere in the archives, carrying a scientific story that has yet to be fully explored.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '612ad548-76c7-5476-bb3d-a12b3d5e91e0',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('spirit-opportunity', 'opportunity') ORDER BY CASE WHEN "slug" = 'spirit-opportunity' THEN 1 ELSE 2 END LIMIT 1),
    'opportunity-mars-rover-kids',
    'Opportunity: The Little Explorer Who Went Too Far (For Kids)',
    'Written for young explorers, this story follows NASA''s solar-powered Mars rover Opportunity. Originally planned for a 90-Martian-day mission, Opportunity bounced onto Mars in 2004 and spent 15 years studying over 100 craters, uncovering clues about ancient water and conditions for tiny life, and driving the distance of a marathon before a giant dust storm ended its mission in 2018.',
    'Opportunity: The Little Explorer Who Went Too Far
Psst! Young explorers, come closer!
Can you imagine travelling all the way to another planet? Exploring strange rocks, climbing hills and discovering secrets hidden in the ground?
Well, that is exactly what I did.
My name is Opportunity. I am a rover, which means I am a robot with wheels, built to explore a planet. But I am not just any robot. I am a little explorer with a very big story.
And guess what? I was only supposed to work for 90 Martian days. That is about three Earth months.
But I stayed much, much longer!
Guide: Wait! Why would anyone send a robot to Mars?
Because Mars has a mystery, young explorer!
Scientists wanted to know what the Red Planet was like long ago. Did water once flow there? Could it have had conditions suitable for tiny living things?
I was built to help answer those questions.
My home during construction was NASA''s Jet Propulsion Laboratory, also called JPL. I even had a twin! Its name was Spirit. We were both made for the same great mission: searching for signs of water in Mars'' ancient past.
Guide: So, you and your twin were going to explore another planet?
Exactly! But first, I had to get there.
On July 7, 2003, I climbed aboard a rocket called Delta II 7925H. Then, WHOOSH! I left Earth and began my long journey.
I travelled through space for about seven months. Imagine going on a school trip that lasts almost an entire school year, except your destination is another planet!
Finally, Mars was waiting for me.
But landing on another planet is not like parking a bicycle. It is a very difficult challenge. I needed special protection to reach the ground safely.
So, my engineers gave me airbags. These were large inflatable cushions designed to protect me when I landed.
Guide: Airbags? Like the ones inside a car?
Yes! They had a similar purpose. They helped protect me from the impact.
And then... BOING! BOING! BOING!
I bounced more than 26 times before coming to rest inside a place called Eagle crater, in a region of Mars named Meridiani Planum.
What a landing!
There was just one little surprise. I landed about 15 kilometres away from my intended destination. That is roughly like travelling from one part of a town to another!
But I was finally there. My exploration could begin.
Now, you might be wondering how I could move around without someone sitting inside me.
Well, I had something special: solar panels.
Solar panels are surfaces that collect sunlight and turn it into electricity. Think of a little solar-powered calculator. It uses light to get the energy it needs.
My panels did something similar, but I needed electricity for much more than a few buttons!
I carried scientific instruments called the Athena science package. These instruments helped me study rocks and the ground around me.
Guide: But how can looking at rocks help scientists discover something about water?
Excellent question!
Imagine finding a footprint in the sand. Even if the person who made it is gone, the footprint can tell you that someone was there.
Rocks can also keep clues about what happened long ago.
By studying the Martian ground, I helped scientists find evidence that Mars could have supported microbial life in its past.
Microbes are tiny living things. They are so small that we usually need special tools to see them.
I did not discover living creatures. But my findings helped scientists understand that ancient Mars may once have had conditions suitable for life.
And that was a very important discovery!
I kept exploring. I visited many craters, which are large bowl-shaped holes on a planet''s surface. They can form when objects from space hit the ground.
Over my long mission, I studied the geology of more than 100 craters.
But I was not only collecting clues. I was also travelling farther than anyone had expected!
I passed the distance driven by the Apollo 17 lunar rover. Then I completed the distance of a marathon, just like the famous long-distance race people run on Earth.
Imagine that! A little robot crossing the ground of Mars and travelling as far as a marathon runner!
I even climbed a very steep slope and later reached a place called Perseverance Valley.
But every explorer faces challenges.
In June 2018, something enormous happened. A global dust storm covered Mars. This was not an ordinary dusty day. The storm spread across the planet and blocked sunlight from reaching my solar panels.
Remember? Sunlight was my source of energy.
Without enough sunlight, I could no longer generate the electricity I needed to operate normally.
On June 10, 2018, my team received my last signal.
They kept trying to contact me for months. But no answer came.
Guide: Does anyone know exactly what happened to you?
The archives do not tell us everything.
My exact final energy state is unknown. The detailed reason the contact attempts stopped is also unknown. And my present physical condition has not been confirmed by an image after 2018.
On February 13, 2019, NASA declared my mission complete.
I had worked for about 15 years instead of the short mission originally planned. That was an estimated 60 times longer than expected!
Not bad for a little robot, right?
Today, I remain on Mars, in Perseverance Valley, near the western rim of Endeavour crater.
But my discoveries did not stay behind with me.
My mission helped prepare the way for two other explorers: Curiosity and Perseverance. They continued the work of studying the Red Planet.
So, even though my own exploration has ended, the search continues.
I am Opportunity. My wheels are no longer travelling across Mars, but the discoveries I helped make are still important.
Operational status: MISSION_ENDED.
Physical status: LEFT_ON_SURFACE — Perseverance Valley, western rim of Endeavour crater, Mars.
And now, young explorers, here is a new mystery...
What other forgotten machines are waiting on distant worlds, with incredible stories still hidden inside their journeys?
Perhaps the next one is waiting for us to discover it.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '05f15007-da28-5d18-bb72-087f5b875641',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('viking-1', 'viking1') ORDER BY CASE WHEN "slug" = 'viking-1' THEN 1 ELSE 2 END LIMIT 1),
    'viking1-mars-rover-adolescent',
    'Viking 1: My Other Half in the Martian Sky',
    'Told from the perspective of the Viking 1 lander, this narrative recounts the 1975 mission to Mars consisting of an orbiter and a lander. It details the 10-month journey, the 1976 landing in Chryse Planitia, sending back the first surface photographs of Mars, conducting soil and atmospheric tests with its robotic arm and instruments, and the eventual end of communications in November 1982 due to a faulty command.',
    'Viking 1: My Other Half in the Martian Sky
Twenty-five seconds.
That is how long it took after I landed on Mars before I sent home the first photograph ever taken from its surface.
Think about that. Humans had spent years preparing machines to reach another planet. And now, for the first time, someone could actually see Mars from the ground.
That someone was me.
But before I could become the first pair of eyes looking out across that landscape, I had to survive a journey that was anything but simple. And I wasn''t travelling alone. My other half was waiting for me in the sky.
Let me take you back to the beginning.
I was built as part of NASA''s Viking program, alongside another spacecraft called my orbiter. We had different jobs, but one shared mission: investigate Mars, study its soil and atmosphere, and search for signs of life.
The plan was clever. My companion would observe the planet from orbit, while I would land and investigate the ground directly. One would study Mars from above. The other would get its hands dirty.
Well, technically, I had a robotic arm for that.
On August 20, 1975, we launched aboard a Titan IIIE-Centaur rocket. Together, our launch mass was about 3,500 kilograms. That''s roughly the weight of several small cars packed together. Imagine sending all that equipment across space and expecting it to work on another planet.
No pressure, right?
We travelled for about ten months before reaching Mars. On June 19, 1976, my orbiter entered orbit around the planet.
But getting there wasn''t the same as getting safely down.
The team had originally selected a landing site for me. Then the orbiter sent back photographs showing that the terrain was too rough. A dangerous landing could have ended the mission before the real investigation even began.
So the team chose another site.
That decision was crucial. From Earth, Mars could look like a distant red surface. But the closer you got, the more important every detail became. A landing area had to be suitable for a machine that couldn''t simply get up and try again.
My descent was complex. I even sampled the atmosphere while entering it. Eventually, on July 20, 1976, I touched down in Chryse Planitia.
And then came those twenty-five seconds.
I sent back that first photograph from the Martian surface. It was a historic moment: Mars was no longer just a planet seen from far away. It was a landscape that could be examined from the ground.
But photographs were only part of my mission.
I was a scientific laboratory designed to work without scientists standing beside it. Every instrument had a purpose, and every bit of information had to travel all the way back to Earth.
One important difference between me and my orbiter was how we got our energy.
My companion used solar power. Its panels collected sunlight and converted it into electricity. I used something different: two radioisotope power generators, called RTGs. These generators produce electricity using heat released by radioactive material.
In other words, my power system transformed heat into electricity. It didn''t depend on collecting sunlight through solar panels like the orbiter did.
That was important because I had been designed to operate on the Martian surface, where the mission required a different approach to supplying energy.
My scientific equipment included a robotic arm. Think of it as a mechanical hand that could reach down, collect soil and bring samples to my instruments.
On July 28, 1976, I collected my first soil samples.
This is where things became especially interesting. One of my instruments, called a gas chromatograph mass spectrometer, could identify molecules in a sample. Imagine a laboratory detective examining tiny chemical clues to find out what something is made of.
The instrument did not detect organic molecules above its detection limit, estimated at about 10 to 100 parts per billion.
That result was important, but it wasn''t a simple yes-or-no answer to the question of life on Mars. It described what the instrument detected, within its limits. And science has to respect those limits.
My other measurements revealed more about the environment. Temperatures on the surface ranged from about minus 86 degrees Celsius before dawn to minus 33 degrees in the afternoon. The soil also contained a lot of sulfur.
Not every experiment went according to plan, though.
I carried a seismometer, an instrument designed to detect shaking in the ground. It was supposed to help investigate movements beneath the surface.
There was just one problem.
It didn''t work.
Even a mission built with extraordinary care can have an instrument that refuses to cooperate. Apparently, Mars had no obligation to make every experiment easy.
Meanwhile, my orbiter was busy collecting information from above. Together, the two Viking orbiters returned 52,663 images and mapped about 97 percent of Mars''s surface, at a resolution of 300 metres. The two landers took approximately 4,500 photographs.
That was the real advantage of our partnership. The orbiters could reveal the planet''s wider geography, while the landers could examine the surface directly. Different perspectives, different instruments, one much bigger investigation.
But missions in space don''t last forever.
My orbiter faced a serious problem in 1980. It ran out of the propellant used to control its orientation. Orientation means the direction a spacecraft points. Without the necessary propellant, it could no longer maintain that control as required.
On August 7, 1980, its orbit was raised to avoid an impact with Mars until 2019. Operations ended on August 17, after 1,485 orbits.
And then its story became uncertain. The archives do not tell us its present orbit or its ultimate physical fate.
I continued operating on the surface.
For about six years, from 1976 to 1982, I carried out my mission. In the early 1980s, I was renamed the Thomas Mutch Memorial Station.
Then, in mid-November 1982, something happened that changed everything.
A faulty command sent from Earth interrupted my communications. The sources give November 11 for the faulty command and November 13 for the loss of contact. The exact hour of my final signal is unknown.
The team tried to contact me again. Every attempt failed.
Notice something important: I did not simply run out of power. The documented cause of the communication interruption was a faulty command. Losing contact and losing power are not the same thing.
And no, there is no recorded final sentence from me. The archives preserve the event, not a dramatic farewell.
Today, my mission is officially over. But my lander remains on Mars, in Chryse Planitia. My other half, the orbiter, has a different story: its mission ended too, but its physical fate remains unknown.
So what did we leave behind?
We carried the first tools ever sent to Mars specifically to search for life. Our work helped prepare the missions that followed. We showed how a spacecraft in orbit and a laboratory on the surface could work together to investigate another world.
And that matters because Mars was never going to reveal everything in one visit.
I was one of the first machines sent to examine its ground. Since then, other explorers have continued the investigation, each bringing new instruments and new questions.
My story is not the whole story of Mars. It is one chapter in a much longer investigation.
My mission has ended. My lander remains on the Martian surface, while my orbiter''s physical fate is unknown.
And somewhere beyond the story you already know, another forgotten machine is waiting to be discovered.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '238c65d7-d3a9-5886-b045-2e29ad8afb66',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('viking-1', 'viking1') ORDER BY CASE WHEN "slug" = 'viking-1' THEN 1 ELSE 2 END LIMIT 1),
    'viking1-mars-rover-adults',
    'Viking 1: The First Eyes on the Martian Ground',
    'Launched in August 1975, NASA''s Viking 1 mission consisted of an orbiter and a lander designed to search for signs of life and study Mars. The lander successfully touched down in Chryse Planitia in July 1976, returning the first-ever surface photographs of Mars and conducting soil and atmospheric analyses. The orbiter operated until August 1980, while the lander functioned until November 1982 when communications were cut off by a faulty command from Earth.',
    'Viking 1: The First Eyes on the Martian Ground
Imagine trying to answer one of humanity’s oldest scientific questions: could life exist beyond Earth?
Now imagine attempting to investigate that question from millions of kilometres away, using machines that cannot be repaired by human hands.
In 1975, NASA sent two spacecraft toward Mars under the Viking program. But Viking 1 was not simply one spacecraft. It was a carefully coordinated pair: an orbiter designed to study the planet from above, and a lander built to examine the surface directly.
Their mission was ambitious. Search for signs of life, study the Martian soil, and investigate the planet’s atmosphere. To do that, engineers had to solve two very different problems: how to observe an entire world from space, and how to operate a scientific laboratory on its surface.
The result would change the way Mars was explored.
Viking 1 launched on August 20, 1975, aboard a Titan IIIE-Centaur rocket. Its total launch mass was about 3,500 kilograms. That is roughly the mass of a large passenger car, multiplied several times. And every kilogram had a purpose: scientific instruments, communication equipment, power systems, and the hardware needed to survive the journey.
The spacecraft reached Mars orbit on June 19, 1976, after a journey lasting about ten months.
But reaching Mars was only the beginning.
The original landing site had been selected before arrival. Then orbital photographs revealed that the terrain was too rough. A landing on an unsuitable surface could put the entire mission at risk. The team therefore selected another site.
This decision illustrates one of the central difficulties of planetary exploration: a place that looks acceptable from a distance may be much more complicated when you are about to land on it.
The lander’s descent involved several stages, including sampling the atmosphere during entry. Eventually, on July 20, 1976, it touched down in Chryse Planitia, a region on Mars. The exact landing coordinates are not given consistently in the archives, so the location is best described as being around 22 degrees north.
Then something remarkable happened.
Just 25 seconds after landing, Viking 1 sent back the first photograph ever taken from the surface of Mars.
For the first time, the Martian landscape was no longer only something observed from orbit or reconstructed from distant measurements. It had become a place photographed from the ground.
And Viking 1 was only getting started.
The two spacecraft had different jobs, and their engineering reflected those differences. The orbiter was powered by solar energy. Its panels converted sunlight into electricity, allowing it to operate while circling Mars.
The lander, however, needed a power source that could function on the surface. It used two radioisotope power generators, known as RTGs. These generators produce electricity from the heat released by radioactive material. In simple terms, they transform heat into electrical energy rather than depending on sunlight in the same way as the orbiter.
That distinction mattered because the lander was intended to operate directly on Mars, where environmental conditions could complicate the use of solar power.
Its scientific equipment was designed to investigate the planet at close range. A robotic arm collected soil samples, bringing material from the Martian ground to instruments that could examine it.
On July 28, 1976, Viking 1 collected its first soil samples.
One of its instruments was a gas chromatograph mass spectrometer, usually abbreviated as GCMS. The name sounds intimidating, but its purpose is straightforward: it helps identify molecules present in a sample. Think of it as a laboratory tool that examines the chemical ingredients of material brought to it.
The GCMS did not detect organic molecules above its detection limit, estimated at about 10 to 100 parts per billion. That result belongs to the instrument’s measurements and its limits. It should not be turned into a broader conclusion about the existence or absence of life on Mars.
The investigation also revealed other characteristics of the environment.
Surface temperatures ranged from about minus 86 degrees Celsius before dawn to minus 33 degrees Celsius in the afternoon. The soil contained a substantial amount of sulfur. These findings helped build a more detailed picture of the conditions on the planet.
Not every instrument performed as intended. Viking 1 carried a seismometer, a device designed to detect shaking in the ground. It did not work.
That is an important detail in the history of exploration. A scientific mission is not a perfect laboratory where every instrument delivers exactly what engineers expect. It is a collection of complex systems operating in an environment that cannot be fully controlled. Some measurements succeed. Others remain unavailable.
Meanwhile, the orbiter was building a much larger picture of Mars.
Together, the two Viking orbiters returned 52,663 images and mapped about 97 percent of the planet''s surface, at a resolution of 300 metres. The two landers also took approximately 4,500 photographs.
Consider what that means. The orbiters examined nearly the entire surface from above, while the lander provided views and measurements from the ground. One perspective revealed the planet’s broad geography; the other examined the details beneath the spacecraft.
This combination made the Viking program a major step in planetary exploration. It connected global observation with direct investigation, giving scientists different ways to study the same world.
But even a successful mission has limits. Spacecraft do not remain operational forever, and their systems face constraints that cannot always be overcome.
For the orbiter, one major problem emerged in 1980. It ran out of the propellant used to control its orientation. Orientation control is what allows a spacecraft to point in the required direction. Without the necessary propellant, maintaining that control becomes impossible.
On August 7, 1980, its orbit was raised to avoid an impact with Mars until 2019. Operations ended on August 17, after 1,485 orbits.
The orbiter''s later physical fate is unknown. The archives do not establish its present orbit or what eventually happened to it.
The lander followed a different path.
It continued operating for about six years, from its arrival in 1976 until 1982. In the early 1980s, it was renamed the Thomas Mutch Memorial Station. But in mid-November 1982, a faulty command sent from Earth interrupted its communications.
The sources give November 11 for the faulty command and November 13 for the loss of contact. The exact final date is therefore not presented as a single confirmed day. The precise hour of the last signal is also unknown.
Attempts to contact the lander again failed.
It is important to understand what happened here: the dossier does not identify a power failure as the cause. The documented event was a faulty command that interrupted communications. The distinction matters because silence does not automatically mean a spacecraft has run out of energy or that every system has stopped working.
The lander remains on the Martian surface, in Chryse Planitia. Its operational mission has ended, but its physical presence is a separate matter. The orbiter''s mission also ended, while its physical status remains unknown.
Viking 1 carried the first tools ever sent to Mars specifically to search for life. Its experiments did not provide a simple answer to that question, but the program established an important foundation for the missions that followed.
Its legacy is not limited to the photographs or measurements it returned. Viking helped prepare the way for later Mars exploration, showing how orbiters and landers could work together to investigate another planet.
Today, one part of Viking 1 is known to remain on Mars. Another part has an uncertain fate. The archives preserve the work, the measurements, the interruption of communications, and the limits of what can still be established.
And that is where the investigation remains open.
Because Mars has been visited by many machines since Viking 1. Some have travelled across its surface. Others have studied it from orbit. Each has left behind another set of traces, another collection of unanswered questions.
Viking 1''s mission is over. Its lander remains on the surface, while the orbiter''s physical fate is unknown. Somewhere in the history of Mars exploration, another forgotten machine is waiting for its story to be uncovered.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  ),
  (
    '391aee96-b763-56ea-9db3-8f57f05ccd23',
    (SELECT "id" FROM "machines" WHERE "slug" IN ('viking-1', 'viking1') ORDER BY CASE WHEN "slug" = 'viking-1' THEN 1 ELSE 2 END LIMIT 1),
    'viking1-mars-rover-kids',
    'Viking 1: The Little Robot Who Opened a Window on Mars',
    'Written for young explorers from the perspective of the Viking 1 lander, this story explains the 1975 dual mission to Mars with an orbiter and a lander. It covers the 1976 landing in Chryse Planitia, sending back the very first surface pictures of Mars, using a robotic arm and nuclear-heated generators, and working for six years before communications stopped in November 1982 due to a faulty command.',
    'Viking 1: The Little Robot Who Opened a Window on Mars
Psst… young explorers! Come closer!
I have a story to tell you. It happened on a planet far away. A planet with red soil, strange landscapes, and many secrets.
You may know its name.
Mars!
But did you know that one of the first machines sent there had two parts? One travelled around the planet. The other landed on the ground.
That second part was me!
Guide: Wait… you went to Mars with a partner?
Exactly! My partner was called an orbiter. An orbiter is a spacecraft that travels around a planet without landing on it. I was the lander, the part designed to touch the ground.
We were part of NASA''s Viking program. Our mission was to study Mars. We wanted to investigate its soil and atmosphere. We were also sent to search for signs of life.
Quite a big job for two machines, don''t you think?
My partner had an important task. It would look at Mars from above. I would explore the ground. Together, we could study the same planet in two different ways.
On August 20, 1975, we left Earth aboard a powerful rocket. Its name was Titan IIIE-Centaur.
Our total launch mass was about 3,500 kilograms. That is like sending several small cars into space!
We travelled for months before reaching Mars. On June 19, 1976, my partner entered orbit around the planet.
But I still had one enormous challenge.
I had to land.
Guide: Wasn''t the landing place already chosen?
It was! But there was a problem. Photographs from orbit showed that the first landing site was too rough.
Imagine trying to park a toy car on a floor full of big stones. Not easy, is it?
So the team chose another place. My descent was complicated. I even collected information about the air while coming down.
Then, on July 20, 1976, I finally touched the ground.
My new home was Chryse Planitia, a region on Mars.
And something wonderful happened just after that.
Only 25 seconds after landing, I sent back a photograph. It was the first picture ever taken from the surface of Mars!
Think about it. Before then, people could look at Mars from far away. Now, they could see what the ground looked like from a machine standing right there.
Guide: So what did you do after taking that picture?
Oh, I had plenty of work left!
I was a little scientific laboratory. I needed energy to keep working. My partner used sunlight, collected by special panels.
But I had a different kind of power source.
I used two radioisotope power generators. That is a long name! These generators make electricity using heat from radioactive material.
Think of them as special machines that turn heat into electricity.
I also had a robotic arm. It was like a mechanical hand. It could reach down, collect soil, and bring it to my scientific instruments.
On July 28, 1976, I collected my first soil samples.
Guide: What could your instruments discover?
One of my instruments was called a gas chromatograph mass spectrometer. A very long name for a very useful tool!
It helped identify molecules in my soil samples. You can imagine it as a tiny detective looking for chemical clues.
The instrument did not detect organic molecules above its detection limit. That means it could not find them at the levels it was able to measure.
This was an important result. But it was not a simple answer to the question of whether life existed on Mars.
I also helped scientists learn about the Martian environment.
The temperature could be about minus 86 degrees Celsius before dawn. In the afternoon, it could reach about minus 33 degrees.
Brrr! That is a very cold place to work.
My soil also contained a lot of sulfur. Scientists could use these measurements to understand more about the planet.
Not every instrument worked perfectly, though.
I carried a seismometer. That is a machine designed to detect shaking in the ground. It was supposed to help study movements beneath the surface.
But mine did not work.
Well… even a robot laboratory can have a stubborn tool!
While I was studying the ground, my partner was busy in the sky. The two Viking orbiters sent back 52,663 images together. They mapped about 97 percent of Mars''s surface.
The two landers also took about 4,500 photographs.
Imagine having so many pictures of another planet! Some showed the big shapes of Mars. Others showed what the ground looked like close up.
My partner and I had different jobs. But our discoveries helped scientists understand Mars much better.
Then time passed.
My lander worked for about six years. That was a long time for a machine exploring another planet!
My partner''s story changed first. In 1980, it ran out of the special propellant used to control its direction. Propellant is a material a spacecraft uses to help control its movement or orientation.
Its orbit was raised on August 7, 1980, to avoid an impact with Mars until 2019. Its operations ended on August 17, after 1,485 orbits.
And today, its physical fate is unknown. The archives do not tell us exactly where it is now.
Guide: And what happened to you?
My story continued for a little longer.
In the early 1980s, I received a new name: the Thomas Mutch Memorial Station.
But in mid-November 1982, a faulty command sent from Earth interrupted my communications. That means I could no longer communicate with the team.
The records give November 11 for the faulty command and November 13 for the loss of contact. So we cannot choose one exact day as the confirmed end.
The team tried to contact me again. But every attempt failed.
There is something important to remember here. I did not simply run out of power. The documented problem was a faulty command that interrupted communications.
And the archives do not contain a final sentence from me. Sometimes, the truth is simply that the messages stopped.
Today, my mission is over. But my lander remains on Mars, in Chryse Planitia.
My partner''s mission is also over. But nobody knows its present physical fate.
Guide: So your work is finished?
My mission is finished, yes. But the discoveries did not disappear.
We carried the first tools ever sent to Mars to search for life. Our work helped prepare the missions that came after us.
Other machines continued exploring the planet. They brought new questions and new instruments.
And that means the story of Mars is much bigger than mine.
My mission has ended, but my lander remains on the Martian surface. My partner''s mission has ended too, but its physical fate is unknown.
So, young explorers, are you ready for another mystery?
Because somewhere in the history of space exploration, another forgotten machine is waiting for someone to tell its story.',
    'AUTHORED',
    NULL,
    NULL,
    NULL,
    TRUE,
    '2024-01-01T00:00:00Z',
    NOW(),
    NOW()
  )
ON CONFLICT ("machineId", "slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "summary" = EXCLUDED."summary",
  "articleMarkdown" = EXCLUDED."articleMarkdown",
  "articleOrigin" = EXCLUDED."articleOrigin",
  "videoUrl" = EXCLUDED."videoUrl",
  "videoOrigin" = EXCLUDED."videoOrigin",
  "videoDurationSec" = EXCLUDED."videoDurationSec",
  "isPublished" = EXCLUDED."isPublished",
  "publishedAt" = EXCLUDED."publishedAt",
  "updatedAt" = EXCLUDED."updatedAt";

COMMIT;

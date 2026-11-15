# Checklist de vérification

Liste à parcourir **pour chaque affirmation** avant de la valider.

## Pour une date

- [ ] Calendrier précisé (UTC pour missions récentes, date locale pour événements historiques).
- [ ] Niveau de précision connu (jour, heure, minute).
- [ ] Source primaire ou institutionnelle citée.
- [ ] Cohérence avec les autres dates de la même mission.

## Pour un chiffre ou une mesure

- [ ] Unité explicite (km, kg, m/s, W, bars…).
- [ ] Méthode de mesure ou d'estimation connue.
- [ ] Marge d'incertitude mentionnée si elle existe.
- [ ] Arrondi cohérent avec le niveau de précision de la source.
- [ ] Au moins une source primaire ou NSSDCA confirme.

## Pour une citation

- [ ] Auteur identifié nommément.
- [ ] Document source identifié (titre, date, support).
- [ ] Citation reproduite mot pour mot.
- [ ] Contexte de la citation préservé ou signalé si extrait.
- [ ] Traduction signalée explicitement si applicable, avec langue originale.

## Pour une attribution

- [ ] Personne, agence ou équipe correctement nommée.
- [ ] Rôle exact lors de l'événement (pas d'extrapolation).
- [ ] Période couverte par le rôle vérifiée.

## Pour un événement

- [ ] Nature de l'événement bien catégorisée (lancement, atterrissage, perte de contact, abandon).
- [ ] Lien équipement/mission/lieu cohérent avec le modèle de données.
- [ ] Date et lieu confirmés par source primaire.

## Pour une relation entre entités

- [ ] Relation hiérarchique (équipement ↔ sous-équipement) non cyclique.
- [ ] Distinction maintenue entre mission, équipement, instrument, archive.
- [ ] Distinction maintenue entre statut opérationnel et état physique.

## Signalements systématiques

- [ ] Toute incertitude est explicite dans la sortie.
- [ ] Toute source externe est datée (date d'accès).
- [ ] Toute contradiction entre JSON du projet et source externe est signalée à l'utilisateur.

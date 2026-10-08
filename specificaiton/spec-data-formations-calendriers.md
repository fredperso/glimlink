---
title: 'Formations, calendriers et présence potentielle'
version: '1.1'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [6, 14, 15, 17, 20]
maquette_revision: travail-local-USR-17
tags: [specification, data, glimlink]
---

# Formations, calendriers et présence potentielle

Référence consolidée du PDF V3 et de la session utilisateur, confrontée à la copie de travail locale USR-17 (base `d6f296f`). Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Partager un planning structuré au niveau formation/promotion pertinent et contrôler la présence demandée sur une période. L’éditeur et les vues mois/année enrichissent la V1 à la demande de l’utilisateur.

## 2. Définitions

**Rythme hebdomadaire** : jours de cours stables sur une période. **Exception datée** : cours, absence de cours ou période à vérifier modifiant ce rythme. **Présence potentielle** : jour sans conflit scolaire, sous réserve des disponibilités individuelles. **Hors période** : calendrier ne couvrant pas la date demandée.

## 3. Exigences, contraintes et recommandations

| ID      | Source              | Exigence                                                                                                                |
| ------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| CAL-001 | PDF §6              | Rattacher l’étudiant à une formation/promotion dont le calendrier est partagé, sans copier ses cours dans chaque fiche. |
| CAL-002 | PDF §6              | Une modification du calendrier est prise en compte par tous les profils rattachés.                                      |
| CAL-003 | PDF §6              | Conserver la période du planning ; un rythme variable ne devient pas un rythme constant supposé.                        |
| CAL-004 | PDF §6              | Contrôler les cours, la date de début individuelle et les indisponibilités connues.                                     |
| CAL-005 | PDF §6              | Jour sans cours = potentiellement disponible, jamais garantie contractuelle.                                            |
| CAL-006 | PDF §6              | Une donnée insuffisante produit À vérifier ; un conflit connu reste visible.                                            |
| CAL-007 | Demande utilisateur | Fournir un éditeur de rythme/exceptions et des vues finalisées mois/année.                                              |
| CAL-008 | Demande utilisateur | Rendre les états cours/disponibilité intuitive, avec couleurs lisibles et légende textuelle.                            |

## 4. Interfaces et contrats de données

`Calendar` porte `id`, titre, école, `courseDays`, `mode` (`weekly/variable/unknown`), période `start/end`, exceptions et compétences visées. La maquette regroupe formation et promotion dans le titre du calendrier ; il n’existe pas encore d’entités autonomes Formation et Promotion.

États de date : `course`, `potential`, `unknown`, `weekend`, `outside`. Une indisponibilité individuelle est affichée distinctement. Les cours sont bleus, la présence potentielle verte, les inconnues orangées, hors période/week-end neutres. Une légende et les intitulés complètent la couleur.

Priorité du calcul local : hors période → week-end non évalué → dernière exception couvrant la date → rythme variable/inconnu à vérifier → jours hebdomadaires. Les semaines commencent lundi. La plage d’un besoin détermine les dates contrôlées ; `checkAvailability` complète ce résultat par le permis et la disponibilité personnelle. Les demi-journées et horaires ne sont pas représentés.

USR-17 : la création et l’édition du planning et des compétences visées utilisent [l’espace administrateur](spec-design-espace-administrateur.md). AC-ADM-001 et AC-ADM-004 complètent V3-05 ; le conseiller conserve uniquement la consultation et le rattachement des candidats.

## 5. Critères d’acceptation

- **V3-05** : deux candidats rattachés héritent de la même mise à jour.
- **V3-06** : cours lundi/mardi et demande vendredi ne créent pas de conflit scolaire.
- **V3-07** : un cours mardi crée une réserve lorsque mardi est obligatoire.
- **V3-08** : calendrier absent/incomplet ne confirme pas la présence.
- **V3-09** : jour sans cours n’efface pas date trop tardive ou indisponibilité individuelle.
- **AC-CAL-001** : une exception de cours datée produit un conflit sur les dates concernées, même avec un reste du planning inconnu.
- **AC-CAL-002** : mois/année et rythme montrent des états cohérents, y compris une année bissextile.

## 6. Stratégie de test

Tests calendrier et V3-05–09 dans `tests/domain.test.ts`, `qa-calendars.js`, `qa-flows.js`, `qa-mobile.js`. La revue du vrai calendrier du centre et de la granularité métier reste nécessaire avant production.

## 7. Justification et contexte

Le PDF laisse ouverte la granularité complète. L’utilisateur a demandé mois/année et un éditeur plus abouti : ces vues sont ajoutées sans affirmer qu’un calendrier complet implique une disponibilité garantie.

## 8. Dépendances et intégrations

Données fiables du centre et rattachement correct. USR-17 confie la création et l’édition des formations/calendriers à l’administrateur. Groupes, rattachements multiples, périodes de stage et priorités d’exceptions restent à arbitrer. Pas de connexion à un planning externe.

## 9. Exemples et cas limites

Calendrier couvrant seulement une partie du besoin : à vérifier. Exception Cours au centre vendredi : conflit vendredi. Dernière exception chevauchante prioritaire dans la maquette ; cette règle reste un choix local. Week-end non évalué n’équivaut ni à disponible ni à interdit.

## 10. Critères de validation

Vérifier calculs déterministes, héritage, dates et légendes sans dépendre uniquement des couleurs. Le libellé de maquette « Disponible en entreprise · à confirmer » doit être lu comme une possibilité, pas un engagement.

## 11. Spécifications liées

[Matching](spec-process-besoins-matching.md), [Compétences](spec-data-competences.md), [Données](spec-schema-donnees.md), [Arbitrages](spec-process-arbitrages.md).

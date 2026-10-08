---
title: 'Espace entreprise et accueil simplifié'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [4, 7, 9, 10, 11, 12]
maquette_revision: d6f296f
tags: [specification, design, glimlink]
---

# Espace entreprise et accueil simplifié

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Spécifier le parcours entreprise consolidé au 8 octobre. L’accueil sert à exprimer un nouveau besoin, lire trois compteurs et joindre le conseiller. L’exploration se fait dans chaque besoin, pas sur l’accueil.

## 2. Définitions

**Accueil** : vue `home`. **Besoins en cours** : besoins dont le statut est `active`. **Mises en relation effectuées** : demandes confirmées au statut `completed`. **Talent Alerts** : nouveaux profils compatibles non lus, liés aux besoins actifs. **Suggestions** : autres profils déjà disponibles proposés dans Ma sélection.

## 3. Exigences, contraintes et recommandations

| ID      | Source                        | Exigence                                                                                                                                                                            |
| ------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ENT-001 | Décision utilisateur du 08/10 | Garder « Bonjour Camille » pour Maison Alba et « Vous avez les missions. Ils ont le potentiel. », avec recherche simple. Le prénom s’adapte au contact du partenaire actif.         |
| ENT-002 | Décision utilisateur          | Après la recherche, afficher uniquement trois accès chiffrés : besoins en cours, mises en relation effectuées, Talent Alerts. Conserver la carte de contact du conseiller référent. |
| ENT-003 | Décision utilisateur          | Aucune exploration, carte de candidat ni suggestion sur l’accueil.                                                                                                                  |
| ENT-004 | Décision utilisateur          | Dans Besoins, afficher détail, état d’avancement et alertes propres ; ouvrir chaque besoin pour son brief et ses profils.                                                           |
| ENT-005 | Décision utilisateur          | Proposer les profils en swipe avec pourcentage ; garder besoins actifs/clôturés.                                                                                                    |
| ENT-006 | Décision utilisateur          | Modifier une recherche existante seulement dans Besoins et ses écrans associés. La recherche d’accueil crée un nouveau besoin.                                                      |
| ENT-007 | Décision utilisateur          | Ma sélection montre avatar, prénom, formation par besoin, ouvre la fiche complète autorisée et propose la mise en relation avec le conseiller.                                      |
| ENT-008 | Décision utilisateur          | Ajouter des suggestions dans Ma sélection, distinctes des Talent Alerts.                                                                                                            |
| ENT-009 | PDF §9                        | Accompagner une recherche sans résultat, expliquer les raisons et proposer le contact conseiller.                                                                                   |

## 4. Interfaces et contrats de données

| Vue                  | Chemin                        | Contenu et actions                                                                         |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| Accueil              | `#/company/home`              | Message, champ libre, bouton Décrire mon besoin, trois compteurs, Mathilde JEANNE          |
| Besoins              | `#/company/needs`             | Actifs/clôturés, avancement, nouveaux profils par besoin, modification, fermeture manuelle |
| Détail/profils       | `#/company/discover?need=…`   | Brief, compatibilité, swipe par défaut, fiche et sélection ; grille sur choix explicite    |
| Nouveau/modification | `#/company/new-need`          | Description et brief à confirmer ; paramètre `need` pour un besoin existant                |
| Ma sélection         | `#/company/selections?need=…` | Résumés par besoin actif, bouton de demande, suggestions                                   |
| Demandes             | `#/company/requests`          | Suivi ; paramètre `need` pour l’historique d’un besoin                                     |
| Talent Alerts        | `#/company/alerts`            | Alertes et historique ; filtrage par besoin lorsque précisé                                |

Le texte d’accueil est transmis au formulaire de besoin sans perte. `talentAlerts` compte les profils compatibles non lus distincts sur l’ensemble des besoins actifs ; par besoin, la déduplication porte sur besoin/profil. Les compteurs ne sont pas ceux de la cloche : celle-ci comporte aussi l’événement de bienvenue simulé.

Les avancements représentés : recherche à confirmer, profils à explorer, demande à traiter, prise de contact, entretien à organiser, mise en relation effectuée ou besoin clôturé. Ma sélection s’affiche sur les besoins actifs ; l’historique clôturé se consulte depuis Besoins/Demandes.

## 5. Critères d’acceptation

- **AC-ENT-001** : accueil Maison Alba initial : 2 besoins, 0 mise en relation effectuée, 1 nouveau profil compatible, aucune carte/swipe.
- **AC-ENT-002** : un texte saisi sur l’accueil est conservé dans le formulaire du nouveau besoin.
- **AC-ENT-003** : ouvrir un besoin validé affiche le swipe par défaut et un pourcentage.
- **AC-ENT-004** : cliquer sur le résumé d’un talent retenu ouvre sa fiche publiée ; aucune coordonnée privée n’apparaît.
- **AC-ENT-005** : un profil Talent Alert du besoin n’est pas également affiché comme suggestion.
- **AC-ENT-006** : ajouter une suggestion enrichit uniquement la sélection du besoin choisi.
- **AC-ENT-007** : l’envoi d’une demande ne clôture pas le besoin ; la confirmation du conseiller actualise les trois compteurs.

## 6. Stratégie de test

`qa-company-experience.js` couvre accueil, recherche, suivi, sélection et clôture à 1366/390/320 px. `qa-swipe.js`, `qa-mobile.js` et `qa-mobile-navigation.js` complètent les gestes et la navigation. Tests métier des compteurs et suggestions dans `tests/domain.test.ts`.

## 7. Justification et contexte

Cette décision remplace l’ancien accueil qui présentait liste de besoins, étapes, alertes détaillées et découverte de profils. Les profils restent accessibles dans leur contexte métier : le besoin. Le compteur des mises en relation effectuées exclut les simples demandes en attente.

## 8. Dépendances et intégrations

Besoins confirmés, profils publiés, calendriers, demandes et alertes du compte actif. Le conseiller présenté correspond à la démonstration à un référent ; routage dynamique multi-conseillers à compléter.

## 9. Exemples et cas limites

Avec zéro besoin, les compteurs affichent zéro et la recherche reste disponible. Un besoin non confirmé renvoie au brief. Un besoin clôturé n’offre plus de nouveaux matchs ; son détail et ses demandes sont conservés. Les suggestions peuvent être vides, sans fabrication de candidat.

## 10. Critères de validation

Comparer les blocs d’accueil à ENT-001–003, contrôler tous les compteurs, l’isolation des partenaires, les résumés et l’exclusion des alertes dans les suggestions. Les scores restent fictifs ; les critères détaillés ne sont pas définitivement arbitrés.

## 11. Spécifications liées

[Besoins et matching](spec-process-besoins-matching.md), [Sélections et suivi](spec-process-selections-mises-en-relation.md), [Notifications](spec-process-notifications.md), [Ergonomie mobile](spec-design-ergonomie-mobile.md).

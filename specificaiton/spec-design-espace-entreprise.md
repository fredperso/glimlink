---
title: 'Espace entreprise et accueil simplifié'
version: '1.5'
date_created: 2026-10-08
last_updated: 2026-10-24
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [4, 7, 9, 10, 11, 12]
pdf_v6_sections: [2, 3, 4, 9, 10, 11, 19, 20]
maquette_revision: travail-local-USR-26
tags: [specification, design, glimlink]
---

# Espace entreprise et accueil simplifié

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## Table des matières

- [1. Objet et périmètre](#1-objet-et-périmètre)
- [2. Définitions](#2-définitions)
- [3. Exigences, contraintes et recommandations](#3-exigences-contraintes-et-recommandations)
- [4. Interfaces et contrats de données](#4-interfaces-et-contrats-de-données)
- [5. Critères d’acceptation](#5-critères-dacceptation)
- [6. Stratégie de test](#6-stratégie-de-test)
- [7. Justification et contexte](#7-justification-et-contexte)
- [8. Dépendances et intégrations](#8-dépendances-et-intégrations)
- [9. Exemples et cas limites](#9-exemples-et-cas-limites)
- [10. Critères de validation](#10-critères-de-validation)
- [11. Spécifications liées](#11-spécifications-liées)

## 1. Objet et périmètre

Spécifier le parcours entreprise consolidé au 8 octobre puis aligné sur le [PDF V6](SOURCE_V6.md) le 23 octobre (USR-23). L’accueil sert à exprimer un nouveau besoin par une phrase libre, lire trois compteurs et joindre le conseiller. La découverte se fait dans trois espaces sur le même vivier : Découvrir (swipe), Tous les profils (grille) et Ma sélection. Aucun score n’est visible.

## 2. Définitions

**Accueil** : vue `home`. **Besoins en cours** : besoins dont le statut est `active`. **Mises en relation effectuées** : demandes confirmées au statut `completed`. **Talent Alerts** : nouveaux profils compatibles non lus, liés aux besoins actifs. **Suggestions** : autres profils déjà disponibles proposés dans Ma sélection. **Passer** : passer au profil suivant, sans refus ; le profil reste dans Tous les profils (V6 §9). **Relais humain** : demande d’accompagnement adressée au conseiller lorsqu’aucun profil n’est retenu (V6 §11).

## 3. Exigences, contraintes et recommandations

| ID      | Source                        | Exigence                                                                                                                                                                            |
| ------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ENT-001 | Décision utilisateur du 08/10 | Garder « Bonjour Camille » pour Maison Alba et « Vous avez les missions. Ils ont le potentiel. », avec recherche simple. Le prénom s’adapte au contact du partenaire actif.         |
| ENT-002 | Décision utilisateur          | Après la recherche, afficher uniquement trois accès chiffrés : besoins en cours, mises en relation effectuées, Talent Alerts. Conserver la carte de contact du conseiller référent. |
| ENT-003 | Décision utilisateur          | Aucune exploration, carte de candidat ni suggestion sur l’accueil.                                                                                                                  |
| ENT-004 | Décision utilisateur          | Dans Besoins, afficher détail, état d’avancement et alertes propres ; ouvrir chaque besoin pour son brief et ses profils.                                                           |
| ENT-005 | Décision utilisateur ; V6 §1, §7, §19 | Proposer les profils en swipe, sans pourcentage ni score visible (V6 remplace la décision initiale d’afficher un pourcentage) ; garder besoins actifs/clôturés.                |
| ENT-006 | Décision utilisateur          | Modifier une recherche existante seulement dans Besoins et ses écrans associés. La recherche d’accueil crée un nouveau besoin.                                                      |
| ENT-007 | Décision utilisateur          | Ma sélection montre avatar, prénom, formation par besoin, ouvre la fiche complète autorisée et propose la mise en relation avec le conseiller.                                      |
| ENT-008 | Décision utilisateur          | Ajouter des suggestions dans Ma sélection, distinctes des Talent Alerts.                                                                                                            |
| ENT-009 | PDF §9 ; V6 §11               | Sans profil retenu ou sans profil disponible, proposer « Vous n’avez pas encore trouvé le profil recherché ? Votre conseiller peut affiner votre besoin avec vous et vous proposer d’autres pistes. » ; la demande alerte le conseiller. |
| ENT-010 | Demande utilisateur USR-21    | Après la première sélection de la session de découverte, un écran de confirmation façon « match » annonce l’ajout ; rien n’est envoyé. Il propose de demander une mise en relation ou de continuer à explorer. Les sélections suivantes sont confirmées sans interruption (cœur animé, annonce, plateau) (USR-22). |
| ENT-011 | V6 §9                         | Trois espaces seulement : Découvrir (swipe), Tous les profils (grille) et Ma sélection, sur le même vivier ordonné ; Découvrir est accessible depuis la navigation et permet de changer de besoin actif. |
| ENT-012 | V6 §9                         | La carte swipe montre prénom, formation, zone géographique large, sans photo ; « Pourquoi ce profil pour votre besoin ? » en 2-3 phrases ; 3-4 éléments factuels ; « En lien avec vos missions » ; Déclic seulement si utile ; actions Passer, Profil & CV, Sélectionner. |
| ENT-013 | V6 §9, §19                    | Passer ≠ refuser : un profil passé reste dans Tous les profils avec la mention Passé, peut être sélectionné et peut revenir dans Découvrir (« Revoir les profils passés »). |
| ENT-014 | V6 §9                         | La fiche détaillée présente la lecture Glimlink personnalisée, le CV anonymisé en un clic et le calendrier de formation dans des onglets (Vue d’ensemble, Compétences, CV anonymisé, Calendrier ; USR-26) ; nom, téléphone, e-mail et adresse précise restent masqués. |
| ENT-015 | V6 §2                         | La navigation entreprise donne accès à Mes besoins, Découvrir, Ma sélection, Talent Alerts et Mon profil ; l’accueil reste la porte d’entrée de la phrase libre et les mises en relation se suivent depuis Ma sélection. |
| ENT-016 | V6 §3                         | Mon profil porte raison sociale, SIRET, secteur, contact, coordonnées professionnelles et plusieurs sites ; le premier site préremplit le lieu de chaque nouveau besoin, modifiable. |
| ENT-017 | V6 §20                        | Aucune rubrique visible « Pépite / Regard conseiller » ; aucune messagerie avec l’étudiant ; aucun score public. |

## 4. Interfaces et contrats de données

| Vue                  | Chemin                        | Contenu et actions                                                                         |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| Accueil              | `#/company/home`              | Phrase de principe V6, champ libre, bouton Comprendre mon besoin, trois compteurs, Mathilde JEANNE |
| Besoins              | `#/company/needs`             | Actifs/clôturés, avancement, profils à découvrir, nouveaux profils par besoin, modification, fermeture manuelle |
| Découvrir            | `#/company/discover?need=…`   | Besoin confirmé, espaces Découvrir / Tous les profils / Ma sélection, swipe par défaut, relais ; sans `need`, premier besoin actif confirmé |
| Nouveau/modification | `#/company/new-need`          | Phrase libre puis reformulation « Est-ce que j’ai bien compris ? » à confirmer ; paramètre `need` pour un besoin existant |
| Ma sélection         | `#/company/selections?need=…` | Résumés par besoin actif, bouton de demande, suggestions, accès aux mises en relation, relais si vide |
| Demandes             | `#/company/requests`          | Suivi ; paramètre `need` pour l’historique d’un besoin ; accessible depuis Ma sélection et Plus |
| Talent Alerts        | `#/company/alerts`            | Alertes et historique ; filtrage par besoin lorsque précisé                                |
| Mon profil           | `#/company/profile`           | Coordonnées professionnelles, SIRET, secteur, sites, conseiller référent                   |

Sur téléphone, la barre inférieure présente Accueil, Besoins, Découvrir, Sélection et Plus (Talent Alerts, Mon profil, Mises en relation), sur le modèle du conseiller (UX-004).

Le texte d’accueil est transmis au formulaire de besoin sans perte. `talentAlerts` compte les profils compatibles non lus distincts sur l’ensemble des besoins actifs ; par besoin, la déduplication porte sur besoin/profil. Les compteurs ne sont pas ceux de la cloche : celle-ci comporte aussi l’événement de bienvenue simulé.

Les avancements représentés : recherche à confirmer, profils à explorer, demande à traiter, prise de contact, entretien à organiser, mise en relation effectuée ou besoin clôturé. Ma sélection s’affiche sur les besoins actifs ; l’historique clôturé se consulte depuis Besoins/Demandes.

## 5. Critères d’acceptation

- **AC-ENT-001** : accueil Maison Alba initial : 2 besoins, 0 mise en relation effectuée, 1 nouveau profil compatible, aucune carte/swipe.
- **AC-ENT-002** : un texte saisi sur l’accueil est conservé dans le formulaire du nouveau besoin.
- **AC-ENT-003** : ouvrir un besoin validé affiche le swipe par défaut, sans aucun pourcentage ni score dans la page.
- **AC-ENT-004** : cliquer sur le résumé d’un talent retenu ouvre sa fiche publiée ; aucune coordonnée privée n’apparaît.
- **AC-ENT-005** : un profil Talent Alert du besoin n’est pas également affiché comme suggestion.
- **AC-ENT-006** : ajouter une suggestion enrichit uniquement la sélection du besoin choisi.
- **AC-ENT-008** : la première sélection d’une session de swipe ouvre un dialogue « {prénom} rejoint votre sélection » dont le focus est sur « Continuer à explorer » ; Échap le ferme ; « Demander une mise en relation » ouvre la demande ; le choix reste annulable. Les sélections suivantes n’ouvrent aucun dialogue.
- **AC-ENT-007** : l’envoi d’une demande ne clôture pas le besoin ; la confirmation du conseiller actualise les trois compteurs.
- **AC-ENT-009** : Tous les profils affiche les 7 profils visibles du besoin Accueil & gestion administrative, profils retenus et passés compris, avec leur état.
- **AC-ENT-010** : passer un profil dans Découvrir puis ouvrir Tous les profils montre ce profil marqué Passé ; aucun profil n’est supprimé du vivier.
- **AC-ENT-011** : sans profil retenu, le relais humain est proposé ; « Être accompagné par Mathilde » confirme l’envoi et le besoin affiche « Relais demandé » côté conseiller.
- **AC-ENT-012** : modifier le site principal dans Mon profil préremplit ce lieu lors de la reformulation d’un nouveau besoin.
- **AC-ENT-013** : la fiche détaillée ouvre l’onglet CV anonymisé sans nom de famille ni coordonnée de l’étudiant.
- **AC-ENT-014** : dans la fiche détaillée, la Vue d’ensemble réunit pourquoi ce profil, faits saillants, missions en lien, disponibilité et conditions ; l’onglet Compétences sépare ce que la fiche prouve et ce qui est transférable ; « Ajouter à ma sélection » reste visible pendant la lecture (USR-26).

## 6. Stratégie de test

Tests Playwright « V6 — Besoin », « V6 — Passer n’écarte pas », « V6 — Mon profil » et « Sélection » (ordinateur et iPhone 13). `qa-company-experience.js` couvre accueil, recherche, suivi, sélection et clôture à 1366/390/320 px. `qa-swipe.js`, `qa-mobile.js` et `qa-mobile-navigation.js` complètent les gestes et la navigation. Tests métier des compteurs et suggestions dans `tests/domain.test.ts`.

## 7. Justification et contexte

Cette décision remplace l’ancien accueil qui présentait liste de besoins, étapes, alertes détaillées et découverte de profils. Les profils restent accessibles dans leur contexte métier : le besoin. Le compteur des mises en relation effectuées exclut les simples demandes en attente.

## 8. Dépendances et intégrations

Besoins confirmés, profils publiés, calendriers, demandes et alertes du compte actif. Le conseiller présenté correspond à la démonstration à un référent ; routage dynamique multi-conseillers à compléter.

## 9. Exemples et cas limites

Avec zéro besoin, les compteurs affichent zéro et la recherche reste disponible. Un besoin non confirmé renvoie au brief. Un besoin clôturé n’offre plus de nouveaux matchs ; son détail et ses demandes sont conservés. Les suggestions peuvent être vides, sans fabrication de candidat.

## 10. Critères de validation

Comparer les blocs d’accueil à ENT-001–003, contrôler tous les compteurs, l’isolation des partenaires, les résumés et l’exclusion des alertes dans les suggestions. Vérifier l’absence de score visible et la présence de tous les profils dans la grille. L’ordre de présentation et la lecture personnalisée sont simulés ; les critères détaillés ne sont pas définitivement arbitrés.

## 11. Spécifications liées

[Besoins et matching](spec-process-besoins-matching.md), [Sélections et suivi](spec-process-selections-mises-en-relation.md), [Notifications](spec-process-notifications.md), [Ergonomie mobile](spec-design-ergonomie-mobile.md).
